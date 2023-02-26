import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import checker from "vite-plugin-checker";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      // TODO: for dev only, workaround for CORS
      // Seperate API into two routing, because in China bigquery is not accessible
      "^/dev/(langrepos|langmilestone|querytip|chatgpt)": {
        target: "<Your aws deploy URL>",
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "^/dev/(login|modifyuserinfo|signup|subscribetopic|getuserinfo|resetpass)":
        {
          target: "<Your local URL>",
          changeOrigin: true,
          secure: false,
          // rewrite: (path) => path.replace(/^\/api/, ""),
        },
    },
  },
  plugins: [
    vue(),
    checker({
      typescript: true,
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
