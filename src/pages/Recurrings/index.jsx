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
  const { recurrings, addRecurring, removeRecurring, toggleRecurring, markApplied, lastApplied } = useStore()
  const { getPendingToday, applyRecurring, getNextDue } = useRecurringAlerts()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const pending = getPendingToday()

  // Total comprometido com fixos ativos este mês
  const totalFixosMes = recurrings
    .filter(r => r.active)
    .reduce((sum, r) => {
      if (r.frequencia === 'mensal') return sum + r.valor
      if (r.frequencia === 'quinzenal') return sum + r.valor * 2
      if (r.frequencia === 'semanal') return sum + r.valor * 4
      return sum
    }, 0)

  // Quantos fixos já foram aplicados este mês
  const currentMonth = new Date().toISOString().slice(0, 7)
  const jaLancados = recurrings.filter(r =>
    r.active && lastApplied[r.id] === currentMonth
  )
  const totalJaLancado = jaLancados.reduce((sum, r) => sum + r.valor, 0)

  // Total ainda pendente
  const totalPendente = totalFixosMes - totalJaLancado

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

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Gastos Fixos</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" /> Novo fixo
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Total comprometido no mês */}
        <div className="col-span-2 bg-zinc-800/60 border border-zinc-700/50 rounded-2xl p-4">
          <p className="text-xs text-zinc-400 mb-1">Comprometido este mês</p>
          <p className="text-3xl font-bold text-white">{fmtBRL(totalFixosMes)}</p>
          <p className="text-xs text-zinc-500 mt-1">
            {recurrings.filter(r => r.active).length} gasto{recurrings.filter(r => r.active).length !== 1 ? 's' : ''} fixo{recurrings.filter(r => r.active).length !== 1 ? 's' : ''} ativo{recurrings.filter(r => r.active).length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Já lançado */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
          <p className="text-xs text-emerald-400 mb-1">Já lançado</p>
          <p className="text-xl font-bold text-emerald-400">{fmtBRL(totalJaLancado)}</p>
          <p className="text-xs text-emerald-500/70 mt-1">{jaLancados.length} item{jaLancados.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Ainda pendente */}
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4">
          <p className="text-xs text-orange-400 mb-1">Ainda pendente</p>
          <p className="text-xl font-bold text-orange-400">{fmtBRL(totalPendente)}</p>
          <p className="text-xs text-orange-500/70 mt-1">
            {recurrings.filter(r => r.active && lastApplied[r.id] !== currentMonth).length} item{recurrings.filter(r => r.active && lastApplied[r.id] !== currentMonth).length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Barra de progresso geral */}
      <div>
        <div className="flex justify-between text-xs text-zinc-400 mb-2">
          <span>Progresso do mês</span>
          <span>{totalFixosMes > 0 ? Math.round((totalJaLancado / totalFixosMes) * 100) : 0}% lançado</span>
        </div>
        <div className="w-full h-2 bg-zinc-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${totalFixosMes > 0 ? (totalJaLancado / totalFixosMes) * 100 : 0}%` }}
          />
        </div>
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
