import React from 'react'
import { Wallet } from 'lucide-react'
import { usePWA } from '../../hooks/usePWA'

export function Header() {
  const { installPrompt, isInstalled, isOffline, install } = usePWA()

  return (
    <header className="sticky top-0 z-40 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800">
      <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto md:max-w-none">
        <div className="flex items-center gap-2">
          <span className="text-xl">💰</span>
          <span className="font-semibold text-white">Finanças IA</span>
        </div>

      <div className="flex items-center gap-4">
        {isOffline && (
          <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400">
            ⚡ Offline
          </span>
        )}

        {installPrompt && !isInstalled && (
          <button
            onClick={install}
            className="text-xs px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 transition-all"
          >
            📲 Instalar app
          </button>
        )}
      </div>
    </header>
  )
}
