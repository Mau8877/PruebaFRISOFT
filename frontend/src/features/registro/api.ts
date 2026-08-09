import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../../lib/http-client";

export interface RegistroUsuarioRequest {
  nombre: string;
  apellido: string;
  correo: string;
  password: string;
}

export interface UsuarioResponse {
  idUsuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  fechaCreacion: string;
}

function registrarUsuario(payload: RegistroUsuarioRequest) {
  return apiClient.post<UsuarioResponse>("/auth/registro", payload);
}

export function useRegistrarUsuarioMutation() {
  return useMutation({
    mutationFn: registrarUsuario,
  });
}
