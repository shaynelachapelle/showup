// Author: Shayne Lachapelle
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // In development, forward API calls to the Express server so the client and API share
  // one origin (localhost:5173) and the login cookie works. In production Express serves both.
  server: {
    proxy: {
      "/api": "http://localhost:3000",
      "/ics": "http://localhost:3000",
    },
  },
});
