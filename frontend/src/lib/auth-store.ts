import {
  clearSession,
  getToken,
  isAuthenticated as checkIsAuthenticated,
  setSession,
} from "./session";

export interface AuthSnapshot {
  token: string | null;
  isAuthenticated: boolean;
}

type Listener = () => void;

function computeSnapshot(): AuthSnapshot {
  return { token: getToken(), isAuthenticated: checkIsAuthenticated() };
}

let snapshot: AuthSnapshot = computeSnapshot();
const listeners = new Set<Listener>();

function notify(): void {
  snapshot = computeSnapshot();
  listeners.forEach((listener) => listener());
}

/**
 * Store centralizado del estado de sesión (token + autenticado/no autenticado).
 * Envuelve la persistencia de `lib/session.ts` (no la duplica) y notifica a
 * los suscriptores cuando el login o el logout cambian el estado, para que
 * el resto de la app (guard, interceptor 401/403, UI) lean siempre la misma
 * fuente de verdad.
 */
export const authStore = {
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot(): AuthSnapshot {
    return snapshot;
  },
  login(accessToken: string, refreshToken: string): void {
    setSession(accessToken, refreshToken);
    notify();
  },
  logout(): void {
    clearSession();
    notify();
  },
};
