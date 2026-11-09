import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { ErrorBoundary } from './components/error-boundary.tsx'
import { Analytics } from "@vercel/analytics/react"
import './index.css'
import Application from './application.tsx'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Failed to find the root element')
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <Analytics/>
      <HelmetProvider>
        <Application />
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>,
)
