import { useEffect, useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { ApiError } from "../lib/http-client";
import { useRegistrarUsuarioMutation } from "../features/registro/api";
import {
  validarConfirmacionPassword,
  validarCorreo,
  validarPassword,
  validarRequerido,
} from "../lib/validators";

export const Route = createFileRoute("/registro")({
  component: RegistroPage,
});

interface RegistroFormValues {
  nombre: string;
  apellido: string;
  correo: string;
  password: string;
  confirmPassword: string;
}

const REDIRECT_DELAY_MS = 2000;

function RegistroPage() {
  const navigate = useNavigate();
  const mutation = useRegistrarUsuarioMutation();
  const [registroExitoso, setRegistroExitoso] = useState(false);

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
        setRegistroExitoso(true);
      } catch {
        // El error queda expuesto en mutation.error y se muestra debajo del formulario.
      }
    },
  });

  useEffect(() => {
    if (!registroExitoso) return;
    const timer = setTimeout(() => {
      navigate({ to: "/login" });
    }, REDIRECT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [registroExitoso, navigate]);

  if (registroExitoso) {
    return (
      <div>
        <h2>Registro exitoso</h2>
        <p>
          Tu cuenta fue creada correctamente. Serás redirigido a la pantalla
          de inicio de sesión en unos segundos.
        </p>
        <Link to="/login">Ir a iniciar sesión ahora</Link>
      </div>
    );
  }

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
