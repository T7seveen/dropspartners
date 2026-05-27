'use client'
import { useState } from 'react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { Badge } from '@/components/ui/Badge'
import { formatMoney, formatDate } from '@/lib/utils'
import { Copy, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'

const mockLeads = [
  { id: '1', click_id: 'a1b2c3d4', offer: 'Drops — Система', partner: 'alex_traffic', amount: 15000, type: 'sale', status: 'approved', created: '2024-01-20T14:30:00Z', hold_until: '2024-02-03T00:00:00Z', external_id: 'ORD-1001' },
  { id: '2', click_id: 'e5f6g7h8', offer: 'Drops — Лендинг', partner: 'maria_media', amount: 3000, type: 'sale', status: 'pending', created: '2024-01-25T10:15:00Z', hold_until: '2024-02-08T00:00:00Z', external_id: 'ORD-1002' },
  { id: '3', click_id: 'i9j0k1l2', offer: 'Drops — Система', partner: 'pro_aff', amount: 15000, type: 'sale', status: 'pending', created: '2024-01-26T09:00:00Z', hold_until: '2024-02-09T00:00:00Z', external_id: null },
  { id: '4', click_id: 'm3n4o5p6', offer: 'Drops — Лендинг', partner: 'ivan_nov', amount: 3000, type: 'sale', status: 'rejected', created: '2024-01-22T16:45:00Z', hold_until: null, external_id: 'ORD-0998' },
  { id: '5', click_id: 'q7r8s9t0', offer: 'Drops — Система', partner: 'alex_traffic', amount: 15000, type: 'sale', status: 'paid', created: '2024-01-10T11:20:00Z', hold_until: null, external_id: 'ORD-0965' },
]

const statusBadge: Record<string, { variant: any; label: string }> = {
  pending:  { variant: 'amber',   label: 'Холд' },
  approved: { variant: 'blue',    label: 'Одобрено' },
  paid:     { variant: 'green',   label: 'Выплачено' },
  rejected: { variant: 'red',     label: 'Отклонено' },
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
      className="ml-1 text-[#8FA8C8] hover:text-[#2979FF] transition-colors">
      {copied ? <CheckCircle size={12} className="text-green-400"/> : <Copy size={12}/>}
    </button>
  )
}

