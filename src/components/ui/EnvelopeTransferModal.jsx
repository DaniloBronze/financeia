import React, { useState } from 'react'
import { Card } from './Card'
import { Button } from './Button'
import { Input } from './Input'
import { X } from 'lucide-react'
import { fmtBRL } from '../../utils/currency'

export function EnvelopeTransferModal({ isOpen, onClose, onSave, envelope, envelopes }) {
  const [toId, setToId] = useState('')
  const [valor, setValor] = useState('')

  if (!isOpen || !envelope) return null

  const handleSave = () => {
    if (!toId || !valor) return
    const numVal = parseFloat(valor)
    
    if (numVal > envelope.saldo) {
      alert("Não é possível transferir mais do que o saldo disponível.")
      return
    }
    
    onSave(envelope.id, parseInt(toId), numVal)
    
    setToId('')
    setValor('')
    onClose()
  }

  const outras = envelopes.filter(e => e.id !== envelope.id)

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 fade-in">
      <Card className="w-full max-w-md relative bg-[#1a1a1a]">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#888888] hover:text-white">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold mb-2">🔄 Transferir Saldo</h2>
        <p className="text-[#888888] mb-6">
          Origem: <strong>{envelope.nome}</strong> | Saldo: <strong className={envelope.saldo < 0 ? 'text-red-400' : 'text-white'}>{fmtBRL(envelope.saldo)}</strong>
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[#888888] mb-1">Destino</label>
            <select 
              value={toId}
              onChange={e => setToId(e.target.value)}
              className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="">Selecione uma caixinha...</option>
              {outras.map(e => (
                <option key={e.id} value={e.id}>{e.nome} (Saldo: {fmtBRL(e.saldo)})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-[#888888] mb-1">Valor a transferir (R$)</label>
            <Input 
              type="number"
              placeholder="Ex: 50" 
              value={valor}
              onChange={e => setValor(e.target.value)}
            />
          </div>

          <Button className="w-full mt-6 bg-blue-500 hover:bg-blue-600" onClick={handleSave} disabled={!toId || !valor}>
            Transferir
          </Button>
        </div>
      </Card>
    </div>
  )
}
