import useStore from '../store/useStore'

export function useBalance() {
  const { expenses, recurrings, lastApplied, getCurrentIncome } = useStore()

  const currentMonth = new Date().toISOString().slice(0, 7)
  const renda = getCurrentIncome()

  // Total gasto no mês (lançamentos manuais)
  const totalGasto = expenses
    .filter(e => {
      if (!e.data) return false
      const [d, m, y] = e.data.split('/')
      return `${y}-${m}` === currentMonth
    })
    .reduce((sum, e) => sum + e.valor, 0)

  // Total de fixos já lançados no mês
  const totalFixos = recurrings
    .filter(r => r.active && lastApplied[r.id] === currentMonth)
    .reduce((sum, r) => sum + r.valor, 0)

  // Fixos ainda pendentes (comprometido mas não lançado)
  const totalFixosPendentes = recurrings
    .filter(r => r.active && lastApplied[r.id] !== currentMonth)
    .reduce((sum, r) => {
      if (r.frequencia === 'mensal') return sum + r.valor
      if (r.frequencia === 'quinzenal') return sum + r.valor * 2
      if (r.frequencia === 'semanal') return sum + r.valor * 4
      return sum
    }, 0)

  const totalCompromissado = totalGasto + totalFixos + totalFixosPendentes
  const saldoDisponivel = renda - totalGasto - totalFixos
  const saldoReal = renda - totalCompromissado // descontando até os fixos pendentes

  const percentGasto = renda > 0 ? (totalCompromissado / renda) * 100 : 0

  return {
    renda,
    totalGasto,
    totalFixos,
    totalFixosPendentes,
    totalCompromissado,
    saldoDisponivel,
    saldoReal,
    percentGasto
  }
}
