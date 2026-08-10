import { useSyncExternalStore } from "react";
import { authStore, type AuthSnapshot } from "./auth-store";

/** Lee el estado de sesión del store centralizado de forma reactiva. */
export function useAuth(): AuthSnapshot {
  return useSyncExternalStore(authStore.subscribe, authStore.getSnapshot);
}
