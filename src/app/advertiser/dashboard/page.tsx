'use client'
import { useState, useEffect } from 'react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { StatCard } from '@/components/ui/Card'
import { Package, MousePointerClick, Target, TrendingUp, RefreshCw } from 'lucide-react'
import { formatMoney } from '@/lib/utils'
import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts'

const MOCK_STATS = {
  activeOffers: 3,
  totalClicks: 4821,
  totalLeads: 187,
  totalPaid: 284000,
  clicksTrend: 12,
  leadsTrend: 8,
}
const MOCK_CHART = [
  { day: 'Пн', clicks: 612, leads: 24 },
  { day: 'Вт', clicks: 742, leads: 31 },
  { day: 'Ср', clicks: 698, leads: 27 },
  { day: 'Чт', clicks: 821, leads: 36 },
  { day: 'Пт', clicks: 734, leads: 29 },
  { day: 'Сб', clicks: 614, leads: 22 },
  { day: 'Вс', clicks: 600, leads: 18 },
]

export default function AdvertiserDashboard() {
  const [stats, setStats] = useState(MOCK_STATS)
  const [chart, setChart] = useState(MOCK_CHART)
  const [loading, setLoading] = useState(false)

  return (
    <DashboardShell title="Кабинет рекламодателя" role="advertiser">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-[#F0F4FF]">Обзор ваших офферов</h2>
        <p className="text-[#8FA8C8] text-xs mt-0.5">Данные за последние 7 дней</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Активных офферов" value={stats.activeOffers} icon={<Package size={16}/>} sub="в каталоге" />
        <StatCard label="Клики" value={stats.totalClicks.toLocaleString('ru')} icon={<MousePointerClick size={16}/>} trend={stats.clicksTrend} sub="за 7 дней" />
        <StatCard label="Лиды" value={stats.totalLeads} icon={<Target size={16}/>} trend={stats.leadsTrend} sub="за 7 дней" />
        <StatCard label="Выплачено партнёрам" value={formatMoney(stats.totalPaid)} icon={<TrendingUp size={16}/>} accent sub="за всё время" />
      </div>

      {/* Chart */}
      <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[#F0F4FF]">Клики и лиды за 7 дней</h3>
          <div className="flex gap-4 text-xs text-[#8FA8C8]">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#2979FF] inline-block"/>Клики</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#00D4FF] inline-block"/>Лиды</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={chart} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gClicks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2979FF" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#2979FF" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="gLeads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00D4FF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1A2744" vertical={false}/>
            <XAxis dataKey="day" tick={{ fill: '#8FA8C8', fontSize: 11 }} axisLine={false} tickLine={false}/>
            <YAxis tick={{ fill: '#8FA8C8', fontSize: 11 }} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{ background: '#0D1B2E', border: '1px solid #1A2744', borderRadius: 12, color: '#F0F4FF', fontSize: 12 }}/>
            <Area type="monotone" dataKey="clicks" stroke="#2979FF" strokeWidth={2} fill="url(#gClicks)" dot={false}/>
            <Area type="monotone" dataKey="leads" stroke="#00D4FF" strokeWidth={2} fill="url(#gLeads)" dot={false}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { label: 'Мои офферы', desc: 'Управляйте активными офферами', href: '/advertiser/offers', color: 'bg-[#2979FF]/10 border-[#2979FF]/20' },
          { label: 'Просмотр лидов', desc: 'Конверсии и статусы в реальном времени', href: '/advertiser/leads', color: 'bg-[#00D4FF]/10 border-[#00D4FF]/20' },
          { label: 'Webhook-документация', desc: 'Интегрируйте отправку конверсий', href: '/advertiser/leads#webhook', color: 'bg-[#FFB930]/10 border-[#FFB930]/20' },
        ].map(c => (
          <a key={c.href} href={c.href} className={`block p-4 rounded-2xl border ${c.color} hover:brightness-125 transition-all`}>
            <div className="font-semibold text-[#F0F4FF] text-sm mb-1">{c.label}</div>
            <div className="text-xs text-[#8FA8C8]">{c.desc}</div>
          </a>
        ))}
      </div>
    </DashboardShell>
  )
}
