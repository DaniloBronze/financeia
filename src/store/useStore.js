import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(persist(
  (set, get) => ({
    expenses: [],
    goals: [],
    recurrings: [],
    envelopes: [],
    lastApplied: {},
    addExpense: (expense) => set(state => ({
      expenses: [{ ...expense, id: Date.now() }, ...state.expenses]
    })),
    removeExpense: (id) => set(state => ({
      expenses: state.expenses.filter(e => e.id !== id)
    })),
    getByCategory: () => {
      const bycat = {}
      get().expenses.forEach(e => {
        bycat[e.categoria] = (bycat[e.categoria] || 0) + e.valor
      })
      return bycat
    },
    getTotal: () => get().expenses.reduce((s, e) => s + e.valor, 0),
    addGoal: (goal) => set(state => ({
      goals: [{ ...goal, id: Date.now(), saved: 0, createdAt: new Date().toLocaleDateString('pt-BR') }, ...state.goals]
    })),
    updateGoal: (id, data) => set(state => ({
      goals: state.goals.map(g => g.id === id ? { ...g, ...data } : g)
    })),
    removeGoal: (id) => set(state => ({
      goals: state.goals.filter(g => g.id !== id)
    })),
    addToGoal: (id, amount) => set(state => ({
      goals: state.goals.map(g =>
        g.id === id ? { ...g, saved: (g.saved || 0) + amount } : g
      )
    })),
    addRecurring: (item) => set(state => ({
      recurrings: [{ ...item, id: Date.now(), active: true }, ...state.recurrings]
    })),
    toggleRecurring: (id) => set(state => ({
      recurrings: state.recurrings.map(r =>
        r.id === id ? { ...r, active: !r.active } : r
      )
    })),
    removeRecurring: (id) => set(state => ({
      recurrings: state.recurrings.filter(r => r.id !== id)
    })),
    markApplied: (id) => set(state => ({
      lastApplied: { ...state.lastApplied, [id]: new Date().toISOString().slice(0, 7) }
    })),
    addEnvelope: (envelope) => set(state => ({
      envelopes: [{
        ...envelope,
        id: Date.now(),
        saldo: envelope.valor,
        historico: [],
        createdAt: new Date().toLocaleDateString('pt-BR')
      }, ...state.envelopes]
    })),
    updateEnvelope: (id, data) => set(state => ({
      envelopes: state.envelopes.map(e => e.id === id ? { ...e, ...data } : e)
    })),
    removeEnvelope: (id) => set(state => ({
      envelopes: state.envelopes.filter(e => e.id !== id)
    })),
    debitEnvelope: (id, amount, descricao) => set(state => ({
      envelopes: state.envelopes.map(e => {
        if (e.id !== id) return e
        const novoSaldo = e.saldo - amount
        return {
          ...e,
          saldo: novoSaldo,
          historico: [{
            id: Date.now(),
            tipo: 'debito',
            valor: amount,
            descricao,
            data: new Date().toLocaleDateString('pt-BR'),
            saldoApos: novoSaldo
          }, ...e.historico]
        }
      })
    })),
    creditEnvelope: (id, amount, descricao = 'Abastecimento') => set(state => ({
      envelopes: state.envelopes.map(e => {
        if (e.id !== id) return e
        const novoSaldo = e.saldo + amount
        return {
          ...e,
          saldo: novoSaldo,
          historico: [{
            id: Date.now(),
            tipo: 'credito',
            valor: amount,
            descricao,
            data: new Date().toLocaleDateString('pt-BR'),
            saldoApos: novoSaldo
          }, ...e.historico]
        }
      })
    })),
    transferEnvelope: (fromId, toId, amount) => set(state => ({
      envelopes: state.envelopes.map(e => {
        if (e.id === fromId) {
          const novoSaldo = e.saldo - amount
          return {
            ...e,
            saldo: novoSaldo,
            historico: [{
              id: Date.now() + 1,
              tipo: 'transferencia_saida',
              valor: amount,
              descricao: `Transferido para outra caixinha`,
              data: new Date().toLocaleDateString('pt-BR'),
              saldoApos: novoSaldo
            }, ...e.historico]
          }
        }
        if (e.id === toId) {
          const novoSaldo = e.saldo + amount
          return {
            ...e,
            saldo: novoSaldo,
            historico: [{
              id: Date.now() + 2,
              tipo: 'transferencia_entrada',
              valor: amount,
              descricao: `Recebido de outra caixinha`,
              data: new Date().toLocaleDateString('pt-BR'),
              saldoApos: novoSaldo
            }, ...e.historico]
          }
        }
        return e
      })
    })),
  }),
  { name: 'fin_expenses' }
))

export default useStore
