import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses'
import Recurrings from './pages/Recurrings'
import Goals from './pages/Goals'
import Envelopes from './pages/Envelopes'
import Charts from './pages/Charts'
import Insights from './pages/Insights'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="gastos" element={<Expenses />} />
          <Route path="recorrentes" element={<Recurrings />} />
          <Route path="metas" element={<Goals />} />
          <Route path="envelopes" element={<Envelopes />} />
          <Route path="graficos" element={<Charts />} />
          <Route path="insights" element={<Insights />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
