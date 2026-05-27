'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Package, BarChart3, Link2, Wallet,
  BookOpen, User, Settings, LogOut, Shield, ChevronRight,
  Zap, Users, ShoppingBag, Newspaper, Boxes
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const partnerNav = [
  { href: '/dashboard', label: 'Дашборд', icon: LayoutDashboard },
  { href: '/dashboard/offers', label: 'Офферы', icon: Package },
  { href: '/dashboard/dropshipping', label: 'Дропшиппинг', icon: ShoppingBag },
  { href: '/products', label: 'Наши продукты', icon: Boxes },
  { href: '/dashboard/referrals', label: 'Мои ссылки', icon: Link2 },
  { href: '/dashboard/stats', label: 'Статистика', icon: BarChart3 },
  { href: '/dashboard/wallet', label: 'Кошелёк', icon: Wallet },
  { href: '/dashboard/learn', label: 'Обучение', icon: BookOpen },
  { href: '/blog', label: 'Блог', icon: Newspaper },
  { href: '/dashboard/profile', label: 'Профиль', icon: User },
]

const adminNav = [
  { href: '/admin', label: 'Обзор', icon: LayoutDashboard },
  { href: '/admin/offers', label: 'Офферы', icon: Package },
  { href: '/admin/users', label: 'Пользователи', icon: Users },
  { href: '/admin/payouts', label: 'Выплаты', icon: Wallet },
  { href: '/admin/blog', label: 'Блог', icon: BookOpen },
  { href: '/admin/analytics', label: 'Аналитика', icon: BarChart3 },
]

const advertiserNav = [
  { href: '/advertiser/dashboard', label: 'Дашборд', icon: LayoutDashboard },
  { href: '/advertiser/offers', label: 'Мои офферы', icon: Package },
  { href: '/advertiser/leads', label: 'Лиды', icon: Zap },
  { href: '/dashboard/profile', label: 'Профиль', icon: User },
]

interface SidebarProps {
  role?: 'partner' | 'admin' | 'advertiser'
  onClose?: () => void
}

export function Sidebar({ role = 'partner', onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch {}
    router.push('/auth/login')
    router.refresh()
  }
  const nav = role === 'admin' ? adminNav : role === 'advertiser' ? advertiserNav : partnerNav

  return (
    <aside className="w-[180px] h-full flex flex-col bg-[#0D1B2E] border-r border-[#1A2744]">
      {/* Logo */}
      <div className="p-5 border-b border-[#1A2744]">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-full bg-[#2979FF]" />
            <div className="absolute inset-[30%] rounded-full bg-[#0D1B2E]" />
            <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#00D4FF]" />
          </div>
          <div>
            <span className="font-bold text-[#F0F4FF] text-sm tracking-wide">DROPS</span>
            <span className="text-[#2979FF] text-xs font-semibold tracking-widest block -mt-0.5">PARTNERS</span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto scrollbar-thin">
        {role === 'admin' && (
          <div className="px-3 py-1.5 mb-2">
            <span className="text-[10px] font-semibold text-[#8FA8C8] uppercase tracking-widest flex items-center gap-1.5">
              <Shield size={10} /> Админ-панель
            </span>
          </div>
        )}
        {role === 'advertiser' && (
          <div className="px-3 py-1.5 mb-2">
            <span className="text-[10px] font-semibold text-[#8FA8C8] uppercase tracking-widest flex items-center gap-1.5">
              <Zap size={10} /> Рекламодатель
            </span>
          </div>
        )}
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && href !== '/admin' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all',
                active
                  ? 'bg-[#2979FF]/15 text-[#F0F4FF] font-medium border border-[#2979FF]/25'
                  : 'text-[#8FA8C8] hover:bg-[#1A2744] hover:text-[#F0F4FF]'
              )}
            >
              <Icon size={16} className={active ? 'text-[#2979FF]' : ''} />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={12} className="text-[#2979FF]" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-[#1A2744] space-y-1">
        <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-[#8FA8C8] hover:bg-[#1A2744] hover:text-[#F0F4FF] transition-all">
          <Settings size={14} />
          <span>Настройки</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-950/30 transition-all"
        >
          <LogOut size={14} />
          <span>Выйти</span>
        </button>
      </div>
    </aside>
  )
}
