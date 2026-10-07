"use client";

import { useEffect } from "react";
import { useSession } from "@/stores/session";
import { useSettings } from "@/stores/settings";

/** Loads saved settings and this visit's work, and registers the service worker (production only). */
export function ClientBoot() {
  useEffect(() => {
    void useSettings.persist.rehydrate();
    void useSession.persist.rehydrate();

    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Offline support is optional; the app works without it.
      });
    }
  }, []);
  return null;
}
