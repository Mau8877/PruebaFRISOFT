import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginScreen } from "../features/login";
import { authStore } from "../lib/auth-store";

export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    if (authStore.getSnapshot().isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: LoginScreen,
});
