import React from 'react'
import { Wallet } from 'lucide-react'
import { usePWA } from '../../hooks/usePWA'

export function Header() {
  const { installPrompt, isInstalled, isOffline, install } = usePWA()

  return (
    <header className="h-16 border-b border-[#2a2a2a] bg-[#1a1a1a] flex justify-between items-center px-6 sticky top-0 z-10 shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
          <Wallet className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-lg font-semibold text-white">Finanças IA</h1>
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
