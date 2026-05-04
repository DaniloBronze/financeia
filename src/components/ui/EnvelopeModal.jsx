import React, { useState } from 'react'
import { Card } from './Card'
import { Button } from './Button'
import { Input } from './Input'
import { X } from 'lucide-react'

const ICONS = ['🛒', '🚗', '🏠', '🏥', '🎮', '📚', '👕', '💡', '📦', '✈️', '🍕', '🎬', '💊', '🐶', '🎁', '💇', '🏋️', '☕', '🎵', '💻']
const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280']

export function EnvelopeModal({ isOpen, onClose, onSave }) {
  const [nome, setNome] = useState('')
  const [valor, setValor] = useState('')
  const [icone, setIcone] = useState('🛒')
  const [cor, setCor] = useState('#3b82f6')

  if (!isOpen) return null

  const handleSave = () => {
    if (!nome || !valor) return
    onSave({
      nome,
      valor: parseFloat(valor),
      icone,
      cor
    })
    setNome('')
    setValor('')
    setIcone('🛒')
    setCor('#3b82f6')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 fade-in overflow-y-auto">
      <Card className="w-full max-w-md relative bg-[#1a1a1a] my-8">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#888888] hover:text-white">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold mb-6">Nova Caixinha</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[#888888] mb-1">Nome</label>
            <Input 
              placeholder="Ex: Lazer" 
              value={nome}
              onChange={e => setNome(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-[#888888] mb-1">Valor inicial / Teto (R$)</label>
            <Input 
              type="number"
              placeholder="Ex: 500" 
              value={valor}
              onChange={e => setValor(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm text-[#888888] mb-2">Cor</label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setCor(c)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${cor === c ? 'scale-125 border-white' : 'border-transparent'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-[#888888] mb-2">Ícone</label>
            <div className="grid grid-cols-5 gap-2">
              {ICONS.map(i => (
                <button
                  key={i}
                  onClick={() => setIcone(i)}
                  className={`p-2 rounded-lg text-2xl transition-colors ${
                    icone === i ? 'bg-[#2a2a2a] border border-[#888888]' : 'bg-[#0f0f0f] border border-[#2a2a2a] hover:bg-[#2a2a2a]'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <Button className="w-full mt-6" onClick={handleSave} disabled={!nome || !valor}>
            Criar Caixinha
          </Button>
        </div>
      </Card>
    </div>
  )
}
