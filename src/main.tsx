import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import { registerServiceWorker } from './utils/pwa'
import './index.css'

// Register service worker for PWA (non-blocking)
registerServiceWorker()

// Add error logging
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error)
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason)
})

// Ensure DOM is ready before rendering
const rootElement = document.getElementById('root')
if (!rootElement) {
  console.error('Root element not found!')
} else {
  try {
    // Use requestAnimationFrame to ensure rendering happens after initial layout
    requestAnimationFrame(() => {
      ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </React.StrictMode>,
      )
    })
  } catch (error) {
    console.error('Failed to render app:', error)
    rootElement.innerHTML = `
      <div style="padding: 20px; color: red;">
        <h1>Render Error</h1>
        <pre>${String(error)}</pre>
      </div>
    `
  }
}

