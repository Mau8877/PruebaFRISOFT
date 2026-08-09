import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: RootComponent,
});

// Shell técnico raíz: no conoce el estado de sesión, por lo que no incluye
// navegación de la app. La navegación principal vive en AppShell, dentro del
// layout `_authenticated`, ya que solo aplica a rutas privadas.
function RootComponent() {
  return (
    <>
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </>
  );
}
