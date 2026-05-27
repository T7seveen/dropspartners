import Link from 'next/link'
import { Check, ArrowRight, TrendingUp, MessageSquare, BarChart3, Zap, Brain, Target, Globe, ChevronLeft } from 'lucide-react'

const products = [
  {
    id: 'trend-watcher',
    name: 'Trend Watcher',
    tagline: 'AI-мониторинг трендов для маркетологов',
    description: 'Находит вирусные продукты и ниши до того, как они достигнут пика. Анализирует данные из TikTok, Instagram, Telegram, Wildberries и Google Trends в реальном времени.',
    price: '990',
    period: 'мес',
    badge: 'Популярный',
    badgeColor: 'bg-[#FFB930]/15 text-[#FFB930] border-[#FFB930]/25',
    icon: TrendingUp,
    iconColor: 'text-[#FFB930]',
    iconBg: 'bg-[#FFB930]/10',
    accentColor: 'border-[#FFB930]/20',
    features: [
      'Мониторинг 15+ платформ одновременно',
      'AI-прогноз роста тренда на 2–4 недели',
      'Еженедельный отчёт с топ-20 нишами',
      'Уведомления о новых трендах в Telegram',
      'История трендов за 12 месяцев',
      'Экспорт данных в Excel и Google Sheets',
    ],
    screenshotBg: 'from-[#FFB930]/5 to-[#FF6B35]/5',
    screenshotBorder: 'border-[#FFB930]/15',
  },
  {
    id: 'drops-ai-chat',
    name: 'Drops AI Chat',
    tagline: 'AI-ассистент для маркетинга и копирайтинга',
    description: 'Создаёт рекламные креативы, тексты для лендингов, посты в Telegram и сценарии для видео за секунды. Обучен на лучших маркетинговых материалах.',
    price: '1 490',
    period: 'мес',
    badge: 'Новинка',
    badgeColor: 'bg-[#2979FF]/15 text-[#2979FF] border-[#2979FF]/25',
    icon: Brain,
    iconColor: 'text-[#2979FF]',
    iconBg: 'bg-[#2979FF]/10',
    accentColor: 'border-[#2979FF]/30',
    features: [
      'Генерация рекламных текстов и крео',
      'Шаблоны для Telegram, Instagram, TikTok',
      'AI-копирайтинг лендингов и писем',
      'Адаптация контента под любую нишу',
      'История диалогов и сохранение шаблонов',
      'API-доступ для интеграции в свои проекты',
    ],
    screenshotBg: 'from-[#2979FF]/5 to-[#00D4FF]/5',
    screenshotBorder: 'border-[#2979FF]/15',
  },
  {
    id: 'analytics-pro',
    name: 'Traffic Analytics Pro',
    tagline: 'Глубокая UTM-аналитика и трекинг трафика',
    description: 'Единый дашборд для отслеживания всех источников трафика. Связывает UTM-метки с конверсиями и показывает реальный ROI по каждому каналу.',
    price: '490',
    period: 'мес',
    badge: null,
    badgeColor: '',
    icon: BarChart3,
    iconColor: 'text-[#00D4FF]',
    iconBg: 'bg-[#00D4FF]/10',
    accentColor: 'border-[#1A2744]',
    features: [
      'UTM-трекинг по 6 параметрам',
      'Воронки конверсий по источникам',
      'Сравнение периодов в один клик',
      'Гео- и устройственная аналитика',
      'Интеграция с Яндекс.Метрикой и GA4',
      'Автоматические отчёты по расписанию',
    ],
    screenshotBg: 'from-[#00D4FF]/5 to-[#2979FF]/5',
    screenshotBorder: 'border-[#00D4FF]/15',
  },
]

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F0F4FF]">
      {/* Nav */}
      <nav className="border-b border-[#1A2744] bg-[#0A0A0F]/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative w-7 h-7 flex-shrink-0">
              <div className="absolute inset-0 rounded-full bg-[#2979FF]" />
              <div className="absolute inset-[28%] rounded-full bg-[#0A0A0F]" />
              <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#00D4FF]" />
            </div>
            <span className="font-bold text-sm tracking-wide">DROPS</span>
            <span className="text-[#2979FF] text-xs font-semibold tracking-widest">PARTNERS</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-[#8FA8C8]">
            <Link href="/" className="hover:text-white transition-colors">Главная</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Блог</Link>
            <Link href="/auth/register" className="hover:text-white transition-colors">Офферы</Link>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="text-sm text-[#8FA8C8] hover:text-white flex items-center gap-1 transition-colors">
              <ChevronLeft size={15} /> Назад
            </Link>
            <Link href="/auth/register" className="bg-[#2979FF] hover:bg-[#1565C0] text-white text-sm font-semibold px-4 py-1.5 rounded-xl transition-colors">
              Стать партнёром
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#2979FF] opacity-[0.04] rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 pt-16 pb-12 text-center relative">
          <div className="inline-flex items-center gap-2 bg-[#2979FF]/10 border border-[#2979FF]/20 rounded-full px-4 py-1.5 text-sm text-[#2979FF] font-medium mb-6">
            <Zap size={13} />
            Собственные SaaS-продукты
          </div>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
            Наши продукты
          </h1>
          <p className="text-[#8FA8C8] text-lg max-w-2xl mx-auto leading-relaxed">
            Инструменты, которые мы создаём сами — и которые вы можете продвигать.<br />
            Продвигайте реальные продукты с реальными пользователями и получайте стабильный доход.
          </p>

          {/* Partner benefit highlight */}
          <div className="mt-8 inline-flex items-center gap-6 bg-[#0D1B2E] border border-[#1A2744] rounded-2xl px-6 py-4">
            {[
              { label: 'Комиссия партнёра', value: 'до 30%' },
              { label: 'Выплата', value: 'каждый месяц' },
              { label: 'Cookie', value: '365 дней' },
            ].map(item => (
              <div key={item.label} className="text-center">
                <div className="text-lg font-bold text-[#2979FF]">{item.value}</div>
                <div className="text-xs text-[#8FA8C8]">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-4 space-y-8">
          {products.map((product, idx) => {
            const Icon = product.icon
            return (
              <div
                key={product.id}
                className={`bg-[#0D1B2E] border ${product.accentColor} rounded-2xl overflow-hidden`}
              >
                <div className={`grid md:grid-cols-2 gap-0 ${idx % 2 === 1 ? 'md:grid-flow-dense' : ''}`}>
                  {/* Info */}
                  <div className={`p-8 flex flex-col justify-between ${idx % 2 === 1 ? 'md:col-start-2' : ''}`}>
                    <div>
                      {product.badge && (
                        <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border mb-4 ${product.badgeColor}`}>
                          {product.badge}
                        </span>
                      )}
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-xl ${product.iconBg} flex items-center justify-center`}>
                          <Icon size={20} className={product.iconColor} />
                        </div>
                        <h2 className="text-xl font-bold text-[#F0F4FF]">{product.name}</h2>
                      </div>
                      <p className="text-[#8FA8C8] text-sm leading-relaxed mb-4">{product.description}</p>

                      <ul className="space-y-2 mb-6">
                        {product.features.map(feat => (
                          <li key={feat} className="flex items-start gap-2.5 text-sm">
                            <Check size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
                            <span className="text-[#C8DCFF]">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Price + CTAs */}
                    <div>
                      <div className="flex items-baseline gap-1 mb-5">
                        <span className="text-3xl font-bold text-[#F0F4FF]">{product.price} ₽</span>
                        <span className="text-[#8FA8C8] text-sm">/{product.period}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                          href={`/auth/register`}
                          className="flex-1 flex items-center justify-center gap-2 bg-[#2979FF] hover:bg-[#1565C0] text-white font-semibold py-3 px-5 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-[#2979FF]/20"
                        >
                          Попробовать бесплатно <ArrowRight size={15} />
                        </Link>
                        <Link
                          href={`/auth/register?ref=product`}
                          className="flex-1 flex items-center justify-center gap-2 bg-[#1A2744] hover:bg-[#243560] border border-[#2979FF]/20 text-[#F0F4FF] font-medium py-3 px-5 rounded-xl text-sm transition-all"
                        >
                          Стать партнёром
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Screenshot placeholder */}
                  <div className={`${idx % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''} relative`}>
                    <div className={`h-64 md:h-full min-h-[280px] bg-gradient-to-br ${product.screenshotBg} border-t md:border-t-0 ${idx % 2 === 0 ? 'md:border-l' : 'md:border-r'} ${product.screenshotBorder} flex flex-col items-center justify-center p-8`}>
                      <div className="w-full max-w-xs">
                        {/* Mock UI */}
                        <div className="bg-[#0A0A0F]/80 border border-[#1A2744] rounded-xl p-4 mb-3">
                          <div className="flex items-center gap-2 mb-3">
                            <div className={`w-6 h-6 rounded-lg ${product.iconBg} flex items-center justify-center`}>
                              <Icon size={13} className={product.iconColor} />
                            </div>
                            <div className="h-2.5 bg-[#1A2744] rounded w-24" />
                          </div>
                          <div className="space-y-2">
                            <div className="h-2 bg-[#1A2744] rounded w-full" />
                            <div className="h-2 bg-[#1A2744] rounded w-3/4" />
                            <div className="h-2 bg-[#1A2744] rounded w-5/6" />
                          </div>
                          <div className="mt-3 flex gap-2">
                            <div className={`h-6 rounded-lg ${product.iconBg} w-16`} />
                            <div className="h-6 rounded-lg bg-[#1A2744] w-12" />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {[1, 2, 3].map(n => (
                            <div key={n} className="bg-[#0A0A0F]/80 border border-[#1A2744] rounded-lg p-2.5">
                              <div className="h-4 bg-[#1A2744] rounded mb-1.5 w-full" />
                              <div className={`h-3 rounded w-8 ${product.iconBg}`} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Partner CTA */}
      <section className="py-16 border-t border-[#1A2744]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#2979FF]/10 border border-[#2979FF]/20 flex items-center justify-center mx-auto mb-5">
            <Target size={22} className="text-[#2979FF]" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Продвигай наши продукты — и зарабатывай</h2>
          <p className="text-[#8FA8C8] mb-8 leading-relaxed max-w-xl mx-auto">
            Станьте партнёром Drops Partners и получайте комиссию за каждого пользователя, который купит подписку на наши продукты. SaaS-продукты платят регулярно — ваш доход растёт вместе с базой пользователей.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth/register?ref=product"
              className="inline-flex items-center justify-center gap-2 bg-[#2979FF] hover:bg-[#1565C0] text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-[#2979FF]/20"
            >
              Зарегистрироваться <ArrowRight size={16} />
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center gap-2 bg-[#0D1B2E] border border-[#1A2744] hover:border-[#2979FF]/30 text-[#F0F4FF] font-medium px-8 py-3.5 rounded-xl text-sm transition-all"
            >
              Читать кейсы <Globe size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1A2744] py-8 bg-[#0D1B2E]/30">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#8FA8C8]">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-6 h-6">
              <div className="absolute inset-0 rounded-full bg-[#2979FF]" />
              <div className="absolute inset-[28%] rounded-full bg-[#0D1B2E]" />
              <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#00D4FF]" />
            </div>
            <span className="font-bold text-[#F0F4FF] text-xs">DROPS PARTNERS</span>
          </Link>
          <div className="flex items-center gap-5">
            <Link href="/" className="hover:text-white transition-colors">Главная</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Блог</Link>
            <Link href="/auth/register" className="hover:text-white transition-colors">Офферы</Link>
          </div>
          <span className="text-xs">© 2024 Drops Partners</span>
        </div>
      </footer>
    </div>
  )
}
