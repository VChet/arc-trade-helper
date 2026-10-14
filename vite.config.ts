import { fileURLToPath, URL } from "node:url";
import Vue from "@vitejs/plugin-vue";
import namedPort from "named-port";
import { defineConfig } from "vite";
import pkg from "./package.json" with { type: "json" };

// https://vitejs.dev/config
export default defineConfig({
  plugins: [
    Vue()
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  server: {
    port: namedPort(pkg.name, { min: 7000, max: 10000 })
  }
});
