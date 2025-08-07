import { defineConfig, loadEnv } from 'vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load .env files based on the current mode (development, production, etc.)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    root: path.resolve(__dirname, './'), // project root
    publicDir: 'public', // static files
    server: {
      port: 3000,
      open: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'), // allows `@/` imports
      },
    },
    define: {
      // Makes env vars available in client code
      'process.env': env,
    },
  };
});
