/**
 * Reglas espejo de las validaciones de backend (UsuarioService), para dar
 * feedback inmediato en cliente antes de llamar al endpoint de registro.
 */
const CORREO_PATTERN = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export function validarRequerido(
  valor: string,
  etiqueta: string,
): string | undefined {
  return valor.trim() ? undefined : `${etiqueta} es obligatorio`;
}

export function validarCorreo(valor: string): string | undefined {
  if (!valor.trim()) return "El correo es obligatorio";
  if (!CORREO_PATTERN.test(valor)) return "El formato del correo no es válido";
  return undefined;
}

export function validarPassword(valor: string): string | undefined {
  if (!valor) return "La contraseña es obligatoria";
  if (!PASSWORD_PATTERN.test(valor)) {
    return "La contraseña debe tener al menos 8 caracteres e incluir al menos una letra y un número";
  }
  return undefined;
}

export function validarConfirmacionPassword(
  password: string,
  confirmacion: string,
): string | undefined {
  if (!confirmacion) return "Debes confirmar la contraseña";
  if (confirmacion !== password) return "Las contraseñas no coinciden";
  return undefined;
}
