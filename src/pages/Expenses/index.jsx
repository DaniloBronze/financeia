import React, { useState } from 'react'
import { Search, Trash2 } from 'lucide-react'
import useStore from '../../store/useStore'
import { CATEGORIES } from '../../constants/categories'
import { fmtBRL } from '../../utils/currency'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Badge } from '../../components/ui/Badge'

export default function Expenses() {
  const { expenses, removeExpense } = useStore()
  const [filterCat, setFilterCat] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = expenses.filter(e => {
    const matchCat = filterCat === 'All' || e.categoria === filterCat
    const matchSearch = e.descricao.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  // Sort by most recent
  filtered.sort((a, b) => b.id - a.id)

  return (
    <div className="max-w-4xl mx-auto space-y-6 fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-semibold">Meus Gastos</h1>
        
        <div className="flex w-full md:w-auto gap-4">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
            <Input 
              placeholder="Buscar gasto..." 
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="All">Todas as categorias</option>
            {Object.keys(CATEGORIES).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="text-center text-[#888888] py-12">
            Nenhum gasto encontrado para estes filtros.
          </Card>
        ) : (
          filtered.map(expense => {
            const cat = CATEGORIES[expense.categoria] || CATEGORIES['Outros']
            return (
              <Card key={expense.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0"
                    style={{ backgroundColor: `${cat.color}20` }}
                  >
                    {cat.icon}
                  </div>
                  <div>
                    <p className="font-medium text-white">{expense.descricao}</p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-[#888888] flex-wrap">
                      <span>{expense.data}</span>
                      <Badge color={cat.color}>{expense.categoria}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-lg whitespace-nowrap">{fmtBRL(expense.valor)}</span>
                  <button 
                    onClick={() => removeExpense(expense.id)}
                    className="p-2 text-[#888888] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
