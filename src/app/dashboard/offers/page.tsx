'use client'
import { useState } from 'react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { OfferCard } from '@/components/offers/OfferCard'
import {
  Search, Flame, Star, X, Copy, CheckCircle,
  ExternalLink, Link2, Loader2,
} from 'lucide-react'
import { Offer } from '@/types'
import { getPayoutLabel } from '@/lib/utils'

const mockOffers: Offer[] = [
  {
    id: '1', slug: 'drops-system', title: 'Drops — Пакет «Система»',
    description: 'Продавайте комплексный маркетинг. 15 000₽ за каждый заключённый договор.',
    full_description: null, category_id: 5, type: 'cpa', payout_amount: 15000,
    payout_percent: 0, currency: 'RUB', target_url: 'https://drops.agency',
    product_price: null, product_image: null, advertiser_name: 'Drops',
    logo_url: null, cover_url: null, tags: ['маркетинг', 'b2b'],
    allowed_geos: [], allowed_traffic: ['social','telegram'],
    clicks_count: 1247, conversions_count: 52, cr_percent: 4.2,
    status: 'active', is_featured: true, is_top: true,
    cookie_days: 60, hold_days: 14, created_at: '', updated_at: '',
    categories: { id: 5, slug: 'marketing', name: 'Маркетинг', icon: '📈', description: null, sort_order: 5 }
  },
  {
    id: '2', slug: 'bybit', title: 'Bybit — Крипто-биржа',
    description: 'До 30% RevShare навсегда. Один из лучших конвертов в крипте.',
    full_description: null, category_id: 2, type: 'revshare', payout_amount: 0,
    payout_percent: 30, currency: 'USDT', target_url: 'https://bybit.com',
    product_price: null, product_image: null, advertiser_name: 'Bybit',
    logo_url: null, cover_url: null, tags: ['крипта','биржа'],
    allowed_geos: [], allowed_traffic: ['social','youtube','blog'],
    clicks_count: 3412, conversions_count: 98, cr_percent: 2.9,
    status: 'active', is_featured: true, is_top: true,
    cookie_days: 365, hold_days: 30, created_at: '', updated_at: '',
    categories: { id: 2, slug: 'crypto', name: 'Крипто-биржи', icon: '₿', description: null, sort_order: 2 }
  },
  {
    id: '3', slug: 'nordvpn', title: 'NordVPN — Подписка',
    description: '40% с первой оплаты + 30% с продлений. Высокий CR, знаменитый бренд.',
    full_description: null, category_id: 3, type: 'cps', payout_amount: 1200,
    payout_percent: 0, currency: 'RUB', target_url: 'https://nordvpn.com',
    product_price: null, product_image: null, advertiser_name: 'NordVPN',
    logo_url: null, cover_url: null, tags: ['vpn','saas'],
    allowed_geos: [], allowed_traffic: ['social','context','seo'],
    clicks_count: 892, conversions_count: 31, cr_percent: 3.5,
    status: 'active', is_featured: false, is_top: false,
    cookie_days: 30, hold_days: 14, created_at: '', updated_at: '',
    categories: { id: 3, slug: 'software', name: 'SaaS / Сервисы', icon: '💻', description: null, sort_order: 3 }
  },
  {
    id: '4', slug: 'skillbox', title: 'Skillbox — Онлайн-курсы',
    description: '500₽ за каждую заявку. Широкая аудитория, простая конверсия.',
    full_description: null, category_id: 4, type: 'cpl', payout_amount: 500,
    payout_percent: 0, currency: 'RUB', target_url: 'https://skillbox.ru',
    product_price: null, product_image: null, advertiser_name: 'Skillbox',
    logo_url: null, cover_url: null, tags: ['образование','курсы'],
    allowed_geos: [], allowed_traffic: ['social','seo','email'],
    clicks_count: 654, conversions_count: 44, cr_percent: 6.7,
    status: 'active', is_featured: false, is_top: false,
    cookie_days: 30, hold_days: 14, created_at: '', updated_at: '',
    categories: { id: 4, slug: 'education', name: 'Онлайн-школы', icon: '🎓', description: null, sort_order: 4 }
  },
  {
    id: '5', slug: 'drops-landing', title: 'Drops — Лендинг под ключ',
    description: '3 000₽ за каждую оплаченную заявку. Продвигайте сайты для бизнеса.',
    full_description: null, category_id: 5, type: 'cpa', payout_amount: 3000,
    payout_percent: 0, currency: 'RUB', target_url: 'https://drops.agency',
    product_price: null, product_image: null, advertiser_name: 'Drops',
    logo_url: null, cover_url: null, tags: ['маркетинг','сайт'],
    allowed_geos: [], allowed_traffic: ['social','telegram','email'],
    clicks_count: 423, conversions_count: 18, cr_percent: 4.3,
    status: 'active', is_featured: false, is_top: false,
    cookie_days: 30, hold_days: 14, created_at: '', updated_at: '',
    categories: { id: 5, slug: 'marketing', name: 'Маркетинг', icon: '📈', description: null, sort_order: 5 }
  },
  {
    id: '6', slug: 'factory-pipes', title: 'ТрубМастер — Трубы оптом',
    description: 'Дропшиппинг. Находите покупателей на трубы — мы отгружаем, вы получаете % с продажи.',
    full_description: null, category_id: 1, type: 'dropship', payout_amount: 0,
    payout_percent: 8, currency: 'RUB', target_url: '#',
    product_price: 45000, product_image: null, advertiser_name: 'ТрубМастер',
    logo_url: null, cover_url: null, tags: ['производство','b2b','строительство'],
    allowed_geos: ['RU'], allowed_traffic: ['avito','context','b2b'],
    clicks_count: 187, conversions_count: 9, cr_percent: 4.8,
    status: 'active', is_featured: false, is_top: false,
    cookie_days: 90, hold_days: 30, created_at: '', updated_at: '',
    categories: { id: 1, slug: 'ecom', name: 'Товары / Дропшиппинг', icon: '📦', description: null, sort_order: 1 }
  },
]

