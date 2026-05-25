'use client'
import { useState } from 'react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts'
import { formatMoney } from '@/lib/utils'

const daily = [
  { date:'19.01', clicks:142, conversions:4, earnings:5200 },
  { date:'20.01', clicks:198, conversions:6, earnings:7800 },
  { date:'21.01', clicks:167, conversions:5, earnings:6500 },
  { date:'22.01', clicks:221, conversions:8, earnings:10400 },
  { date:'23.01', clicks:189, conversions:5, earnings:6500 },
  { date:'24.01', clicks:156, conversions:4, earnings:5200 },
  { date:'25.01', clicks:174, conversions:6, earnings:6000 },
]

const deviceData = [
  { name:'Mobile', value:58, color:'#2979FF' },
  { name:'Desktop', value:34, color:'#00D4FF' },
  { name:'Tablet', value:8, color:'#FFB930' },
]

const geoData = [
  { country:'🇷🇺 Россия', clicks:734, conv:28, pct:58 },
  { country:'🇺🇦 Украина', clicks:198, conv:7, pct:16 },
  { country:'🇰🇿 Казахстан', clicks:142, conv:5, pct:11 },
  { country:'🇧🇾 Беларусь', clicks:98, conv:3, pct:8 },
  { country:'🌍 Другие', clicks:75, conv:2, pct:6 },
]

const sourceData = [
  { name:'Instagram', clicks:412, conv:16 },
  { name:'Telegram', clicks:289, conv:11 },
  { name:'TikTok', clicks:198, conv:7 },
  { name:'YouTube', clicks:143, conv:5 },
  { name:'Прямые', clicks:87, conv:3 },
  { name:'Прочие', clicks:118, conv:4 },
]

const periods = ['7 дней','30 дней','3 месяца','Всего']

export default function StatsPage() {
  const [period, setPeriod] = useState('7 дней')
  const [offer, setOffer] = useState('all')

  return (
    <DashboardShell title="Детальная статистика">
      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="flex bg-[#0D1B2E] border border-[#1A2744] rounded-xl p-1 gap-1">
          {periods.map(p=>(
            <button key={p} onClick={()=>setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${period===p?'bg-[#2979FF] text-white':'text-[#8FA8C8] hover:text-[#F0F4FF]'}`}>
              {p}
            </button>
          ))}
        </div>
        <select value={offer} onChange={e=>setOffer(e.target.value)}
          className="bg-[#0D1B2E] border border-[#1A2744] rounded-xl px-3 py-2 text-sm text-[#F0F4FF] outline-none cursor-pointer">
          <option value="all">Все офферы</option>
          <option value="1">Drops — Система</option>
          <option value="2">Bybit RevShare</option>
          <option value="3">NordVPN</option>
        </select>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
        {[
          { label:'Клики', value:'1 247' },
          { label:'Уники', value:'892' },
          { label:'Конверсии', value:'38' },
          { label:'CR', value:'4.26%' },
          { label:'Заработано', value:'47 600 ₽' },
        ].map(s=>(
          <div key={s.label} className="bg-[#0D1B2E] border border-[#1A2744] rounded-xl p-3 text-center">
            <div className="text-xs text-[#8FA8C8] mb-1">{s.label}</div>
            <div className="text-lg font-bold text-[#F0F4FF]">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Main chart */}
      <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-5 mb-4">
        <h3 className="text-sm font-semibold text-[#F0F4FF] mb-4">Динамика за период</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={daily} margin={{ top:5, right:5, left:-20, bottom:0 }}>
            <defs>
              <linearGradient id="gc" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2979FF" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#2979FF" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="ge" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFB930" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#FFB930" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1A2744" vertical={false}/>
            <XAxis dataKey="date" tick={{ fill:'#8FA8C8', fontSize:11 }} axisLine={false} tickLine={false}/>
            <YAxis yAxisId="left" tick={{ fill:'#8FA8C8', fontSize:11 }} axisLine={false} tickLine={false}/>
            <YAxis yAxisId="right" orientation="right" tick={{ fill:'#8FA8C8', fontSize:11 }} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{ background:'#0D1B2E', border:'1px solid #1A2744', borderRadius:12, color:'#F0F4FF', fontSize:12 }}/>
            <Legend wrapperStyle={{ fontSize:12, color:'#8FA8C8' }}/>
            <Area yAxisId="left" type="monotone" dataKey="clicks" name="Клики" stroke="#2979FF" strokeWidth={2} fill="url(#gc)" dot={false}/>
            <Area yAxisId="right" type="monotone" dataKey="earnings" name="Доход (₽)" stroke="#FFB930" strokeWidth={2} fill="url(#ge)" dot={false}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Three columns */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Devices */}
        <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-[#F0F4FF] mb-4">Устройства</h3>
          <div className="flex justify-center mb-3">
            <PieChart width={160} height={160}>
              <Pie data={deviceData} cx={75} cy={75} innerRadius={45} outerRadius={70} dataKey="value" strokeWidth={0}>
                {deviceData.map((d,i)=><Cell key={i} fill={d.color}/>)}
              </Pie>
            </PieChart>
          </div>
          <div className="space-y-2">
            {deviceData.map(d=>(
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background:d.color }}/>
                  <span className="text-xs text-[#8FA8C8]">{d.name}</span>
                </div>
                <span className="text-xs font-semibold text-[#F0F4FF]">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Geo */}
        <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-[#F0F4FF] mb-4">География</h3>
          <div className="space-y-3">
            {geoData.map(g=>(
              <div key={g.country}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#F0F4FF]">{g.country}</span>
                  <span className="text-xs text-[#8FA8C8]">{g.clicks} кл</span>
                </div>
                <div className="h-1.5 bg-[#1A2744] rounded-full overflow-hidden">
                  <div className="h-full bg-[#2979FF] rounded-full" style={{ width:`${g.pct}%` }}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sources */}
        <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-[#F0F4FF] mb-4">Источники трафика</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={sourceData} layout="vertical" margin={{ top:0, right:20, left:0, bottom:0 }}>
              <XAxis type="number" tick={{ fill:'#8FA8C8', fontSize:10 }} axisLine={false} tickLine={false}/>
              <YAxis dataKey="name" type="category" tick={{ fill:'#8FA8C8', fontSize:10 }} axisLine={false} tickLine={false} width={55}/>
              <Tooltip contentStyle={{ background:'#0D1B2E', border:'1px solid #1A2744', borderRadius:12, color:'#F0F4FF', fontSize:11 }}/>
              <Bar dataKey="clicks" name="Клики" fill="#2979FF" radius={[0,4,4,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardShell>
  )
}
