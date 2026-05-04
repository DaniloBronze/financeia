import React, { forwardRef } from 'react'

export const Input = forwardRef(({ className = '', ...props }, ref) => {
  return (
    <input 
      ref={ref}
      className={`w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-4 py-2 text-white placeholder-[#888888] focus:outline-none focus:border-indigo-500 transition-colors ${className}`}
      {...props}
    />
  )
})