const categories = [
  { id: 0, slug: 'all', name: 'Все', icon: '🔥' },
  { id: 1, slug: 'ecom', name: 'Товары', icon: '📦' },
  { id: 2, slug: 'crypto', name: 'Крипта', icon: '₿' },
  { id: 3, slug: 'software', name: 'SaaS', icon: '💻' },
  { id: 4, slug: 'education', name: 'Обучение', icon: '🎓' },
  { id: 5, slug: 'marketing', name: 'Маркетинг', icon: '📈' },
]
const offerTypes = ['Все', 'CPA', 'CPL', 'CPS', 'RevShare', 'Дропшиппинг']

// ── Get Link Modal ──────────────────────────────────────────────────

function GetLinkModal({ offer, onClose }: { offer: Offer; onClose: () => void }) {
  const [loading, setLoading] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const generateLink = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/offers/${offer.id}/take`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Ошибка создания ссылки')
        return
      }
      setLinkUrl(data.url)
    } catch {
      setError('Ошибка соединения')
    } finally {
      setLoading(false)
    }
  }

  const copy = () => {
    navigator.clipboard.writeText(linkUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-6 shadow-2xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-bold text-[#F0F4FF] text-base">Получить ссылку</h3>
            <p className="text-[#8FA8C8] text-sm mt-0.5">{offer.title}</p>
          </div>
          <button onClick={onClose} className="text-[#8FA8C8] hover:text-white transition-colors">
            <X size={20}/>
          </button>
        </div>

        {/* Offer info */}
        <div className="bg-[#1A2744] rounded-xl p-3 mb-5 flex justify-between items-center">
          <div>
            <div className="text-[10px] text-[#8FA8C8] uppercase tracking-wide mb-0.5">Выплата</div>
            <div className="text-[#2979FF] font-bold">{getPayoutLabel(offer)}</div>
          </div>
          <div>
            <div className="text-[10px] text-[#8FA8C8] uppercase tracking-wide mb-0.5">Холд</div>
            <div className="text-[#F0F4FF] font-semibold text-sm">{offer.hold_days} дн.</div>
          </div>
          <div>
            <div className="text-[10px] text-[#8FA8C8] uppercase tracking-wide mb-0.5">Куки</div>
            <div className="text-[#F0F4FF] font-semibold text-sm">{offer.cookie_days} дн.</div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Link result */}
        {linkUrl ? (
          <div className="space-y-3">
            <div className="bg-[#1A2744]/70 rounded-xl p-3">
              <div className="text-[10px] text-[#8FA8C8] mb-1.5 uppercase tracking-wide flex items-center gap-1">
                <Link2 size={10}/> Ваша реферальная ссылка
              </div>
              <code className="text-xs text-[#C8DCFF] break-all font-mono">{linkUrl}</code>
            </div>
            <div className="flex gap-2">
              <button
                onClick={copy}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  copied
                    ? 'bg-green-600 text-white'
                    : 'bg-[#2979FF] hover:bg-[#1565C0] text-white'
                }`}
              >
                {copied ? <CheckCircle size={16}/> : <Copy size={16}/>}
                {copied ? 'Скопировано!' : 'Скопировать'}
              </button>
              <a
                href={linkUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 flex items-center gap-1.5 bg-[#1A2744] hover:bg-[#243560] rounded-xl text-sm text-[#8FA8C8] hover:text-white transition-all"
              >
                <ExternalLink size={14}/>
              </a>
            </div>
            <a
              href="/dashboard/referrals"
              className="block text-center text-xs text-[#2979FF] hover:underline"
            >
              Перейти к моим ссылкам →
            </a>
          </div>
        ) : (
          <button
            onClick={generateLink}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#2979FF] hover:bg-[#1565C0] disabled:opacity-60 text-white font-semibold rounded-xl transition-all"
          >
            {loading ? <Loader2 size={16} className="animate-spin"/> : <Link2 size={16}/>}
            {loading ? 'Создаём ссылку...' : 'Создать реферальную ссылку'}
          </button>
        )}
      </div>
    </div>
  )
}

