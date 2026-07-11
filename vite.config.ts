/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'
import fs from 'node:fs'
import type { PluginOption } from 'vite'
import { fileURLToPath } from 'node:url'

const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url))

// Public site URL used for canonical links, sitemap, and Open Graph.
// Override this by setting VITE_SITE_URL in your .env or CI environment.
const siteUrl = process.env.VITE_SITE_URL || 'https://parthivrawat.com'
process.env.VITE_SITE_URL = siteUrl

// Generate robots.txt and sitemap.xml after the build completes.
const seoFilesPlugin = (): PluginOption => ({
  name: 'generate-seo-files',
  apply: 'build',
  closeBundle() {
    const distDir = path.resolve(dirname, 'dist')
    fs.mkdirSync(distDir, { recursive: true })

    const robots = [
      'User-agent: *',
      'Allow: /',
      '',
      `Sitemap: ${siteUrl}/sitemap.xml`,
      '',
    ].join('\n')
    fs.writeFileSync(path.join(distDir, 'robots.txt'), robots)

    const today = new Date().toISOString().split('T')[0]
    const pages = [
      { loc: '/', priority: '1.0', changefreq: 'weekly' },
      { loc: '/about', priority: '0.8', changefreq: 'monthly' },
      { loc: '/projects', priority: '0.9', changefreq: 'weekly' },
      { loc: '/contact', priority: '0.7', changefreq: 'monthly' },
    ]
    const sitemap = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...pages.map(page =>
        [
          '  <url>',
          `    <loc>${siteUrl}${page.loc}</loc>`,
          `    <lastmod>${today}</lastmod>`,
          `    <changefreq>${page.changefreq}</changefreq>`,
          `    <priority>${page.priority}</priority>`,
          '  </url>',
        ].join('\n')
      ),
      '</urlset>',
      '',
    ].join('\n')
    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap)
  },
})

// PWA Configuration
const pwaOptions: import('vite-plugin-pwa').VitePWAOptions = {
  // General options
  strategies: 'generateSW',
  injectRegister: 'auto',
  minify: true,
  includeManifestIcons: true,
  disable: false,
  devOptions: {
    enabled: true,
  },
  // Manifest generation
  manifest: {
    name: 'Portfolio | Full-Stack Developer',
    short_name: 'Portfolio',
    description:
      'Full-stack developer portfolio showcasing modern web applications and innovative solutions',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    display_override: ['window-controls-overlay', 'standalone'],
    background_color: '#0f172a',
    theme_color: '#0f172a',
    orientation: 'portrait-primary',
    lang: 'en',
    icons: [
      {
        src: '/logo192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/logo512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    screenshots: [
      {
        src: '/screenshots/desktop-wide.png',
        sizes: '1281x801',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Portfolio Home - Desktop View',
      },
      {
        src: '/screenshots/mobile-narrow.png',
        sizes: '389x849',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Portfolio Home - Mobile View',
      },
    ],
    categories: ['portfolio', 'developer', 'technology'],
    protocol_handlers: [
      {
        protocol: 'web+portfolio',
        url: '/?protocol=%s',
      },
    ],
  },
  injectManifest: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,pdf}'],
  },
  registerType: 'autoUpdate' as const,
  includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
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
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'
  return {
    plugins: [
      react(),
      VitePWA(pwaOptions),
      seoFilesPlugin(),
      // Bundle analyzer only runs when ANALYZE=true and never auto-opens a browser
      process.env.ANALYZE === 'true' &&
        (visualizer({
          open: false,
          gzipSize: true,
          brotliSize: true,
          filename: 'bundle-analyzer.html',
        }) as PluginOption),
    ],
    publicDir: 'public',
    // preview: {
    //   port: 4173,
    //   host: true,
    // },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      // Only emit source maps in development or when explicitly requested
      sourcemap: process.env.SOURCE_MAP === 'true' || isDev,
      // Enable better tree-shaking
      target: 'esnext',
      rollupOptions: {
        output: {
          manualChunks: {
            // Separate vendor chunks for better caching
            react: ['react', 'react-dom', 'react-router-dom'],
            'react-icons': ['react-icons/hi', 'react-icons/fa'],
            utils: ['clsx', 'tailwind-merge'],
          },
          // Optimize chunk naming for better caching
          chunkFileNames: chunkInfo => {
            const facadeModuleId = chunkInfo.facadeModuleId
              ? chunkInfo.facadeModuleId.split('/').pop()
              : 'chunk'
            return `js/[name]-[hash].js`
          },
          assetFileNames: assetInfo => {
            const info = assetInfo.name?.split('.') || []
            const extType = info[info.length - 1]
            if (
              /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(
                assetInfo.name || ''
              )
            ) {
              return `media/[name]-[hash][extname]`
            }
            if (
              /\.(png|jpe?g|gif|svg|webp|avif)(\?.*)?$/i.test(
                assetInfo.name || ''
              )
            ) {
              return `images/[name]-[hash][extname]`
            }
            if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name || '')) {
              return `fonts/[name]-[hash][extname]`
            }
            return `assets/[name]-[hash][extname]`
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
        // mangle defaults are used (Terser minifies identifiers)
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
        // Lightweight CSS-only shim for framer-motion's API
        'framer-motion': path.resolve(dirname, './src/lib/framer-motion.tsx'),
      },
    },
    optimizeDeps: {
      // Pre-bundle dependencies for faster development
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'react-icons/hi',
        'react-icons/fa',
      ],
      // Exclude dependencies from pre-bundling
      exclude: [],
    },
    define: {
      // Global constants for better tree-shaking
      __DEV__: isDev,
      __PROD__: mode === 'production',
      // Vite does not expose process.env by default; shim for client-side NODE_ENV checks
      'process.env.NODE_ENV': JSON.stringify(mode),
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
  }
})
