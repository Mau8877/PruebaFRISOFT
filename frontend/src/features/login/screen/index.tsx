import {
  Link,
  useLocation,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { ApiError } from "../../../lib/http-client";
import { useLoginMutation } from "../api";
import { LoginForm } from "../components";
import "../styles";
import type { LoginRequest } from "../types";

interface NavigationState {
  registroExitoso?: boolean;
}

function resolverRutaDestino(redirect?: unknown): string {
  if (typeof redirect !== "string" || !redirect) return "/";
  try {
    const url = new URL(redirect, window.location.origin);
    if (url.origin !== window.location.origin) return "/";
    return url.pathname + url.search + url.hash;
  } catch {
    return "/";
  }
}

export function LoginScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationState = useRouterState({
    select: (state) => state.location.state as NavigationState | undefined,
  });
  const mutation = useLoginMutation();
  const redirect = (location.search as { redirect?: unknown }).redirect;

  const errorMessage =
    mutation.error instanceof ApiError
      ? mutation.error.message
      : mutation.isError
        ? "No se pudo iniciar sesión. Intenta nuevamente."
        : undefined;

  const handleSubmit = async (values: LoginRequest) => {
    try {
      await mutation.mutateAsync({
        correo: values.correo.trim(),
        password: values.password,
      });
      navigate({ to: resolverRutaDestino(redirect) as never });
    } catch {
      // El error queda expuesto en mutation.error y se muestra en el formulario.
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Iniciar sesión</h2>
        <p className="login-subtitle">
          Ingresa tus credenciales para acceder a tu cuenta.
        </p>
        {navigationState?.registroExitoso && (
          <p className="login-status" role="status">
            Cuenta creada exitosamente. Ahora puedes iniciar sesión.
          </p>
        )}
        <LoginForm
          onSubmit={handleSubmit}
          isPending={mutation.isPending}
          errorMessage={errorMessage}
        />
        <p className="login-footer">
          ¿No tienes cuenta? <Link to="/registro">Crea una cuenta</Link>
        </p>
      </div>
    </div>
  );
}
