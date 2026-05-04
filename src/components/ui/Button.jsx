import React from 'react'

export function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
    secondary: "bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white",
    danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
    ghost: "bg-transparent hover:bg-[#2a2a2a] text-[#888888] hover:text-white"
  }
  
  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
