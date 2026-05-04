import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Receipt, PieChart, Lightbulb, Target, Calendar, WalletCards } from 'lucide-react'

export function Sidebar() {
  const links = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/gastos', icon: Receipt, label: 'Gastos' },
    { to: '/recorrentes', icon: Calendar, label: 'Fixos' },
    { to: '/envelopes', icon: WalletCards, label: 'Caixinhas' },
    { to: '/metas', icon: Target, label: 'Metas' },
    { to: '/graficos', icon: PieChart, label: 'Gráficos' },
    { to: '/insights', icon: Lightbulb, label: 'Insights' },
  ]

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-[#2a2a2a] bg-[#1a1a1a] min-h-[calc(100vh-4rem)]">
        <nav className="flex-1 py-6 px-4 space-y-2">
          {links.map((link) => (
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

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-900 border-t border-zinc-800 pb-safe">
        <div className="flex items-center justify-around px-2 py-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-2 rounded-xl min-w-[56px] transition-all
                ${isActive
                  ? 'text-indigo-400 bg-indigo-500/10'
                  : 'text-zinc-500'
                }`
              }
            >
              <span className="text-xl"><link.icon className="w-5 h-5" /></span>
              <span className="text-[10px] font-medium leading-none">{link.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  )
}
