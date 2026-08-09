import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../../../lib/http-client";
import { setSession } from "../../../lib/session";
import type { LoginRequest, LoginResponse } from "../types";

function iniciarSesion(payload: LoginRequest) {
  return apiClient.post<LoginResponse>("/auth/login", payload);
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: iniciarSesion,
    onSuccess: (data) => {
      setSession(data.accessToken, data.refreshToken);
    },
  });
}
