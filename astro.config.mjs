import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import react from '@astrojs/react';

// Para GitHub Pages Project Pages (usuario.github.io/hookbloq/):
//   - site: la URL completa del dominio
//   - base: el path del subdirectorio (debe coincidir con el nombre del repo)
// Para usuario.github.io/ (User Pages) o dominio propio:
//   - site: la URL
//   - base: '/' (o eliminar la linea)
//
// IMPORTANTE: ajusta estos valores antes de hacer el primer deploy.
// Ver README.md seccion "Deploy en GitHub Pages".

// Cargar variables de entorno desde .env de forma explicita.
// Vite deberia hacerlo automaticamente para vars con prefijo VITE_, pero
// en algunos setups de Astro no funciona. loadEnv garantiza que esten disponibles.
const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), 'VITE_');

export default defineConfig({
  site: 'https://hookbloq.github.io',
  base: '/',
  output: 'static',
  integrations: [react()],
  build: {
    // Genera /page/index.html en vez de /page.html para URLs limpias
    format: 'directory',
  },
  vite: {
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
    },
  },
});
