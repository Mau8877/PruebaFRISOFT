import { z } from "zod";

export const correoLoginSchema = z
  .string()
  .trim()
  .min(1, "El correo es obligatorio")
  .email("El formato del correo no es válido");

export const passwordLoginSchema = z
  .string()
  .min(1, "La contraseña es obligatoria");

export const loginSchema = z.object({
  correo: correoLoginSchema,
  password: passwordLoginSchema,
});

export const loginSchemas = { login: loginSchema };

export function validarCorreoLogin(value: string): string | undefined {
  const resultado = correoLoginSchema.safeParse(value);
  if (resultado.success) return undefined;
  return resultado.error.issues[0]?.message;
}

export function validarPasswordLogin(value: string): string | undefined {
  const resultado = passwordLoginSchema.safeParse(value);
  if (resultado.success) return undefined;
  return resultado.error.issues[0]?.message;
}
