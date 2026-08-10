import type { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { authStore } from "../lib/auth-store";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const navigate = useNavigate();

  function handleLogout() {
    authStore.logout();
    navigate({ to: "/login" });
  }

  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <h1>Frisoft</h1>
        <nav className="app-shell__nav">
          <Link to="/" activeProps={{ "aria-current": "page" }}>
            Inicio
          </Link>
          <Link to="/perfil" activeProps={{ "aria-current": "page" }}>
            Mi perfil
          </Link>
        </nav>
        <button type="button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </header>
      <main className="app-shell__content">{children}</main>
    </div>
  );
}
