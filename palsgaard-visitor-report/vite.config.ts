import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  server: { https: false } // Use Vercel/HTTPS for camera/mic
});
