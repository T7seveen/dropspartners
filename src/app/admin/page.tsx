'use client'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { StatCard } from '@/components/ui/Card'
import { Users, Package, TrendingUp, Wallet, Clock, CheckCircle, XCircle, Eye } from 'lucide-react'
import { formatMoney, formatDate } from '@/lib/utils'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts'

const stats = {
  partners: 247,
  partnersTrend: 18,
  offers: 23,
  activeOffers: 18,
  totalClicks: 48291,
  clicksTrend: 24,
  totalConversions: 1847,
  totalPaid: 2840000,
  pendingPayouts: 5,
  pendingAmount: 187500,
}

const chartData = [
  { day: 'Пн', clicks: 4821, conversions: 184, revenue: 284000 },
  { day: 'Вт', clicks: 6234, conversions: 241, revenue: 372000 },
  { day: 'Ср', clicks: 5812, conversions: 198, revenue: 310000 },
  { day: 'Чт', clicks: 7103, conversions: 287, revenue: 441000 },
  { day: 'Пт', clicks: 6891, conversions: 264, revenue: 412000 },
  { day: 'Сб', clicks: 5234, conversions: 189, revenue: 298000 },
  { day: 'Вс', clicks: 4921, conversions: 168, revenue: 262000 },
]

const topPartners = [
  { name: 'alex_traffic', clicks: 3421, conv: 142, earned: 284000 },
  { name: 'maria_media', clicks: 2891, conv: 98, earned: 196000 },
  { name: 'pro_affiliate', clicks: 2341, conv: 87, earned: 174000 },
  { name: 'dropmaster', clicks: 1923, conv: 64, earned: 128000 },
  { name: 'traffic_king', clicks: 1712, conv: 58, earned: 116000 },
]

const recentPayouts = [
  { partner: 'alex_traffic', amount: 45000, method: 'USDT', status: 'pending', date: '2024-01-25' },
  { partner: 'maria_media', amount: 28000, method: 'Карта', status: 'pending', date: '2024-01-25' },
  { partner: 'pro_affiliate', amount: 62000, method: 'USDT', status: 'processing', date: '2024-01-24' },
]

export default function AdminPage() {
  return (
    <DashboardShell title="Админ-панель" role="admin">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-[#F0F4FF]">Обзор платформы</h2>
        <p className="text-[#8FA8C8] text-xs mt-0.5">Данные за последние 7 дней</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard label="Партнёры" value={stats.partners} icon={<Users size={16}/>} trend={stats.partnersTrend} sub="всего зарегистрировано" />
        <StatCard label="Клики" value={stats.totalClicks.toLocaleString('ru')} icon={<TrendingUp size={16}/>} trend={stats.clicksTrend} sub="за 7 дней" />
        <StatCard label="Конверсии" value={stats.totalConversions.toLocaleString('ru')} icon={<Package size={16}/>} sub="за 7 дней" />
        <StatCard label="Выплачено" value={formatMoney(stats.totalPaid)} icon={<Wallet size={16}/>} accent sub="за всё время" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-4 mb-5">
        <div className="lg:col-span-2 bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-[#F0F4FF] mb-4">Активность платформы</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData} margin={{ top:5, right:5, left:-20, bottom:0 }}>
              <defs>
                <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2979FF" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2979FF" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gB" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00D4FF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A2744" vertical={false}/>
              <XAxis dataKey="day" tick={{ fill:'#8FA8C8', fontSize:11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:'#8FA8C8', fontSize:11 }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ background:'#0D1B2E', border:'1px solid #1A2744', borderRadius:12, color:'#F0F4FF', fontSize:12 }}/>
              <Area type="monotone" dataKey="clicks" stroke="#2979FF" strokeWidth={2} fill="url(#gA)" dot={false}/>
              <Area type="monotone" dataKey="conversions" stroke="#00D4FF" strokeWidth={2} fill="url(#gB)" dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pending payouts alert */}
        <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[#F0F4FF]">Ожидают выплаты</h3>
            <span className="bg-amber-500/20 text-amber-400 text-xs font-bold px-2 py-0.5 rounded-full">{recentPayouts.length}</span>
          </div>
          <div className="space-y-3">
            {recentPayouts.map((p, i) => (
              <div key={i} className="p-3 bg-[#1A2744] rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#F0F4FF]">@{p.partner}</span>
                  <span className="text-sm font-bold text-[#2979FF]">{formatMoney(p.amount)}</span>
                </div>
                <div className="text-xs text-[#8FA8C8] mb-2">{p.method} · {formatDate(p.date)}</div>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-green-600/20 hover:bg-green-600/30 text-green-400 text-xs rounded-lg transition-colors">
                    <CheckCircle size={12}/> Одобрить
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-xs rounded-lg transition-colors">
                    <XCircle size={12}/> Отклонить
                  </button>
                </div>
              </div>
            ))}
          </div>
          <a href="/admin/payouts" className="mt-3 block text-center text-xs text-[#2979FF] hover:underline">
            Все заявки на выплату →
          </a>
        </div>
      </div>

      {/* Bottom */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Top partners */}
        <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-[#F0F4FF] mb-4">Топ партнёры</h3>
          <div className="space-y-2">
            {topPartners.map((p, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#1A2744] transition-colors">
                <div className="w-6 h-6 rounded-full bg-[#2979FF]/15 flex items-center justify-center text-xs font-bold text-[#2979FF]">{i+1}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-[#F0F4FF] font-medium">@{p.name}</div>
                  <div className="text-xs text-[#8FA8C8]">{p.clicks.toLocaleString('ru')} кл · {p.conv} конв</div>
                </div>
                <div className="text-sm font-bold text-green-400">{formatMoney(p.earned)}</div>
                <a href={`/admin/users?id=${p.name}`} className="text-[#8FA8C8] hover:text-[#F0F4FF]"><Eye size={14}/></a>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by offer */}
        <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-[#F0F4FF] mb-4">Доход по офферам</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={[
              { name: 'Drops Сист.', revenue: 780000 },
              { name: 'Bybit', revenue: 520000 },
              { name: 'NordVPN', revenue: 187000 },
              { name: 'Skillbox', revenue: 88000 },
              { name: 'Трубы', revenue: 41000 },
            ]} margin={{ top:5, right:5, left:-20, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A2744" vertical={false}/>
              <XAxis dataKey="name" tick={{ fill:'#8FA8C8', fontSize:9 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:'#8FA8C8', fontSize:9 }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ background:'#0D1B2E', border:'1px solid #1A2744', borderRadius:12, color:'#F0F4FF', fontSize:11 }}
                formatter={(v: any) => [formatMoney(v), 'Доход']}/>
              <Bar dataKey="revenue" fill="#2979FF" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardShell>
  )
}
