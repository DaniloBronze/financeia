import React from 'react'
import { Card } from './Card'
import { X } from 'lucide-react'
import { fmtBRL } from '../../utils/currency'

export function EnvelopeHistory({ isOpen, onClose, envelope }) {
  if (!isOpen || !envelope) return null

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-end p-0 fade-in">
      <div className="w-full max-w-md h-full bg-[#1a1a1a] shadow-2xl p-6 overflow-y-auto slide-in-right">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span style={{ color: envelope.cor }}>{envelope.icone}</span> 
            {envelope.nome}
          </h2>
          <button onClick={onClose} className="text-[#888888] hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="mb-8">
          <p className="text-sm text-[#888888] mb-1">Saldo atual</p>
          <p className={`text-3xl font-bold ${envelope.saldo < 0 ? 'text-red-400' : 'text-white'}`}>
            {fmtBRL(envelope.saldo)}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-[#888888] uppercase tracking-wider mb-4 border-b border-[#2a2a2a] pb-2">Histórico de Movimentações</h3>
          
          <div className="space-y-4">
            {(!envelope.historico || envelope.historico.length === 0) ? (
              <p className="text-center text-[#888888] py-8">Nenhuma movimentação ainda.</p>
            ) : (
              envelope.historico.map((h) => {
                let colorClass = 'text-white'
                let icon = '•'
                let isOut = false

                if (h.tipo === 'debito') {
                  colorClass = 'text-red-400'
                  icon = '💸'
                  isOut = true
                } else if (h.tipo === 'credito') {
                  colorClass = 'text-emerald-400'
                  icon = '➕'
                } else if (h.tipo === 'transferencia_saida') {
                  colorClass = 'text-red-400'
                  icon = '🔄'
                  isOut = true
                } else if (h.tipo === 'transferencia_entrada') {
                  colorClass = 'text-emerald-400'
                  icon = '🔄'
                }

                return (
                  <div key={h.id} className="flex flex-col gap-1 p-3 rounded-xl bg-[#0f0f0f] border border-[#2a2a2a]">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{icon}</span>
                        <p className="font-medium text-white">{h.descricao}</p>
                      </div>
                      <span className={`font-semibold ${colorClass}`}>
                        {isOut ? '-' : '+'}{fmtBRL(h.valor)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-[#888888] mt-2">
                      <span>{h.data}</span>
                      <span>Saldo: {fmtBRL(h.saldoApos)}</span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
      
      {/* Estilo local para a animação */}
      <style dangerouslySetInnerHTML={{__html: `
        .slide-in-right {
          animation: slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}} />
    </div>
  )
}
