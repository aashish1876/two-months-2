import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    // Use a relative base path so the bundle works on any host/subpath
    // (e.g. https://aashish1876.github.io/two-months-2/).
    base: './',
    // Build output goes to docs/ so GitHub Pages can publish directly
    // from main branch (Pages only allows /docs or / as the publish folder,
    // and we can't publish / because index.html at the root is the Vite
    // source — not the built bundle).
    build: {
      outDir: 'docs',
      emptyOutDir: true,
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
