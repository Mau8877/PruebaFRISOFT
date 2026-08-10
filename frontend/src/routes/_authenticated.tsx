import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell } from "../components/app-shell";
import { authStore } from "../lib/auth-store";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ location }) => {
    if (!authStore.getSnapshot().isAuthenticated) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
