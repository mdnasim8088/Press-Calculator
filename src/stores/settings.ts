import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Unit } from "@/core";
import type { HelpLang } from "@/i18n/help";

/** Calculator defaults edited on the Settings page and saved with its Save button. */
export interface CalculatorDefaults {
  currency: string;
  defaultUnit: Unit;
  defaultPricePerSqm: number;
  defaultGap: number;
}

export interface SettingsState extends CalculatorDefaults {
  /** Language of the small explanation lines under English labels (saved instantly). */
  helpLang: HelpLang;
  setHelpLang: (lang: HelpLang) => void;
  saveDefaults: (defaults: CalculatorDefaults) => void;
}

export const FACTORY_DEFAULTS: CalculatorDefaults = {
  currency: "SAR",
  defaultUnit: "cm",
  defaultPricePerSqm: 50,
  defaultGap: 0.5,
};

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      ...FACTORY_DEFAULTS,
      helpLang: "bn",
      setHelpLang: (helpLang) => set({ helpLang }),
      saveDefaults: (defaults) => set(defaults),
    }),
    {
      name: "print-calculator:settings",
      storage: createJSONStorage(() => localStorage),
      // Rehydrated on the client after mount (see ClientBoot) to avoid SSR mismatches.
      skipHydration: true,
    },
  ),
);

/** True once saved settings have been loaded from storage on the client. */
export function useSettingsHydrated(): boolean {
  return useSyncExternalStore(
    (onChange) => useSettings.persist.onFinishHydration(onChange),
    () => useSettings.persist.hasHydrated(),
    () => false,
  );
}
