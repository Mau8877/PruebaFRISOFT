import { useForm } from "@tanstack/react-form";
import { validarCorreoLogin, validarPasswordLogin } from "../schemas";
import type { LoginRequest } from "../types";
import { LoginField } from "./LoginField";

interface LoginFormProps {
  onSubmit: (values: LoginRequest) => void;
  isPending: boolean;
  errorMessage?: string;
}

interface LoginFormValues {
  correo: string;
  password: string;
}

export function LoginForm({ onSubmit, isPending, errorMessage }: LoginFormProps) {
  const form = useForm({
    defaultValues: { correo: "", password: "" } as LoginFormValues,
    onSubmit: ({ value }) => {
      onSubmit({
        correo: value.correo,
        password: value.password,
      });
    },
  });

  return (
    <form
      className="login-form"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
      noValidate
    >
      <form.Field
        name="correo"
        validators={{
          onChange: ({ value }) => validarCorreoLogin(value),
        }}
      >
        {(field) => (
          <LoginField
            id={field.name}
            name={field.name}
            label="Correo"
            type="email"
            value={field.state.value}
            isTouched={field.state.meta.isTouched}
            error={field.state.meta.errors.join(", ")}
            onChange={(value) => field.handleChange(value)}
            onBlur={() => field.handleBlur()}
          />
        )}
      </form.Field>

      <form.Field
        name="password"
        validators={{
          onChange: ({ value }) => validarPasswordLogin(value),
        }}
      >
        {(field) => (
          <LoginField
            id={field.name}
            name={field.name}
            label="Contraseña"
            type="password"
            value={field.state.value}
            isTouched={field.state.meta.isTouched}
            error={field.state.meta.errors.join(", ")}
            onChange={(value) => field.handleChange(value)}
            onBlur={() => field.handleBlur()}
          />
        )}
      </form.Field>

      {errorMessage && (
        <p className="login-error" role="alert">
          {errorMessage}
        </p>
      )}

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting] as const}
      >
        {([canSubmit, isSubmitting]) => (
          <button
            className="login-button"
            type="submit"
            disabled={!canSubmit || isPending}
          >
            {isSubmitting || isPending ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        )}
      </form.Subscribe>
    </form>
  );
}
