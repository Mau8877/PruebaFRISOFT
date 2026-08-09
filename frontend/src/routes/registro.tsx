import { useForm } from "@tanstack/react-form";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { ApiError } from "../lib/http-client";
import { useRegistrarUsuarioMutation } from "../features/registro/api";
import {
  validarConfirmacionPassword,
  validarCorreo,
  validarPassword,
  validarRequerido,
} from "../lib/validators";

const registroSearchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/registro")({
  validateSearch: registroSearchSchema,
  component: RegistroPage,
});

interface RegistroFormValues {
  nombre: string;
  apellido: string;
  correo: string;
  password: string;
  confirmPassword: string;
}

const ESTADO_REGISTRO_EXITOSO: Record<string, unknown> = {
  registroExitoso: true,
};

/**
 * Resuelve la ruta de destino tras un registro exitoso. Si `redirect` está
 * presente y es misma-origen, se usa esa ruta; en caso contrario se cae a
 * `/login`. El guard de rutas privadas redirige a login con `?redirect=...`,
 * por lo que este parámetro puede llegar como URL completa.
 */
function resolverRutaDestino(redirect?: string): string {
  if (!redirect) return "/login";
  try {
    const url = new URL(redirect, window.location.origin);
    if (url.origin !== window.location.origin) return "/login";
    return url.pathname + url.search + url.hash;
  } catch {
    return "/login";
  }
}

function RegistroPage() {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const mutation = useRegistrarUsuarioMutation();

  const form = useForm({
    defaultValues: {
      nombre: "",
      apellido: "",
      correo: "",
      password: "",
      confirmPassword: "",
    } as RegistroFormValues,
    onSubmit: async ({ value }) => {
      try {
        await mutation.mutateAsync({
          nombre: value.nombre.trim(),
          apellido: value.apellido.trim(),
          correo: value.correo.trim(),
          password: value.password,
        });
        form.reset();
        navigate({
          to: resolverRutaDestino(redirect) as never,
          state: ESTADO_REGISTRO_EXITOSO,
        });
      } catch {
        // El error queda expuesto en mutation.error y se muestra debajo del formulario.
      }
    },
  });

  const errorMessage =
    mutation.error instanceof ApiError
      ? mutation.error.message
      : mutation.isError
        ? "No se pudo completar el registro. Intenta nuevamente."
        : undefined;

  return (
    <div>
      <h2>Crear cuenta</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void form.handleSubmit();
        }}
        noValidate
      >
        <form.Field
          name="nombre"
          validators={{
            onChange: ({ value }) => validarRequerido(value, "El nombre"),
          }}
        >
          {(field) => (
            <div>
              <label htmlFor={field.name}>Nombre</label>
              <input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
              />
              {field.state.meta.isTouched &&
                field.state.meta.errors.length > 0 && (
                  <p role="alert">{field.state.meta.errors.join(", ")}</p>
                )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="apellido"
          validators={{
            onChange: ({ value }) => validarRequerido(value, "El apellido"),
          }}
        >
          {(field) => (
            <div>
              <label htmlFor={field.name}>Apellido</label>
              <input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
              />
              {field.state.meta.isTouched &&
                field.state.meta.errors.length > 0 && (
                  <p role="alert">{field.state.meta.errors.join(", ")}</p>
                )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="correo"
          validators={{
            onChange: ({ value }) => validarCorreo(value),
          }}
        >
          {(field) => (
            <div>
              <label htmlFor={field.name}>Correo</label>
              <input
                id={field.name}
                name={field.name}
                type="email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
              />
              {field.state.meta.isTouched &&
                field.state.meta.errors.length > 0 && (
                  <p role="alert">{field.state.meta.errors.join(", ")}</p>
                )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="password"
          validators={{
            onChange: ({ value }) => validarPassword(value),
            onChangeListenTo: ["confirmPassword"],
          }}
        >
          {(field) => (
            <div>
              <label htmlFor={field.name}>Contraseña</label>
              <input
                id={field.name}
                name={field.name}
                type="password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
              />
              {field.state.meta.isTouched &&
                field.state.meta.errors.length > 0 && (
                  <p role="alert">{field.state.meta.errors.join(", ")}</p>
                )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="confirmPassword"
          validators={{
            onChangeListenTo: ["password"],
            onChange: ({ value, fieldApi }) =>
              validarConfirmacionPassword(
                fieldApi.form.getFieldValue("password"),
                value,
              ),
          }}
        >
          {(field) => (
            <div>
              <label htmlFor={field.name}>Confirmar contraseña</label>
              <input
                id={field.name}
                name={field.name}
                type="password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
              />
              {field.state.meta.isTouched &&
                field.state.meta.errors.length > 0 && (
                  <p role="alert">{field.state.meta.errors.join(", ")}</p>
                )}
            </div>
          )}
        </form.Field>

        {errorMessage && <p role="alert">{errorMessage}</p>}

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting] as const}
        >
          {([canSubmit, isSubmitting]) => (
            <button type="submit" disabled={!canSubmit || mutation.isPending}>
              {isSubmitting || mutation.isPending
                ? "Registrando..."
                : "Registrarme"}
            </button>
          )}
        </form.Subscribe>
      </form>

      <p>
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </div>
  );
}
