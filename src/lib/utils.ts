import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMoney(amount: number, currency = 'RUB'): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency', currency,
    minimumFractionDigits: 0, maximumFractionDigits: 2,
  }).format(amount)
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('ru-RU').format(n)
}

export function formatPercent(n: number): string {
  return `${n.toFixed(1)}%`
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

export function formatDateTime(date: string): string {
  return new Date(date).toLocaleString('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export function getOfferTypeLabel(type: string): string {
  const map: Record<string, string> = {
    cpa: 'CPA', cpl: 'CPL', cps: 'CPS',
    revshare: 'RevShare', dropship: 'Дропшиппинг',
  }
  return map[type] ?? type.toUpperCase()
}

export function getOfferTypeColor(type: string): string {
  const map: Record<string, string> = {
    cpa: 'bg-blue-950/60 text-blue-300 border border-blue-500/30',
    cpl: 'bg-purple-950/60 text-purple-300 border border-purple-500/30',
    cps: 'bg-green-950/60 text-green-300 border border-green-500/30',
    revshare: 'bg-amber-950/60 text-amber-300 border border-amber-500/30',
    dropship: 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30',
  }
  return map[type] ?? 'bg-[#1A2744] text-[#C8DCFF] border border-[#2979FF]/20'
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    active: 'bg-green-950/60 text-green-300 border border-green-500/30',
    pending: 'bg-amber-950/60 text-amber-300 border border-amber-500/30',
    approved: 'bg-green-950/60 text-green-300 border border-green-500/30',
    rejected: 'bg-red-950/60 text-red-300 border border-red-500/30',
    paid: 'bg-blue-950/60 text-blue-300 border border-blue-500/30',
    draft: 'bg-[#1A2744] text-[#8FA8C8] border border-[#2979FF]/20',
    paused: 'bg-orange-950/60 text-orange-300 border border-orange-500/30',
  }
  return map[status] ?? 'bg-[#1A2744] text-[#8FA8C8] border border-[#2979FF]/20'
}

export function getPayoutLabel(offer: { type: string; payout_amount: number; payout_percent: number; currency: string }): string {
  if (offer.type === 'revshare') return `${offer.payout_percent}% RevShare`
  return formatMoney(offer.payout_amount, offer.currency)
}

export function buildRefUrl(baseUrl: string, code: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'https://partners.drops.agency'
  return `${base}/ref/${code}`
}

export function last7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  })
}
