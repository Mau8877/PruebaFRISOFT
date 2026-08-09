import { createFileRoute, useRouterState } from "@tanstack/react-router";
import { z } from "zod";

const loginSearchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/login")({
  validateSearch: loginSearchSchema,
  component: LoginPage,
});

interface NavigationState {
  registroExitoso?: boolean;
}

function LoginPage() {
  const state = useRouterState({
    select: (navigationState) =>
      navigationState.location.state as NavigationState | undefined,
  });

  return (
    <div>
      <h2>Iniciar sesión</h2>
      {state?.registroExitoso && (
        <p role="status">
          Cuenta creada exitosamente. Ahora puedes iniciar sesión.
        </p>
      )}
      <p>
        El formulario de autenticación se implementa en una Unidad de Trabajo
        independiente. Esta página es el punto de entrada público al que el
        guard de rutas privadas redirige cuando no existe una sesión válida.
      </p>
    </div>
  );
}
