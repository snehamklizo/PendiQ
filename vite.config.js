import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Ensure this is set correctly
  server: {
    historyApiFallback: true, // Ensures Vite handles SPA routing
  }
});
