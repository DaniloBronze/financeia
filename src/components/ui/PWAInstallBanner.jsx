import { useState, useEffect } from 'react'

export function PWAInstallBanner() {
  const [showIOSGuide, setShowIOSGuide] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [installPrompt, setInstallPrompt] = useState(null) // Android

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
  const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true

  useEffect(() => {
    // Android — captura o evento nativo
    const handler = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)

    // iOS — mostra o guia se não estiver instalado
    const wasDismissed = localStorage.getItem('pwa_banner_dismissed')
    if (isIOS && !isInStandaloneMode && !wasDismissed) {
      setTimeout(() => setShowIOSGuide(true), 2000) // aparece após 2s
    }

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [isIOS, isInStandaloneMode])

  const handleAndroidInstall = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') setInstallPrompt(null)
  }

  const handleDismiss = () => {
    setShowIOSGuide(false)
    setInstallPrompt(null)
    setDismissed(true)
    localStorage.setItem('pwa_banner_dismissed', 'true')
  }

  // Já instalado ou dispensado — não mostra nada
  if (isInStandaloneMode || dismissed) return null

  // Android — botão simples
  if (installPrompt) {
    return (
      <div className="fixed bottom-20 left-4 right-4 z-50">
        <div className="bg-indigo-600 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xl">
          <div>
            <p className="text-white font-semibold text-sm">Instalar o app</p>
            <p className="text-indigo-200 text-xs mt-0.5">Acesse mais rápido pela tela inicial</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleDismiss} className="px-3 py-1.5 text-indigo-200 text-xs rounded-lg">
              Agora não
            </button>
            <button onClick={handleAndroidInstall} className="px-3 py-1.5 bg-white text-indigo-600 font-semibold text-xs rounded-lg">
              Instalar
            </button>
          </div>
        </div>
      </div>
    )
  }

  // iOS — guia passo a passo
  if (showIOSGuide) {
    return (
      <div className="fixed inset-0 z-50 flex items-end">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm fade-in" onClick={handleDismiss} />

        {/* Painel */}
        <div className="relative w-full bg-zinc-900 border-t border-zinc-700 rounded-t-3xl p-6 pb-10 slide-in-bottom">
          <div className="w-10 h-1 bg-zinc-600 rounded-full mx-auto mb-6" />

          <h3 className="text-white font-bold text-lg mb-1">Instalar o Finanças IA</h3>
          <p className="text-zinc-400 text-sm mb-6">Adicione à tela inicial para acessar sem precisar digitar a URL.</p>

          {/* Passos */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
              <div>
                <p className="text-white text-sm font-medium">Toque no botão de compartilhar</p>
                <p className="text-zinc-400 text-xs mt-0.5">O ícone <span className="text-white">⬆️</span> na barra inferior do Safari</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
              <div>
                <p className="text-white text-sm font-medium">Role para baixo e toque em</p>
                <p className="text-zinc-300 text-xs mt-0.5 bg-zinc-800 px-2 py-1 rounded-lg inline-block">
                  + Adicionar à Tela de Início
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
              <div>
                <p className="text-white text-sm font-medium">Toque em "Adicionar"</p>
                <p className="text-zinc-400 text-xs mt-0.5">O app aparecerá na sua tela inicial</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="w-full py-3 bg-zinc-800 text-zinc-300 rounded-xl text-sm font-medium transition-colors hover:bg-zinc-700"
          >
            Entendi, fazer depois
          </button>
        </div>
      </div>
    )
  }

  return null
}