// ── Page ────────────────────────────────────────────────────────────

export default function OffersPage() {
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState(0)
  const [typeFilter, setTypeFilter] = useState('Все')
  const [sort, setSort] = useState<'top' | 'new' | 'payout' | 'cr'>('top')
  const [activeOffer, setActiveOffer] = useState<Offer | null>(null)

  const typeMap: Record<string, string> = {
    'CPA': 'cpa', 'CPL': 'cpl', 'CPS': 'cps', 'RevShare': 'revshare', 'Дропшиппинг': 'dropship',
  }

  const filtered = mockOffers
    .filter(o => {
      const matchSearch = !search || o.title.toLowerCase().includes(search.toLowerCase()) || (o.description ?? '').toLowerCase().includes(search.toLowerCase())
      const matchCat = catFilter === 0 || o.category_id === catFilter
      const matchType = typeFilter === 'Все' || o.type === typeMap[typeFilter]
      return matchSearch && matchCat && matchType
    })
    .sort((a, b) => {
      if (sort === 'payout') return (b.payout_amount || b.payout_percent) - (a.payout_amount || a.payout_percent)
      if (sort === 'cr') return b.cr_percent - a.cr_percent
      if (sort === 'new') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      // top: is_top first, then clicks
      if (a.is_top !== b.is_top) return (b.is_top ? 1 : 0) - (a.is_top ? 1 : 0)
      return b.clicks_count - a.clicks_count
    })

  return (
    <DashboardShell title="Каталог офферов">
      {activeOffer && (
        <GetLinkModal offer={activeOffer} onClose={() => setActiveOffer(null)} />
      )}

      {/* Filters */}
      <div className="mb-5 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 bg-[#0D1B2E] border border-[#1A2744] rounded-xl px-3 py-2 flex-1">
            <Search size={16} className="text-[#8FA8C8] shrink-0"/>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск офферов..."
              className="bg-transparent text-sm text-[#F0F4FF] placeholder-[#8FA8C8] outline-none flex-1"
            />
          </div>
          <select
            value={sort}
            onChange={e => setSort(e.target.value as any)}
            className="bg-[#0D1B2E] border border-[#1A2744] rounded-xl px-3 py-2 text-sm text-[#F0F4FF] outline-none cursor-pointer"
          >
            <option value="top">Топ офферы</option>
            <option value="new">Новые</option>
            <option value="payout">По выплате</option>
            <option value="cr">По CR</option>
          </select>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 flex-wrap">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setCatFilter(c.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                catFilter === c.id
                  ? 'bg-[#2979FF] text-white'
                  : 'bg-[#0D1B2E] border border-[#1A2744] text-[#8FA8C8] hover:border-[#2979FF]/40 hover:text-[#F0F4FF]'
              }`}
            >
              <span>{c.icon}</span> {c.name}
            </button>
          ))}
        </div>

        {/* Type pills */}
        <div className="flex gap-2 flex-wrap">
          {offerTypes.map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1 rounded-lg text-xs transition-all ${
                typeFilter === t
                  ? 'bg-[#1A2744] border border-[#2979FF] text-[#2979FF]'
                  : 'bg-transparent text-[#8FA8C8] hover:text-[#F0F4FF]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Hot offers */}
      {catFilter === 0 && !search && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Flame size={16} className="text-[#FFB930]"/>
            <h3 className="text-sm font-semibold text-[#F0F4FF]">Горячие офферы</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {mockOffers.filter(o => o.is_top).map(o => (
              <OfferCard key={o.id} offer={o} onGetLink={setActiveOffer}/>
            ))}
          </div>
        </div>
      )}

      {/* All offers */}
      <div className="flex items-center gap-2 mb-3">
        <Star size={16} className="text-[#8FA8C8]"/>
        <h3 className="text-sm font-semibold text-[#F0F4FF]">
          {catFilter === 0 && !search ? 'Все офферы' : `Результаты (${filtered.length})`}
        </h3>
      </div>

      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map(o => (
            <OfferCard key={o.id} offer={o} onGetLink={setActiveOffer}/>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-[#8FA8C8]">
          <div className="text-4xl mb-3">🔍</div>
          <div className="text-sm">Ничего не найдено. Попробуйте другие фильтры.</div>
        </div>
      )}
    </DashboardShell>
  )
}
