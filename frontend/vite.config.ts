/// <reference types="node" />

import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import path from 'node:path';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  resolve: {
    alias: {
      '@classes': path.resolve('../shared/classes.ts'),
      '@hash': path.resolve('../shared/hash.ts'),
    },
  },
});
