'use client'
import { useState, useEffect, useCallback } from 'react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import {
  Wallet, Clock, CheckCircle, XCircle, AlertCircle,
  TrendingUp, ArrowDownCircle, RefreshCw,
} from 'lucide-react'
import { formatMoney, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

const MIN_WITHDRAWAL = 1000

interface WalletData {
  balance: number
  pending_hold: number
  total_earned: number
  total_paid: number
  payouts: Payout[]
  dev_mode?: boolean
}

interface Payout {
  id: string
  amount: number
  method: string
  status: 'pending' | 'processing' | 'paid' | 'rejected'
  created_at: string
  paid_at: string | null
  admin_note?: string | null
}

const statusIcon = {
  paid: CheckCircle,
  processing: Clock,
  pending: AlertCircle,
  rejected: XCircle,
}
const statusColor = {
  paid: 'text-green-400',
  processing: 'text-amber-400',
  pending: 'text-[#8FA8C8]',
  rejected: 'text-red-400',
}
const statusLabel = {
  paid: 'Выплачено',
  processing: 'В обработке',
  pending: 'На рассмотрении',
  rejected: 'Отклонено',
}
const methodLabel: Record<string, string> = {
  card: 'Карта РФ',
  usdt: 'USDT TRC20',
  bitcoin: 'Bitcoin',
  bank: 'Банковский перевод',
  qiwi: 'QIWI / ЮMoney',
}

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [loading, setLoading] = useState(true)
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('card')
  const [details, setDetails] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formError, setFormError] = useState('')

  const fetchWallet = useCallback(async () => {
    try {
      const res = await fetch('/api/wallet')
      if (!res.ok) throw new Error()
      const data = await res.json()
      setWallet(data)
    } catch {
      // Fallback to mock for dev
      setWallet({
        balance: 35100,
        pending_hold: 12500,
        total_earned: 224900,
        total_paid: 187400,
        payouts: [
          { id: '1', amount: 15000, method: 'card', status: 'paid', created_at: '2024-01-20', paid_at: '2024-01-21' },
          { id: '2', amount: 28000, method: 'usdt', status: 'paid', created_at: '2024-01-10', paid_at: '2024-01-11' },
          { id: '3', amount: 7500, method: 'card', status: 'processing', created_at: '2024-01-25', paid_at: null },
          { id: '4', amount: 50000, method: 'bank', status: 'paid', created_at: '2023-12-20', paid_at: '2023-12-21' },
        ],
        dev_mode: true,
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchWallet() }, [fetchWallet])

  const handleWithdraw = async () => {
    setFormError('')
    const amountNum = Number(amount)

    if (!amount || amountNum < MIN_WITHDRAWAL) {
      setFormError(`Минимальная сумма вывода — ${formatMoney(MIN_WITHDRAWAL)}`)
      return
    }
    if (wallet && amountNum > wallet.balance) {
      setFormError('Недостаточно средств на балансе')
      return
    }
    if (!details.trim()) {
      setFormError('Введите реквизиты для выплаты')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/payouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountNum, method, details }),
      })
      const data = await res.json()
      if (!res.ok) {
        setFormError(data.error ?? 'Ошибка при создании запроса')
        return
      }
      setSuccess(true)
      setAmount('')
      setDetails('')
      // Refresh wallet data
      await fetchWallet()
      setTimeout(() => setSuccess(false), 5000)
    } catch {
      setFormError('Ошибка соединения. Попробуйте позже.')
    } finally {
      setSubmitting(false)
    }
  }

  const balance = wallet?.balance ?? 0

  return (
    <DashboardShell title="Кошелёк" balance={balance}>
      {wallet?.dev_mode && (
        <div className="mb-4 px-4 py-3 bg-amber-950/30 border border-amber-500/20 rounded-xl text-amber-400 text-xs">
          🔧 Демо-режим — подключите Supabase для реальных данных
        </div>
      )}

      {/* Balance cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-[#2979FF]/15 to-[#0D1B2E] border border-[#2979FF]/30 rounded-2xl p-5">
          <div className="flex items-center gap-2 text-[#8FA8C8] text-xs mb-2">
            <Wallet size={14}/> Доступный баланс
          </div>
          <div className="text-[#2979FF] font-bold text-3xl">
            {loading ? '—' : formatMoney(balance)}
          </div>
          <div className="text-[10px] text-[#8FA8C8] mt-1">Минимум вывода: {formatMoney(MIN_WITHDRAWAL)}</div>
        </div>

        <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-4">
          <div className="flex items-center gap-1.5 text-[#8FA8C8] text-xs mb-2">
            <Clock size={12}/> В холде
          </div>
          <div className="text-amber-400 font-bold text-xl">
            {loading ? '—' : formatMoney(wallet?.pending_hold ?? 0)}
          </div>
          <div className="text-[10px] text-[#8FA8C8] mt-0.5">Поступит через 14 дн.</div>
        </div>

        <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-4">
          <div className="flex items-center gap-1.5 text-[#8FA8C8] text-xs mb-2">
            <TrendingUp size={12}/> Всего заработано
          </div>
          <div className="text-green-400 font-bold text-xl">
            {loading ? '—' : formatMoney(wallet?.total_earned ?? 0)}
          </div>
          <div className="text-[10px] text-[#8FA8C8] mt-0.5">За всё время</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Withdrawal form */}
        <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-5">
          <h3 className="font-semibold text-[#F0F4FF] text-sm mb-4 flex items-center gap-2">
            <ArrowDownCircle size={16} className="text-[#2979FF]" />
            Запрос на выплату
          </h3>

          {success && (
            <div className="mb-4 p-3 bg-green-950/40 border border-green-500/30 rounded-xl flex items-center gap-2 text-green-400 text-sm">
              <CheckCircle size={16}/> Запрос принят! Обработка в течение 1 рабочего дня.
            </div>
          )}

          {formError && (
            <div className="mb-4 p-3 bg-red-950/40 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle size={16}/> {formError}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="text-xs text-[#8FA8C8] mb-1.5 block">Сумма (₽)</label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                min={MIN_WITHDRAWAL}
                max={balance}
                placeholder={`Минимум ${MIN_WITHDRAWAL}`}
                className="w-full bg-[#1A2744] border border-[#2979FF]/20 rounded-xl px-3 py-2.5 text-sm text-[#F0F4FF] placeholder-[#8FA8C8] outline-none focus:border-[#2979FF] transition-colors"
              />
              <div className="flex justify-between text-[10px] text-[#8FA8C8] mt-1">
                <span>Доступно: {formatMoney(balance)}</span>
                {amount && Number(amount) >= MIN_WITHDRAWAL && (
                  <button
                    type="button"
                    onClick={() => setAmount(String(Math.floor(balance)))}
                    className="text-[#2979FF] hover:underline"
                  >
                    Вывести всё
                  </button>
                )}
              </div>
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
                {method === 'card' ? 'Номер карты' : method === 'bank' ? 'Реквизиты (БИК + счёт + ФИО)' : 'Адрес кошелька'}
              </label>
              <input
                value={details}
                onChange={e => setDetails(e.target.value)}
                placeholder={
                  method === 'card' ? '0000 0000 0000 0000'
                  : method === 'bank' ? 'БИК 000000000, р/с 40817...'
                  : 'T...'
                }
                className="w-full bg-[#1A2744] border border-[#2979FF]/20 rounded-xl px-3 py-2.5 text-sm text-[#F0F4FF] placeholder-[#8FA8C8] outline-none focus:border-[#2979FF] transition-colors"
              />
            </div>

            <Button
              onClick={handleWithdraw}
              loading={submitting}
              disabled={
                !amount || !details ||
                Number(amount) < MIN_WITHDRAWAL ||
                Number(amount) > balance
              }
              className="w-full"
            >
              {amount && Number(amount) >= MIN_WITHDRAWAL
                ? `Вывести ${formatMoney(Number(amount))}`
                : 'Запросить выплату'}
            </Button>
          </div>

          <p className="text-[10px] text-[#8FA8C8] mt-3 text-center">
            Выплаты обрабатываются вручную через Telegram. Среднее время — до 24 часов.
          </p>
        </div>

        {/* History */}
        <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-[#1A2744] flex items-center justify-between">
            <h3 className="font-semibold text-[#F0F4FF] text-sm">История выплат</h3>
            <button
              onClick={fetchWallet}
              className="text-[#8FA8C8] hover:text-white transition-colors"
              title="Обновить"
            >
              <RefreshCw size={14}/>
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-[#8FA8C8] text-sm">Загрузка...</div>
          ) : !wallet?.payouts?.length ? (
            <div className="p-8 text-center">
              <div className="text-3xl mb-2">💸</div>
              <div className="text-[#8FA8C8] text-sm">Выплат пока нет</div>
              <div className="text-[#8FA8C8] text-xs mt-1">Ваши запросы появятся здесь</div>
            </div>
          ) : (
            <div className="divide-y divide-[#1A2744]">
              {wallet.payouts.map(p => {
                const Icon = statusIcon[p.status] ?? AlertCircle
                return (
                  <div key={p.id} className="p-4 flex items-center gap-3">
                    <Icon size={18} className={statusColor[p.status] ?? 'text-[#8FA8C8]'} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-[#F0F4FF]">{formatMoney(p.amount)}</div>
                      <div className="text-xs text-[#8FA8C8] truncate">
                        {methodLabel[p.method] ?? p.method} · {formatDate(p.created_at)}
                      </div>
                      {p.admin_note && (
                        <div className="text-xs text-red-400 mt-0.5 truncate">{p.admin_note}</div>
                      )}
                    </div>
                    <span className={`text-xs font-medium shrink-0 ${statusColor[p.status] ?? 'text-[#8FA8C8]'}`}>
                      {statusLabel[p.status] ?? p.status}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  )
}
