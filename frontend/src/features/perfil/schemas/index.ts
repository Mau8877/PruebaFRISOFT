import { z } from "zod";

export const nombrePerfilSchema = z.string().trim().min(1, "El nombre es obligatorio");

export const apellidoPerfilSchema = z
  .string()
  .trim()
  .min(1, "El apellido es obligatorio");

export const actualizarPerfilSchema = z.object({
  nombre: nombrePerfilSchema,
  apellido: apellidoPerfilSchema,
});

export function validarNombrePerfil(value: string): string | undefined {
  const resultado = nombrePerfilSchema.safeParse(value);
  if (resultado.success) return undefined;
  return resultado.error.issues[0]?.message;
}

export function validarApellidoPerfil(value: string): string | undefined {
  const resultado = apellidoPerfilSchema.safeParse(value);
  if (resultado.success) return undefined;
  return resultado.error.issues[0]?.message;
}
