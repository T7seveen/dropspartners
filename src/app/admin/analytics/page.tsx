'use client'
import { useState } from 'react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { formatMoney } from '@/lib/utils'

const daily = [
  { date:'19.01', clicks:4821, conversions:184, revenue:284000, partners:3 },
  { date:'20.01', clicks:6234, conversions:241, revenue:372000, partners:5 },
  { date:'21.01', clicks:5812, conversions:198, revenue:310000, partners:4 },
  { date:'22.01', clicks:7103, conversions:287, revenue:441000, partners:8 },
  { date:'23.01', clicks:6891, conversions:264, revenue:412000, partners:6 },
  { date:'24.01', clicks:5234, conversions:189, revenue:298000, partners:4 },
  { date:'25.01', clicks:4921, conversions:168, revenue:262000, partners:3 },
]

const offerRevenue = [
  { name:'Drops Система', rev:780000, conv:52 },
  { name:'Bybit', rev:520000, conv:98 },
  { name:'NordVPN', rev:187000, conv:31 },
  { name:'Skillbox', rev:88000, conv:44 },
  { name:'Трубы', rev:41000, conv:9 },
]

const geoData = [
  { name:'Россия', value:58, color:'#2979FF' },
  { name:'Украина', value:16, color:'#00D4FF' },
  { name:'Казахстан', value:11, color:'#FFB930' },
  { name:'Беларусь', value:8, color:'#10B981' },
  { name:'Другие', value:7, color:'#4A5568' },
]

const deviceData = [
  { name:'Mobile', value:58, color:'#2979FF' },
  { name:'Desktop', value:34, color:'#00D4FF' },
  { name:'Tablet', value:8, color:'#FFB930' },
]

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState('7 дней')
  const periods = ['7 дней', '30 дней', '3 месяца', 'Всё время']

  const totalRev = daily.reduce((s, d) => s + d.revenue, 0)
  const totalClicks = daily.reduce((s, d) => s + d.clicks, 0)
  const totalConv = daily.reduce((s, d) => s + d.conversions, 0)
  const avgCR = ((totalConv / totalClicks) * 100).toFixed(2)

  return (
    <DashboardShell title="Аналитика платформы" role="admin">
      {/* Period selector */}
      <div className="flex gap-2 mb-5">
        {periods.map(p => (
          <button key={p} onClick={() => setPeriod(p)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              period === p ? 'bg-[#2979FF] text-white' : 'bg-[#0D1B2E] border border-[#1A2744] text-[#8FA8C8] hover:border-[#2979FF]/40'
            }`}>{p}</button>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label:'Всего кликов', value:totalClicks.toLocaleString('ru'), color:'text-[#F0F4FF]' },
          { label:'Конверсий', value:totalConv.toLocaleString('ru'), color:'text-[#00D4FF]' },
          { label:'CR платформы', value:`${avgCR}%`, color:'text-green-400' },
          { label:'Общий доход', value:formatMoney(totalRev), color:'text-[#2979FF]' },
        ].map(s => (
          <div key={s.label} className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-4 text-center">
            <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-[#8FA8C8] mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Main chart */}
      <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-5 mb-4">
        <h3 className="text-sm font-semibold text-[#F0F4FF] mb-4">Трафик и доход</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={daily} margin={{ top:5, right:5, left:-15, bottom:0 }}>
            <defs>
              <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2979FF" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#2979FF" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="gB" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFB930" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#FFB930" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1A2744" vertical={false}/>
            <XAxis dataKey="date" tick={{ fill:'#8FA8C8', fontSize:11 }} axisLine={false} tickLine={false}/>
            <YAxis yAxisId="left" tick={{ fill:'#8FA8C8', fontSize:10 }} axisLine={false} tickLine={false}/>
            <YAxis yAxisId="right" orientation="right" tick={{ fill:'#8FA8C8', fontSize:10 }} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{ background:'#0D1B2E', border:'1px solid #1A2744', borderRadius:12, color:'#F0F4FF', fontSize:12 }}/>
            <Area yAxisId="left" type="monotone" dataKey="clicks" name="Клики" stroke="#2979FF" strokeWidth={2} fill="url(#gA)" dot={false}/>
            <Area yAxisId="right" type="monotone" dataKey="revenue" name="Доход (₽)" stroke="#FFB930" strokeWidth={2} fill="url(#gB)" dot={false}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom 3 */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* By offer */}
        <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-[#F0F4FF] mb-4">Доход по офферам</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={offerRevenue} layout="vertical" margin={{ top:0, right:15, left:0, bottom:0 }}>
              <XAxis type="number" tick={{ fill:'#8FA8C8', fontSize:9 }} axisLine={false} tickLine={false}/>
              <YAxis dataKey="name" type="category" tick={{ fill:'#8FA8C8', fontSize:9 }} axisLine={false} tickLine={false} width={60}/>
              <Tooltip contentStyle={{ background:'#0D1B2E', border:'1px solid #1A2744', borderRadius:12, color:'#F0F4FF', fontSize:11 }}
                formatter={(v:any) => [formatMoney(v), 'Доход']}/>
              <Bar dataKey="rev" fill="#2979FF" radius={[0,3,3,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Geo */}
        <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-[#F0F4FF] mb-4">Geography</h3>
          <div className="flex justify-center mb-3">
            <PieChart width={140} height={140}>
              <Pie data={geoData} cx={65} cy={65} innerRadius={40} outerRadius={60} dataKey="value" strokeWidth={0}>
                {geoData.map((d,i) => <Cell key={i} fill={d.color}/>)}
              </Pie>
            </PieChart>
          </div>
          <div className="space-y-1.5">
            {geoData.map(d => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background:d.color }}/>
                <span className="text-xs text-[#8FA8C8] flex-1">{d.name}</span>
                <span className="text-xs font-semibold text-[#F0F4FF]">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Devices */}
        <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-[#F0F4FF] mb-4">Новые партнёры</h3>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={daily} margin={{ top:5, right:5, left:-25, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A2744" vertical={false}/>
              <XAxis dataKey="date" tick={{ fill:'#8FA8C8', fontSize:9 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:'#8FA8C8', fontSize:9 }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ background:'#0D1B2E', border:'1px solid #1A2744', borderRadius:12, color:'#F0F4FF', fontSize:11 }}/>
              <Line type="monotone" dataKey="partners" name="Партнёры" stroke="#00D4FF" strokeWidth={2} dot={{ fill:'#00D4FF', r:3 }}/>
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {deviceData.map(d => (
              <div key={d.name} className="text-center">
                <div className="text-xs font-semibold text-[#F0F4FF]">{d.value}%</div>
                <div className="text-[10px] text-[#8FA8C8]">{d.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
