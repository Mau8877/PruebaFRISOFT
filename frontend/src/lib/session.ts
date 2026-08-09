const TOKEN_STORAGE_KEY = "frisoft_auth_token";
const REFRESH_TOKEN_STORAGE_KEY = "frisoft_refresh_token";

function decodeJwtPayload(token: string): { exp?: number } | null {
  const payload = token.split(".")[1];
  if (!payload) return null;

  try {
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "=",
    );
    return JSON.parse(atob(padded)) as { exp?: number };
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
}

export function setRefreshToken(token: string): void {
  localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, token);
}

export function clearRefreshToken(): void {
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
}

export function setSession(accessToken: string, refreshToken: string): void {
  setToken(accessToken);
  setRefreshToken(refreshToken);
}

export function clearSession(): void {
  clearToken();
  clearRefreshToken();
}

/** Un token es válido si existe, es decodificable y no está expirado. */
export function isTokenValid(token: string | null): boolean {
  if (!token) return false;

  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return false;

  return payload.exp * 1000 > Date.now();
}

export function isAuthenticated(): boolean {
  return isTokenValid(getToken());
}
