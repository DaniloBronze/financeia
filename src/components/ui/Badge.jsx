import React from 'react'

export function Badge({ children, color, className = '' }) {
  return (
    <span 
      className={`px-2 py-1 rounded-md text-xs font-medium ${className}`}
      style={{ backgroundColor: `${color}20`, color: color }}
    >
      {children}
    </span>
  )
}
