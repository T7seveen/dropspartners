import Link from 'next/link'
import { formatMoney, getOfferTypeLabel, getPayoutLabel } from '@/lib/utils'
import { ArrowLeft, Clock, Globe, TrendingUp, Users, Shield, CheckCircle } from 'lucide-react'
import type { Offer } from '@/types'

const MOCK_OFFERS: Record<string, Offer> = {
  'drops-system': {
    id: '1', slug: 'drops-system', title: 'Drops — Пакет «Система»',
    description: 'Продавайте комплексный маркетинг. 15 000₽ за каждый заключённый договор.',
    full_description: 'Капитальный оффер для тех, кто работает с предпринимателями. Клиент покупает комплексный маркетинговый пакет от агентства Drops: сайт, реклама, SMM. Высокий чек = высокая выплата.',
    category_id: 5, type: 'cpa', payout_amount: 15000, payout_percent: 0, currency: 'RUB',
    target_url: 'https://drops.agency', product_price: null, product_image: null,
    advertiser_name: 'Drops Agency', logo_url: null, cover_url: null,
    tags: ['маркетинг', 'b2b', 'высокий чек'], allowed_geos: ['RU', 'BY', 'KZ'],
    allowed_traffic: ['social', 'telegram', 'email', 'seo'],
    clicks_count: 1247, conversions_count: 52, cr_percent: 4.2,
    status: 'active', is_featured: true, is_top: true, cookie_days: 60, hold_days: 14,
    created_at: '2024-01-01', updated_at: '2024-01-01',
    categories: { id: 5, slug: 'marketing', name: 'Маркетинг', icon: '📈', description: null, sort_order: 5 },
  },
  'bybit': {
    id: '2', slug: 'bybit', title: 'Bybit — Крипто-биржа',
    description: 'До 30% RevShare навсегда. Один из лучших конвертов в крипте.',
    full_description: 'Приводите трейдеров на Bybit и получайте 30% от их комиссии навсегда. Пассивный доход, пока ваши рефералы торгуют.',
    category_id: 2, type: 'revshare', payout_amount: 0, payout_percent: 30, currency: 'USDT',
    target_url: 'https://bybit.com', product_price: null, product_image: null,
    advertiser_name: 'Bybit', logo_url: null, cover_url: null,
    tags: ['крипта', 'биржа', 'revshare'], allowed_geos: [],
    allowed_traffic: ['social', 'youtube', 'blog', 'telegram'],
    clicks_count: 3412, conversions_count: 98, cr_percent: 2.9,
    status: 'active', is_featured: true, is_top: true, cookie_days: 365, hold_days: 30,
    created_at: '2024-01-01', updated_at: '2024-01-01',
    categories: { id: 2, slug: 'crypto', name: 'Крипто-биржи', icon: '₿', description: null, sort_order: 2 },
  },
}

