// PWA utilities
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered:', registration)
        })
        .catch((error) => {
          console.log('SW registration failed:', error)
        })
    })
  }
}

export function installPWA() {
  // Check if PWA is installable
  if ('serviceWorker' in navigator) {
    return new Promise((resolve) => {
      window.addEventListener('beforeinstallprompt', (e: Event) => {
        e.preventDefault()
        resolve(e)
      })
    })
  }
  return null
}

export function isPWAInstalled(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true
}

export function isOnline(): boolean {
  return navigator.onLine
}

