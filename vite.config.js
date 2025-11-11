import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()], // ← add this line
  server: {
    host: 'localhost',
    port: 3000,
    hmr: {
      host: 'localhost',
      port: 3000,
    },
  },
});
