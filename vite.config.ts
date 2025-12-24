import { svelte } from "@sveltejs/vite-plugin-svelte"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"
import ViteRails from "vite-plugin-rails"

export default defineConfig({
  // server: {
  //   allowedHosts: ["vite.devto.win"],
  //   hmr: {
  //     host: "vite.devto.win",
  //     clientPort: 443,
  //   },
  // },
  plugins: [
    svelte(),
    tailwindcss(),
    ViteRails({
      envVars: { RAILS_ENV: "development" },
      envOptions: { defineOn: "import.meta.env" },
      fullReload: {
        additionalPaths: ["config/routes.rb", "app/controllers/**/*"],
      },
    }),
  ],
  build: {
    sourcemap: false, // Disable source maps for production
  },
})
