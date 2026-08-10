import { authStore } from "./auth-store";
import { getToken } from "./session";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/** Forma del body de error estandarizada por el backend (ver ErrorResponse). */
interface ApiErrorBody {
  status?: string;
  code?: string;
  message?: string;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & { body?: unknown };

function redirectToLogin(): void {
  if (window.location.pathname === "/login") return;
  window.location.assign("/login");
}

async function parseErrorBody(
  response: Response,
): Promise<{ message: string; code?: string }> {
  try {
    const data = (await response.json()) as ApiErrorBody;
    if (data && typeof data.message === "string") {
      return { message: data.message, code: data.code };
    }
  } catch {
    // El body no era JSON: se usa el texto de estado como respaldo.
  }
  return { message: response.statusText || "Error en la petición" };
}

/**
 * Interceptor de request (adjunta el token) + interceptor de response
 * (limpia la sesión y redirige al login ante 401/403).
 */
async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;

  const finalHeaders = new Headers(headers);
  finalHeaders.set("Accept", "application/json");
  if (body !== undefined) {
    finalHeaders.set("Content-Type", "application/json");
  }

  const token = getToken();
  if (token) {
    finalHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401 || response.status === 403) {
    const { message, code } = await parseErrorBody(response);
    authStore.logout();
    redirectToLogin();
    throw new ApiError(response.status, message, code);
  }

  if (!response.ok) {
    const { message, code } = await parseErrorBody(response);
    throw new ApiError(response.status, message, code);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
