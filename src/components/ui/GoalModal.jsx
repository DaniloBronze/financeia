import React, { useState } from 'react'
import { Card } from './Card'
import { Button } from './Button'
import { Input } from './Input'
import { X } from 'lucide-react'

const ICONS = ['🏦', '✈️', '🏠', '🚗', '📱', '💍', '🎓', '🏋️', '🌍', '💻']

export function GoalModal({ isOpen, onClose, onSave }) {
  const [nome, setNome] = useState('')
  const [alvo, setAlvo] = useState('')
  const [prazo, setPrazo] = useState('')
  const [icone, setIcone] = useState('🏦')

  if (!isOpen) return null

  const handleSave = () => {
    if (!nome || !alvo || !prazo) return
    onSave({
      nome,
      alvo: parseFloat(alvo),
      prazo: new Date(prazo).toLocaleDateString('pt-BR'),
      icone
    })
    setNome('')
    setAlvo('')
    setPrazo('')
    setIcone('🏦')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 fade-in">
      <Card className="w-full max-w-md relative bg-[#1a1a1a]">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#888888] hover:text-white">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold mb-6">Nova Meta</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[#888888] mb-1">Nome da meta</label>
            <Input 
              placeholder="Ex: Reserva de emergência" 
              value={nome}
              onChange={e => setNome(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-[#888888] mb-1">Valor alvo (R$)</label>
            <Input 
              type="number"
              placeholder="Ex: 2000" 
              value={alvo}
              onChange={e => setAlvo(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-[#888888] mb-1">Prazo</label>
            <Input 
              type="date"
              value={prazo}
              onChange={e => setPrazo(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-[#888888] mb-2">Ícone</label>
            <div className="grid grid-cols-5 gap-2">
              {ICONS.map(i => (
                <button
                  key={i}
                  onClick={() => setIcone(i)}
                  className={`p-2 rounded-lg text-2xl transition-colors ${
                    icone === i ? 'bg-indigo-600/20 border border-indigo-500' : 'bg-[#0f0f0f] border border-[#2a2a2a] hover:bg-[#2a2a2a]'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <Button className="w-full mt-6" onClick={handleSave} disabled={!nome || !alvo || !prazo}>
            Criar Meta
          </Button>
        </div>
      </Card>
    </div>
  )
}
