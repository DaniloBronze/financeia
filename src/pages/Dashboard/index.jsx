import React, { useState, useEffect } from 'react'
import { Sparkles, Trash2 } from 'lucide-react'
import useStore from '../../store/useStore'
import { parseExpense } from '../../services/ai'
import { CATEGORIES } from '../../constants/categories'
import { fmtBRL } from '../../utils/currency'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Toast } from '../../components/ui/Toast'
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition'
import { useBudgetAlerts } from '../../hooks/useBudgetAlerts'
import { useRecurringAlerts } from '../../hooks/useRecurringAlerts'
import { useBalance } from '../../hooks/useBalance'
import { IncomeSetup } from '../../components/ui/IncomeSetup'

export default function Dashboard() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { expenses, addExpense, removeExpense, getByCategory, markApplied, envelopes, debitEnvelope } = useStore()
  const { transcript, isListening, isSupported, startListening, stopListening } = useSpeechRecognition()
  const { requestPermission, checkAlerts } = useBudgetAlerts()
  const { getPendingToday, applyRecurring } = useRecurringAlerts()
  const { renda, totalGasto, saldoDisponivel, saldoReal, totalFixosPendentes, percentGasto } = useBalance()

  const [toastAlerts, setToastAlerts] = useState([])
  const [suggestedEnvelope, setSuggestedEnvelope] = useState(null)
  const [pendingExpense, setPendingExpense] = useState(null)

  const pending = getPendingToday()

  useEffect(() => { requestPermission() }, [])

  useEffect(() => {
    if (transcript) setText(transcript)
  }, [transcript])
  
  const bycat = getByCategory()
  
  let topCat = '-'
  let maxVal = 0
  Object.entries(bycat).forEach(([cat, val]) => {
    if (val > maxVal) {
      maxVal = val
      topCat = cat
    }
  })

  const handleSubmit = async () => {
    if (!text.trim()) return
    setLoading(true)
    setError('')
    try {
      const data = await parseExpense(text)
      if (data && typeof data.valor !== 'undefined') {
        let cat = data.categoria
        if (!CATEGORIES[cat]) cat = 'Outros'
        
        const newExpense = {
          descricao: data.descricao || 'Despesa',
          valor: parseFloat(data.valor) || 0,
          categoria: cat,
          data: data.data || new Date().toLocaleDateString('pt-BR'),
          original: text
        }
        
        const envelope = envelopes.find(e =>
          e.categorias?.includes(cat) || e.nome.toLowerCase() === cat.toLowerCase()
        )

        if (envelope) {
          setPendingExpense(newExpense)
          setSuggestedEnvelope(envelope)
        } else {
          addExpense(newExpense)
          setText('')
          
          const updatedExpenses = [newExpense, ...expenses]
          const alerts = checkAlerts(updatedExpenses)
          if (alerts.length > 0) setToastAlerts(alerts)
        }
      } else {
        throw new Error("Não foi possível identificar o valor ou categoria.")
      }
    } catch (err) {
      if (err.message === 'OFFLINE') {
        setError('Sem internet — a IA está offline. Guarde para adicionar depois ou quando a conexão voltar.')
      } else {
        setError(err.message || 'Erro ao processar com IA.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmEnvelopeDebit = (debitar) => {
    if (debitar) {
      debitEnvelope(suggestedEnvelope.id, pendingExpense.valor, pendingExpense.descricao)
    }
    
    addExpense(pendingExpense)
    setText('')
    const updatedExpenses = [pendingExpense, ...expenses]
    const alerts = checkAlerts(updatedExpenses)
    if (alerts.length > 0) setToastAlerts(alerts)
    
    setSuggestedEnvelope(null)
    setPendingExpense(null)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const lastExpenses = expenses.slice(0, 5)

  return (
    <div className="max-w-4xl mx-auto space-y-6 fade-in">
      <IncomeSetup />

      {renda > 0 && (
        <>
          {/* Card principal — saldo disponível */}
          <div className={`rounded-2xl p-6 border shadow-sm ${
            saldoDisponivel < 0
              ? 'bg-red-500/10 border-red-500/30'
              : saldoDisponivel < renda * 0.2
              ? 'bg-orange-500/10 border-orange-500/30'
              : 'bg-emerald-500/10 border-emerald-500/20'
          }`}>
            <p className="text-xs text-zinc-400 mb-1">Saldo disponível</p>
            <p className={`text-4xl font-bold ${
              saldoDisponivel < 0 ? 'text-red-400'
              : saldoDisponivel < renda * 0.2 ? 'text-orange-400'
              : 'text-emerald-400'
            }`}>
              {fmtBRL(saldoDisponivel)}
            </p>
            {totalFixosPendentes > 0 && (
              <p className="text-xs text-zinc-500 mt-2">
                Saldo real: {fmtBRL(saldoReal)} (descontando fixos pendentes)
              </p>
            )}
          </div>

          {/* Barra de consumo da renda */}
          <div className="bg-zinc-800/60 border border-zinc-700/50 rounded-2xl p-5">
            <div className="flex justify-between text-xs text-zinc-400 mb-3">
              <span className="font-medium">Consumo da renda</span>
              <span className="font-semibold">{Math.min(100, Math.round(percentGasto))}%</span>
            </div>
            <div className="w-full h-2.5 bg-zinc-700/50 rounded-full overflow-hidden mb-4">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  percentGasto > 100 ? 'bg-red-500'
                  : percentGasto > 75 ? 'bg-orange-500'
                  : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, percentGasto)}%` }}
              />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="border-r border-zinc-700/50">
                <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Renda</p>
                <p className="text-sm font-bold text-white">{fmtBRL(renda)}</p>
              </div>
              <div className="border-r border-zinc-700/50">
                <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Gasto</p>
                <p className="text-sm font-bold text-red-400">{fmtBRL(totalGasto)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Fixos pend.</p>
                <p className="text-sm font-bold text-orange-400">{fmtBRL(totalFixosPendentes)}</p>
              </div>
            </div>
          </div>
        </>
      )}

      {!renda && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          <Card className="col-span-2 md:col-span-1 p-4">
            <p className="text-xs text-zinc-400 mb-1">Total gasto no mês</p>
            <p className="text-3xl font-bold text-white">{fmtBRL(totalGasto)}</p>
          </Card>
          <Card className="p-4 min-h-[80px] flex flex-col justify-between">
            <p className="text-xs text-zinc-400">Maior categoria</p>
            <p className="text-sm font-semibold text-white mt-1 line-clamp-2">{topCat}</p>
          </Card>
          <Card className="p-4 min-h-[80px] flex flex-col justify-between">
            <p className="text-xs text-zinc-400">Lançamentos</p>
            <p className="text-3xl font-bold text-white mt-1">{expenses.length}</p>
          </Card>
        </div>
      )}

      {pending.length > 0 && (
        <div className="flex flex-col gap-2">
          {pending.map(r => (
            <div key={r.id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
              <span className="text-sm text-indigo-300">
                📅 <strong>{r.descricao}</strong> vence hoje — {fmtBRL(r.valor)}
              </span>
              <div className="flex gap-2">
                <button onClick={() => applyRecurring(r)} className="text-xs px-3 py-2 bg-indigo-500 text-white hover:bg-indigo-600 transition-colors rounded-lg">
                  Adicionar
                </button>
                <button onClick={() => markApplied(r.id)} className="text-xs px-3 py-2 bg-[#2a2a2a] text-[#888888] hover:text-white transition-colors rounded-lg">
                  Ignorar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Card className="border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-indigo-400">✦</span>
          <h2 className="text-sm font-semibold text-zinc-300">Registrar com IA</h2>
        </div>
        {suggestedEnvelope ? (
          <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl fade-in">
            <p className="text-indigo-100 mb-4">
              Descontar <strong>{fmtBRL(pendingExpense.valor)}</strong> da caixinha <strong>{suggestedEnvelope.icone} {suggestedEnvelope.nome}</strong> (Saldo: {fmtBRL(suggestedEnvelope.saldo)})?
            </p>
            <div className="flex gap-3">
              <Button onClick={() => handleConfirmEnvelopeDebit(true)}>Sim, descontar</Button>
              <Button variant="secondary" onClick={() => handleConfirmEnvelopeDebit(false)}>Não, só registrar</Button>
            </div>
          </div>
        ) : (
          <div className="relative">
            <textarea
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ex: gastei 85 reais no mercado hoje..."
              className="w-full bg-[#1a1a1a] md:bg-zinc-800 border border-[#2a2a2a] md:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 resize-none focus:outline-none focus:border-indigo-500 transition-colors"
              disabled={loading}
            />
            {isSupported && (
              <button
                onClick={isListening ? stopListening : startListening}
                className={`absolute top-3 right-3 p-2 rounded-lg transition-all ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {isListening ? '⏹ Ouvindo...' : '🎙️'}
              </button>
            )}
            {error && <span className="text-red-400 text-sm block mt-2">{error}</span>}
            <button 
              onClick={handleSubmit} 
              disabled={loading || !text.trim()}
              className="w-full mt-3 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analisando com IA...
                </>
              ) : (
                '✨ Analisar e adicionar'
              )}
            </button>
          </div>
        )}
      </Card>

      <div>
        <h2 className="text-lg font-medium mb-4">Últimos Lançamentos</h2>
        <div className="space-y-3">
          {lastExpenses.length === 0 ? (
            <Card className="text-center text-[#888888] py-8">
              Nenhum gasto registrado ainda.
            </Card>
          ) : (
            lastExpenses.map(expense => {
              const cat = CATEGORIES[expense.categoria] || CATEGORIES['Outros']
              return (
                <div key={expense.id} className="flex items-center gap-3 bg-[#1a1a1a] md:bg-zinc-800/60 border border-[#2a2a2a] md:border-zinc-700/50 rounded-2xl p-4 transition-colors">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                       style={{ background: `${cat.color}20`, color: cat.color }}>
                    {cat.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white capitalize truncate">{expense.descricao}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-zinc-500">{expense.data}</span>
                      <span className="text-[10px] md:text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ background: `${cat.color}20`, color: cat.color }}>
                        {expense.categoria}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-sm font-bold text-white">{fmtBRL(expense.valor)}</span>
                    <button 
                      onClick={() => removeExpense(expense.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
      <Toast alerts={toastAlerts} onClose={() => setToastAlerts([])} />
    </div>
  )
}
