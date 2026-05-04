import { useEffect } from 'react'
import useStore from '../store/useStore'

export function useRecurringAlerts() {
  const { recurrings, lastApplied, expenses, addExpense, markApplied } = useStore()

  const getPendingToday = () => {
    const today = new Date()
    const currentMonth = today.toISOString().slice(0, 7)
    const todayDay = today.getDate()

    return recurrings.filter(r => {
      if (!r.active) return false
      if (lastApplied[r.id] === currentMonth) return false

      if (r.frequencia === 'mensal') return r.dia === todayDay
      if (r.frequencia === 'quinzenal') return todayDay === r.dia || todayDay === r.dia + 15
      if (r.frequencia === 'semanal') return today.getDay() === r.diaSemana
      return false
    })
  }

  const applyRecurring = (recurring) => {
    addExpense({
      descricao: recurring.descricao,
      valor: recurring.valor,
      categoria: recurring.categoria,
      data: new Date().toLocaleDateString('pt-BR'),
      original: `[recorrente] ${recurring.descricao}`
    })
    markApplied(recurring.id)
  }

  const getNextDue = (r) => {
    const today = new Date()
    
    if (r.frequencia === 'mensal') {
      const next = new Date(today.getFullYear(), today.getMonth(), r.dia)
      if (next < today) next.setMonth(next.getMonth() + 1)
      const diff = Math.ceil((next - today) / (1000 * 60 * 60 * 24))
      return diff === 0 ? 'Hoje' : diff === 1 ? 'Amanhã' : `em ${diff} dias`
    }
    
    // Simplification for others
    if (r.frequencia === 'semanal') {
      let diff = r.diaSemana - today.getDay()
      if (diff < 0) diff += 7
      return diff === 0 ? 'Hoje' : diff === 1 ? 'Amanhã' : `em ${diff} dias`
    }
    
    if (r.frequencia === 'quinzenal') {
      // Find next date (dia or dia + 15)
      let d1 = r.dia
      let d2 = r.dia + 15
      if (d2 > 28) d2 = 28 // Avoid end of month issues
      
      const next1 = new Date(today.getFullYear(), today.getMonth(), d1)
      if (next1 < today) next1.setMonth(next1.getMonth() + 1)
      
      const next2 = new Date(today.getFullYear(), today.getMonth(), d2)
      if (next2 < today) next2.setMonth(next2.getMonth() + 1)
      
      const next = next1 < next2 ? next1 : next2
      const diff = Math.ceil((next - today) / (1000 * 60 * 60 * 24))
      return diff === 0 ? 'Hoje' : diff === 1 ? 'Amanhã' : `em ${diff} dias`
    }
    
    return 'Desconhecido'
  }

  return { getPendingToday, applyRecurring, getNextDue }
}
