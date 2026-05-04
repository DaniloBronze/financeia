const API_KEY = import.meta.env.VITE_GROQ_API_KEY
const BASE_URL = 'https://api.groq.com/openai/v1/chat/completions'

async function callGroq(prompt) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3
    })
  })
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || "Erro na comunicação com a API");
  }

  const data = await res.json()
  return data.choices[0].message.content
}

export async function parseExpense(text) {
  if (!navigator.onLine) {
    throw new Error('OFFLINE')
  }

  const today = new Date().toLocaleDateString('pt-BR')
  const prompt = `Você é um extrator de dados de gastos financeiros.
Analise o texto e retorne SOMENTE um JSON válido, sem markdown, sem explicação:
{
  "descricao": "descrição curta do gasto",
  "valor": 0.00,
  "categoria": "uma das categorias: Alimentação, Transporte, Moradia, Saúde, Lazer, Educação, Vestuário, Contas/Serviços, Outros",
  "data": "DD/MM/AAAA"
}
Hoje é ${today}.
Texto: "${text}"`

  const raw = await callGroq(prompt)
  const clean = raw.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}

export async function generateInsights(expenses) {
  const total = expenses.reduce((s, e) => s + e.valor, 0)
  const bycat = expenses.reduce((acc, e) => {
    acc[e.categoria] = (acc[e.categoria] || 0) + e.valor
    return acc
  }, {})
  const sumText = Object.entries(bycat)
    .map(([k, v]) => `${k}: R$${v.toFixed(2)}`)
    .join(', ')

  const prompt = `Você é um consultor financeiro pessoal. Analise os gastos e dê 3 insights práticos em português.
Total do mês: R$${total.toFixed(2)}
Por categoria: ${sumText}
Transações: ${expenses.length}

Escreva em texto corrido, sem listas, amigável e direto. Máximo 150 palavras.`

  return await callGroq(prompt)
}

export async function suggestGoalStrategy(goal, expenses) {
  const totalGasto = expenses.reduce((s, e) => s + e.valor, 0)
  const faltam = goal.alvo - (goal.saved || 0)
  const prazo = goal.prazo

  const prompt = `Você é um consultor financeiro. O usuário tem a seguinte meta:
Meta: ${goal.nome}
Valor alvo: R$${goal.alvo}
Já guardou: R$${goal.saved || 0}
Faltam: R$${faltam}
Prazo: ${prazo}
Gasto médio mensal atual: R$${totalGasto.toFixed(2)}

Dê 2 sugestões práticas e objetivas em português de como ele pode atingir essa meta.
Seja direto, máximo 80 palavras.`

  return await callGroq(prompt)
}

export async function suggestEnvelopes(expenses, income) {
  const bycat = expenses.reduce((acc, e) => {
    acc[e.categoria] = (acc[e.categoria] || 0) + e.valor
    return acc
  }, {})
  const sumText = Object.entries(bycat)
    .map(([k, v]) => `${k}: R$${v.toFixed(2)}`)
    .join(', ')

  const prompt = `Você é um consultor financeiro pessoal especialista em método envelope.
O usuário tem renda mensal de R$${income} e histórico de gastos: ${sumText}.

Sugira como distribuir a renda em caixinhas (envelopes) de forma inteligente.
Retorne SOMENTE um JSON válido, sem markdown:
[
  { "nome": "Nome da caixinha", "icone": "emoji", "valor": 000, "justificativa": "frase curta" }
]
Máximo 6 caixinhas. Considere reserva de emergência e lazer.`

  const raw = await callGroq(prompt)
  const clean = raw.replace(/\`\`\`json|\`\`\`/g, '').trim()
  return JSON.parse(clean)
}
