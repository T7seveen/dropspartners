import { DashboardShell } from '@/components/layout/DashboardShell'
import { StatCard } from '@/components/ui/Card'
import { TrendingUp, MousePointerClick, Target, Wallet, Clock, Link2 } from 'lucide-react'
import { formatMoney } from '@/lib/utils'
import { RecentActivity, QuickChart, TopOffers } from './RecentActivity'

// Mock data — replace with real Supabase queries
const stats = {
  clicks: 1247,
  conversions: 38,
  cr: 3.05,
  earnings: 47600,
  pending: 12500,
  balance: 35100,
  clicksTrend: 12,
  convTrend: 8,
  earnTrend: 24,
}

export default function DashboardPage() {
  return (
    <DashboardShell title="Дашборд" balance={stats.balance}>
      {/* Welcome */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#F0F4FF]">Добро пожаловать 👋</h2>
        <p className="text-[#8FA8C8] text-sm mt-1">Обзор вашей активности за последние 7 дней</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="Клики"
          value={stats.clicks.toLocaleString('ru')}
          icon={<MousePointerClick size={16} />}
          trend={stats.clicksTrend}
          sub="за 7 дней"
        />
        <StatCard
          label="Конверсии"
          value={stats.conversions}
          icon={<Target size={16} />}
          trend={stats.convTrend}
          sub={`CR: ${stats.cr}%`}
        />
        <StatCard
          label="Заработано"
          value={formatMoney(stats.earnings)}
          icon={<TrendingUp size={16} />}
          trend={stats.earnTrend}
          sub="за 7 дней"
          accent
        />
        <StatCard
          label="В ожидании"
          value={formatMoney(stats.pending)}
          icon={<Clock size={16} />}
          sub="холд до выплаты"
        />
      </div>

      {/* Chart + Activity */}
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 bg-[#0D1B2E] rounded-2xl border border-[#1A2744] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#F0F4FF] text-sm">Динамика за 7 дней</h3>
            <div className="flex gap-3 text-xs text-[#8FA8C8]">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#2979FF] inline-block" />Клики</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#00D4FF] inline-block" />Конверсии</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#FFB930] inline-block" />Доход</span>
            </div>
          </div>
          <QuickChart />
        </div>

        <div className="bg-[#0D1B2E] rounded-2xl border border-[#1A2744] p-5">
          <h3 className="font-semibold text-[#F0F4FF] text-sm mb-4">Последние события</h3>
          <RecentActivity />
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
              { icon: Wallet, label: 'Запросить выплату', href: '/dashboard/payouts' },
              { icon: TrendingUp, label: 'Статистика', href: '/dashboard/stats' },
              { icon: Target, label: 'Каталог офферов', href: '/dashboard/offers' },
            ].map(({ icon: Icon, label, href }) => (
              <a key={href} href={href} className="flex items-center gap-2.5 p-3 rounded-xl bg-[#1A2744] hover:bg-[#243560] border border-[#2979FF]/10 hover:border-[#2979FF]/30 transition-all group">
                <Icon size={16} className="text-[#2979FF] group-hover:scale-110 transition-transform" />
                <span className="text-xs text-[#C8DCFF] font-medium">{label}</span>
              </a>
            ))}
          </div>

          {/* Balance card */}
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-[#2979FF]/15 to-[#1A2744] border border-[#2979FF]/25">
            <div className="text-xs text-[#8FA8C8] mb-1">Доступный баланс</div>
            <div className="text-2xl font-bold text-[#2979FF]">{formatMoney(stats.balance)}</div>
            <div className="text-xs text-[#8FA8C8] mt-1">Минимум вывода: 2 000 ₽</div>
            <a href="/dashboard/payouts" className="mt-3 inline-flex items-center gap-1.5 bg-[#2979FF] hover:bg-[#1565C0] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors">
              Вывести
            </a>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
