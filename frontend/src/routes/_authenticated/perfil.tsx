import { createFileRoute } from "@tanstack/react-router";
import { PerfilScreen } from "../../features/perfil";

export const Route = createFileRoute("/_authenticated/perfil")({
  component: PerfilScreen,
});
