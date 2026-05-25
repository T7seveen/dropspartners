'use client'
import { useState } from 'react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { Plus, Edit2, Pause, Trash2, Eye, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatMoney, getOfferTypeLabel } from '@/lib/utils'

const offers = [
  { id: '1', title: 'Drops — Система', type: 'cpa', payout: 15000, clicks: 1247, conversions: 52, status: 'active', is_top: true, category: 'Маркетинг' },
  { id: '2', title: 'Bybit RevShare', type: 'revshare', payout_percent: 30, clicks: 3412, conversions: 98, status: 'active', is_top: true, category: 'Крипта' },
  { id: '3', title: 'NordVPN', type: 'cps', payout: 1200, clicks: 892, conversions: 31, status: 'active', is_top: false, category: 'SaaS' },
  { id: '4', title: 'Skillbox', type: 'cpl', payout: 500, clicks: 654, conversions: 44, status: 'active', is_top: false, category: 'Обучение' },
  { id: '5', title: 'ТрубМастер — Трубы', type: 'dropship', payout_percent: 8, clicks: 187, conversions: 9, status: 'paused', is_top: false, category: 'Товары' },
]

const statusBadge: Record<string, any> = { active: 'green', paused: 'amber', draft: 'default', archived: 'red' }
const statusLabel: Record<string, string> = { active: 'Активен', paused: 'Пауза', draft: 'Черновик', archived: 'Архив' }

export default function AdminOffersPage() {
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')

  return (
    <DashboardShell title="Управление офферами" role="admin">
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-[#0D1B2E] border border-[#1A2744] rounded-xl px-3 py-2 w-64">
          <Search size={14} className="text-[#8FA8C8]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск..."
            className="bg-transparent text-sm text-[#F0F4FF] placeholder-[#8FA8C8] outline-none flex-1" />
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus size={16} /> Добавить оффер
        </Button>
      </div>

      {/* New offer form */}
      {showForm && (
        <div className="bg-[#0D1B2E] border border-[#2979FF]/30 rounded-2xl p-5 mb-5 animate-fadeIn">
          <h3 className="font-semibold text-[#F0F4FF] mb-4">Новый оффер</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            {[
              { label: 'Название', placeholder: 'Drops — Лендинг', type: 'text' },
              { label: 'Слаг (URL)', placeholder: 'drops-landing', type: 'text' },
              { label: 'Целевой URL', placeholder: 'https://...', type: 'url' },
              { label: 'Рекламодатель', placeholder: 'Drops Agency', type: 'text' },
            ].map(f => (
              <div key={f.label}>
                <label className="text-xs text-[#8FA8C8] mb-1 block">{f.label}</label>
                <input type={f.type} placeholder={f.placeholder}
                  className="w-full bg-[#1A2744] border border-[#2979FF]/20 rounded-xl px-3 py-2 text-sm text-[#F0F4FF] placeholder-[#8FA8C8] outline-none focus:border-[#2979FF]" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <label className="text-xs text-[#8FA8C8] mb-1 block">Тип</label>
              <select className="w-full bg-[#1A2744] border border-[#2979FF]/20 rounded-xl px-3 py-2 text-sm text-[#F0F4FF] outline-none">
                <option value="cpa">CPA</option>
                <option value="cpl">CPL</option>
                <option value="cps">CPS</option>
                <option value="revshare">RevShare</option>
                <option value="dropship">Дропшиппинг</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-[#8FA8C8] mb-1 block">Выплата (₽)</label>
              <input type="number" placeholder="5000" className="w-full bg-[#1A2744] border border-[#2979FF]/20 rounded-xl px-3 py-2 text-sm text-[#F0F4FF] outline-none" />
            </div>
            <div>
              <label className="text-xs text-[#8FA8C8] mb-1 block">Категория</label>
              <select className="w-full bg-[#1A2744] border border-[#2979FF]/20 rounded-xl px-3 py-2 text-sm text-[#F0F4FF] outline-none">
                <option>Маркетинг</option>
                <option>Крипта</option>
                <option>SaaS</option>
                <option>Обучение</option>
                <option>Товары</option>
              </select>
            </div>
          </div>
          <div className="mb-3">
            <label className="text-xs text-[#8FA8C8] mb-1 block">Описание</label>
            <textarea rows={2} placeholder="Краткое описание оффера..."
              className="w-full bg-[#1A2744] border border-[#2979FF]/20 rounded-xl px-3 py-2 text-sm text-[#F0F4FF] placeholder-[#8FA8C8] outline-none resize-none" />
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm">Сохранить оффер</Button>
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Отмена</Button>
          </div>
        </div>
      )}

      {/* Offers table */}
      <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1A2744]">
              {['Оффер', 'Тип', 'Выплата', 'Клики', 'Конверсии', 'Статус', 'Действия'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#8FA8C8] uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A2744]">
            {offers.filter(o => !search || o.title.toLowerCase().includes(search.toLowerCase())).map(o => (
              <tr key={o.id} className="hover:bg-[#1A2744]/20 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium text-sm text-[#F0F4FF]">{o.title}</div>
                  <div className="text-xs text-[#8FA8C8]">{o.category} {o.is_top && <span className="text-[#FFB930]">· ТОП</span>}</div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="blue">{getOfferTypeLabel(o.type)}</Badge>
                </td>
                <td className="px-4 py-3 font-mono text-sm text-[#2979FF] font-semibold">
                  {o.type === 'revshare' || o.type === 'dropship' ? `${(o as any).payout_percent}%` : formatMoney((o as any).payout)}
                </td>
                <td className="px-4 py-3 text-sm text-[#F0F4FF]">{o.clicks.toLocaleString('ru')}</td>
                <td className="px-4 py-3 text-sm text-[#F0F4FF]">{o.conversions}</td>
                <td className="px-4 py-3">
                  <Badge variant={statusBadge[o.status]}>{statusLabel[o.status]}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button className="text-[#8FA8C8] hover:text-[#2979FF] transition-colors"><Edit2 size={14} /></button>
                    <button className="text-[#8FA8C8] hover:text-amber-400 transition-colors"><Pause size={14} /></button>
                    <button className="text-[#8FA8C8] hover:text-[#F0F4FF] transition-colors"><Eye size={14} /></button>
                    <button className="text-[#8FA8C8] hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  )
}
