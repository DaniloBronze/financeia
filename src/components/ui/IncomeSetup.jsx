import { useState } from 'react'
import useStore from '../../store/useStore'
import { fmtBRL } from '../../utils/currency'

export function IncomeSetup() {
  const { getCurrentIncome, setIncome } = useStore()
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState('')
  const renda = getCurrentIncome()

  const handleSave = () => {
    const num = parseFloat(value.replace(',', '.'))
    if (!num || num <= 0) return
    setIncome(num)
    setEditing(false)
    setValue('')
  }

  if (editing) {
    return (
      <div className="bg-zinc-800/60 border border-indigo-500/30 rounded-2xl p-4 mb-4">
        <p className="text-xs text-zinc-400 mb-3">Qual é a sua renda este mês?</p>
        <div className="flex gap-2">
          <div className="flex-1 flex items-center bg-zinc-900 border border-zinc-700 rounded-xl px-3 gap-2">
            <span className="text-zinc-500 text-sm">R$</span>
            <input
              type="number"
              placeholder="3750,00"
              value={value}
              onChange={e => setValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              autoFocus
              className="flex-1 bg-transparent text-white py-3 text-sm outline-none"
            />
          </div>
          <button onClick={handleSave}
            className="px-4 py-3 bg-indigo-600 text-white rounded-xl text-sm font-medium">
            Salvar
          </button>
          <button onClick={() => setEditing(false)}
            className="px-3 py-3 bg-zinc-700 text-zinc-400 rounded-xl text-sm">
            ✕
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="w-full text-left bg-zinc-800/40 border border-dashed border-zinc-700 rounded-2xl p-4 mb-4 hover:border-indigo-500/50 transition-all"
    >
      {renda > 0 ? (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-500">Renda este mês</p>
            <p className="text-lg font-bold text-white mt-0.5">{fmtBRL(renda)}</p>
          </div>
          <span className="text-xs text-zinc-500 bg-zinc-700 px-2 py-1 rounded-lg">editar</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-zinc-400">
          <span>💰</span>
          <span className="text-sm">Definir renda do mês</span>
        </div>
      )}
    </button>
  )
}
