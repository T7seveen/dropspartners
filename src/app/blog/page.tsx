'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Clock, Eye, ArrowRight, BookOpen } from 'lucide-react'
import { formatDate } from '@/lib/utils'

// ── Articles catalogue ────────────────────────────────────────────────────────
const ARTICLES = [
  {
    id: '1',
    slug: 'kak-zarabotat-na-kripto-trafike',
    title: 'Как заработать на крипто-трафике в 2024',
    excerpt: 'Полный разбор: какие офферы дают лучшую конверсию, как настроить трекинг и где брать качественный трафик под крипто-нишу.',
    category: 'tutorial',
    catLabel: 'Обучение',
    catColor: 'bg-blue-500/15 text-blue-400',
    views: 1842,
    readMin: 8,
    date: '2024-01-20',
    image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&h=400&fit=crop',
    featured: true,
  },
  {
    id: '2',
    slug: 'top-10-offerov-yanvarya',
    title: 'Топ-10 офферов января: разбираем условия',
    excerpt: 'Сравниваем ставки, CR и условия холда у самых выгодных офферов месяца. Спойлер: один оффер даёт CR 6.8%.',
    category: 'promo',
    catLabel: 'Акция',
    catColor: 'bg-amber-500/15 text-amber-400',
    views: 967,
    readMin: 5,
    date: '2024-01-15',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop',
  },
  {
    id: '3',
    slug: 'dropshipping-ot-proizvoditelya',
    title: 'Дропшиппинг от производителя: как это работает у нас',
    excerpt: 'Подробный кейс: партнёр запустил дроп-магазин с нуля, вышел на 120 000 ₽/мес за 45 дней. Детальный разбор стратегии.',
    category: 'case',
    catLabel: 'Кейс',
    catColor: 'bg-green-500/15 text-green-400',
    views: 534,
    readMin: 12,
    date: '2024-01-10',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=400&fit=crop',
  },
  {
    id: '4',
    slug: 'seo-strategii-dlya-affiliatov',
    title: 'SEO-стратегии для аффилиатов: что работает сейчас',
    excerpt: 'Как получать органический трафик из Яндекса и Google на партнёрские офферы без серых методов. Только белые схемы.',
    category: 'tutorial',
    catLabel: 'Обучение',
    catColor: 'bg-blue-500/15 text-blue-400',
    views: 712,
    readMin: 10,
    date: '2024-01-08',
    image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800&h=400&fit=crop',
  },
  {
    id: '5',
    slug: 'telegram-kanal-dlya-arbitrazha',
    title: 'Как монетизировать Telegram-канал через партнёрки',
    excerpt: 'Схемы нативной интеграции, ботов и воронок продаж для Telegram. Реальные цифры с каналов в нашей сети.',
    category: 'tutorial',
    catLabel: 'Обучение',
    catColor: 'bg-blue-500/15 text-blue-400',
    views: 1103,
    readMin: 7,
    date: '2024-01-05',
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&h=400&fit=crop',
  },
  {
    id: '6',
    slug: 'novye-offery-fevralya',
    title: 'Новые офферы февраля — анонс',
    excerpt: 'Анонс шести новых офферов: SaaS, образование, нутра. Открываем ранний доступ для партнёров с рейтингом 4+.',
    category: 'news',
    catLabel: 'Новость',
    catColor: 'bg-purple-500/15 text-purple-400',
    views: 0,
    readMin: 3,
    date: '2024-01-25',
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop',
    draft: true,
  },
]

const CATS = ['Все', 'Обучение', 'Акция', 'Кейс', 'Новость']

export default function BlogPage() {
  const [category, setCategory] = useState('Все')
  const published = ARTICLES.filter(a => !a.draft)
  const filtered = category === 'Все' ? published : published.filter(a => a.catLabel === category)
  const featured = published.find(a => a.featured)

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      {/* Nav */}
      <nav className="border-b border-[#1A2744] bg-[#0D1B2E] sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="relative w-7 h-7">
              <div className="absolute inset-0 rounded-full bg-[#2979FF]" />
              <div className="absolute inset-[30%] rounded-full bg-[#0D1B2E]" />
              <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#00D4FF]" />
            </div>
            <div>
              <span className="font-bold text-[#F0F4FF] text-sm">DROPS</span>
              <span className="text-[#2979FF] text-[10px] font-semibold ml-1">PARTNERS</span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <BookOpen size={14} className="text-[#8FA8C8]" />
            <span className="text-sm text-[#8FA8C8] font-medium">Блог</span>
            <Link href="/dashboard" className="text-xs text-[#2979FF] hover:underline ml-2">← Кабинет</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#F0F4FF] mb-2">Блог Drops Partners</h1>
          <p className="text-[#8FA8C8]">Кейсы, обучение и новости партнёрской программы</p>
        </div>

        {/* Featured article */}
        {featured && category === 'Все' && (
          <Link href={`/blog/${featured.slug}`} className="block mb-8 bg-[#0D1B2E] border border-[#2979FF]/20 rounded-2xl overflow-hidden hover:border-[#2979FF]/40 transition-all group">
            <div className="sm:flex">
              <div className="sm:w-2/5 h-48 sm:h-auto overflow-hidden">
                <img src={featured.image} alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] bg-[#2979FF]/20 text-[#2979FF] font-bold px-2 py-0.5 rounded">FEATURED</span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${featured.catColor}`}>{featured.catLabel}</span>
                  </div>
                  <h2 className="text-lg font-bold text-[#F0F4FF] mb-2">{featured.title}</h2>
                  <p className="text-[#8FA8C8] text-sm leading-relaxed">{featured.excerpt}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-4 text-[11px] text-[#8FA8C8]">
                    <span className="flex items-center gap-1"><Eye size={11}/> {featured.views.toLocaleString('ru')}</span>
                    <span className="flex items-center gap-1"><Clock size={11}/> {featured.readMin} мин</span>
                    <span>{formatDate(featured.date)}</span>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-[#2979FF] font-medium group-hover:gap-2 transition-all">
                    Читать <ArrowRight size={13}/>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Category filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {CATS.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
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

        {/* Articles grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.filter(a => !a.featured || category !== 'Все').map(article => (
            <Link key={article.id} href={`/blog/${article.slug}`} className="block bg-[#0D1B2E] border border-[#1A2744] rounded-2xl overflow-hidden hover:border-[#2979FF]/30 transition-all group">
              <div className="h-40 overflow-hidden">
                <img src={article.image} alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${article.catColor}`}>
                    {article.catLabel}
                  </span>
                </div>
                <h3 className="font-semibold text-[#F0F4FF] text-sm mb-2 line-clamp-2 leading-snug">
                  {article.title}
                </h3>
                <p className="text-[#8FA8C8] text-xs leading-relaxed line-clamp-3 mb-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between text-[10px] text-[#8FA8C8]">
                  <div className="flex items-center gap-3">
                    {article.views > 0 && (
                      <span className="flex items-center gap-0.5"><Eye size={10}/> {article.views.toLocaleString('ru')}</span>
                    )}
                    <span className="flex items-center gap-0.5"><Clock size={10}/> {article.readMin} мин</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#2979FF] font-medium">
                    Читать <ArrowRight size={10}/>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <div className="text-4xl mb-3">📭</div>
            <div className="text-sm text-[#8FA8C8]">Статей в этой категории пока нет</div>
          </div>
        )}
      </div>
    </div>
  )
}
