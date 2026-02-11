"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";

const FREE_ANALYTICS_PER_WEEK = 2;
const STORAGE_KEY = "predictpro_free_analytics";

interface FreeAnalyticsTracker {
  count: number;
  weekStart: string;
}

export function usePremiumAccess() {
  const { isPremium } = useAuth();
  const [freeViewsLeft, setFreeViewsLeft] = useState(FREE_ANALYTICS_PER_WEEK);

  useEffect(() => {
    if (isPremium) return;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const tracker: FreeAnalyticsTracker = JSON.parse(stored);
      const weekStart = new Date(tracker.weekStart);
      const now = new Date();
      const diffDays =
        (now.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24);

      if (diffDays >= 7) {
        // Reset weekly counter
        const newTracker: FreeAnalyticsTracker = {
          count: 0,
          weekStart: now.toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newTracker));
        setFreeViewsLeft(FREE_ANALYTICS_PER_WEEK);
      } else {
        setFreeViewsLeft(FREE_ANALYTICS_PER_WEEK - tracker.count);
      }
    }
  }, [isPremium]);

  const consumeFreeView = () => {
    if (isPremium) return true;

    const stored = localStorage.getItem(STORAGE_KEY);
    let tracker: FreeAnalyticsTracker;

    if (stored) {
      tracker = JSON.parse(stored);
    } else {
      tracker = { count: 0, weekStart: new Date().toISOString() };
    }

    if (tracker.count >= FREE_ANALYTICS_PER_WEEK) {
      return false;
    }

    tracker.count += 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tracker));
    setFreeViewsLeft(FREE_ANALYTICS_PER_WEEK - tracker.count);
    return true;
  };

  const canAccessPremium = isPremium || freeViewsLeft > 0;

  return { canAccessPremium, freeViewsLeft, consumeFreeView, isPremium };
}
