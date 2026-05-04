import React, { useEffect } from 'react'

export function Toast({ alerts, onClose }) {
  useEffect(() => {
    if (!alerts.length) return
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [alerts])

  if (!alerts.length) return null

  return (
    <div className="fixed bottom-20 md:bottom-6 right-6 flex flex-col gap-2 z-50">
      {alerts.map((a, i) => (
        <div
          key={i}
          className={`flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg text-sm max-w-sm
            ${a.type === 'danger'
              ? 'bg-red-500/10 border border-red-500/30 text-red-400'
              : 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400'
            }`}
        >
          <span>{a.type === 'danger' ? '🚨' : '⚠️'}</span>
          <p>{a.msg}</p>
        </div>
      ))}
    </div>
  )
}
