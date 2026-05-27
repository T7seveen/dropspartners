'use client'
import { useState, useEffect } from 'react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { StatCard } from '@/components/ui/Card'
import { TrendingUp, MousePointerClick, Target, Wallet, Clock, Link2, Loader2 } from 'lucide-react'
import { formatMoney } from '@/lib/utils'
import { RecentActivity, QuickChart, TopOffers, type RecentEvent } from './RecentActivity'

interface DashStats {
  clicks: number
  conversions: number
  cr: number
  earnings: number
  pending: number
  balance: number
  clicksTrend: number
  convTrend: number
  earnTrend: number
  chartData: { day: string; clicks: number; conversions: number; earnings: number }[]
  recentEvents: RecentEvent[]
}

const EMPTY_CHART = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(day => ({ day, clicks: 0, conversions: 0, earnings: 0 }))

export default function DashboardPage() {
  const [stats, setStats] = useState<DashStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(r => r.json())
      .then(d => setStats(d))
      .catch(() => setStats(null))
      .finally(() => setLoading(false))
  }, [])

  const s = stats ?? {
    clicks: 0, conversions: 0, cr: 0, earnings: 0, pending: 0, balance: 0,
    clicksTrend: 0, convTrend: 0, earnTrend: 0,
    chartData: EMPTY_CHART, recentEvents: [],
  }

  if (loading) {
    return (
      <DashboardShell title="Дашборд" balance={0}>
        <div className="flex items-center justify-center py-32 text-[#8FA8C8]">
          <Loader2 size={20} className="animate-spin mr-2" /> Загрузка…
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell title="Дашборд" balance={s.balance}>
      {/* Welcome */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#F0F4FF]">Добро пожаловать 👋</h2>
        <p className="text-[#8FA8C8] text-sm mt-1">Обзор вашей активности за последние 7 дней</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Клики" value={s.clicks.toLocaleString('ru')} icon={<MousePointerClick size={16} />} trend={s.clicksTrend} sub="за 7 дней" />
        <StatCard label="Конверсии" value={s.conversions} icon={<Target size={16} />} trend={s.convTrend} sub={`CR: ${s.cr}%`} />
        <StatCard label="Заработано" value={formatMoney(s.earnings)} icon={<TrendingUp size={16} />} trend={s.earnTrend} sub="за 7 дней" accent />
        <StatCard label="В ожидании" value={formatMoney(s.pending)} icon={<Clock size={16} />} sub="холд до выплаты" />
      </div>

      {/* Empty state for new partners */}
      {s.clicks === 0 && s.conversions === 0 && (
        <div className="mb-6 p-5 bg-[#0D1B2E] border border-[#2979FF]/20 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="text-3xl">🚀</div>
            <div>
              <h3 className="font-semibold text-[#F0F4FF] text-sm mb-1">Начните зарабатывать прямо сейчас</h3>
              <p className="text-[#8FA8C8] text-xs mb-3">Выберите оффер, получите реферальную ссылку и начните её продвигать — статистика появится здесь.</p>
              <div className="flex gap-2">
                <a href="/dashboard/offers" className="inline-flex items-center gap-1.5 bg-[#2979FF] hover:bg-[#1565C0] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors">
                  <Link2 size={12} /> Выбрать оффер
                </a>
                <a href="/dashboard/learn" className="inline-flex items-center gap-1.5 bg-[#1A2744] hover:bg-[#243560] text-[#8FA8C8] hover:text-white text-xs px-4 py-2 rounded-xl transition-colors">
                  Обучение
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chart + Activity */}
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 bg-[#0D1B2E] rounded-2xl border border-[#1A2744] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#F0F4FF] text-sm">Динамика за 7 дней</h3>
            <div className="flex gap-3 text-xs text-[#8FA8C8]">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#2979FF] inline-block" />Клики</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#FFB930] inline-block" />Доход</span>
            </div>
          </div>
          <QuickChart data={s.chartData} />
        </div>

        <div className="bg-[#0D1B2E] rounded-2xl border border-[#1A2744] p-5">
          <h3 className="font-semibold text-[#F0F4FF] text-sm mb-4">Последние события</h3>
          <RecentActivity events={s.recentEvents} />
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-[#0D1B2E] rounded-2xl border border-[#1A2744] p-5">
          <h3 className="font-semibold text-[#F0F4FF] text-sm mb-4">Топ офферов</h3>
          <TopOffers />
        </div>

        <div className="bg-[#0D1B2E] rounded-2xl border border-[#1A2744] p-5">
          <h3 className="font-semibold text-[#F0F4FF] text-sm mb-3">Быстрые действия</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: Link2, label: 'Создать ссылку', href: '/dashboard/offers' },
              { icon: Wallet, label: 'Запросить выплату', href: '/dashboard/wallet' },
              { icon: TrendingUp, label: 'Статистика', href: '/dashboard/stats' },
              { icon: Target, label: 'Каталог офферов', href: '/dashboard/offers' },
            ].map(({ icon: Icon, label, href }) => (
              <a key={label} href={href} className="flex items-center gap-2.5 p-3 rounded-xl bg-[#1A2744] hover:bg-[#243560] border border-[#2979FF]/10 hover:border-[#2979FF]/30 transition-all group">
                <Icon size={16} className="text-[#2979FF] group-hover:scale-110 transition-transform" />
                <span className="text-xs text-[#C8DCFF] font-medium">{label}</span>
              </a>
            ))}
          </div>

          {/* Balance card */}
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-[#2979FF]/15 to-[#1A2744] border border-[#2979FF]/25">
            <div className="text-xs text-[#8FA8C8] mb-1">Доступный баланс</div>
            <div className="text-2xl font-bold text-[#2979FF]">{formatMoney(s.balance)}</div>
            <div className="text-xs text-[#8FA8C8] mt-1">Минимум вывода: 1 000 ₽</div>
            <a href="/dashboard/wallet" className="mt-3 inline-flex items-center gap-1.5 bg-[#2979FF] hover:bg-[#1565C0] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors">
              Вывести
            </a>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
