'use client'
import { useState } from 'react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { Copy, ExternalLink, CheckCircle, QrCode, BarChart3, Trash2 } from 'lucide-react'
import { formatMoney, formatDate } from '@/lib/utils'

const mockLinks = [
  { id: '1', offer: 'Drops — Система', type: 'CPA', payout: '15 000 ₽', code: 'dp_a1b2c3', url: 'https://partners.drops.agency/ref/dp_a1b2c3', clicks: 312, conversions: 13, earnings: 195000, cr: 4.2, created: '2024-01-10' },
  { id: '2', offer: 'Bybit RevShare', type: 'RevShare', payout: '30%', code: 'dp_x4y5z6', url: 'https://partners.drops.agency/ref/dp_x4y5z6', clicks: 248, conversions: 7, earnings: 58400, cr: 2.8, created: '2024-01-08' },
  { id: '3', offer: 'NordVPN', type: 'CPS', payout: '1 200 ₽', code: 'dp_m7n8o9', url: 'https://partners.drops.agency/ref/dp_m7n8o9', clicks: 187, conversions: 6, earnings: 7200, cr: 3.2, created: '2024-01-15' },
  { id: '4', offer: 'Skillbox', type: 'CPL', payout: '500 ₽', code: 'dp_q0r1s2', url: 'https://partners.drops.agency/ref/dp_q0r1s2', clicks: 143, conversions: 10, earnings: 5000, cr: 7.0, created: '2024-01-20' },
]

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={copy} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1A2744] hover:bg-[#243560] text-xs text-[#8FA8C8] hover:text-white transition-all">
      {copied ? <CheckCircle size={12} className="text-green-400" /> : <Copy size={12} />}
      {copied ? 'Скопировано!' : 'Копировать'}
    </button>
  )
}

export default function ReferralsPage() {
  const totalEarnings = mockLinks.reduce((s, l) => s + l.earnings, 0)
  const totalClicks = mockLinks.reduce((s, l) => s + l.clicks, 0)
  const totalConv = mockLinks.reduce((s, l) => s + l.conversions, 0)

  return (
    <DashboardShell title="Мои реферальные ссылки">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Всего кликов', value: totalClicks.toLocaleString('ru') },
          { label: 'Конверсий', value: totalConv },
          { label: 'Заработано', value: formatMoney(totalEarnings) },
        ].map(s => (
          <div key={s.label} className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-4 text-center">
            <div className="text-[#8FA8C8] text-xs mb-1">{s.label}</div>
            <div className="text-[#F0F4FF] font-bold text-xl">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Links table */}
      <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-[#1A2744] flex items-center justify-between">
          <h3 className="font-semibold text-[#F0F4FF] text-sm">Активные ссылки ({mockLinks.length})</h3>
          <a href="/dashboard/offers" className="text-xs text-[#2979FF] hover:underline">+ Добавить оффер</a>
        </div>

        <div className="divide-y divide-[#1A2744]">
          {mockLinks.map(link => (
            <div key={link.id} className="p-4 hover:bg-[#1A2744]/30 transition-colors">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="font-medium text-[#F0F4FF] text-sm">{link.offer}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-[#1A2744] text-[#C8DCFF] px-2 py-0.5 rounded">{link.type}</span>
                    <span className="text-xs text-[#8FA8C8]">Выплата: <span className="text-[#2979FF] font-semibold">{link.payout}</span></span>
                    <span className="text-xs text-[#8FA8C8]">от {formatDate(link.created)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-bold text-sm">{formatMoney(link.earnings)}</div>
                  <div className="text-[#8FA8C8] text-xs">заработано</div>
                </div>
              </div>

              {/* URL */}
              <div className="flex items-center gap-2 mb-3 bg-[#1A2744]/50 rounded-xl p-2.5">
                <code className="text-xs text-[#C8DCFF] flex-1 truncate font-mono">{link.url}</code>
                <CopyButton text={link.url} />
              </div>

              {/* Stats mini */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'Клики', value: link.clicks.toLocaleString('ru') },
                  { label: 'Конверсии', value: link.conversions },
                  { label: 'CR', value: `${link.cr}%` },
                  { label: 'Код', value: link.code },
                ].map(s => (
                  <div key={s.label} className="bg-[#0A0A0F] rounded-lg p-2 text-center">
                    <div className="text-[10px] text-[#8FA8C8] mb-0.5">{s.label}</div>
                    <div className="text-xs font-semibold text-[#F0F4FF] font-mono">{s.value}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 mt-3">
                <a href={`/dashboard/stats?link=${link.id}`} className="flex items-center gap-1.5 text-xs text-[#8FA8C8] hover:text-[#F0F4FF] transition-colors">
                  <BarChart3 size={12} /> Статистика
                </a>
                <a href={link.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-[#8FA8C8] hover:text-[#F0F4FF] transition-colors">
                  <ExternalLink size={12} /> Открыть
                </a>
                <button className="flex items-center gap-1.5 text-xs text-red-400/60 hover:text-red-400 transition-colors ml-auto">
                  <Trash2 size={12} /> Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  )
}
