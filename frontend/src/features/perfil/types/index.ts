export interface Perfil {
  idUsuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  fechaCreacion: string;
  fechaActualizacion: string | null;
}

export interface ActualizarPerfilRequest {
  nombre: string;
  apellido: string;
}
