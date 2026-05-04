import React, { useState } from 'react'
import { Card } from './Card'
import { Button } from './Button'
import { Input } from './Input'
import { X } from 'lucide-react'
import { fmtBRL } from '../../utils/currency'

export function EnvelopeDebitModal({ isOpen, onClose, onSave, envelope, addExpense }) {
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [alsoAddExpense, setAlsoAddExpense] = useState(true)

  if (!isOpen || !envelope) return null

  const handleSave = () => {
    if (!descricao || !valor) return
    const numVal = parseFloat(valor)
    
    if (numVal > envelope.saldo) {
      if (!window.confirm("⚠️ Isso vai deixar a caixinha negativa. Continuar?")) {
        return
      }
    }
    
    onSave(envelope.id, numVal, descricao)
    
    if (alsoAddExpense && addExpense) {
      let cat = envelope.categorias?.[0] || 'Outros'
      addExpense({
        descricao,
        valor: numVal,
        categoria: cat,
        data: new Date().toLocaleDateString('pt-BR'),
        original: `[caixinha] ${descricao}`
      })
    }
    
    setDescricao('')
    setValor('')
    setAlsoAddExpense(true)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 fade-in">
      <Card className="w-full max-w-md relative bg-[#1a1a1a]">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#888888] hover:text-white">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold mb-2">💸 Gastar da Caixinha</h2>
        <p className="text-[#888888] mb-6">
          Caixinha: <strong>{envelope.nome}</strong> | Saldo: <strong className={envelope.saldo < 0 ? 'text-red-400' : 'text-white'}>{fmtBRL(envelope.saldo)}</strong>
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[#888888] mb-1">Descrição do gasto</label>
            <Input 
              placeholder="Ex: Jantar" 
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-[#888888] mb-1">Valor (R$)</label>
            <Input 
              type="number"
              placeholder="Ex: 50" 
              value={valor}
              onChange={e => setValor(e.target.value)}
            />
          </div>
          
          <label className="flex items-center gap-2 cursor-pointer mt-2 text-sm text-[#888888]">
            <input 
              type="checkbox" 
              checked={alsoAddExpense}
              onChange={e => setAlsoAddExpense(e.target.checked)}
              className="rounded bg-[#0f0f0f] border-[#2a2a2a]"
            />
            Também registrar nos gastos gerais
          </label>

          <Button className="w-full mt-6 bg-red-500 hover:bg-red-600" onClick={handleSave} disabled={!descricao || !valor}>
            Confirmar Gasto
          </Button>
        </div>
      </Card>
    </div>
  )
}
