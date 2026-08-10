import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../lib/http-client";
import type { ActualizarPerfilRequest, Perfil } from "../types";

export const perfilQueryKey = ["perfil", "me"] as const;

function obtenerPerfil() {
  return apiClient.get<Perfil>("/api/usuarios/me");
}

function actualizarPerfil(payload: ActualizarPerfilRequest) {
  return apiClient.put<Perfil>("/api/usuarios/me", payload);
}

export function usePerfilQuery() {
  return useQuery({
    queryKey: perfilQueryKey,
    queryFn: obtenerPerfil,
  });
}

export function useActualizarPerfilMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: actualizarPerfil,
    onSuccess: (data) => {
      queryClient.setQueryData(perfilQueryKey, data);
    },
  });
}
