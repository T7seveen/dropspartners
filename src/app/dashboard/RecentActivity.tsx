'use client'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

const data = [
  { day: 'Пн', clicks: 142, conversions: 4, earnings: 5200 },
  { day: 'Вт', clicks: 198, conversions: 6, earnings: 7800 },
  { day: 'Ср', clicks: 167, conversions: 5, earnings: 6500 },
  { day: 'Чт', clicks: 221, conversions: 8, earnings: 10400 },
  { day: 'Пт', clicks: 189, conversions: 5, earnings: 6500 },
  { day: 'Сб', clicks: 156, conversions: 4, earnings: 5200 },
  { day: 'Вс', clicks: 174, conversions: 6, earnings: 6000 },
]

export function QuickChart() {
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
        <Area type="monotone" dataKey="clicks" stroke="#2979FF" strokeWidth={2} fill="url(#gClicks)" dot={false} />
        <Area type="monotone" dataKey="earnings" stroke="#FFB930" strokeWidth={2} fill="url(#gEarnings)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

const events = [
  { type: 'conversion', text: 'Конверсия: Drops — Лендинг', amount: '+3 000 ₽', time: '5 мин' },
  { type: 'click', text: 'Клик: NordVPN', amount: '', time: '12 мин' },
  { type: 'conversion', text: 'Конверсия: Bybit RevShare', amount: '+850 ₽', time: '1 ч' },
  { type: 'payout', text: 'Выплата одобрена', amount: '-15 000 ₽', time: '3 ч' },
  { type: 'click', text: 'Клик: Skillbox', amount: '', time: '5 ч' },
]

const typeIcon: Record<string, string> = { conversion: '✅', click: '👆', payout: '💸' }
const typeColor: Record<string, string> = { conversion: 'text-green-400', click: 'text-[#8FA8C8]', payout: 'text-[#2979FF]' }

export function RecentActivity() {
  return (
    <div className="space-y-2.5">
      {events.map((e, i) => (
        <div key={i} className="flex items-start gap-3">
          <span className="text-base mt-0.5">{typeIcon[e.type]}</span>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-[#F0F4FF] truncate">{e.text}</div>
            <div className="text-[10px] text-[#8FA8C8]">{e.time} назад</div>
          </div>
          {e.amount && <span className={`text-xs font-semibold ${typeColor[e.type]}`}>{e.amount}</span>}
        </div>
      ))}
    </div>
  )
}

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
