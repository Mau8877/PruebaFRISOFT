import { useForm } from "@tanstack/react-form";
import { validarApellidoPerfil, validarNombrePerfil } from "../schemas";
import type { ActualizarPerfilRequest } from "../types";
import { PerfilField } from "./PerfilField";

interface PerfilFormProps {
  nombreInicial: string;
  apellidoInicial: string;
  onSubmit: (values: ActualizarPerfilRequest) => void;
  isPending: boolean;
  errorMessage?: string;
  successMessage?: string;
}

interface PerfilFormValues {
  nombre: string;
  apellido: string;
}

export function PerfilForm({
  nombreInicial,
  apellidoInicial,
  onSubmit,
  isPending,
  errorMessage,
  successMessage,
}: PerfilFormProps) {
  const form = useForm({
    defaultValues: { nombre: nombreInicial, apellido: apellidoInicial } as PerfilFormValues,
    onSubmit: ({ value }) => {
      onSubmit({
        nombre: value.nombre.trim(),
        apellido: value.apellido.trim(),
      });
    },
  });

  return (
    <form
      className="perfil-form"
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
          onChange: ({ value }) => validarNombrePerfil(value),
        }}
      >
        {(field) => (
          <PerfilField
            id={field.name}
            name={field.name}
            label="Nombre"
            value={field.state.value}
            isTouched={field.state.meta.isTouched}
            error={field.state.meta.errors.join(", ")}
            disabled={isPending}
            onChange={(value) => field.handleChange(value)}
            onBlur={() => field.handleBlur()}
          />
        )}
      </form.Field>

      <form.Field
        name="apellido"
        validators={{
          onChange: ({ value }) => validarApellidoPerfil(value),
        }}
      >
        {(field) => (
          <PerfilField
            id={field.name}
            name={field.name}
            label="Apellido"
            value={field.state.value}
            isTouched={field.state.meta.isTouched}
            error={field.state.meta.errors.join(", ")}
            disabled={isPending}
            onChange={(value) => field.handleChange(value)}
            onBlur={() => field.handleBlur()}
          />
        )}
      </form.Field>

      {errorMessage && (
        <p className="perfil-error" role="alert">
          {errorMessage}
        </p>
      )}

      {successMessage && (
        <p className="perfil-status" role="status">
          {successMessage}
        </p>
      )}

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting] as const}
      >
        {([canSubmit, isSubmitting]) => (
          <button
            className="perfil-button"
            type="submit"
            disabled={!canSubmit || isPending}
          >
            {isSubmitting || isPending ? "Guardando..." : "Guardar cambios"}
          </button>
        )}
      </form.Subscribe>
    </form>
  );
}
