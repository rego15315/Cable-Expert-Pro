
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 这里的端口是前端运行的端口
    port: 3000,
    proxy: {
      // 将所有以 /api 开头的请求转发到 Python 后端
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      // 如果需要联调 Telegram Webhook，也可以代理
      '/tg-webhook': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
