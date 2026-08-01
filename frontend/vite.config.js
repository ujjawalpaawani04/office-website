import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [ tailwindcss(),react()],
  // Dev-only: proxies /api (and /media, for uploaded images) to the local
  // Flask backend so the browser always talks to whichever host it's
  // already on (localhost:5173 or a LAN IP - either works). That keeps the
  // request genuinely same-origin regardless of hostname, which matters
  // because the admin refresh cookie is SameSite=Strict - a same-origin
  // request always carries it, whereas going straight to a fixed
  // VITE_API_BASE_URL host would silently drop the cookie the moment the
  // page's own host doesn't match it. Production (Vercel) doesn't use this
  // dev server at all, so it's unaffected.
  server: {
    proxy: {
      "/api": { target: "http://127.0.0.1:5000", changeOrigin: true },
      "/media": { target: "http://127.0.0.1:5000", changeOrigin: true },
      "/uploads": { target: "http://127.0.0.1:5000", changeOrigin: true },
    },
  },
})
