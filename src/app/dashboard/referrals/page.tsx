'use client'
import { useState, useEffect } from 'react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { Copy, ExternalLink, CheckCircle, BarChart3, Loader2, Link2 } from 'lucide-react'
import { formatMoney, formatDate } from '@/lib/utils'

interface ReferralLink {
  id: string
  offer: string
  type: string
  payout: string
  code: string
  url: string
  clicks: number
  conversions: number
  earnings: number
  cr: number
  created: string
}

// const MOCK_LINKS: ReferralLink[] = [
//   { id: '1', offer: 'Drops — Система', type: 'CPA', payout: '15 000 ₽', code: 'dp_a1b2c3', url: 'https://partners.drops.agency/ref/dp_a1b2c3', clicks: 312, conversions: 13, earnings: 195000, cr: 4.2, created: '2024-01-10' },
//   { id: '2', offer: 'Bybit RevShare', type: 'RevShare', payout: '30%', code: 'dp_x4y5z6', url: 'https://partners.drops.agency/ref/dp_x4y5z6', clicks: 248, conversions: 7, earnings: 58400, cr: 2.8, created: '2024-01-08' },
//   { id: '3', offer: 'NordVPN', type: 'CPS', payout: '1 200 ₽', code: 'dp_m7n8o9', url: 'https://partners.drops.agency/ref/dp_m7n8o9', clicks: 187, conversions: 6, earnings: 7200, cr: 3.2, created: '2024-01-15' },
// ]

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
  const [links, setLinks] = useState<ReferralLink[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/referrals')
      .then(r => r.json())
      .then(d => {
        if (d.links && d.links.length > 0) {
          // Map API response to display shape
          const origin = typeof window !== 'undefined' ? window.location.origin : 'https://partners.drops.agency'
          setLinks(d.links.map((l: any) => ({
            id: l.id,
            offer: l.offers?.title ?? 'Оффер',
            type: l.offers?.type ?? 'CPA',
            payout: l.offers?.payout_amount
              ? `${l.offers.payout_amount.toLocaleString('ru')} ₽`
              : '—',
            code: l.code,
            url: `${origin}/ref/${l.code}`,
            clicks: l.clicks ?? 0,
            conversions: l.conversions ?? 0,
            earnings: l.earnings ?? 0,
            cr: (l.clicks ?? 0) > 0
              ? Math.round(((l.conversions ?? 0) / l.clicks) * 1000) / 10
              : 0,
            created: l.created_at,
          })))
        } else {
          setLinks([])
        }
      })
      .catch(() => setLinks([]))
      .finally(() => setLoading(false))
  }, [])

  const totalEarnings = links.reduce((s, l) => s + l.earnings, 0)
  const totalClicks = links.reduce((s, l) => s + l.clicks, 0)
  const totalConv = links.reduce((s, l) => s + l.conversions, 0)

  if (loading) {
    return (
      <DashboardShell title="Мои реферальные ссылки">
        <div className="flex items-center justify-center py-32 text-[#8FA8C8]">
          <Loader2 size={20} className="animate-spin mr-2" /> Загрузка…
        </div>
      </DashboardShell>
    )
  }

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

      {/* Links */}
      <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-[#1A2744] flex items-center justify-between">
          <h3 className="font-semibold text-[#F0F4FF] text-sm">Активные ссылки ({links.length})</h3>
          <a href="/dashboard/offers" className="text-xs text-[#2979FF] hover:underline">+ Добавить оффер</a>
        </div>

        {links.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-4xl mb-3">🔗</div>
            <div className="text-sm font-medium text-[#F0F4FF] mb-1">У вас пока нет реферальных ссылок</div>
            <div className="text-xs text-[#8FA8C8] mb-4">Выберите оффер и получите ссылку для продвижения</div>
            <a href="/dashboard/offers"
              className="inline-flex items-center gap-1.5 bg-[#2979FF] hover:bg-[#1565C0] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors">
              <Link2 size={12} /> Перейти к офферам
            </a>
          </div>
        ) : (
          <div className="divide-y divide-[#1A2744]">
            {links.map(link => (
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
