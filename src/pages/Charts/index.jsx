import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import useStore from '../../store/useStore'
import { CATEGORIES, BUDGETS } from '../../constants/categories'
import { fmtBRL } from '../../utils/currency'
import { Card } from '../../components/ui/Card'
import { ProgressBar } from '../../components/ui/ProgressBar'

export default function Charts() {
  const { getByCategory } = useStore()
  const bycat = getByCategory()

  const data = Object.entries(bycat).map(([cat, val]) => ({
    name: cat,
    value: val,
    color: CATEGORIES[cat] ? CATEGORIES[cat].color : CATEGORIES['Outros'].color
  }))

  const renderCustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-3 rounded-lg shadow-lg z-50">
          <p className="font-medium text-white">{payload[0].name}</p>
          <p className="text-[#888888]">{fmtBRL(payload[0].value)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 fade-in">
      <h1 className="text-2xl font-semibold mb-6">Gráficos e Orçamentos</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-96 flex flex-col">
          <h2 className="text-lg font-medium mb-4">Gastos por Categoria</h2>
          {data.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-[#888888]">
              Nenhum dado disponível.
            </div>
          ) : (
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={renderCustomTooltip} />
                  <Legend 
                    formatter={(value) => (
                      <span className="text-[#f5f5f5]">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-lg font-medium mb-4">Orçamentos</h2>
          {Object.keys(bycat).length === 0 ? (
            <div className="text-center text-[#888888] py-8">
              Registre gastos para visualizar o orçamento.
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(bycat).map(([cat, val]) => {
                const limit = BUDGETS[cat] || BUDGETS['Outros']
                return (
                  <ProgressBar 
                    key={cat}
                    label={cat}
                    value={val}
                    max={limit}
                    valueLabel={`${fmtBRL(val)} / ${fmtBRL(limit)}`}
                  />
                )
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
