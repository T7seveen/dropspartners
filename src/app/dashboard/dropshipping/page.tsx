'use client'
import { useState } from 'react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { Search, ShoppingBag, Copy, CheckCircle, TrendingUp, Package, Star, Tag } from 'lucide-react'

// ── Product catalogue ────────────────────────────────────────────────────────
interface DropProduct {
  id: string
  name: string
  description: string
  category: string
  image: string
  drop_price: number      // закупочная цена (для партнёра)
  retail_price: number    // рекомендованная розничная цена
  commission: number      // % комиссии партнёру
  stock: number           // остаток на складе
  rating: number
  orders: number
  hot?: boolean
}

const PRODUCTS: DropProduct[] = [
  {
    id: 'tws-earbuds',
    name: 'Беспроводные наушники TWS Pro',
    description: 'Активное шумоподавление, 30 ч автономности, кейс с беспроводной зарядкой. Совместимы с iOS и Android.',
    category: 'Электроника',
    image: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=400&h=300&fit=crop',
    drop_price: 890,
    retail_price: 3490,
    commission: 15,
    stock: 248,
    rating: 4.7,
    orders: 1204,
    hot: true,
  },
  {
    id: 'humidifier',
    name: 'Ультразвуковой увлажнитель воздуха',
    description: '4L резервуар, работа до 20 ч, ночник, тихий режим <25дБ. Идеален для офиса и детской комнаты.',
    category: 'Дом и уют',
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop',
    drop_price: 1200,
    retail_price: 3990,
    commission: 18,
    stock: 143,
    rating: 4.5,
    orders: 876,
    hot: true,
  },
  {
    id: 'smartwatch',
    name: 'Смарт-часы FitPro X5',
    description: 'AMOLED экран 1.9", пульсоксиметр, 100+ режимов спорта, GPS, 7 дней работы. IP68 водозащита.',
    category: 'Электроника',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=300&fit=crop',
    drop_price: 1450,
    retail_price: 5490,
    commission: 20,
    stock: 89,
    rating: 4.8,
    orders: 2341,
    hot: true,
  },
  {
    id: 'led-strip',
    name: 'RGB LED-лента 10м с пультом',
    description: 'SMD 5050, 60 диодов/метр, пульт + приложение, синхронизация с музыкой. Легкий монтаж, самоклейка.',
    category: 'Дом и уют',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    drop_price: 480,
    retail_price: 1790,
    commission: 22,
    stock: 512,
    rating: 4.6,
    orders: 3128,
  },
  {
    id: 'thermos',
    name: 'Термос Steel Pro 500мл',
    description: 'Нержавеющая сталь 304, двойные стенки, удержание тепла 24 ч / холода 48 ч. Не протекает.',
    category: 'Спорт и активность',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop',
    drop_price: 680,
    retail_price: 2190,
    commission: 18,
    stock: 377,
    rating: 4.9,
    orders: 4510,
  },
  {
    id: 'phone-case',
    name: 'MagSafe-чехол iPhone 15/14/13',
    description: 'Матовый поликарбонат + TPU рамка, встроенный магнит MagSafe, защита камеры, 5 цветов.',
    category: 'Аксессуары',
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=300&fit=crop',
    drop_price: 150,
    retail_price: 690,
    commission: 25,
    stock: 840,
    rating: 4.4,
    orders: 6720,
  },
  {
    id: 'desk-lamp',
    name: 'LED-лампа для рабочего стола',
    description: 'Регулировка яркости 5 уровней, 3 цветовых режима, USB-порт для зарядки, гибкая ножка. Eye-care.',
    category: 'Дом и уют',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop',
    drop_price: 920,
    retail_price: 2890,
    commission: 17,
    stock: 204,
    rating: 4.6,
    orders: 1893,
  },
  {
    id: 'massage-gun',
    name: 'Массажный пистолет RecoveryPro',
    description: '6 насадок, 5 скоростей 1200-3200 RPM, 3000 мАч, шум <45дБ. Для восстановления мышц после тренировок.',
    category: 'Спорт и активность',
    image: 'https://images.unsplash.com/photo-1616279969862-12f5bbec11e3?w=400&h=300&fit=crop',
    drop_price: 2100,
    retail_price: 6990,
    commission: 19,
    stock: 67,
    rating: 4.8,
    orders: 987,
    hot: true,
  },
]

