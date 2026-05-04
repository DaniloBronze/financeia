import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

export function Layout() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-4rem)]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto pb-24 pt-4 px-4 md:p-8 max-w-lg md:max-w-none mx-auto w-full min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
