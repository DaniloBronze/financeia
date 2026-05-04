import React, { useState } from 'react'
import { Card } from './Card'
import { Button } from './Button'
import { Input } from './Input'
import { X } from 'lucide-react'
import { fmtBRL } from '../../utils/currency'

export function EnvelopeCreditModal({ isOpen, onClose, onSave, envelope }) {
  const [descricao, setDescricao] = useState('Abastecimento')
  const [valor, setValor] = useState('')

  if (!isOpen || !envelope) return null

  const handleSave = () => {
    if (!descricao || !valor) return
    const numVal = parseFloat(valor)
    
    onSave(envelope.id, numVal, descricao)
    
    setDescricao('Abastecimento')
    setValor('')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 fade-in">
      <Card className="w-full max-w-md relative bg-[#1a1a1a]">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#888888] hover:text-white">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold mb-2">➕ Abastecer Caixinha</h2>
        <p className="text-[#888888] mb-6">
          Caixinha: <strong>{envelope.nome}</strong> | Saldo: <strong className={envelope.saldo < 0 ? 'text-red-400' : 'text-white'}>{fmtBRL(envelope.saldo)}</strong>
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[#888888] mb-1">Descrição</label>
            <Input 
              placeholder="Ex: Abastecimento do mês" 
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-[#888888] mb-1">Valor a adicionar (R$)</label>
            <Input 
              type="number"
              placeholder="Ex: 50" 
              value={valor}
              onChange={e => setValor(e.target.value)}
            />
          </div>

          <Button className="w-full mt-6 bg-emerald-500 hover:bg-emerald-600" onClick={handleSave} disabled={!descricao || !valor}>
            Abastecer
          </Button>
        </div>
      </Card>
    </div>
  )
}
