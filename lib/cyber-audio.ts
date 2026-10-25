"use client";

let audioCtx: AudioContext | null = null;
let humOsc1: OscillatorNode | null = null;
let humOsc2: OscillatorNode | null = null;
let humGain: GainNode | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export const cyberAudio = {
  // Start subtle low datacenter fan / transformer hum
  startDatacenterHum(enabled: boolean) {
    if (!enabled) {
      this.stopDatacenterHum();
      return;
    }
    const ctx = getAudioContext();
    if (!ctx) return;
    if (humGain) return; // already playing

    try {
      humGain = ctx.createGain();
      humGain.gain.setValueAtTime(0.001, ctx.currentTime);
      humGain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 1.2);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(140, ctx.currentTime);

      humOsc1 = ctx.createOscillator();
      humOsc1.type = "sawtooth";
      humOsc1.frequency.setValueAtTime(60, ctx.currentTime);

      humOsc2 = ctx.createOscillator();
      humOsc2.type = "sine";
      humOsc2.frequency.setValueAtTime(120, ctx.currentTime);

      humOsc1.connect(filter);
      humOsc2.connect(filter);
      filter.connect(humGain);
      humGain.connect(ctx.destination);

      humOsc1.start();
      humOsc2.start();
    } catch {
      // AudioContext policy catch
    }
  },

  stopDatacenterHum() {
    if (humGain && audioCtx) {
      try {
        humGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);
        setTimeout(() => {
          humOsc1?.stop();
          humOsc2?.stop();
          humOsc1?.disconnect();
          humOsc2?.disconnect();
          humGain?.disconnect();
          humOsc1 = null;
          humOsc2 = null;
          humGain = null;
        }, 350);
      } catch {
        humGain = null;
      }
    }
  },

  // Corosync heartbeat ping
  playHeartbeat(enabled: boolean) {
    if (!enabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(840, now);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.08);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Ignored
    }
  },

  // Dramatic electrical lightning crash / PDU surge
  playLightningCrash(enabled: boolean) {
    if (!enabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // White noise buffer
      const bufferSize = ctx.sampleRate * 0.45;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(3200, now);
      filter.frequency.exponentialRampToValueAtTime(200, now + 0.4);
      filter.Q.setValueAtTime(4, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
    } catch {
      // Ignored
    }
  },

  // Split-brain alert klaxon
  playWarningAlert(enabled: boolean) {
    if (!enabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(620, now + 0.12);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1400, now);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // Ignored
    }
  },

  // STONITH laser targeting & high-voltage relay snap
  playStonithLaser(enabled: boolean) {
    if (!enabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Laser sweep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(2400, now + 0.22);

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1200, now);
      filter.Q.setValueAtTime(6, now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.26);

      // Heavy breaker snap at the end
      setTimeout(() => {
        if (!ctx) return;
        const t2 = ctx.currentTime;
        const pop = ctx.createOscillator();
        const popGain = ctx.createGain();
        pop.type = "square";
        pop.frequency.setValueAtTime(160, t2);
        pop.frequency.exponentialRampToValueAtTime(30, t2 + 0.08);

        popGain.gain.setValueAtTime(0.2, t2);
        popGain.gain.exponentialRampToValueAtTime(0.001, t2 + 0.09);

        pop.connect(popGain);
        popGain.connect(ctx.destination);
        pop.start(t2);
        pop.stop(t2 + 0.1);
      }, 220);
    } catch {
      // Ignored
    }
  },

  // MySQL service spin-up sound
  playServiceSpinUp(enabled: boolean) {
    if (!enabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.35);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.42);
    } catch {
      // Ignored
    }
  },

  // Golden VIP docking chord (crystalline major 9th chime)
  playDockingChime(enabled: boolean) {
    if (!enabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.09, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.7);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.75);
      });
    } catch {
      // Ignored
    }
  },
};
