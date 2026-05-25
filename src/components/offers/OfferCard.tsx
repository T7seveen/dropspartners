import Link from 'next/link'
import { ExternalLink, TrendingUp, Clock, Globe } from 'lucide-react'
import { Offer } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn, getOfferTypeLabel, getPayoutLabel } from '@/lib/utils'

interface OfferCardProps {
  offer: Offer
  isLinked?: boolean
  linkCode?: string
  onGetLink?: (offer: Offer) => void
}

export function OfferCard({ offer, isLinked, linkCode, onGetLink }: OfferCardProps) {
  const typeLabel = getOfferTypeLabel(offer.type)
  const payout = getPayoutLabel(offer)

  const typeColors: Record<string, string> = {
    cpa: 'blue', cpl: 'purple', cps: 'green', revshare: 'amber', dropship: 'cyan',
  }

  return (
    <div className={cn(
      'rounded-2xl border transition-all duration-200 overflow-hidden group',
      'bg-[#0D1B2E] border-[#1A2744] hover:border-[#2979FF]/40',
      offer.is_featured && 'ring-1 ring-[#2979FF]/30'
    )}>
      {/* Top accent + cover */}
      <div className="relative h-20 bg-gradient-to-br from-[#1A2744] to-[#0D1B2E] overflow-hidden">
        {offer.cover_url ? (
          <img src={offer.cover_url} alt="" className="w-full h-full object-cover opacity-60" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-20 select-none">
            {offer.categories?.icon ?? '📦'}
          </div>
        )}
        {offer.is_top && (
          <span className="absolute top-2 right-2 bg-[#FFB930] text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
            ТОП
          </span>
        )}
        {offer.is_featured && !offer.is_top && (
          <span className="absolute top-2 right-2 bg-[#2979FF] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            HOT
          </span>
        )}
        {/* Logo */}
        {offer.logo_url && (
          <div className="absolute bottom-2 left-3 w-8 h-8 rounded-lg bg-[#0D1B2E] border border-[#1A2744] p-1">
            <img src={offer.logo_url} alt="" className="w-full h-full object-contain" />
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[#F0F4FF] text-sm truncate group-hover:text-[#2979FF] transition-colors">
              {offer.title}
            </h3>
            <p className="text-[#8FA8C8] text-xs mt-0.5 line-clamp-2">{offer.description}</p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          <Badge variant={typeColors[offer.type] as any}>{typeLabel}</Badge>
          {offer.categories && (
            <Badge variant="default">{offer.categories.icon} {offer.categories.name}</Badge>
          )}
        </div>

        {/* Payout highlight */}
        <div className="bg-[#1A2744] rounded-xl p-3 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-[#8FA8C8] uppercase tracking-wide">Выплата</div>
            <div className="text-[#2979FF] font-bold text-lg">{payout}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-[#8FA8C8] uppercase tracking-wide">CR</div>
            <div className="text-[#F0F4FF] font-semibold text-sm">
              {offer.cr_percent > 0 ? `${offer.cr_percent}%` : '—'}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-[#8FA8C8] uppercase tracking-wide">Куки</div>
            <div className="flex items-center gap-1 text-[#F0F4FF] text-sm font-semibold">
              <Clock size={10} className="text-[#8FA8C8]" />
              {offer.cookie_days}д
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 text-xs text-[#8FA8C8]">
          <span className="flex items-center gap-1"><TrendingUp size={12} className="text-[#2979FF]" /> {offer.clicks_count.toLocaleString('ru')} кликов</span>
          <span className="flex items-center gap-1"><Globe size={12} /> {offer.conversions_count} конверсий</span>
        </div>

        {/* CTA */}
        <div className="flex gap-2 pt-1">
          {isLinked ? (
            <Link href={`/dashboard/referrals?offer=${offer.id}`}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#1A2744] hover:bg-[#243560] text-[#C8DCFF] text-xs font-medium rounded-xl transition-all border border-[#2979FF]/20">
              Мои ссылки <ExternalLink size={12} />
            </Link>
          ) : (
            <Button size="sm" className="flex-1 text-xs" onClick={() => onGetLink?.(offer)}>
              Получить ссылку
            </Button>
          )}
          <Link href={`/offers/${offer.slug}`}
            className="px-3 py-1.5 bg-[#1A2744] hover:bg-[#243560] rounded-xl text-xs text-[#8FA8C8] hover:text-white transition-all">
            Подробнее
          </Link>
        </div>
      </div>
    </div>
  )
}
