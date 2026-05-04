import React, { useState } from 'react'
import { Lightbulb, Calendar } from 'lucide-react'
import useStore from '../../store/useStore'
import { generateInsights } from '../../services/ai'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'

export default function Insights() {
  const { expenses } = useStore()
  const [insight, setInsight] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastGenerated, setLastGenerated] = useState(null)

  const handleGenerate = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await generateInsights(expenses)
      setInsight(result)
      setLastGenerated(new Date().toLocaleString('pt-BR'))
    } catch (err) {
      setError(err.message || 'Erro ao gerar análise.')
    } finally {
      setLoading(false)
    }
  }

  const hasEnoughExpenses = expenses.length >= 3

  return (
    <div className="max-w-3xl mx-auto space-y-6 fade-in">
      <h1 className="text-2xl font-semibold mb-6">Consultor Financeiro IA</h1>

      <Card className="text-center py-10 px-4">
        <div className="w-16 h-16 bg-indigo-600/10 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lightbulb className="w-8 h-8" />
        </div>
        
        <h2 className="text-xl font-medium mb-2">Análise Inteligente</h2>
        <p className="text-[#888888] mb-8 max-w-lg mx-auto">
          A Inteligência Artificial vai analisar seus padrões de gastos atuais e fornecer insights práticos e diretos para ajudar você a economizar.
        </p>

        <Button 
          onClick={handleGenerate} 
          disabled={!hasEnoughExpenses || loading}
          className="mx-auto"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analisando...
            </>
          ) : (
            'Gerar análise completa'
          )}
        </Button>

        {!hasEnoughExpenses && (
          <p className="text-sm text-yellow-500 mt-4">
            Registre pelo menos 3 gastos para gerar insights personalizados.
          </p>
        )}
        {error && (
          <p className="text-sm text-red-400 mt-4">{error}</p>
        )}
      </Card>

      {insight && (
        <Card className="border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.05)] fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              💡 Seus Insights
            </h3>
            {lastGenerated && (
              <span className="text-xs text-[#888888] flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {lastGenerated}
              </span>
            )}
          </div>
          <p className="text-[#f5f5f5] leading-relaxed whitespace-pre-wrap">
            {insight}
          </p>
        </Card>
      )}
    </div>
  )
}
