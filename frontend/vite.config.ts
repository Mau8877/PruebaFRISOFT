import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite({
      // Auto-genera el routeTree cada vez que cambies las rutas
      generatedRouteTree: "./src/routeTree.gen.ts",
    }),
  ],
});
