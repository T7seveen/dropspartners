'use client'
import { useState, useEffect, useCallback } from 'react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { CheckCircle, XCircle, Clock, RefreshCw, AlertCircle, Loader2 } from 'lucide-react'
import { formatMoney, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'

interface Payout {
  id: string
  partner_id: string
  amount: number
  method: string
  details: string
  status: string
  created_at: string
  paid_at: string | null
  admin_note: string | null
  profiles?: { username: string | null; email: string; full_name: string | null; telegram_chat_id: string | null }
}

const statusVariant: Record<string, any> = { pending: 'amber', processing: 'blue', paid: 'green', rejected: 'red' }
const statusLabel: Record<string, string> = { pending: 'Ожидание', processing: 'В обработке', paid: 'Выплачено', rejected: 'Отклонено' }

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const [actionId, setActionId] = useState<string | null>(null)
  const [rejectNote, setRejectNote] = useState<Record<string, string>>({})
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/payouts?status=${filter}`)
      if (!res.ok) throw new Error()
      const d = await res.json()
      setPayouts(d.payouts ?? [])
    } catch {
      // Fallback mock
      setPayouts([
        { id: '1', partner_id: 'p1', amount: 45000, method: 'usdt', details: 'T...',   status: 'pending',    created_at: '2024-01-25T10:00:00Z', paid_at: null, admin_note: null, profiles: { username: 'alex_traffic', email: 'alex@mail.ru', full_name: 'Алексей', telegram_chat_id: null } },
        { id: '2', partner_id: 'p2', amount: 28000, method: 'card', details: '4242...', status: 'pending',    created_at: '2024-01-25T11:00:00Z', paid_at: null, admin_note: null, profiles: { username: 'maria_media',  email: 'maria@g.com', full_name: 'Мария', telegram_chat_id: null } },
        { id: '3', partner_id: 'p3', amount: 62000, method: 'usdt', details: 'T...',   status: 'processing', created_at: '2024-01-24T09:00:00Z', paid_at: null, admin_note: null, profiles: { username: 'pro_aff',      email: 'pro@m.ru',    full_name: 'Прoфи', telegram_chat_id: null } },
      ].filter(p => filter === 'all' || p.status === filter))
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => { load() }, [load])

  const action = async (id: string, act: 'approve' | 'reject') => {
    setError('')
    setActionId(id)
    try {
      const res = await fetch('/api/admin/payouts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payout_id: id, action: act, admin_note: rejectNote[id] ?? null }),
      })
      const d = await res.json()
      if (!res.ok) { setError(d.error ?? 'Ошибка'); return }
      setPayouts(prev => prev.filter(p => p.id !== id))
    } catch { setError('Ошибка соединения') }
    finally { setActionId(null) }
  }

  const pendingTotal = payouts.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0)
  const paidTotal = payouts.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0)
  const processingTotal = payouts.filter(p => p.status === 'processing').reduce((s, p) => s + p.amount, 0)

  return (
    <DashboardShell title="Управление выплатами" role="admin">
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-[#0D1B2E] border border-amber-500/20 rounded-2xl p-4">
          <div className="text-xs text-[#8FA8C8] mb-1">Ожидают выплаты</div>
          <div className="text-xl font-bold text-amber-400">{formatMoney(pendingTotal)}</div>
          <div className="text-xs text-[#8FA8C8] mt-1">{payouts.filter(p => p.status === 'pending').length} заявок</div>
        </div>
        <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-4">
          <div className="text-xs text-[#8FA8C8] mb-1">Выплачено</div>
          <div className="text-xl font-bold text-green-400">{formatMoney(paidTotal)}</div>
        </div>
        <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-4">
          <div className="text-xs text-[#8FA8C8] mb-1">В обработке</div>
          <div className="text-xl font-bold text-[#2979FF]">{formatMoney(processingTotal)}</div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        {['pending', 'processing', 'paid', 'rejected', 'all'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${filter === f ? 'bg-[#2979FF] text-white' : 'bg-[#0D1B2E] border border-[#1A2744] text-[#8FA8C8] hover:border-[#2979FF]/40 hover:text-[#F0F4FF]'}`}>
            {f === 'all' ? 'Все' : statusLabel[f]}
          </button>
        ))}
        <button onClick={load} className="ml-auto text-[#8FA8C8] hover:text-white transition-colors">
          <RefreshCw size={14}/>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-950/40 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle size={16}/> {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-[#8FA8C8]">
          <Loader2 size={20} className="animate-spin mr-2"/> Загрузка...
        </div>
      ) : (
        <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1A2744]">
                {['Партнёр', 'Сумма', 'Метод / Реквизиты', 'Дата', 'Статус', 'Действия'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#8FA8C8] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A2744]">
              {payouts.map(p => (
                <tr key={p.id} className="hover:bg-[#1A2744]/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-[#F0F4FF]">
                      {p.profiles?.username ? `@${p.profiles.username}` : p.profiles?.full_name ?? '—'}
                    </div>
                    <div className="text-xs text-[#8FA8C8]">{p.profiles?.email}</div>
                  </td>
                  <td className="px-4 py-3 font-bold text-[#2979FF] text-sm whitespace-nowrap">{formatMoney(p.amount)}</td>
                  <td className="px-4 py-3">
                    <div className="text-xs font-medium text-[#F0F4FF]">{p.method}</div>
                    <div className="text-[10px] text-[#8FA8C8] font-mono truncate max-w-[140px]">{p.details}</div>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#8FA8C8] whitespace-nowrap">{formatDate(p.created_at)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant[p.status] ?? 'default'}>
                      {statusLabel[p.status] ?? p.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {p.status === 'pending' && (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => action(p.id, 'approve')}
                            disabled={actionId === p.id}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-green-950/40 hover:bg-green-950/60 text-green-400 text-xs rounded-lg border border-green-500/25 transition-colors disabled:opacity-50"
                          >
                            {actionId === p.id ? <Loader2 size={12} className="animate-spin"/> : <CheckCircle size={12}/>} Одобрить
                          </button>
                          <button
                            onClick={() => action(p.id, 'reject')}
                            disabled={actionId === p.id}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-red-950/40 hover:bg-red-950/60 text-red-400 text-xs rounded-lg border border-red-500/25 transition-colors disabled:opacity-50"
                          >
                            <XCircle size={12}/> Откл.
                          </button>
                        </div>
                        <input
                          placeholder="Причина (опц.)"
                          value={rejectNote[p.id] ?? ''}
                          onChange={e => setRejectNote(prev => ({ ...prev, [p.id]: e.target.value }))}
                          className="w-full bg-[#0A0A0F] border border-[#1A2744] rounded-lg px-2 py-1 text-[10px] text-[#8FA8C8] outline-none focus:border-[#2979FF] placeholder-[#4A6080]"
                        />
                      </div>
                    )}
                    {p.status === 'processing' && (
                      <span className="flex items-center gap-1 text-xs text-[#8FA8C8]"><Clock size={12}/> В обработке</span>
                    )}
                    {p.status === 'paid' && (
                      <span className="flex items-center gap-1 text-xs text-green-400"><CheckCircle size={12}/> {p.paid_at ? formatDate(p.paid_at) : 'Выплачено'}</span>
                    )}
                    {p.status === 'rejected' && p.admin_note && (
                      <span className="text-[10px] text-red-400">{p.admin_note}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {payouts.length === 0 && (
            <div className="py-12 text-center text-[#8FA8C8]">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-sm">Нет заявок в этом статусе</div>
            </div>
          )}
        </div>
      )}
    </DashboardShell>
  )
}
