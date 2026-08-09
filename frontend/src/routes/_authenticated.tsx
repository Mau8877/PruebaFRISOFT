import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell } from "../components/app-shell";
import { isAuthenticated } from "../lib/session";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ location }) => {
    if (!isAuthenticated()) {
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
