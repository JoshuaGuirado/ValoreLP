import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Site estático com três páginas independentes: funciona em qualquer hospedagem
// (Vercel, Netlify, Hostinger, cPanel...) sem regra de redirecionamento.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        captura: resolve(__dirname, 'index.html'),
        obrigado: resolve(__dirname, 'obrigado/index.html'),
        privacidade: resolve(__dirname, 'politica-de-privacidade/index.html'),
      },
    },
  },
})
