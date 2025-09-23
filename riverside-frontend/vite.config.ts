import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    https: {
      key: fs.readFileSync("./localhost+3-key.pem"),
      cert: fs.readFileSync("./localhost+3.pem"),
    },
    host: "0.0.0.0",
    port: 4001,
    allowedHosts: ["192.168.100.16", "localhost", "riverside.local"],
  },
});
