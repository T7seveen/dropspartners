'use client'
import { useState } from 'react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { Wallet, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { formatMoney, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

const balance = 35100
const pending = 12500
const paid_total = 187400

const history = [
  { id: '1', amount: 15000, method: 'Карта •••• 4242', status: 'paid', date: '2024-01-20', paid_at: '2024-01-21' },
  { id: '2', amount: 28000, method: 'USDT TRC20', status: 'paid', date: '2024-01-10', paid_at: '2024-01-11' },
  { id: '3', amount: 7500, method: 'Карта •••• 4242', status: 'processing', date: '2024-01-25', paid_at: null },
  { id: '4', amount: 50000, method: 'Банк. перевод', status: 'paid', date: '2023-12-20', paid_at: '2023-12-21' },
]

const statusIcon = { paid: CheckCircle, processing: Clock, pending: AlertCircle, rejected: XCircle }
const statusColor = { paid: 'text-green-400', processing: 'text-amber-400', pending: 'text-[#8FA8C8]', rejected: 'text-red-400' }
const statusLabel = { paid: 'Выплачено', processing: 'В обработке', pending: 'На рассмотрении', rejected: 'Отклонено' }

export default function PayoutsPage() {
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('card')
  const [details, setDetails] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    if (!amount || !details) return
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1200))
    setSubmitting(false)
    setSuccess(true)
    setAmount('')
    setDetails('')
  }

  return (
    <DashboardShell title="Выплаты" balance={balance}>
      {/* Balance overview */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-gradient-to-br from-[#2979FF]/15 to-[#0D1B2E] border border-[#2979FF]/30 rounded-2xl p-5">
          <div className="text-[#8FA8C8] text-xs mb-2">Доступный баланс</div>
          <div className="text-[#2979FF] font-bold text-2xl">{formatMoney(balance)}</div>
          <div className="text-[10px] text-[#8FA8C8] mt-1">Минимум вывода: 2 000 ₽</div>
        </div>
        <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-5">
          <div className="text-[#8FA8C8] text-xs mb-2">В холде</div>
          <div className="text-amber-400 font-bold text-2xl">{formatMoney(pending)}</div>
          <div className="text-[10px] text-[#8FA8C8] mt-1">Поступит через 14 дней</div>
        </div>
        <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-5">
          <div className="text-[#8FA8C8] text-xs mb-2">Всего выплачено</div>
          <div className="text-green-400 font-bold text-2xl">{formatMoney(paid_total)}</div>
          <div className="text-[10px] text-[#8FA8C8] mt-1">За всё время</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Request form */}
        <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-5">
          <h3 className="font-semibold text-[#F0F4FF] text-sm mb-4 flex items-center gap-2">
            <Wallet size={16} className="text-[#2979FF]" /> Запрос на выплату
          </h3>

          {success && (
            <div className="mb-4 p-3 bg-green-950/40 border border-green-500/30 rounded-xl flex items-center gap-2 text-green-400 text-sm">
              <CheckCircle size={16} /> Запрос отправлен! Обработка в течение 1 рабочего дня.
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="text-xs text-[#8FA8C8] mb-1.5 block">Сумма (₽)</label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Минимум 2 000"
                max={balance}
                className="w-full bg-[#1A2744] border border-[#2979FF]/20 rounded-xl px-3 py-2.5 text-sm text-[#F0F4FF] placeholder-[#8FA8C8] outline-none focus:border-[#2979FF] transition-colors"
              />
              <div className="text-[10px] text-[#8FA8C8] mt-1">Доступно: {formatMoney(balance)}</div>
            </div>

            <div>
              <label className="text-xs text-[#8FA8C8] mb-1.5 block">Метод выплаты</label>
              <select
                value={method}
                onChange={e => setMethod(e.target.value)}
                className="w-full bg-[#1A2744] border border-[#2979FF]/20 rounded-xl px-3 py-2.5 text-sm text-[#F0F4FF] outline-none focus:border-[#2979FF] transition-colors cursor-pointer"
              >
                <option value="card">Карта РФ</option>
                <option value="usdt">USDT TRC20</option>
                <option value="bitcoin">Bitcoin</option>
                <option value="bank">Банковский перевод</option>
                <option value="qiwi">QIWI / ЮMoney</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-[#8FA8C8] mb-1.5 block">
                {method === 'card' ? 'Номер карты' : method === 'bank' ? 'Реквизиты' : 'Адрес кошелька'}
              </label>
              <input
                value={details}
                onChange={e => setDetails(e.target.value)}
                placeholder={method === 'card' ? '0000 0000 0000 0000' : method === 'bank' ? 'БИК, счёт, получатель' : 'Адрес кошелька'}
                className="w-full bg-[#1A2744] border border-[#2979FF]/20 rounded-xl px-3 py-2.5 text-sm text-[#F0F4FF] placeholder-[#8FA8C8] outline-none focus:border-[#2979FF] transition-colors"
              />
            </div>

            <Button
              onClick={handleSubmit}
              loading={submitting}
              disabled={!amount || !details || Number(amount) < 2000 || Number(amount) > balance}
              className="w-full"
            >
              Запросить выплату {amount && Number(amount) >= 2000 ? `— ${formatMoney(Number(amount))}` : ''}
            </Button>
          </div>
        </div>

        {/* History */}
        <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-[#1A2744]">
            <h3 className="font-semibold text-[#F0F4FF] text-sm">История выплат</h3>
          </div>
          <div className="divide-y divide-[#1A2744]">
            {history.map(p => {
              const Icon = statusIcon[p.status as keyof typeof statusIcon]
              return (
                <div key={p.id} className="p-4 flex items-center gap-3">
                  <Icon size={18} className={statusColor[p.status as keyof typeof statusColor]} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[#F0F4FF]">{formatMoney(p.amount)}</div>
                    <div className="text-xs text-[#8FA8C8] truncate">{p.method} · {formatDate(p.date)}</div>
                  </div>
                  <span className={`text-xs font-medium ${statusColor[p.status as keyof typeof statusColor]}`}>
                    {statusLabel[p.status as keyof typeof statusLabel]}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
