"use client";

import { sendGAEvent } from "@next/third-parties/google";

/**
 * GA4 Measurement ID resolved from environment variables with fallback
 */
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || "G-G57HF31NMF";

/**
 * Generic event tracker wrapper around gtag and @next/third-parties/google sendGAEvent
 */
export function trackEvent(
  action: string,
  params?: Record<string, string | number | boolean | undefined>
) {
  if (typeof window === "undefined" || !GA_TRACKING_ID) return;

  try {
    if (typeof (window as any).gtag === "function") {
      (window as any).gtag("event", action, params || {});
    } else {
      sendGAEvent("event", action, params || {});
    }
  } catch (err) {
    // Fail silently in development or if ad-blocker blocks analytics
    if (process.env.NODE_ENV === "development") {
      console.debug(`[Analytics Debug] ${action}:`, params);
    }
  }
}

/**
 * Track user mode toggles (Blog Mode / Learning Mode / Simulation Mode)
 */
export function trackModeSwitch(
  newMode: "blog" | "learning" | "simulation",
  articleSlug: string
) {
  trackEvent("mode_switch", {
    event_category: "Engagement",
    event_label: articleSlug,
    target_mode: newMode,
  });
}

/**
 * Track Operative Lab Drill Stage completions
 */
export function trackDrillStageComplete(
  stageIndex: number,
  stageName: string,
  articleSlug: string
) {
  trackEvent("drill_stage_complete", {
    event_category: "Learning",
    event_label: articleSlug,
    stage_index: stageIndex,
    stage_name: stageName,
  });
}

/**
 * Track Simulator actions (Auto-Pilot, Step forward, Approval Gate, Reset)
 */
export function trackSimulatorAction(
  simulatorType: "mysql_cluster" | "k3s_edge" | string,
  action: string,
  stepIndex?: number
) {
  trackEvent("simulator_action", {
    event_category: "Simulation",
    event_label: simulatorType,
    simulator_action: action,
    step_index: stepIndex,
  });
}

/**
 * Track theme change (Dark Terminal vs Light Archimedean Parchment)
 */
export function trackThemeChange(newTheme: string) {
  trackEvent("theme_change", {
    event_category: "Preferences",
    event_label: newTheme,
  });
}
