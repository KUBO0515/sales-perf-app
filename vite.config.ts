import { defineConfig, configDefaults } from 'vitest/config'
import react from '@vitejs/plugin-react'
import pkg from './package.json'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'


export default defineConfig({
  plugins: [react(),tsconfigPaths(),tailwindcss(),],
    test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    include: ['src/test/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: [...configDefaults.exclude],
    coverage: { provider: 'v8', reporter: ['text', 'html'] },
  },
  define: {
    'import.meta.env.APP_VERSION': JSON.stringify(pkg.version),
  },
})