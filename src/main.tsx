import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import { registerServiceWorker } from './utils/pwa'
import './index.css'

// Register service worker for PWA
registerServiceWorker()

// Add error logging
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error)
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason)
})

try {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>,
  )
} catch (error) {
  console.error('Failed to render app:', error)
  document.getElementById('root')!.innerHTML = `
    <div style="padding: 20px; color: red;">
      <h1>Render Error</h1>
      <pre>${error}</pre>
    </div>
  `
}