const CATEGORIES = ['Все', 'Электроника', 'Дом и уют', 'Спорт и активность', 'Аксессуары']

function formatPrice(n: number) {
  return n.toLocaleString('ru') + ' ₽'
}

function CopyLinkButton({ productId }: { productId: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const origin = window.location.origin
    // In real implementation this calls /api/offers/[id]/take and returns a referral link
    const mockUrl = `${origin}/ref/dp_${productId.slice(0, 8)}`
    await navigator.clipboard.writeText(mockUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#2979FF] hover:bg-[#1565C0] text-white text-xs font-semibold rounded-xl transition-colors"
    >
      {copied ? <CheckCircle size={13} /> : <Copy size={13} />}
      {copied ? 'Скопировано!' : 'Получить ссылку'}
    </button>
  )
}

export default function DropshippingPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Все')
  const [sort, setSort] = useState<'popular' | 'margin' | 'price'>('popular')

  const filtered = PRODUCTS
    .filter(p => category === 'Все' || p.category === category)
    .filter(p =>
      !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === 'popular') return b.orders - a.orders
      if (sort === 'margin') return (b.retail_price - b.drop_price) / b.retail_price - (a.retail_price - a.drop_price) / a.retail_price
      return a.drop_price - b.drop_price
    })

  const totalProducts = PRODUCTS.length
  const avgMargin = Math.round(PRODUCTS.reduce((s, p) => s + (p.retail_price - p.drop_price) / p.retail_price * 100, 0) / PRODUCTS.length)

  return (
    <DashboardShell title="Дропшиппинг" role="partner">
      {/* Header stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Package size={14} className="text-[#2979FF]" />
            <span className="text-xs text-[#8FA8C8]">Товаров в каталоге</span>
          </div>
          <div className="text-xl font-bold text-[#F0F4FF]">{totalProducts}</div>
          <div className="text-[10px] text-[#8FA8C8] mt-0.5">Обновляется еженедельно</div>
        </div>
        <div className="bg-[#0D1B2E] border border-green-500/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={14} className="text-green-400" />
            <span className="text-xs text-[#8FA8C8]">Средняя маржа</span>
          </div>
          <div className="text-xl font-bold text-green-400">{avgMargin}%</div>
          <div className="text-[10px] text-[#8FA8C8] mt-0.5">Ваша чистая прибыль</div>
        </div>
        <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <ShoppingBag size={14} className="text-amber-400" />
            <span className="text-xs text-[#8FA8C8]">Как это работает</span>
          </div>
          <div className="text-xs text-[#8FA8C8] leading-relaxed">
            Продаёте по РРЦ → мы отгружаем → вы получаете разницу
          </div>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8FA8C8]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск товаров..."
            className="w-full bg-[#0D1B2E] border border-[#1A2744] rounded-xl pl-9 pr-3 py-2.5 text-sm text-[#F0F4FF] placeholder-[#8FA8C8] outline-none focus:border-[#2979FF]"
          />
        </div>
        <select
          value={sort}
          onChange={e => setSort(e.target.value as any)}
          className="bg-[#0D1B2E] border border-[#1A2744] rounded-xl px-3 py-2.5 text-sm text-[#F0F4FF] outline-none cursor-pointer"
        >
          <option value="popular">По популярности</option>
          <option value="margin">По марже</option>
          <option value="price">По цене</option>
        </select>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              category === cat
                ? 'bg-[#2979FF] text-white'
                : 'bg-[#0D1B2E] border border-[#1A2744] text-[#8FA8C8] hover:border-[#2979FF]/40 hover:text-[#F0F4FF]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(product => {
          const margin = product.retail_price - product.drop_price
          const marginPct = Math.round(margin / product.retail_price * 100)

          return (
            <div key={product.id} className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl overflow-hidden hover:border-[#2979FF]/30 transition-all group">
              {/* Image */}
              <div className="relative overflow-hidden h-44">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={e => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" fill="%231A2744"><rect width="400" height="300"/><text x="50%" y="50%" text-anchor="middle" fill="%238FA8C8" font-size="14">Фото</text></svg>' }}
                />
                {/* Badges */}
                <div className="absolute top-2 left-2 flex gap-1">
                  {product.hot && (
                    <span className="bg-amber-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded">ХИТ</span>
                  )}
                  <span className="bg-[#0A0A0F]/80 backdrop-blur text-[#8FA8C8] text-[10px] px-1.5 py-0.5 rounded">
                    {product.category}
                  </span>
                </div>
                {/* Margin badge */}
                <div className="absolute top-2 right-2">
                  <span className="bg-green-500/90 backdrop-blur text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    +{marginPct}% маржа
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-[#F0F4FF] text-sm mb-1 line-clamp-2 leading-snug">
                  {product.name}
                </h3>
                <p className="text-[#8FA8C8] text-[11px] mb-3 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>

                {/* Pricing */}
                <div className="bg-[#0A0A0F] rounded-xl p-3 mb-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#8FA8C8] flex items-center gap-1">
                      <Tag size={9}/> Закупочная цена
                    </span>
                    <span className="text-sm font-bold text-[#2979FF]">{formatPrice(product.drop_price)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#8FA8C8]">РРЦ (розничная)</span>
                    <span className="text-sm font-bold text-green-400">{formatPrice(product.retail_price)}</span>
                  </div>
                  <div className="pt-1 border-t border-[#1A2744] flex items-center justify-between">
                    <span className="text-[10px] text-[#8FA8C8]">Ваша прибыль</span>
                    <span className="text-sm font-bold text-amber-400">{formatPrice(margin)}</span>
                  </div>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-3 text-[10px] text-[#8FA8C8] mb-3">
                  <span className="flex items-center gap-0.5">
                    <Star size={10} className="text-amber-400 fill-amber-400" /> {product.rating}
                  </span>
                  <span>{product.orders.toLocaleString('ru')} заказов</span>
                  <span className={product.stock > 100 ? 'text-green-400' : product.stock > 20 ? 'text-amber-400' : 'text-red-400'}>
                    {product.stock > 100 ? '✓ В наличии' : product.stock > 20 ? `${product.stock} шт.` : `⚠ ${product.stock} шт.`}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <CopyLinkButton productId={product.id} />
                  <button className="px-3 py-2 border border-[#1A2744] hover:border-[#2979FF]/40 text-[#8FA8C8] hover:text-[#F0F4FF] text-xs rounded-xl transition-colors whitespace-nowrap">
                    Подробнее
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <div className="text-sm text-[#8FA8C8]">Товары не найдены. Попробуйте изменить запрос.</div>
        </div>
      )}

      {/* Info block */}
      <div className="mt-6 p-5 bg-[#0D1B2E] border border-[#1A2744] rounded-2xl">
        <h3 className="font-semibold text-[#F0F4FF] text-sm mb-2">Как работает дропшиппинг с Drops?</h3>
        <div className="grid sm:grid-cols-3 gap-4 text-xs text-[#8FA8C8]">
          <div className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-[#2979FF]/20 text-[#2979FF] font-bold text-xs flex items-center justify-center flex-shrink-0">1</span>
            <span>Получите реферальную ссылку на товар и разместите его в своём магазине / соцсети по РРЦ</span>
          </div>
          <div className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-[#2979FF]/20 text-[#2979FF] font-bold text-xs flex items-center justify-center flex-shrink-0">2</span>
            <span>Покупатель делает заказ. Вы принимаете оплату. Передаёте нам закупочную цену и данные доставки</span>
          </div>
          <div className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-[#2979FF]/20 text-[#2979FF] font-bold text-xs flex items-center justify-center flex-shrink-0">3</span>
            <span>Мы отгружаем товар от вашего имени. Разница между РРЦ и закупочной — ваша прибыль</span>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
