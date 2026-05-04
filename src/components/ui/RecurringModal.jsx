import React, { useState } from 'react'
import { Card } from './Card'
import { Button } from './Button'
import { Input } from './Input'
import { X } from 'lucide-react'
import { CATEGORIES } from '../../constants/categories'

export function RecurringModal({ isOpen, onClose, onSave }) {
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [categoria, setCategoria] = useState('Outros')
  const [frequencia, setFrequencia] = useState('mensal')
  const [dia, setDia] = useState(1)
  const [diaSemana, setDiaSemana] = useState(1)

  if (!isOpen) return null

  const handleSave = () => {
    if (!descricao || !valor) return
    onSave({
      descricao,
      valor: parseFloat(valor),
      categoria,
      frequencia,
      dia: frequencia === 'mensal' || frequencia === 'quinzenal' ? parseInt(dia) : undefined,
      diaSemana: frequencia === 'semanal' ? parseInt(diaSemana) : undefined
    })
    setDescricao('')
    setValor('')
    setCategoria('Outros')
    setFrequencia('mensal')
    setDia(1)
    setDiaSemana(1)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 fade-in">
      <Card className="w-full max-w-md relative bg-[#1a1a1a]">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#888888] hover:text-white">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold mb-6">Novo Gasto Fixo</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[#888888] mb-1">Descrição</label>
            <Input 
              placeholder="Ex: Aluguel" 
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-[#888888] mb-1">Valor (R$)</label>
            <Input 
              type="number"
              placeholder="Ex: 1500" 
              value={valor}
              onChange={e => setValor(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-[#888888] mb-1">Categoria</label>
            <select 
              value={categoria}
              onChange={e => setCategoria(e.target.value)}
              className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              {Object.keys(CATEGORIES).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-[#888888] mb-1">Frequência</label>
            <select 
              value={frequencia}
              onChange={e => setFrequencia(e.target.value)}
              className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="mensal">Mensal</option>
              <option value="quinzenal">Quinzenal</option>
              <option value="semanal">Semanal</option>
            </select>
          </div>
          
          {(frequencia === 'mensal' || frequencia === 'quinzenal') && (
            <div>
              <label className="block text-sm text-[#888888] mb-1">Dia do Vencimento</label>
              <Input 
                type="number"
                min="1"
                max="31"
                value={dia}
                onChange={e => setDia(e.target.value)}
              />
            </div>
          )}

          {frequencia === 'semanal' && (
            <div>
              <label className="block text-sm text-[#888888] mb-1">Dia da Semana</label>
              <select 
                value={diaSemana}
                onChange={e => setDiaSemana(e.target.value)}
                className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="0">Domingo</option>
                <option value="1">Segunda-feira</option>
                <option value="2">Terça-feira</option>
                <option value="3">Quarta-feira</option>
                <option value="4">Quinta-feira</option>
                <option value="5">Sexta-feira</option>
                <option value="6">Sábado</option>
              </select>
            </div>
          )}

          <Button className="w-full mt-6" onClick={handleSave} disabled={!descricao || !valor}>
            Criar Gasto Fixo
          </Button>
        </div>
      </Card>
    </div>
  )
}
