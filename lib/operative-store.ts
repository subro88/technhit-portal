"use client";

export interface OperativeBadge {
  id: string;
  name: string;
  category: string;
  iconName: string;
  description: string;
  unlockedAt?: string;
}

export interface OperativeState {
  xp: number;
  level: number;
  levelTitle: string;
  nextLevelXp: number;
  currentLevelBaseXp: number;
  clearedStages: Record<string, string[]>; // { [slug]: ["recon", "motive", ...] }
  badges: OperativeBadge[];
  soundEnabled: boolean;
  recentXpReward?: { amount: number; reason: string; timestamp: number } | null;
}

const STORAGE_KEY = "technhit_operative_state_v1";

const RANKS = [
  { minXp: 0, level: 1, title: "Sysadmin Recruit", nextXp: 150 },
  { minXp: 150, level: 2, title: "Terminal Operator", nextXp: 350 },
  { minXp: 350, level: 3, title: "Infrastructure Engineer", nextXp: 650 },
  { minXp: 650, level: 4, title: "Systems Architect", nextXp: 1000 },
  { minXp: 1000, level: 5, title: "Principal Site Reliability Engineer", nextXp: 1500 },
  { minXp: 1500, level: 6, title: "Master Cluster Commander", nextXp: 2200 },
];

export function calculateLevel(xp: number) {
  let rank = RANKS[0];
  for (const r of RANKS) {
    if (xp >= r.minXp) {
      rank = r;
    } else {
      break;
    }
  }
  return {
    level: rank.level,
    levelTitle: rank.title,
    nextLevelXp: rank.nextXp,
    currentLevelBaseXp: rank.minXp,
  };
}

export const INITIAL_OPERATIVE_STATE: OperativeState = {
  xp: 0,
  level: 1,
  levelTitle: "Sysadmin Recruit",
  nextLevelXp: 150,
  currentLevelBaseXp: 0,
  clearedStages: {},
  badges: [],
  soundEnabled: true,
  recentXpReward: null,
};

// Web Audio API Synthesizer (zero dependencies, high-tech feedback)
export function playHapticSound(type: "click" | "flip" | "success" | "levelup" | "error") {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.soundEnabled === false) return;
    }

    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === "click") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === "flip") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.08);
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.09);
    } else if (type === "success") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(660, now + 0.08);
      osc.frequency.setValueAtTime(880, now + 0.16);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.32);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === "levelup") {
      osc.type = "square";
      osc.frequency.setValueAtTime(330, now);
      osc.frequency.setValueAtTime(440, now + 0.1);
      osc.frequency.setValueAtTime(550, now + 0.2);
      osc.frequency.setValueAtTime(880, now + 0.3);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.55);
      osc.start(now);
      osc.stop(now + 0.6);
    } else if (type === "error") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.12);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.13);
    }
  } catch {
    // Gracefully ignore audio context blocks
  }
}

export function getOperativeState(): OperativeState {
  if (typeof window === "undefined") return INITIAL_OPERATIVE_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_OPERATIVE_STATE;
    const parsed = JSON.parse(raw);
    const { level, levelTitle, nextLevelXp, currentLevelBaseXp } = calculateLevel(parsed.xp || 0);
    return {
      ...INITIAL_OPERATIVE_STATE,
      ...parsed,
      level,
      levelTitle,
      nextLevelXp,
      currentLevelBaseXp,
    };
  } catch {
    return INITIAL_OPERATIVE_STATE;
  }
}

function saveState(state: OperativeState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent("technhit_operative_update", { detail: state }));
  } catch (err) {
    console.error("Failed to persist operative state", err);
  }
}

export function awardOperativeXp(amount: number, reason: string): OperativeState {
  const current = getOperativeState();
  const newXp = current.xp + amount;
  const currentLevel = current.level;
  const { level, levelTitle, nextLevelXp, currentLevelBaseXp } = calculateLevel(newXp);

  const updated: OperativeState = {
    ...current,
    xp: newXp,
    level,
    levelTitle,
    nextLevelXp,
    currentLevelBaseXp,
    recentXpReward: { amount, reason, timestamp: Date.now() },
  };

  saveState(updated);

  if (level > currentLevel) {
    playHapticSound("levelup");
  } else {
    playHapticSound("success");
  }

  return updated;
}

export function markStageComplete(slug: string, stageKey: string, xpReward = 25): OperativeState {
  const current = getOperativeState();
  const slugStages = current.clearedStages[slug] || [];

  if (slugStages.includes(stageKey)) {
    return current; // already cleared
  }

  const updatedCleared = {
    ...current.clearedStages,
    [slug]: [...slugStages, stageKey],
  };

  const newXp = current.xp + xpReward;
  const { level, levelTitle, nextLevelXp, currentLevelBaseXp } = calculateLevel(newXp);

  const updated: OperativeState = {
    ...current,
    xp: newXp,
    level,
    levelTitle,
    nextLevelXp,
    currentLevelBaseXp,
    clearedStages: updatedCleared,
    recentXpReward: { amount: xpReward, reason: `Cleared Stage: ${stageKey.toUpperCase()}`, timestamp: Date.now() },
  };

  saveState(updated);
  playHapticSound("success");
  return updated;
}

export function unlockOperativeBadge(badge: OperativeBadge): OperativeState {
  const current = getOperativeState();
  if (current.badges.some((b) => b.id === badge.id)) {
    return current;
  }

  const newBadge = {
    ...badge,
    unlockedAt: new Date().toISOString(),
  };

  const updated: OperativeState = {
    ...current,
    badges: [...current.badges, newBadge],
    recentXpReward: { amount: 50, reason: `UNLOCKED BADGE: ${badge.name}`, timestamp: Date.now() },
    xp: current.xp + 50,
  };

  const levelInfo = calculateLevel(updated.xp);
  const finalState = { ...updated, ...levelInfo };

  saveState(finalState);
  playHapticSound("levelup");
  return finalState;
}

export function toggleOperativeSound(): boolean {
  const current = getOperativeState();
  const nextSound = !current.soundEnabled;
  saveState({ ...current, soundEnabled: nextSound });
  return nextSound;
}
