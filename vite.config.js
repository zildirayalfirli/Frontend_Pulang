import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: '192.168.1.141',
//     port: 4000
//   }
// })

export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost",
    port: 5173,
  },
});

// export default defineConfig({
//   plugins: [react()],
// })
