'use client'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { formatMoney } from '@/lib/utils'

// ── Chart ─────────────────────────────────────────────────────────────────

interface ChartPoint {
  day: string
  clicks: number
  conversions: number
  earnings: number
}

interface QuickChartProps {
  data: ChartPoint[]
}

export function QuickChart({ data }: QuickChartProps) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="gClicks" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2979FF" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#2979FF" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gEarnings" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FFB930" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#FFB930" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1A2744" vertical={false} />
        <XAxis dataKey="day" tick={{ fill: '#8FA8C8', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#8FA8C8', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: '#0D1B2E', border: '1px solid #1A2744', borderRadius: 12, color: '#F0F4FF', fontSize: 12 }}
          cursor={{ stroke: '#2979FF', strokeWidth: 1, strokeDasharray: '4 4' }}
        />
        <Area type="monotone" dataKey="clicks" stroke="#2979FF" strokeWidth={2} fill="url(#gClicks)" dot={false} name="Клики" />
        <Area type="monotone" dataKey="earnings" stroke="#FFB930" strokeWidth={2} fill="url(#gEarnings)" dot={false} name="Доход" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// ── Recent activity ────────────────────────────────────────────────────────

export interface RecentEvent {
  id: string
  type: string
  amount: number
  status: string
  offer: string
  created_at: string
}

interface RecentActivityProps {
  events: RecentEvent[]
}

const statusIcon: Record<string, string> = { pending: '⏳', approved: '✅', paid: '💸', rejected: '❌' }
const statusColor: Record<string, string> = {
  pending: 'text-amber-400',
  approved: 'text-green-400',
  paid: 'text-[#2979FF]',
  rejected: 'text-red-400',
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'только что'
  if (mins < 60) return `${mins} мин`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} ч`
  return `${Math.floor(hrs / 24)} дн`
}

export function RecentActivity({ events }: RecentActivityProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-3xl mb-2">🚀</div>
        <div className="text-xs text-[#8FA8C8]">Пока нет событий.</div>
        <div className="text-xs text-[#4A6080] mt-1">Поделитесь реферальной ссылкой!</div>
      </div>
    )
  }

  return (
    <div className="space-y-2.5">
      {events.map(e => (
        <div key={e.id} className="flex items-start gap-3">
          <span className="text-base mt-0.5">{statusIcon[e.status] ?? '📌'}</span>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-[#F0F4FF] truncate">{e.offer}</div>
            <div className="text-[10px] text-[#8FA8C8]">{timeAgo(e.created_at)} назад</div>
          </div>
          {e.amount > 0 && (
            <span className={`text-xs font-semibold ${statusColor[e.status] ?? 'text-[#8FA8C8]'}`}>
              +{formatMoney(e.amount)}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

// ── Top offers (static placeholder) ───────────────────────────────────────

const topOffers = [
  { name: 'Drops — Система', type: 'CPA', clicks: 312, cr: '4.2%', earned: '63 000 ₽' },
  { name: 'Bybit RevShare', type: 'RevShare', clicks: 248, cr: '3.1%', earned: '28 400 ₽' },
  { name: 'NordVPN', type: 'CPS', clicks: 187, cr: '2.8%', earned: '16 800 ₽' },
  { name: 'Skillbox', type: 'CPL', clicks: 143, cr: '5.6%', earned: '8 000 ₽' },
]

export function TopOffers() {
  return (
    <div className="space-y-2">
      {topOffers.map((o, i) => (
        <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#1A2744] transition-colors">
          <div className="w-6 h-6 rounded-full bg-[#2979FF]/15 flex items-center justify-center text-[10px] font-bold text-[#2979FF]">
            {i + 1}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-[#F0F4FF] truncate">{o.name}</div>
            <div className="text-[10px] text-[#8FA8C8]">{o.type} · {o.clicks} кл · CR {o.cr}</div>
          </div>
          <div className="text-xs font-semibold text-green-400">{o.earned}</div>
        </div>
      ))}
    </div>
  )
}
