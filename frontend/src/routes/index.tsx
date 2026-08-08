import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div>
      <h2>🏠 Página Principal</h2>
      <p>Bienvenido a tu app con TanStack</p>
    </div>
  );
}
