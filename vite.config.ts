/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'
import type { PluginOption } from 'vite'
import { fileURLToPath } from 'node:url'

const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url))

// PWA Configuration
const pwaOptions: import('vite-plugin-pwa').VitePWAOptions = {
  // General options
  strategies: 'generateSW',
  injectRegister: 'auto',
  minify: true,
  includeManifestIcons: true,
  disable: true,
  // Manifest generation
  manifest: {
    name: 'My Portfolio',
    short_name: 'Portfolio',
    description: 'Professional portfolio website',
    theme_color: '#ffffff',
    icons: [
      {
        src: 'pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
  injectManifest: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,pdf}'],
  },
  registerType: 'autoUpdate' as const,
  includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
  workbox: {
    clientsClaim: true,
    skipWaiting: true,
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        urlPattern: /^https:\/\/.*\.(png|jpe?g|svg|gif|webp|avif)$/i,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'images-cache',
          expiration: {
            maxEntries: 60,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
    ],
  },
}
export default defineConfig({
  plugins: [
    react(),
    VitePWA(pwaOptions),
    // Bundle analyzer only runs when ANALYZE=true and never auto-opens a browser
    process.env.ANALYZE === 'true' &&
      visualizer({
        open: false,
        gzipSize: true,
        brotliSize: true,
        filename: 'bundle-analyzer.html',
      }) as PluginOption,
  ],
  publicDir: 'public',
  preview: {
    port: 4173,
    host: true,
  },
  build: {
    outDir: 'dist',
    // Only emit source maps in development or when explicitly requested
    sourcemap: process.env.SOURCE_MAP === 'true' || process.env.NODE_ENV !== 'production',
    // Enable better tree-shaking
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          react: ['react', 'react-dom', 'react-router-dom'],
          'react-redux': ['@reduxjs/toolkit', 'react-redux'],
          'react-icons': ['react-icons/hi', 'react-icons/fa'],
          'framer-motion': ['framer-motion'],
          'utils': ['date-fns', 'clsx', 'tailwind-merge'],
        },
        // Optimize chunk naming for better caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
          return `js/[name]-[hash].js`;
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const extType = info[info.length - 1];
          if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name || '')) {
            return `media/[name]-[hash][extname]`;
          }
          if (/\.(png|jpe?g|gif|svg|webp|avif)(\?.*)?$/i.test(assetInfo.name || '')) {
            return `images/[name]-[hash][extname]`;
          }
          if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name || '')) {
            return `fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
      // External dependencies that shouldn't be bundled
      external: [],
    },
    chunkSizeWarningLimit: 1000, // 1MB
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        // Remove unused code
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
      mangle: {
        // Keep class names for debugging in production
        keep_classnames: false,
        keep_fnames: false,
      },
    },
    // Enable CSS code splitting
    cssCodeSplit: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(dirname, './src'),
      '@components': path.resolve(dirname, './src/components'),
      '@pages': path.resolve(dirname, './src/pages'),
      '@hooks': path.resolve(dirname, './src/hooks'),
      '@services': path.resolve(dirname, './src/services'),
      '@utils': path.resolve(dirname, './src/utils'),
      '@assets': path.resolve(dirname, './src/assets'),
      '@styles': path.resolve(dirname, './src/styles'),
      '@types': path.resolve(dirname, './src/types'),
      '@constants': path.resolve(dirname, './src/constants'),
    },
  },
  optimizeDeps: {
    // Pre-bundle dependencies for faster development
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@reduxjs/toolkit',
      'react-redux',
      'framer-motion',
      'react-icons/hi',
      'react-icons/fa',
    ],
    // Exclude dependencies from pre-bundling
    exclude: [],
  },
  define: {
    // Global constants for better tree-shaking
    __DEV__: process.env.NODE_ENV === 'development',
    __PROD__: process.env.NODE_ENV === 'production',
    // Vite does not expose process.env by default; shim for client-side NODE_ENV checks
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'production'),
  },
  server: {
    fs: {
      // Restrict serving files to the project root only
      allow: ['.'],
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    exclude: [
      'node_modules/**',
      'dist/**',
      'e2e/**',
      '**/*.spec.ts',
      '**/*.spec.tsx',
      '**/*.stories.*',
    ],
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
})
