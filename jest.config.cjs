/**
 * Jest is configured entirely from here — the Babel options live inline rather than in a
 * root babel.config file so that @vitejs/plugin-react doesn't pick them up and change how
 * the dev server and production build compile.
 */

/** ESM-only packages Jest has to transpile instead of skipping with the rest of node_modules. */
const esmDependencies = [
  'react-leaflet',
  '@react-leaflet',
  'leaflet',
  'motion',
  'motion-dom',
  'motion-utils',
  'embla-carousel',
  'embla-carousel-react',
  'embla-carousel-reactive-utils',
  'lucide-react',
  'sonner',
  'recharts',
  'react-icons',
  'd3-.*',
  'internmap',
  'delaunator',
  'robust-predicates',
  'decimal.js-light',
  'victory-vendor',
]

module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
  setupFiles: ['<rootDir>/src/test/polyfills.cjs'],
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(png|jpe?g|gif|svg|webp|avif|ico|woff2?|eot|ttf|otf|mp4|webm)$':
      '<rootDir>/src/test/file-mock.cjs',
  },
  transform: {
    '^.+\\.[jt]sx?$': [
      'babel-jest',
      {
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          ['@babel/preset-react', { runtime: 'automatic' }],
          '@babel/preset-typescript',
        ],
        // Rewrites import.meta.env, which Jest cannot parse, into process.env.
        plugins: ['babel-plugin-transform-vite-meta-env'],
      },
    ],
  },
  transformIgnorePatterns: [`/node_modules/(?!(${esmDependencies.join('|')})/)`],
  testEnvironmentOptions: { customExportConditions: [''] },
  clearMocks: true,
  restoreMocks: true,
}
