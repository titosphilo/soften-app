import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const geminiApiKey =
    env.VITE_GEMINI_API_KEY ||
    env.GEMINI_API_KEY ||
    env.GOOGLE_GENERATIVE_AI_API_KEY ||
    ''

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(geminiApiKey),
    },
    test: {
      environment: 'jsdom',
      setupFiles: './src/test/setup.js',
    },
  }
})
