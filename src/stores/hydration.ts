import { useSessionHydrated } from "./session";
import { useSettingsHydrated } from "./settings";

/** True once both saved settings and this visit's form state have loaded. */
export function useStoresHydrated(): boolean {
  const settings = useSettingsHydrated();
  const session = useSessionHydrated();
  return settings && session;
}
