import { useState, useEffect } from 'react'

export function usePWA() {
  const [installPrompt, setInstallPrompt] = useState(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    const onOnline = () => setIsOffline(false)
    const onOffline = () => setIsOffline(true)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  const install = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') setIsInstalled(true)
    setInstallPrompt(null)
  }

  return { installPrompt, isInstalled, isOffline, install }
}