export default function AdvertiserLeadsPage() {
  const [filter, setFilter] = useState('all')
  const [showWebhook, setShowWebhook] = useState(false)

  const filtered = filter === 'all' ? mockLeads : mockLeads.filter(l => l.status === filter)
  const totals = {
    all: mockLeads.length,
    pending: mockLeads.filter(l => l.status === 'pending').length,
    approved: mockLeads.filter(l => l.status === 'approved').length,
    paid: mockLeads.filter(l => l.status === 'paid').length,
    rejected: mockLeads.filter(l => l.status === 'rejected').length,
  }

  const webhookUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/api/webhooks/conversion`
    : 'https://partners.drops.agency/api/webhooks/conversion'

  const webhookExample = `curl -X POST ${webhookUrl} \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{
    "click_id": "uuid-from-dp_click-cookie",
    "offer_id": "your-offer-uuid",
    "type": "sale",
    "order_value": 25000,
    "external_id": "ORD-12345"
  }'`

  return (
    <DashboardShell title="Лиды и конверсии" role="advertiser">
      {/* Summary */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Всего лидов', value: totals.all, color: 'text-[#F0F4FF]' },
          { label: 'В холде', value: totals.pending, color: 'text-amber-400' },
          { label: 'Одобрено', value: totals.approved, color: 'text-[#2979FF]' },
          { label: 'Выплачено', value: totals.paid, color: 'text-green-400' },
        ].map(s => (
          <div key={s.label} className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-4 text-center">
            <div className="text-[#8FA8C8] text-xs mb-1">{s.label}</div>
            <div className={`font-bold text-xl ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {Object.entries(totals).map(([key, count]) => {
          const labels: Record<string, string> = { all: 'Все', pending: 'Холд', approved: 'Одобрено', paid: 'Выплачено', rejected: 'Отклонено' }
          return (
            <button key={key} onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                filter === key
                  ? 'bg-[#2979FF] text-white'
                  : 'bg-[#0D1B2E] border border-[#1A2744] text-[#8FA8C8] hover:border-[#2979FF]/40 hover:text-[#F0F4FF]'
              }`}>
              {labels[key]} ({count})
            </button>
          )
        })}
      </div>

      {/* Table */}
      <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl overflow-hidden mb-5">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1A2744]">
              {['Click ID', 'Оффер', 'Партнёр', 'Сумма', 'Тип', 'Статус', 'Дата'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#8FA8C8] uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A2744]">
            {filtered.map(lead => {
              const badge = statusBadge[lead.status] ?? { variant: 'default', label: lead.status }
              return (
                <tr key={lead.id} className="hover:bg-[#1A2744]/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 font-mono text-xs text-[#C8DCFF]">
                      {lead.click_id.slice(0, 8)}...
                      <CopyBtn text={lead.click_id}/>
                    </div>
                    {lead.external_id && (
                      <div className="text-[10px] text-[#8FA8C8] mt-0.5">{lead.external_id}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#F0F4FF]">{lead.offer}</td>
                  <td className="px-4 py-3 text-xs text-[#8FA8C8]">@{lead.partner}</td>
                  <td className="px-4 py-3 font-bold text-[#2979FF] text-sm">{formatMoney(lead.amount)}</td>
                  <td className="px-4 py-3 text-xs text-[#8FA8C8]">{lead.type}</td>
                  <td className="px-4 py-3"><Badge variant={badge.variant}>{badge.label}</Badge></td>
                  <td className="px-4 py-3 text-xs text-[#8FA8C8]">{formatDate(lead.created)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-10 text-center text-[#8FA8C8] text-sm">Нет данных</div>
        )}
      </div>

      {/* Webhook docs */}
      <div id="webhook" className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowWebhook(!showWebhook)}
          className="w-full flex items-center justify-between p-5 text-left hover:bg-[#1A2744]/20 transition-colors"
        >
          <div>
            <h3 className="font-semibold text-[#F0F4FF] text-sm">Webhook — интеграция конверсий</h3>
            <p className="text-[#8FA8C8] text-xs mt-0.5">Отправляйте конверсии автоматически из вашей CRM/сайта</p>
          </div>
          {showWebhook ? <ChevronUp size={16} className="text-[#8FA8C8]"/> : <ChevronDown size={16} className="text-[#8FA8C8]"/>}
        </button>

        {showWebhook && (
          <div className="px-5 pb-5 border-t border-[#1A2744]">
            <div className="mt-4 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-[#8FA8C8] mb-1">Endpoint</div>
                  <div className="font-mono text-[#C8DCFF] bg-[#0A0A0F] rounded-lg p-2 flex items-center gap-1">
                    <span className="text-green-400">POST</span> /api/webhooks/conversion
                    <CopyBtn text={webhookUrl}/>
                  </div>
                </div>
                <div>
                  <div className="text-[#8FA8C8] mb-1">Аутентификация</div>
                  <div className="font-mono text-[#C8DCFF] bg-[#0A0A0F] rounded-lg p-2">
                    Header: <span className="text-amber-400">x-api-key: YOUR_API_KEY</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs text-[#8FA8C8] mb-2">Пример запроса:</div>
                <div className="relative">
                  <pre className="bg-[#0A0A0F] rounded-xl p-4 text-xs text-[#C8DCFF] overflow-x-auto font-mono leading-relaxed">
                    {webhookExample}
                  </pre>
                  <button
                    onClick={() => navigator.clipboard.writeText(webhookExample)}
                    className="absolute top-2 right-2 p-1.5 bg-[#1A2744] hover:bg-[#243560] rounded-lg text-[#8FA8C8] hover:text-white transition-colors"
                  >
                    <Copy size={12}/>
                  </button>
                </div>
              </div>

              <div className="text-xs text-[#8FA8C8] space-y-1">
                <p>• <span className="text-[#F0F4FF]">click_id</span> — UUID из cookie <code className="bg-[#1A2744] px-1 rounded">dp_click</code> или GET-параметра</p>
                <p>• <span className="text-[#F0F4FF]">offer_id</span> — UUID оффера из нашей панели</p>
                <p>• <span className="text-[#F0F4FF]">order_value</span> — сумма продажи (для RevShare)</p>
                <p>• <span className="text-[#F0F4FF]">external_id</span> — ваш ID заказа (для дедупликации)</p>
                <p>• API-ключ получите у менеджера в Telegram: <a href="https://t.me/drops_support" className="text-[#2979FF] hover:underline" target="_blank">@drops_support</a></p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