export default async function OfferPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let offer: Offer | null = MOCK_OFFERS[slug] ?? null

  if (!offer) {
    try {
      const { getOffer } = await import('@/lib/db')
      offer = await getOffer(slug)
    } catch {
      offer = null
    }
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-[#F0F4FF] mb-2">Оффер не найден</h2>
          <Link href="/dashboard/offers" className="text-[#2979FF] hover:underline text-sm">
            Вернуться к каталогу
          </Link>
        </div>
      </div>
    )
  }

  const payout = getPayoutLabel(offer)
  const typeLabel = getOfferTypeLabel(offer.type)

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F0F4FF]">
      <nav className="border-b border-[#1A2744] bg-[#0A0A0F]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/dashboard/offers" className="flex items-center gap-2 text-[#8FA8C8] hover:text-white text-sm transition-colors">
            <ArrowLeft size={16} /> Каталог офферов
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl overflow-hidden">
          {/* Cover */}
          <div className="relative h-36 bg-gradient-to-br from-[#1A2744] via-[#0D1B2E] to-[#0A0A0F] overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-7xl opacity-10 select-none">
              {offer.categories?.icon ?? '📦'}
            </div>
            {offer.is_top && (
              <span className="absolute top-4 right-4 bg-[#FFB930] text-black text-xs font-bold px-3 py-1 rounded-full">ТОП</span>
            )}
            {offer.is_featured && !offer.is_top && (
              <span className="absolute top-4 right-4 bg-[#2979FF] text-white text-xs font-bold px-3 py-1 rounded-full">HOT</span>
            )}
          </div>

          <div className="p-6">
            <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs bg-[#2979FF]/15 text-[#2979FF] border border-[#2979FF]/25 px-2 py-0.5 rounded-full font-bold">
                    {typeLabel}
                  </span>
                  {offer.categories && (
                    <span className="text-xs text-[#8FA8C8]">{offer.categories.icon} {offer.categories.name}</span>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-[#F0F4FF] mt-2">{offer.title}</h1>
                <p className="text-[#8FA8C8] mt-1">{offer.description}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xs text-[#8FA8C8] mb-1">Выплата партнёру</div>
                <div className="text-[#2979FF] font-bold text-3xl">{payout}</div>
                <div className="text-xs text-[#8FA8C8] mt-1">{typeLabel}</div>
              </div>
            </div>

            {/* Key stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { icon: TrendingUp, label: 'Кликов', value: offer.clicks_count.toLocaleString('ru') },
                { icon: Users, label: 'Конверсий', value: offer.conversions_count.toLocaleString('ru') },
                { icon: Globe, label: 'CR', value: offer.cr_percent > 0 ? `${offer.cr_percent}%` : '—' },
                { icon: Clock, label: 'Cookie', value: `${offer.cookie_days} дней` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-[#1A2744] rounded-xl p-3 text-center">
                  <Icon size={16} className="text-[#2979FF] mx-auto mb-1.5" />
                  <div className="text-lg font-bold text-[#F0F4FF]">{value}</div>
                  <div className="text-xs text-[#8FA8C8]">{label}</div>
                </div>
              ))}
            </div>

            {/* Full description */}
            {offer.full_description && (
              <div className="mb-6 p-4 bg-[#1A2744]/40 rounded-xl border border-[#2979FF]/10">
                <h3 className="font-semibold text-[#F0F4FF] mb-2 text-sm">Об оффере</h3>
                <p className="text-[#8FA8C8] text-sm leading-relaxed">{offer.full_description}</p>
              </div>
            )}

            {/* Conditions grid */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-[#1A2744]/30 rounded-xl p-4 border border-[#1A2744]">
                <h3 className="font-semibold text-[#F0F4FF] mb-3 text-sm flex items-center gap-1.5">
                  <Shield size={14} className="text-[#2979FF]" /> Условия
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#8FA8C8]">Холд</span>
                    <span className="text-[#F0F4FF] font-medium">{offer.hold_days} дней</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8FA8C8]">Cookie</span>
                    <span className="text-[#F0F4FF] font-medium">{offer.cookie_days} дней</span>
                  </div>
                  {offer.allowed_geos.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[#8FA8C8]">Гео</span>
                      <span className="text-[#F0F4FF] font-medium">{offer.allowed_geos.join(', ')}</span>
                    </div>
                  )}
                  {offer.advertiser_name && (
                    <div className="flex justify-between">
                      <span className="text-[#8FA8C8]">Рекламодатель</span>
                      <span className="text-[#F0F4FF] font-medium">{offer.advertiser_name}</span>
                    </div>
                  )}
                </div>
              </div>

              {offer.allowed_traffic.length > 0 && (
                <div className="bg-[#1A2744]/30 rounded-xl p-4 border border-[#1A2744]">
                  <h3 className="font-semibold text-[#F0F4FF] mb-3 text-sm flex items-center gap-1.5">
                    <CheckCircle size={14} className="text-green-400" /> Разрешённый трафик
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {offer.allowed_traffic.map(t => (
                      <span key={t} className="text-xs bg-[#1A2744] text-[#C8DCFF] px-2.5 py-1 rounded-lg border border-[#2979FF]/10">{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tags */}
            {offer.tags.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {offer.tags.map(tag => (
                  <span key={tag} className="text-xs text-[#8FA8C8] bg-[#1A2744]/50 px-2.5 py-1 rounded-lg">#{tag}</span>
                ))}
              </div>
            )}

            {/* CTA */}
            <div className="flex gap-3 flex-wrap">
              <Link href={`/dashboard/offers?take=${offer.id}`}
                className="flex-1 min-w-[200px] bg-[#2979FF] hover:bg-[#1565C0] text-white font-bold py-3 rounded-xl text-center transition-all hover:shadow-lg hover:shadow-[#2979FF]/20">
                Получить реферальную ссылку
              </Link>
              <Link href="/dashboard/offers" className="px-6 py-3 bg-[#1A2744] border border-[#2979FF]/20 text-[#8FA8C8] rounded-xl hover:text-white hover:border-[#2979FF]/40 transition-all">
                Назад к каталогу
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
