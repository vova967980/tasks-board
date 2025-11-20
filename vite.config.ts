import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import dts from 'vite-plugin-dts';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [svgr(), dts(), react()],
  resolve: {
    alias: {
      '@styles': path.resolve(__dirname, './src/styles'),
      '@shared-utils': path.resolve(__dirname, './src/shared/utils'),
      '@shared-hooks': path.resolve(__dirname, './src/shared/hooks'),
      '@store': path.resolve(__dirname, './src/store'),
      '@ui-kit': path.resolve(__dirname, './src/ui-kit'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
});
