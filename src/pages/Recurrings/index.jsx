import React, { useState } from 'react'
import { Calendar, Trash2, Plus, Power } from 'lucide-react'
import useStore from '../../store/useStore'
import { useRecurringAlerts } from '../../hooks/useRecurringAlerts'
import { CATEGORIES } from '../../constants/categories'
import { fmtBRL } from '../../utils/currency'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { RecurringModal } from '../../components/ui/RecurringModal'

export default function Recurrings() {
  const { recurrings, addRecurring, removeRecurring, toggleRecurring, markApplied } = useStore()
  const { getPendingToday, applyRecurring, getNextDue } = useRecurringAlerts()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const pending = getPendingToday()

  return (
    <div className="max-w-4xl mx-auto space-y-6 fade-in">
      {pending.length > 0 && (
        <div className="flex flex-col gap-2 mb-6">
          {pending.map(r => (
            <div key={r.id} className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 gap-4">
              <span className="text-indigo-200">
                📅 <strong>{r.descricao}</strong> vence hoje — <strong>{fmtBRL(r.valor)}</strong>
              </span>
              <div className="flex gap-2 w-full md:w-auto">
                <Button onClick={() => applyRecurring(r)} className="w-full md:w-auto text-sm px-4">
                  Adicionar agora
                </Button>
                <Button variant="secondary" onClick={() => markApplied(r.id)} className="w-full md:w-auto text-sm px-4 bg-zinc-800 text-zinc-300">
                  Ignorar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Gastos Fixos</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" /> Novo fixo
        </Button>
      </div>

      <div className="space-y-4">
        {recurrings.length === 0 ? (
          <Card className="text-center text-[#888888] py-12">
            Nenhum gasto recorrente cadastrado.
          </Card>
        ) : (
          recurrings.map(r => {
            const cat = CATEGORIES[r.categoria] || CATEGORIES['Outros']
            const nextDue = getNextDue(r)

            return (
              <Card key={r.id} className={`flex flex-col md:flex-row items-start md:items-center justify-between p-4 transition-opacity ${!r.active ? 'opacity-50' : ''}`}>
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0"
                    style={{ backgroundColor: `${cat.color}20` }}
                  >
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                      {r.descricao}
                      <Badge color={cat.color}>{r.categoria}</Badge>
                    </h3>
                    <p className="text-sm text-[#888888] capitalize">
                      {r.frequencia} • {r.frequencia === 'mensal' ? `dia ${r.dia}` : r.frequencia === 'quinzenal' ? `dias ${r.dia} e ${r.dia + 15 > 28 ? 28 : r.dia + 15}` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-left md:text-right">
                    <span className="font-semibold text-lg block">{fmtBRL(r.valor)}</span>
                    <span className="text-xs text-indigo-400 font-medium">Próximo: {nextDue}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => toggleRecurring(r.id)}
                      className={`p-2 rounded-lg transition-colors ${r.active ? 'text-green-400 hover:bg-green-400/10' : 'text-[#888888] hover:bg-[#2a2a2a]'}`}
                      title={r.active ? "Desativar" : "Ativar"}
                    >
                      <Power className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => removeRecurring(r.id)}
                      className="p-2 text-[#888888] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>

      <RecurringModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={addRecurring}
      />
    </div>
  )
}
