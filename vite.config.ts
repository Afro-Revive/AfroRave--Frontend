import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'import.meta.env.DEV': mode === 'development',
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://afro-revive-latest.onrender.com',
        changeOrigin: true,
        secure: false,
        configure: () => {
          // Proxy configuration without logging
        },
      },
    },
  },
  build: {
    rollupOptions: {
     
      output: {
        manualChunks: {
          // Core React
          'react-vendor': ['react', 'react-dom'],
          
          // Radix UI components
          'ui-vendor': ['@radix-ui/react-accordion', '@radix-ui/react-alert-dialog', '@radix-ui/react-avatar', '@radix-ui/react-checkbox', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-label', '@radix-ui/react-popover', '@radix-ui/react-radio-group', '@radix-ui/react-select', '@radix-ui/react-separator', '@radix-ui/react-slot', '@radix-ui/react-tabs', '@radix-ui/react-tooltip'],
          
          // Form handling
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          
          // Utilities and styling.
          // NOTE: CSS-only packages (tw-animate-css, tailwind-scrollbar) must NOT be
          // listed here — they are consumed via @import/@plugin in index.css, and
          // naming them makes Rollup resolve them as JS entries, which they aren't.
          'utils-vendor': ['date-fns', 'clsx', 'tailwind-merge', 'class-variance-authority'],
          
          // Icons and UI enhancements
          'icons-vendor': ['lucide-react', 'iconsax-react'],
          
          // Maps and location
          'maps-vendor': ['leaflet', 'react-leaflet'],
          
          // Carousel and UI components
          'ui-components-vendor': ['embla-carousel-react', 'react-day-picker', 'vaul'],
          
          // HTTP and routing
          'http-vendor': ['axios', 'react-router-dom'],
          
          // SEO and meta
          'seo-vendor': ['react-helmet-async'],
          
        },
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()?.replace('.tsx', '').replace('.ts', '')
            : 'chunk'
          return `js/${facadeModuleId}-[hash].js`
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || []
          const ext = info[info.length - 1]
          if (/\.(css)$/.test(assetInfo.name || '')) {
            return `css/[name]-[hash].${ext}`
          }
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(assetInfo.name || '')) {
            return `images/[name]-[hash].${ext}`
          }
          if (/\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name || '')) {
            return `fonts/[name]-[hash].${ext}`
          }
          return `assets/[name]-[hash].${ext}`
        },
      },
    },
    chunkSizeWarningLimit: 2048, // 2MB in KB
    reportCompressedSize: true,
    sourcemap: false,
  },
}))
