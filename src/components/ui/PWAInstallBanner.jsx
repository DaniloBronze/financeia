import { useState, useEffect } from 'react'

export function PWAInstallBanner() {
  const [showIOSGuide, setShowIOSGuide] = useState(false)
  const [showAndroidManual, setShowAndroidManual] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [installPrompt, setInstallPrompt] = useState(null) // Android

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
  const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true

  useEffect(() => {
    // Android — captura o evento nativo
    const handler = (e) => {
      e.preventDefault()
      console.log('✅ beforeinstallprompt capturado')
      setInstallPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)

    // iOS — mostra o guia se não estiver instalado
    const wasDismissed = localStorage.getItem('pwa_banner_dismissed')
    if (isIOS && !isInStandaloneMode && !wasDismissed) {
      setTimeout(() => setShowIOSGuide(true), 2000) // aparece após 2s
    }

    // Android Fallback — se após 5s não capturou o evento no Android
    const fallback = setTimeout(() => {
      const isAndroid = /android/i.test(navigator.userAgent)
      const isChrome = /chrome/i.test(navigator.userAgent)
      
      if (isAndroid && isChrome && !isInStandaloneMode && !wasDismissed && !installPrompt) {
        setShowAndroidManual(true)
      }
    }, 5000)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      clearTimeout(fallback)
    }
  }, [isIOS, isInStandaloneMode, installPrompt])

  const handleAndroidInstall = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') {
      setInstallPrompt(null)
      setShowAndroidManual(false)
    }
  }

  const handleDismiss = () => {
    setShowIOSGuide(false)
    setShowAndroidManual(false)
    setInstallPrompt(null)
    setDismissed(true)
    localStorage.setItem('pwa_banner_dismissed', 'true')
  }

  // Já instalado ou dispensado — não mostra nada
  if (isInStandaloneMode || dismissed) return null

  // Android — botão nativo simples
  if (installPrompt) {
    return (
      <div className="fixed bottom-20 left-4 right-4 z-50">
        <div className="bg-indigo-600 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xl fade-in">
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

  // Android Manual Fallback
  if (showAndroidManual) {
    return (
      <div className="fixed bottom-20 left-4 right-4 z-50">
        <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-5 shadow-2xl fade-in">
          <p className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
            <span>📲</span> Instalar o app
          </p>
          <div className="flex flex-col gap-3 mb-5">
            <div className="flex items-center gap-3 text-xs text-zinc-300">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0">1</span>
              Toque nos 3 pontos ⋮ no canto superior do Chrome
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-300">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0">2</span>
              Toque em <span className="text-white font-medium">"Adicionar à tela inicial"</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-300">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0">3</span>
              Confirme tocando em <span className="text-white font-medium">"Adicionar"</span>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-medium transition-colors hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
          >
            Entendi, instalar
          </button>
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
