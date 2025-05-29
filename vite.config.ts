import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Перенаправляем все запросы /api/* на бэкенд на localhost:3000
      '/api': {
        target: 'http://localhost:3000',  // адрес вашего Express-сервера
        changeOrigin: true,                // подменить Origin-заголовок на цель
        secure: false,                     // если HTTPS не используется
        // rewrite: (path) => path.replace(/^\/api/, '/api') // обычно без изменения
      },
    }
  }
});