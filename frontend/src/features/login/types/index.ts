export interface LoginRequest {
  correo: string;
  password: string;
}

export interface UsuarioLogin {
  idUsuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  fechaCreacion: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  usuario: UsuarioLogin;
}
