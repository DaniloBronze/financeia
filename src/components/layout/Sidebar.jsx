import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Receipt, PieChart, Lightbulb, Target, Calendar, WalletCards } from 'lucide-react'

export function Sidebar() {
  const links = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/gastos', icon: Receipt, label: 'Meus Gastos' },
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-[#2a2a2a] bg-[#1a1a1a] pb-safe z-50">
        <div className="flex justify-around items-center h-16">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                  isActive ? 'text-indigo-500' : 'text-[#888888]'
                }`
              }
            >
              <link.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{link.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  )
}
