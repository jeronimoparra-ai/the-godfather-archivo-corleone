import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  plugins: [],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@data': path.resolve(__dirname, 'src/data'),
    }
  },
  server: {
    port: 3000,
    host: true,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Sin manualChunks: la app es pequeña y el bundle principal
    // queda autocontenido (Bootstrap se carga por CDN).
    rollupOptions: {}
  },
  base: '/',
  publicDir: 'public',
  css: {
    devSourcemap: true,
    modules: {
      localsConvention: 'camelCase'
    }
  },
  optimizeDeps: {
    include: ['bootstrap']
  },
  worker: {
    format: 'es'
  },
  esbuild: {
    target: 'es2020'
  }
})