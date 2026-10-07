import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/**
 * Work in progress (calculator display, form inputs) for the current visit.
 * Kept in sessionStorage: it survives moving between pages and reloads while the
 * app is open, and starts fresh when the app or tab is closed and opened again.
 */
interface SessionState {
  forms: Record<string, unknown>;
  setForm: (key: string, value: unknown) => void;
}

export const useSession = create<SessionState>()(
  persist(
    (set) => ({
      forms: {},
      setForm: (key, value) => set((s) => ({ forms: { ...s.forms, [key]: value } })),
    }),
    {
      name: "print-calculator:session",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s) => ({ forms: s.forms }),
      // Rehydrated on the client after mount (see ClientBoot) to avoid SSR mismatches.
      skipHydration: true,
    },
  ),
);

export function useSessionHydrated(): boolean {
  return useSyncExternalStore(
    (onChange) => useSession.persist.onFinishHydration(onChange),
    () => useSession.persist.hasHydrated(),
    () => false,
  );
}

/**
 * Form state that is remembered for the current visit.
 * `initial` runs only when nothing is saved yet (e.g. to read defaults from Settings).
 */
export function useFormState<T extends object>(key: string, initial: () => T): [T, (patch: Partial<T>) => void] {
  const saved = useSession((s) => s.forms[key]) as T | undefined;
  const setForm = useSession((s) => s.setForm);
  const state = saved ?? initial();
  const update = (patch: Partial<T>) => {
    const current = (useSession.getState().forms[key] as T | undefined) ?? state;
    setForm(key, { ...current, ...patch });
  };
  return [state, update];
}
