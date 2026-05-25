'use client'
import { useState } from 'react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react'
import { formatMoney, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'

const payouts = [
  { id:'1', partner:'alex_traffic', email:'alex@mail.ru', amount:45000, method:'USDT TRC20', status:'pending', date:'2024-01-25' },
  { id:'2', partner:'maria_media', email:'maria@gmail.com', amount:28000, method:'Карта •••• 4242', status:'pending', date:'2024-01-25' },
  { id:'3', partner:'pro_affiliate', email:'pro@mail.ru', amount:62000, method:'USDT TRC20', status:'processing', date:'2024-01-24' },
  { id:'4', partner:'dropmaster', email:'drop@yandex.ru', amount:15000, method:'Банк. перевод', status:'paid', date:'2024-01-20', paid_at:'2024-01-21' },
  { id:'5', partner:'traffic_king', email:'king@gmail.com', amount:38000, method:'Bitcoin', status:'paid', date:'2024-01-18', paid_at:'2024-01-19' },
]

const statusVariant: Record<string,any> = { pending:'amber', processing:'blue', paid:'green', rejected:'red' }
const statusLabel: Record<string,string> = { pending:'Ожидание', processing:'В обработке', paid:'Выплачено', rejected:'Отклонено' }

export default function AdminPayoutsPage() {
  const [items, setItems] = useState(payouts)
  const [filter, setFilter] = useState('all')

  const total = {
    pending: items.filter(p=>p.status==='pending').reduce((s,p)=>s+p.amount,0),
    paid: items.filter(p=>p.status==='paid').reduce((s,p)=>s+p.amount,0),
  }

  const approve = (id: string) => setItems(prev => prev.map(p => p.id===id ? {...p, status:'processing'} : p))
  const reject = (id: string) => setItems(prev => prev.map(p => p.id===id ? {...p, status:'rejected'} : p))

  const filtered = filter==='all' ? items : items.filter(p=>p.status===filter)

  return (
    <DashboardShell title="Управление выплатами" role="admin">
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-[#0D1B2E] border border-amber-500/20 rounded-2xl p-4">
          <div className="text-xs text-[#8FA8C8] mb-1">Ожидают выплаты</div>
          <div className="text-xl font-bold text-amber-400">{formatMoney(total.pending)}</div>
          <div className="text-xs text-[#8FA8C8] mt-1">{items.filter(p=>p.status==='pending').length} заявок</div>
        </div>
        <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-4">
          <div className="text-xs text-[#8FA8C8] mb-1">Выплачено всего</div>
          <div className="text-xl font-bold text-green-400">{formatMoney(total.paid)}</div>
          <div className="text-xs text-[#8FA8C8] mt-1">{items.filter(p=>p.status==='paid').length} выплат</div>
        </div>
        <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-4">
          <div className="text-xs text-[#8FA8C8] mb-1">В обработке</div>
          <div className="text-xl font-bold text-[#2979FF]">{formatMoney(items.filter(p=>p.status==='processing').reduce((s,p)=>s+p.amount,0))}</div>
          <div className="text-xs text-[#8FA8C8] mt-1">{items.filter(p=>p.status==='processing').length} заявок</div>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {['all','pending','processing','paid','rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${filter===f ? 'bg-[#2979FF] text-white' : 'bg-[#0D1B2E] border border-[#1A2744] text-[#8FA8C8] hover:border-[#2979FF]/40 hover:text-[#F0F4FF]'}`}>
            {f==='all'?'Все':statusLabel[f]}
          </button>
        ))}
      </div>

      <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1A2744]">
              {['Партнёр','Сумма','Метод','Дата','Статус','Действия'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#8FA8C8] uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A2744]">
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-[#1A2744]/20 transition-colors">
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-[#F0F4FF]">@{p.partner}</div>
                  <div className="text-xs text-[#8FA8C8]">{p.email}</div>
                </td>
                <td className="px-4 py-3 font-bold text-[#2979FF] text-sm">{formatMoney(p.amount)}</td>
                <td className="px-4 py-3 text-sm text-[#F0F4FF]">{p.method}</td>
                <td className="px-4 py-3 text-xs text-[#8FA8C8]">{formatDate(p.date)}</td>
                <td className="px-4 py-3"><Badge variant={statusVariant[p.status]}>{statusLabel[p.status]}</Badge></td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {p.status === 'pending' && <>
                      <button onClick={() => approve(p.id)} className="flex items-center gap-1 px-2.5 py-1.5 bg-green-950/40 hover:bg-green-950/60 text-green-400 text-xs rounded-lg border border-green-500/25 transition-colors">
                        <CheckCircle size={12}/> Одобрить
                      </button>
                      <button onClick={() => reject(p.id)} className="flex items-center gap-1 px-2.5 py-1.5 bg-red-950/40 hover:bg-red-950/60 text-red-400 text-xs rounded-lg border border-red-500/25 transition-colors">
                        <XCircle size={12}/> Откл.
                      </button>
                    </>}
                    {p.status === 'processing' && (
                      <span className="flex items-center gap-1 text-xs text-[#8FA8C8]"><Clock size={12}/> Обрабатывается</span>
                    )}
                    {p.status === 'paid' && (
                      <span className="flex items-center gap-1 text-xs text-green-400"><CheckCircle size={12}/> {p.paid_at ? formatDate(p.paid_at) : 'Выплачено'}</span>
                    )}
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
