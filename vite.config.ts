/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react-swc";
//@ts-expect-error untyped path
import path from "path";
import { defineConfig } from "vite";

//@ts-expect-error untyped __dirname
const root = path.resolve(__dirname, "src");

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": root,
    },
  },
  test: {
    include: ["src/**/*.test.ts"],
  },
});
