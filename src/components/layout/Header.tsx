'use client'
import { Bell, Search, Menu, Plus, CheckCircle2, TrendingUp, Wallet, Info, X } from 'lucide-react'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'

interface HeaderProps {
  title: string
  onMenuClick?: () => void
  balance?: number
}

const DEMO_NOTIFICATIONS = [
  { id: '1', icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-400/10', title: 'Новый оффер в сети', body: 'Bybit RevShare — 40% от прибыли брокера', time: '2 мин назад', unread: true },
  { id: '2', icon: CheckCircle2, color: 'text-blue-400', bg: 'bg-blue-400/10', title: 'Конверсия подтверждена', body: 'Drops — Система: +3 500 ₽ на кошелёк', time: '1 час назад', unread: true },
  { id: '3', icon: Wallet, color: 'text-amber-400', bg: 'bg-amber-400/10', title: 'Напоминание о выводе', body: 'У вас есть одобренные средства для вывода', time: '5 часов назад', unread: false },
  { id: '4', icon: Info, color: 'text-[#8FA8C8]', bg: 'bg-[#8FA8C8]/10', title: 'Добро пожаловать!', body: 'Пройдите обучение и получите первые конверсии', time: 'вчера', unread: false },
]

export function Header({ title, onMenuClick, balance }: HeaderProps) {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS)
  const ref = useRef<HTMLDivElement>(null)
  const unreadCount = notifications.filter(n => n.unread).length

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const markAllRead = () => setNotifications(ns => ns.map(n => ({ ...n, unread: false })))
  const dismiss = (id: string) => setNotifications(ns => ns.filter(n => n.id !== id))

  return (
    <header className="h-14 border-b border-[#1A2744] bg-[#0A0A0F]/80 backdrop-blur flex items-center px-4 gap-4 sticky top-0 z-30">
      <button onClick={onMenuClick} className="lg:hidden text-[#8FA8C8] hover:text-white">
        <Menu size={20} />
      </button>

      <h1 className="font-semibold text-[#F0F4FF] text-sm flex-1 truncate">{title}</h1>

      <div className="hidden md:flex items-center gap-2 bg-[#1A2744] rounded-xl px-3 py-1.5 w-48">
        <Search size={14} className="text-[#8FA8C8]" />
        <input
          placeholder="Поиск..."
          className="bg-transparent text-xs text-[#F0F4FF] placeholder-[#8FA8C8] outline-none w-full"
        />
      </div>

      {balance !== undefined && (
        <div className="hidden sm:flex items-center gap-2 bg-[#1A2744] border border-[#2979FF]/20 rounded-xl px-3 py-1.5">
          <span className="text-xs text-[#8FA8C8]">Баланс:</span>
          <span className="text-xs font-bold text-[#2979FF]">
            {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(balance)}
          </span>
        </div>
      )}

      <Link href="/dashboard/offers" className="hidden sm:flex items-center gap-1.5 bg-[#2979FF] hover:bg-[#1565C0] text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors">
        <Plus size={14} />
        Взять оффер
      </Link>

      {/* Notification bell */}
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(v => !v)}
          className="relative text-[#8FA8C8] hover:text-white transition-colors p-1"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-[#2979FF] rounded-full text-[9px] font-bold text-white flex items-center justify-center px-0.5">
              {unreadCount}
            </span>
          )}
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-[#0D1B2E] border border-[#1A2744] rounded-2xl shadow-2xl overflow-hidden z-50">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#1A2744]">
              <span className="text-sm font-semibold text-[#F0F4FF]">Уведомления</span>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-[10px] text-[#2979FF] hover:underline">
                  Прочитать все
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-10 text-center text-[#8FA8C8] text-sm">Нет уведомлений</div>
              ) : notifications.map(n => (
                <div key={n.id} className={`flex items-start gap-3 px-4 py-3 border-b border-[#1A2744]/50 hover:bg-[#1A2744]/30 transition-colors ${n.unread ? 'bg-[#2979FF]/5' : ''}`}>
                  <div className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${n.bg}`}>
                    <n.icon size={13} className={n.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-[#F0F4FF] truncate">{n.title}</span>
                      {n.unread && <span className="w-1.5 h-1.5 bg-[#2979FF] rounded-full shrink-0" />}
                    </div>
                    <p className="text-[11px] text-[#8FA8C8] mt-0.5 line-clamp-2">{n.body}</p>
                    <span className="text-[10px] text-[#8FA8C8]/60 mt-1 block">{n.time}</span>
                  </div>
                  <button onClick={() => dismiss(n.id)} className="text-[#8FA8C8]/40 hover:text-[#8FA8C8] transition-colors mt-1 shrink-0">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
            <div className="px-4 py-2.5 border-t border-[#1A2744]">
              <Link href="/dashboard/settings" onClick={() => setOpen(false)} className="text-[11px] text-[#2979FF] hover:underline">
                Настройки уведомлений →
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
