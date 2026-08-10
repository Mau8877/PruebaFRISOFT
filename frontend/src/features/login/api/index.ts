import { useMutation } from "@tanstack/react-query";
import { authStore } from "../../../lib/auth-store";
import { apiClient } from "../../../lib/http-client";
import type { LoginRequest, LoginResponse } from "../types";

function iniciarSesion(payload: LoginRequest) {
  return apiClient.post<LoginResponse>("/auth/login", payload);
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: iniciarSesion,
    onSuccess: (data) => {
      authStore.login(data.accessToken, data.refreshToken);
    },
  });
}
