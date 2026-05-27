'use client'
import { useState } from 'react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
  Plus, Eye, Pause, Play, Edit, MousePointerClick,
  Target, TrendingUp, Clock,
} from 'lucide-react'
import { formatMoney } from '@/lib/utils'

type OfferStatus = 'active' | 'paused' | 'draft' | 'archived'

interface AdvOffer {
  id: string
  title: string
  type: string
  payout: string
  status: OfferStatus
  clicks: number
  leads: number
  cr: number
  total_paid: number
  hold_days: number
  created: string
}

const mockOffers: AdvOffer[] = [
  {
    id: '1', title: 'Drops — Пакет «Система»', type: 'CPA', payout: '15 000 ₽/конверсия',
    status: 'active', clicks: 1247, leads: 52, cr: 4.2, total_paid: 780000, hold_days: 14, created: '2024-01-01',
  },
  {
    id: '2', title: 'Drops — Лендинг под ключ', type: 'CPA', payout: '3 000 ₽/конверсия',
    status: 'active', clicks: 423, leads: 18, cr: 4.3, total_paid: 54000, hold_days: 14, created: '2024-01-05',
  },
  {
    id: '3', title: 'Drops — SEO-продвижение', type: 'CPL', payout: '1 000 ₽/лид',
    status: 'draft', clicks: 0, leads: 0, cr: 0, total_paid: 0, hold_days: 21, created: '2024-01-20',
  },
]

const statusBadge: Record<OfferStatus, { variant: any; label: string }> = {
  active:   { variant: 'green',  label: 'Активен' },
  paused:   { variant: 'amber',  label: 'Пауза' },
  draft:    { variant: 'default', label: 'Черновик' },
  archived: { variant: 'red',    label: 'Архив' },
}

export default function AdvertiserOffersPage() {
  const [offers, setOffers] = useState(mockOffers)
  const [showNew, setShowNew] = useState(false)

  const toggle = (id: string) => {
    setOffers(prev => prev.map(o =>
      o.id === id ? { ...o, status: o.status === 'active' ? 'paused' : 'active' } : o
    ))
  }

  return (
    <DashboardShell title="Мои офферы" role="advertiser">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[#8FA8C8] text-xs mt-0.5">Управляйте офферами и отслеживайте результаты</p>
        </div>
        <Button onClick={() => setShowNew(true)} size="sm">
          <Plus size={16}/> Новый оффер
        </Button>
      </div>

      {showNew && (
        <div className="mb-5 bg-[#0D1B2E] border border-[#2979FF]/30 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#F0F4FF] text-sm">Новый оффер</h3>
            <button onClick={() => setShowNew(false)} className="text-[#8FA8C8] hover:text-white text-xs">Отмена</button>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            {['Название оффера', 'Целевой URL'].map(l => (
              <div key={l}>
                <label className="text-xs text-[#8FA8C8] mb-1.5 block">{l}</label>
                <input placeholder={l === 'Название оффера' ? 'Мой продукт' : 'https://...'}
                  className="w-full bg-[#1A2744] border border-[#2979FF]/20 rounded-xl px-3 py-2 text-sm text-[#F0F4FF] placeholder-[#8FA8C8] outline-none focus:border-[#2979FF]"/>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <label className="text-xs text-[#8FA8C8] mb-1.5 block">Тип оффера</label>
              <select className="w-full bg-[#1A2744] border border-[#2979FF]/20 rounded-xl px-3 py-2 text-sm text-[#F0F4FF] outline-none cursor-pointer">
                <option>CPA</option><option>CPL</option><option>RevShare</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-[#8FA8C8] mb-1.5 block">Выплата (₽)</label>
              <input type="number" placeholder="5000"
                className="w-full bg-[#1A2744] border border-[#2979FF]/20 rounded-xl px-3 py-2 text-sm text-[#F0F4FF] placeholder-[#8FA8C8] outline-none focus:border-[#2979FF]"/>
            </div>
            <div>
              <label className="text-xs text-[#8FA8C8] mb-1.5 block">Холд (дней)</label>
              <input type="number" defaultValue={14}
                className="w-full bg-[#1A2744] border border-[#2979FF]/20 rounded-xl px-3 py-2 text-sm text-[#F0F4FF] outline-none focus:border-[#2979FF]"/>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => setShowNew(false)}>Отправить на модерацию</Button>
            <Button size="sm" variant="secondary" onClick={() => setShowNew(false)}>Сохранить черновик</Button>
          </div>
          <p className="text-[10px] text-[#8FA8C8] mt-2">Казино, гемблинг и контент 18+ — запрещены.</p>
        </div>
      )}

      <div className="space-y-3">
        {offers.map(offer => {
          const badge = statusBadge[offer.status]
          return (
            <div key={offer.id} className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-5 hover:border-[#2979FF]/20 transition-all">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-[#F0F4FF] text-sm">{offer.title}</h3>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                    <span className="text-xs bg-[#1A2744] text-[#C8DCFF] px-2 py-0.5 rounded">{offer.type}</span>
                  </div>
                  <div className="text-xs text-[#8FA8C8]">Выплата: <span className="text-[#2979FF] font-semibold">{offer.payout}</span></div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button className="flex items-center gap-1 px-2.5 py-1.5 bg-[#1A2744] hover:bg-[#243560] text-[#8FA8C8] hover:text-white text-xs rounded-lg transition-colors">
                    <Edit size={12}/> Редактировать
                  </button>
                  <button
                    onClick={() => toggle(offer.id)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                      offer.status === 'active'
                        ? 'bg-amber-950/40 text-amber-400 hover:bg-amber-950/60'
                        : 'bg-green-950/40 text-green-400 hover:bg-green-950/60'
                    }`}
                  >
                    {offer.status === 'active' ? <><Pause size={12}/> Пауза</> : <><Play size={12}/> Запустить</>}
                  </button>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { icon: MousePointerClick, label: 'Клики', value: offer.clicks.toLocaleString('ru') },
                  { icon: Target, label: 'Лиды', value: offer.leads },
                  { icon: TrendingUp, label: 'CR', value: `${offer.cr}%` },
                  { icon: Clock, label: 'Холд', value: `${offer.hold_days} дн.` },
                ].map(s => (
                  <div key={s.label} className="bg-[#0A0A0F] rounded-xl p-3 text-center">
                    <s.icon size={12} className="text-[#8FA8C8] mx-auto mb-1"/>
                    <div className="text-[10px] text-[#8FA8C8] mb-0.5">{s.label}</div>
                    <div className="text-sm font-bold text-[#F0F4FF]">{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Webhook hint for active offers */}
              {offer.status === 'active' && (
                <div className="mt-3 p-3 bg-[#1A2744]/50 rounded-xl text-xs text-[#8FA8C8] flex items-center gap-2">
                  <span className="text-amber-400 font-mono">POST</span>
                  <span className="font-mono text-[#C8DCFF] truncate">
                    {typeof window !== 'undefined' ? window.location.origin : 'https://partners.drops.agency'}/api/webhooks/conversion
                  </span>
                  <a href="/advertiser/leads#webhook" className="ml-auto text-[#2979FF] hover:underline shrink-0">Доку­мен­тация</a>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </DashboardShell>
  )
}
