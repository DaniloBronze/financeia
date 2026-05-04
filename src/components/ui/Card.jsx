import React from 'react'

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-5 ${className}`}>
      {children}
    </div>
  )
}
