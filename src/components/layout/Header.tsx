'use client'
import { Bell, Search, Menu, Plus } from 'lucide-react'
import Link from 'next/link'

interface HeaderProps {
  title: string
  onMenuClick?: () => void
  balance?: number
}

export function Header({ title, onMenuClick, balance }: HeaderProps) {
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

      <button className="relative text-[#8FA8C8] hover:text-white transition-colors">
        <Bell size={18} />
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#2979FF] rounded-full pulse-blue" />
      </button>
    </header>
  )
}
