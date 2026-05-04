import React from 'react'

export function ProgressBar({ value, max, label, valueLabel }) {
  const percent = Math.min(100, (value / max) * 100)
  
  let color = 'bg-emerald-500' // green
  if (percent >= 100) color = 'bg-red-500'
  else if (percent >= 75) color = 'bg-yellow-500'

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-white">{label}</span>
        <span className="text-[#888888]">{valueLabel}</span>
      </div>
      <div className="w-full bg-[#2a2a2a] h-2 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
