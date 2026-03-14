import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: 3000,
    open: true,
  },
  plugins: [
    // tsConfigPaths({
    //   projects: ["./tsconfig.json", "../../packages/ui/tsconfig.json"],
    // }),
    nitro(),
    tanstackStart(),
    viteReact(),
    tailwindcss(),
  ],
});
