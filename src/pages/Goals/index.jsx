import React, { useState } from 'react'
import { Target, Sparkles, Trash2, Plus } from 'lucide-react'
import useStore from '../../store/useStore'
import { suggestGoalStrategy } from '../../services/ai'
import { fmtBRL } from '../../utils/currency'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { GoalModal } from '../../components/ui/GoalModal'
import { Input } from '../../components/ui/Input'

export default function Goals() {
  const { goals, addGoal, removeGoal, addToGoal, expenses } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [suggestion, setSuggestion] = useState(null)
  const [loadingSuggestionId, setLoadingSuggestionId] = useState(null)
  const [addAmount, setAddAmount] = useState({})

  const totalAcumulado = goals.reduce((s, g) => s + (g.saved || 0), 0)
  
  // Encontrar meta mais próxima
  let closestGoal = null
  let maxPct = -1
  goals.forEach(g => {
    const pct = ((g.saved || 0) / g.alvo) * 100
    if (pct < 100 && pct > maxPct) {
      maxPct = pct
      closestGoal = g
    }
  })

  const handleSuggest = async (goal) => {
    setLoadingSuggestionId(goal.id)
    try {
      const text = await suggestGoalStrategy(goal, expenses)
      setSuggestion({ id: goal.id, text })
    } catch (err) {
      alert("Erro ao gerar sugestão.")
    } finally {
      setLoadingSuggestionId(null)
    }
  }

  const parseBrDateToMs = (dateStr) => {
    // Handling YYYY-MM-DD input from date picker which becomes DD/MM/YYYY
    const [d, m, y] = dateStr.split('/')
    if (!y) {
      // fallback just in case
      return new Date(dateStr).getTime()
    }
    return new Date(`${y}-${m}-${d}`).getTime()
  }

  const getDaysLeft = (prazo) => {
    const target = parseBrDateToMs(prazo)
    const now = new Date().getTime()
    const diff = target - now
    if (diff <= 0 || isNaN(diff)) return 0
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Minhas Metas</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" /> Nova meta
        </Button>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <p className="text-sm text-[#888888] mb-1">Metas ativas</p>
          <p className="text-2xl font-semibold">{goals.filter(g => (g.saved || 0) < g.alvo).length}</p>
        </Card>
        <Card>
          <p className="text-sm text-[#888888] mb-1">Valor acumulado</p>
          <p className="text-2xl font-semibold">{fmtBRL(totalAcumulado)}</p>
        </Card>
        <Card>
          <p className="text-sm text-[#888888] mb-1">Mais próxima</p>
          <p className="text-xl font-semibold truncate">{closestGoal ? closestGoal.nome : '-'}</p>
        </Card>
      </div>

      {/* Lista de Metas */}
      <div className="space-y-6">
        {goals.length === 0 ? (
          <Card className="text-center text-[#888888] py-12">
            Nenhuma meta cadastrada. Crie sua primeira meta!
          </Card>
        ) : (
          goals.map(goal => {
            const saved = goal.saved || 0
            const pct = Math.min(100, (saved / goal.alvo) * 100)
            const isCompleted = saved >= goal.alvo
            const daysLeft = getDaysLeft(goal.prazo)

            return (
              <Card key={goal.id} className={`relative overflow-hidden transition-all ${isCompleted ? 'border-emerald-500/50 bg-emerald-500/5' : ''}`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#0f0f0f] border border-[#2a2a2a] flex items-center justify-center text-2xl shrink-0">
                      {goal.icone}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white flex items-center gap-2">
                        {goal.nome}
                        {isCompleted && <Badge color="#10b981">Concluída 🎉</Badge>}
                      </h3>
                      <p className="text-sm text-[#888888]">
                        Prazo: {goal.prazo} ({daysLeft > 0 ? `faltam ${daysLeft} dias` : 'prazo esgotado'})
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => removeGoal(goal.id)}
                      className="p-2 text-[#888888] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-white">{Math.round(pct)}%</span>
                    <span className="text-[#888888]">{fmtBRL(saved)} de {fmtBRL(goal.alvo)}</span>
                  </div>
                  <div className="w-full bg-[#2a2a2a] h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${isCompleted ? 'bg-emerald-500' : pct >= 75 ? 'bg-yellow-500' : 'bg-emerald-400'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {!isCompleted && (
                  <div className="flex flex-col md:flex-row gap-4 justify-between items-center mt-6 pt-4 border-t border-[#2a2a2a]">
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <Input 
                        type="number"
                        placeholder="Valor salvo..."
                        className="w-32"
                        value={addAmount[goal.id] || ''}
                        onChange={(e) => setAddAmount({...addAmount, [goal.id]: e.target.value})}
                      />
                      <Button 
                        variant="secondary"
                        onClick={() => {
                          const val = parseFloat(addAmount[goal.id])
                          if (val > 0) {
                            addToGoal(goal.id, val)
                            setAddAmount({...addAmount, [goal.id]: ''})
                          }
                        }}
                      >
                        Guardar
                      </Button>
                    </div>

                    <Button 
                      variant="ghost" 
                      onClick={() => handleSuggest(goal)}
                      disabled={loadingSuggestionId === goal.id}
                      className="text-indigo-400 hover:text-indigo-300 w-full md:w-auto"
                    >
                      {loadingSuggestionId === goal.id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
                          Analisando...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Ver sugestão da IA
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {suggestion?.id === goal.id && (
                  <div className="mt-4 p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-indigo-100 text-sm leading-relaxed fade-in">
                    <strong>💡 Dica do Consultor IA:</strong><br/>
                    {suggestion.text}
                  </div>
                )}
              </Card>
            )
          })
        )}
      </div>

      <GoalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={addGoal}
      />
    </div>
  )
}
