import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Receipt, PieChart, Lightbulb, Target, Calendar, WalletCards, MoreHorizontal, X } from 'lucide-react'

export function Sidebar() {
  const [showMore, setShowMore] = useState(false)
  const location = useLocation()

  const mainNav = [
    { to: '/', icon: LayoutDashboard, label: 'Início' },
    { to: '/gastos', icon: Receipt, label: 'Gastos' },
    { to: '/envelopes', icon: WalletCards, label: 'Caixinhas' },
    { to: '/graficos', icon: PieChart, label: 'Gráficos' },
  ]

  const moreNav = [
    { to: '/recorrentes', icon: Calendar, label: 'Fixos' },
    { to: '/metas', icon: Target, label: 'Metas' },
    { to: '/insights', icon: Lightbulb, label: 'Insights' },
  ]

  const allLinks = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/gastos', icon: Receipt, label: 'Gastos' },
    { to: '/recorrentes', icon: Calendar, label: 'Fixos' },
    { to: '/envelopes', icon: WalletCards, label: 'Caixinhas' },
    { to: '/metas', icon: Target, label: 'Metas' },
    { to: '/graficos', icon: PieChart, label: 'Gráficos' },
    { to: '/insights', icon: Lightbulb, label: 'Insights' },
  ]

  const isMoreActive = moreNav.some(i => i.to === location.pathname)

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-[#2a2a2a] bg-[#1a1a1a] min-h-[calc(100vh-4rem)]">
        <nav className="flex-1 py-6 px-4 space-y-2">
          {allLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive 
                    ? 'bg-indigo-600/10 text-indigo-500' 
                    : 'text-[#888888] hover:bg-[#2a2a2a] hover:text-white'
                }`
              }
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Menu "Mais" — painel que sobe no Mobile */}
      {showMore && (
        <div className="md:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setShowMore(false)}
          />
          {/* Painel */}
          <div className="fixed bottom-20 left-4 right-4 z-50 bg-zinc-800 border border-zinc-700 rounded-2xl overflow-hidden shadow-2xl fade-in">
            {moreNav.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setShowMore(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-5 py-4 border-b border-zinc-700/50 last:border-0 transition-colors
                  ${isActive ? 'text-indigo-400 bg-indigo-500/10' : 'text-zinc-300 hover:bg-zinc-700'}`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Bottom Nav Principal */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-900/95 backdrop-blur-md border-t border-zinc-800 pb-safe">
        <div className="flex items-center justify-around px-1 py-2 max-w-lg mx-auto">
          {/* 4 itens principais */}
          {mainNav.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl min-w-[60px] transition-all
                ${isActive
                  ? 'text-indigo-400'
                  : 'text-zinc-500 hover:text-zinc-300'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </NavLink>
          ))}

          {/* Botão "Mais" */}
          <button
            onClick={() => setShowMore(prev => !prev)}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl min-w-[60px] transition-all
              ${isMoreActive || showMore
                ? 'text-indigo-400'
                : 'text-zinc-500 hover:text-zinc-300'
              }`}
          >
            {showMore ? <X className="w-5 h-5" /> : <MoreHorizontal className="w-5 h-5" />}
            <span className="text-[10px] font-medium leading-none">
              {isMoreActive ? moreNav.find(i => i.to === location.pathname)?.label : 'Mais'}
            </span>
          </button>
        </div>
      </nav>
    </>
  )
}
