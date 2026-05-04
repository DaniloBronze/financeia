import { useRef } from 'react'
import { BUDGETS } from '../constants/categories'

export function useBudgetAlerts() {
  const alertedCategories = useRef(new Set())

  const requestPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission()
    }
  }

  const sendNotification = (title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico'
      })
    }
  }

  const checkAlerts = (expenses) => {
    const bycat = expenses.reduce((acc, e) => {
      acc[e.categoria] = (acc[e.categoria] || 0) + e.valor
      return acc
    }, {})

    const alerts = []

    Object.entries(bycat).forEach(([cat, total]) => {
      const budget = BUDGETS[cat]
      if (!budget) return
      const pct = (total / budget) * 100

      if (pct >= 100) {
        if (!alertedCategories.current.has(`${cat}-100`)) {
          alerts.push({ cat, pct, type: 'danger', msg: `Limite de ${cat} estourado! Gastou R$${total.toFixed(2)} de R$${budget}` })
          sendNotification(`🚨 Limite estourado — ${cat}`, `Você gastou R$${total.toFixed(2)} de R$${budget} previstos.`)
          alertedCategories.current.add(`${cat}-100`)
        }
      } else if (pct >= 80) {
        if (!alertedCategories.current.has(`${cat}-80`)) {
          alerts.push({ cat, pct, type: 'warning', msg: `${cat} em ${Math.round(pct)}% do limite (R$${total.toFixed(2)} de R$${budget})` })
          sendNotification(`⚠️ Atenção — ${cat}`, `Você já usou ${Math.round(pct)}% do orçamento.`)
          alertedCategories.current.add(`${cat}-80`)
        }
      }
    })

    return alerts
  }

  return { requestPermission, checkAlerts }
}
