import { defineConfig } from 'vite';

// Single-file library build: everything is bundled into dist/boat-card.js,
// the file HACS/Home Assistant load as a Lovelace resource.
export default defineConfig({
  build: {
    lib: {
      entry: 'src/boat-card.ts',
      formats: ['es'],
      fileName: () => 'boat-card.js',
    },
    outDir: 'dist',
    emptyOutDir: false, // keep dist/boat/ image assets in place
    minify: true,
    target: 'es2020',
    rollupOptions: {
      output: {
        entryFileNames: 'boat-card.js',
      },
    },
  },
});
