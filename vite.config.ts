import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({

  plugins: [react(), tsconfigPaths()],

  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        builtins(),
        globals(),
      ],
    },
  },
  resolve: {
    alias: {
      '@': '/src/components',
      '@page': '/src/pages',

      buffer: 'rollup-plugin-node-builtins',
     
      process: 'process/browser',
      util: 'util',
      // Add other aliases as needed
    }
  }
})
