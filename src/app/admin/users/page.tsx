'use client'
import { useState } from 'react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { Search, Eye, Shield, Ban, Download } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { formatMoney, formatDate } from '@/lib/utils'

const users = [
  { id:'1', username:'alex_traffic', email:'alex@mail.ru', role:'partner', balance:35100, total_earned:284000, clicks:3421, conversions:142, status:'active', created:'2024-01-05' },
  { id:'2', username:'maria_media', email:'maria@gmail.com', role:'partner', balance:12400, total_earned:196000, clicks:2891, conversions:98, status:'active', created:'2024-01-08' },
  { id:'3', username:'dropmaster', email:'drop@yandex.ru', role:'partner', balance:8900, total_earned:128000, clicks:1923, conversions:64, status:'active', created:'2024-01-12' },
  { id:'4', username:'spammer99', email:'spam@test.com', role:'partner', balance:0, total_earned:0, clicks:12, conversions:0, status:'suspended', created:'2024-01-20' },
  { id:'5', username:'bizadmin', email:'biz@drops.agency', role:'advertiser', balance:0, total_earned:0, clicks:0, conversions:0, status:'active', created:'2024-01-01' },
]

const roleVariant: Record<string,any> = { partner:'blue', advertiser:'purple', admin:'cyan' }
const statusVariant: Record<string,any> = { active:'green', suspended:'red', pending:'amber' }
const statusLabel: Record<string,string> = { active:'Активен', suspended:'Заблокирован', pending:'Ожидание' }

export default function AdminUsersPage() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  const filtered = users.filter(u => {
    const s = !search || u.username.includes(search) || u.email.includes(search)
    const r = roleFilter === 'all' || u.role === roleFilter
    return s && r
  })

  return (
    <DashboardShell title="Пользователи" role="admin">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
        <div className="flex gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-[#0D1B2E] border border-[#1A2744] rounded-xl px-3 py-2">
            <Search size={14} className="text-[#8FA8C8]"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Поиск по нику, email..."
              className="bg-transparent text-sm text-[#F0F4FF] placeholder-[#8FA8C8] outline-none w-48"/>
          </div>
          <select value={roleFilter} onChange={e=>setRoleFilter(e.target.value)}
            className="bg-[#0D1B2E] border border-[#1A2744] rounded-xl px-3 py-2 text-sm text-[#F0F4FF] outline-none cursor-pointer">
            <option value="all">Все роли</option>
            <option value="partner">Партнёры</option>
            <option value="advertiser">Рекламодатели</option>
            <option value="admin">Админы</option>
          </select>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 bg-[#1A2744] border border-[#2979FF]/20 rounded-xl text-xs text-[#8FA8C8] hover:text-white transition-colors">
          <Download size={14}/> Экспорт CSV
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label:'Всего пользователей', value: users.length },
          { label:'Партнёры', value: users.filter(u=>u.role==='partner').length },
          { label:'Активные', value: users.filter(u=>u.status==='active').length },
          { label:'Заблокированные', value: users.filter(u=>u.status==='suspended').length },
        ].map(s=>(
          <div key={s.label} className="bg-[#0D1B2E] border border-[#1A2744] rounded-xl p-4">
            <div className="text-xs text-[#8FA8C8] mb-1">{s.label}</div>
            <div className="text-xl font-bold text-[#F0F4FF]">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1A2744]">
              {['Пользователь','Роль','Баланс','Заработано','Клики','Конв.','Статус','Действия'].map(h=>(
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#8FA8C8] uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A2744]">
            {filtered.map(u=>(
              <tr key={u.id} className="hover:bg-[#1A2744]/20 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium text-sm text-[#F0F4FF]">@{u.username}</div>
                  <div className="text-xs text-[#8FA8C8]">{u.email}</div>
                  <div className="text-[10px] text-[#8FA8C8]">с {formatDate(u.created)}</div>
                </td>
                <td className="px-4 py-3"><Badge variant={roleVariant[u.role]}>{u.role}</Badge></td>
                <td className="px-4 py-3 text-sm font-semibold text-[#2979FF]">{formatMoney(u.balance)}</td>
                <td className="px-4 py-3 text-sm text-green-400 font-semibold">{formatMoney(u.total_earned)}</td>
                <td className="px-4 py-3 text-sm text-[#F0F4FF]">{u.clicks.toLocaleString('ru')}</td>
                <td className="px-4 py-3 text-sm text-[#F0F4FF]">{u.conversions}</td>
                <td className="px-4 py-3"><Badge variant={statusVariant[u.status]}>{statusLabel[u.status]}</Badge></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button className="text-[#8FA8C8] hover:text-[#2979FF] transition-colors" title="Просмотр"><Eye size={14}/></button>
                    <button className="text-[#8FA8C8] hover:text-amber-400 transition-colors" title="Роль"><Shield size={14}/></button>
                    <button className={`transition-colors ${u.status==='active'?'text-[#8FA8C8] hover:text-red-400':'text-red-400/50 hover:text-green-400'}`} title="Заблокировать">
                      <Ban size={14}/>
                    </button>
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
