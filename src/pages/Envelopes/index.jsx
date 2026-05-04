import React, { useState } from 'react'
import { Plus, Sparkles, Trash2, ArrowRightLeft, PlusCircle, ArrowDownCircle } from 'lucide-react'
import useStore from '../../store/useStore'
import { suggestEnvelopes } from '../../services/ai'
import { fmtBRL } from '../../utils/currency'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { EnvelopeModal } from '../../components/ui/EnvelopeModal'
import { EnvelopeDebitModal } from '../../components/ui/EnvelopeDebitModal'
import { EnvelopeCreditModal } from '../../components/ui/EnvelopeCreditModal'
import { EnvelopeTransferModal } from '../../components/ui/EnvelopeTransferModal'
import { EnvelopeHistory } from '../../components/ui/EnvelopeHistory'

export default function Envelopes() {
  const { envelopes, addEnvelope, removeEnvelope, debitEnvelope, creditEnvelope, transferEnvelope, addExpense } = useStore()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeEnvelopeForDebit, setActiveEnvelopeForDebit] = useState(null)
  const [activeEnvelopeForCredit, setActiveEnvelopeForCredit] = useState(null)
  const [activeEnvelopeForTransfer, setActiveEnvelopeForTransfer] = useState(null)
  const [activeEnvelopeForHistory, setActiveEnvelopeForHistory] = useState(null)
  
  const [income, setIncome] = useState('')
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState(null)

  const { expenses } = useStore.getState() // Needed for AI suggestion

  const totalDistribuido = envelopes.reduce((acc, e) => acc + e.valor, 0)
  const totalDisponivel = envelopes.reduce((acc, e) => acc + e.saldo, 0)
  const totalGasto = totalDistribuido - totalDisponivel

  const handleSuggest = async () => {
    if (!income) return
    setLoadingSuggestions(true)
    try {
      const data = await suggestEnvelopes(expenses, parseFloat(income))
      setSuggestions(data)
    } catch (err) {
      alert("Erro ao gerar sugestões.")
    } finally {
      setLoadingSuggestions(false)
    }
  }

  const handleCreateSuggestion = (s) => {
    addEnvelope({
      nome: s.nome,
      valor: s.valor,
      icone: s.icone || '💰',
      cor: '#3b82f6'
    })
    setSuggestions(suggestions.filter(sg => sg.nome !== s.nome))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Caixinhas</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" /> Nova Caixinha
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <p className="text-sm text-[#888888] mb-1">Total distribuído</p>
          <p className="text-2xl font-semibold">{fmtBRL(totalDistribuido)}</p>
        </Card>
        <Card>
          <p className="text-sm text-[#888888] mb-1">Total disponível</p>
          <p className="text-2xl font-semibold text-emerald-400">{fmtBRL(totalDisponivel)}</p>
        </Card>
        <Card>
          <p className="text-sm text-[#888888] mb-1">Total gasto</p>
          <p className="text-2xl font-semibold text-red-400">{fmtBRL(totalGasto)}</p>
        </Card>
      </div>

      {envelopes.length === 0 && (
        <Card className="p-6 border border-indigo-500/30 bg-indigo-500/5">
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            Sugestão Inteligente de Caixinhas
          </h2>
          <p className="text-[#888888] mb-4 text-sm">
            Informe sua renda mensal para a IA analisar seus gastos e criar um plano de envelopes ideal para você.
          </p>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <Input 
              type="number"
              placeholder="Sua renda mensal (Ex: 5000)"
              value={income}
              onChange={e => setIncome(e.target.value)}
              className="max-w-xs"
            />
            <Button onClick={handleSuggest} disabled={!income || loadingSuggestions}>
              {loadingSuggestions ? 'Analisando...' : 'Gerar Sugestões'}
            </Button>
          </div>
          
          {suggestions && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestions.map((s, i) => (
                <div key={i} className="p-4 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2 mb-1">
                      {s.icone} {s.nome} <span className="text-emerald-400 text-sm ml-auto">{fmtBRL(s.valor)}</span>
                    </h3>
                    <p className="text-sm text-[#888888] mb-4">{s.justificativa}</p>
                  </div>
                  <Button variant="secondary" onClick={() => handleCreateSuggestion(s)} className="w-full text-sm">
                    Criar esta caixinha
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {envelopes.map(env => {
          const pctGasto = ((env.valor - env.saldo) / env.valor) * 100
          
          let progBg = 'bg-emerald-500'
          if (pctGasto >= 50 && pctGasto < 80) progBg = 'bg-yellow-500'
          if (pctGasto >= 80) progBg = 'bg-red-500'
          
          let cardStatus = ''
          if (env.saldo === 0) cardStatus = 'ZERADA'
          if (env.saldo < 0) cardStatus = 'NEGATIVA'

          return (
            <Card key={env.id} className="relative overflow-hidden cursor-pointer hover:border-[#3a3a3a] transition-colors" onClick={(e) => {
              // Ignore se clicou em botões
              if (e.target.closest('button')) return
              setActiveEnvelopeForHistory(env)
            }}>
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 border border-white/10"
                    style={{ backgroundColor: env.cor }}
                  >
                    {env.icone}
                  </div>
                  <div>
                    <h3 className="font-medium text-lg leading-tight">{env.nome}</h3>
                    {cardStatus && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${env.saldo < 0 ? 'bg-red-500/20 text-red-400' : 'bg-zinc-700 text-zinc-300'}`}>
                        {cardStatus}
                      </span>
                    )}
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); removeEnvelope(env.id); }} className="text-[#888888] hover:text-red-400 p-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-sm text-[#888888] mb-1">Saldo Atual</p>
                <p className={`text-3xl font-bold ${env.saldo < 0 ? 'text-red-400' : 'text-white'}`}>
                  {fmtBRL(env.saldo)}
                </p>
              </div>

              <div className="mb-6">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#888888]">{fmtBRL(env.valor - env.saldo)} gastos de {fmtBRL(env.valor)}</span>
                  <span className="font-medium text-[#888888]">{Math.max(0, Math.round(pctGasto))}%</span>
                </div>
                <div className="w-full bg-[#2a2a2a] h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${progBg}`}
                    style={{ width: `${Math.min(100, Math.max(0, pctGasto))}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 border-t border-[#2a2a2a] pt-4 mt-auto">
                <button 
                  onClick={(e) => { e.stopPropagation(); setActiveEnvelopeForDebit(env); }}
                  className="flex flex-col items-center justify-center gap-1 py-2 rounded-lg hover:bg-[#2a2a2a] text-[#888888] hover:text-red-400 transition-colors"
                >
                  <ArrowDownCircle className="w-5 h-5" />
                  <span className="text-[10px] uppercase font-semibold">Gastar</span>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setActiveEnvelopeForCredit(env); }}
                  className="flex flex-col items-center justify-center gap-1 py-2 rounded-lg hover:bg-[#2a2a2a] text-[#888888] hover:text-emerald-400 transition-colors"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span className="text-[10px] uppercase font-semibold">Abastecer</span>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setActiveEnvelopeForTransfer(env); }}
                  className="flex flex-col items-center justify-center gap-1 py-2 rounded-lg hover:bg-[#2a2a2a] text-[#888888] hover:text-blue-400 transition-colors"
                >
                  <ArrowRightLeft className="w-5 h-5" />
                  <span className="text-[10px] uppercase font-semibold">Transferir</span>
                </button>
              </div>
            </Card>
          )
        })}
      </div>

      <EnvelopeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={addEnvelope}
      />
      
      <EnvelopeDebitModal 
        isOpen={!!activeEnvelopeForDebit} 
        onClose={() => setActiveEnvelopeForDebit(null)} 
        onSave={debitEnvelope}
        envelope={activeEnvelopeForDebit}
        addExpense={addExpense}
      />

      <EnvelopeCreditModal 
        isOpen={!!activeEnvelopeForCredit} 
        onClose={() => setActiveEnvelopeForCredit(null)} 
        onSave={creditEnvelope}
        envelope={activeEnvelopeForCredit}
      />

      <EnvelopeTransferModal 
        isOpen={!!activeEnvelopeForTransfer} 
        onClose={() => setActiveEnvelopeForTransfer(null)} 
        onSave={transferEnvelope}
        envelope={activeEnvelopeForTransfer}
        envelopes={envelopes}
      />

      <EnvelopeHistory 
        isOpen={!!activeEnvelopeForHistory} 
        onClose={() => setActiveEnvelopeForHistory(null)} 
        envelope={activeEnvelopeForHistory}
      />
    </div>
  )
}
