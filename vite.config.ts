import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Charge les variables d'environnement de manière sécurisée
  // Ne fait pas échouer le build si les variables sont absentes (valeur de secours '')
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: '/',
    build: {
      outDir: 'dist',
    },
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || ''),
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
    },
  };
});
