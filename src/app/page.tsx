import Link from 'next/link'
import { ArrowRight, CheckCircle, Star, TrendingUp, Brain, BarChart3, Users, Zap, BookOpen, ChevronRight } from 'lucide-react'

const statsBar = [
  { value: '2 847', label: 'партнёров' },
  { value: '₽18.4M', label: 'выплачено' },
  { value: '156', label: 'офферов' },
  { value: '4.8★', label: 'рейтинг' },
]

const howItWorks = [
  { n: '01', title: 'Зарегистрируйся', sub: '2 мин, без верификации', desc: 'Создай аккаунт и сразу получи доступ к полному каталогу офферов. Никакой проверки документов, никакого ожидания.' },
  { n: '02', title: 'Выбери нишу', sub: 'CPA, дроп, RevShare', desc: 'Под твой трафик и аудиторию. Крипта, SaaS, дропшиппинг, обучение — выбирай то, что конвертит у тебя лучше всего.' },
  { n: '03', title: 'Зарабатывай', sub: 'выплаты каждый день', desc: 'Каждая конверсия — деньги на баланс. Вывод на карту РФ или USDT каждый день без минимального порога.' },
]

const personas = [
  {
    emoji: '📱',
    title: 'Блогер / Инфлюенсер',
    desc: 'У тебя есть аудитория в Telegram, Instagram или TikTok. Хочешь монетизировать её через нативные интеграции без потери доверия.',
    points: ['Нативные офферы под любую аудиторию', 'Высокие ставки RevShare', 'Ссылки за 1 клик'],
  },
  {
    emoji: '⚡',
    title: 'Арбитражник',
    desc: 'Льёшь платный трафик и ищешь офферы с высокими ставками, адекватным холдом и реальными выплатами без задержек.',
    points: ['Ставки выше рынка на 15–30%', 'Холд от 3 дней', 'Постбэк и API для трекеров'],
  },
  {
    emoji: '🌱',
    title: 'Новичок',
    desc: 'Начинаешь с нуля. Нужно бесплатное обучение, простые офферы для старта и поддержка менеджера на первых шагах.',
    points: ['Бесплатные курсы с нуля', 'Офферы без минимального трафика', 'Поддержка 24/7 в Telegram'],
  },
]

const topOffers = [
  { name: 'Drops Система', cat: 'Маркетинг', type: 'CPA', payout: '15 000 ₽', cr: '4.2%', hot: true },
  { name: 'Bybit', cat: 'Крипта', type: 'RevShare', payout: '30%', cr: '2.9%', hot: true },
  { name: 'Дропшиппинг', cat: 'Физтовары', type: 'RevShare', payout: 'от 8%', cr: '4.8%', hot: false },
]

const ownProducts = [
  { name: 'Trend Watcher', desc: 'AI-мониторинг трендов — находит вирусные ниши до пика', icon: TrendingUp, color: 'text-[#FFB930]', bg: 'bg-[#FFB930]/10' },
  { name: 'Drops AI Chat', desc: 'AI-ассистент для копирайтинга, крео и лендингов', icon: Brain, color: 'text-[#2979FF]', bg: 'bg-[#2979FF]/10' },
  { name: 'Analytics Pro', desc: 'Глубокий UTM-дашборд и воронки конверсий', icon: BarChart3, color: 'text-[#00D4FF]', bg: 'bg-[#00D4FF]/10' },
]

const testimonials = [
  {
    name: 'Алексей Т.',
    role: 'Арбитражник, Москва',
    avatar: 'АТ',
    text: 'Пришёл с нулём и за 3 месяца вышел на 120 000 ₽ в месяц. Drops Partners реально помогает — и обучение, и офферы с адекватными условиями.',
    earned: '284 000 ₽',
    period: 'за 4 месяца',
  },
  {
    name: 'Мария М.',
    role: 'Telegram-инфлюенсер',
    avatar: 'ММ',
    text: 'Монетизировала свой канал через Drops. Оффер на Bybit поставила — и RevShare капает каждый месяц. Буквально пассивный доход.',
    earned: '196 000 ₽',
    period: 'за 3 месяца',
  },
  {
    name: 'Дмитрий П.',
    role: 'Дропшиппинг, Авито',
    avatar: 'ДП',
    text: 'Продаю через Авито, отгрузка через завод-партнёр Drops. Не нужно склада, не нужно денег на товар. 8% с каждой продажи.',
    earned: '128 000 ₽',
    period: 'за 2 месяца',
  },
]

const blogPreviews = [
  {
    slug: 'kak-zarabotat-na-kripto-trafike',
    title: 'Как заработать на крипто-трафике в 2024',
    cat: 'Обучение',
    catColor: 'bg-blue-500/15 text-blue-400',
    readMin: 8,
    image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=600&h=300&fit=crop',
  },
  {
    slug: 'dropshipping-ot-proizvoditelya',
    title: 'Дропшиппинг от производителя: кейс на 120K за 45 дней',
    cat: 'Кейс',
    catColor: 'bg-green-500/15 text-green-400',
    readMin: 12,
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=300&fit=crop',
  },
  {
    slug: 'telegram-kanal-dlya-arbitrazha',
    title: 'Как монетизировать Telegram-канал через партнёрки',
    cat: 'Обучение',
    catColor: 'bg-blue-500/15 text-blue-400',
    readMin: 7,
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&h=300&fit=crop',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F0F4FF]">

      {/* ── STICKY NAV ── */}
      <nav className="border-b border-[#1A2744] bg-[#0A0A0F]/92 backdrop-blur sticky top-0 z-50">
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
            <Link href="/auth/register" className="hover:text-white transition-colors">Офферы</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Обучение</Link>
            <Link href="/products" className="hover:text-white transition-colors">Наши продукты</Link>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/auth/login" className="text-sm text-[#8FA8C8] hover:text-white px-3 py-1.5 transition-colors">Войти</Link>
            <Link href="/auth/register" className="bg-[#2979FF] hover:bg-[#1565C0] text-white text-sm font-semibold px-4 py-1.5 rounded-xl transition-all hover:shadow-lg hover:shadow-[#2979FF]/20">
              Начать бесплатно
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-[#2979FF] opacity-[0.055] rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#00D4FF] opacity-[0.03] rounded-full blur-3xl -translate-x-1/3 translate-y-1/3 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 pt-20 pb-16 relative">
          <div className="max-w-3xl">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 bg-[#FFB930]/10 border border-[#FFB930]/25 rounded-full px-4 py-1.5 text-sm text-[#FFB930] font-medium mb-7">
              <span className="w-2 h-2 bg-[#FFB930] rounded-full animate-pulse" />
              🔥 Новые офферы каждую неделю
            </div>

            {/* H1 */}
            <h1 className="text-4xl md:text-5xl lg:text-[62px] font-bold leading-[1.07] mb-6 tracking-tight">
              Зарабатывай от <span className="text-[#2979FF]">50 000 ₽</span><br />
              в месяц на партнёрках
            </h1>

            <p className="text-[#8FA8C8] text-lg max-w-2xl mb-8 leading-relaxed">
              Drops Partners — CPA-сеть с собственными продуктами, дропшиппингом от заводов и реальными выплатами каждый день. Для новичков и профи.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-7">
              <Link href="/auth/register" className="inline-flex items-center justify-center gap-2 bg-[#2979FF] hover:bg-[#1565C0] text-white font-bold px-8 py-4 rounded-xl text-base transition-all hover:shadow-xl hover:shadow-[#2979FF]/25">
                Начать зарабатывать <ArrowRight size={18} />
              </Link>
              <Link href="/auth/register" className="inline-flex items-center justify-center gap-2 bg-[#0D1B2E] border border-[#1A2744] hover:border-[#2979FF]/40 text-[#F0F4FF] font-medium px-8 py-4 rounded-xl text-base transition-all">
                Посмотреть офферы <ChevronRight size={18} />
              </Link>
            </div>

            {/* Social proof pills */}
            <div className="flex flex-wrap gap-4 text-sm text-[#8FA8C8]">
              <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-green-400" /> Без опыта</span>
              <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-green-400" /> Выплата за 1 день</span>
              <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-green-400" /> Поддержка 24/7</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="border-t border-b border-[#1A2744] bg-[#0D1B2E]/50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1 divide-x divide-[#1A2744]">
            {statsBar.map(s => (
              <div key={s.label} className="text-center py-3 px-4">
                <div className="text-2xl md:text-3xl font-bold text-[#F0F4FF] mb-0.5">{s.value}</div>
                <div className="text-xs text-[#8FA8C8]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 border-b border-[#1A2744]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Как начать зарабатывать</h2>
            <p className="text-[#8FA8C8]">Три шага до первых денег — без верификации и сложных форм</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {howItWorks.map((step, i) => (
              <div key={i} className="relative bg-[#0D1B2E] border border-[#1A2744] hover:border-[#2979FF]/30 rounded-2xl p-7 transition-all group">
                <div className="text-[64px] font-bold text-[#2979FF]/10 leading-none mb-4 font-mono select-none group-hover:text-[#2979FF]/18 transition-colors">{step.n}</div>
                <div className="font-bold text-[#F0F4FF] text-lg mb-1">{step.title}</div>
                <div className="text-xs text-[#2979FF] font-semibold mb-3">{step.sub}</div>
                <p className="text-[#8FA8C8] text-sm leading-relaxed">{step.desc}</p>
                {i < howItWorks.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-3 z-10 w-6 h-6 rounded-full bg-[#0D1B2E] border border-[#1A2744] items-center justify-center">
                    <ArrowRight size={12} className="text-[#2979FF]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR WHOM ── */}
      <section className="py-20 border-b border-[#1A2744] bg-[#0D1B2E]/20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Для кого это</h2>
            <p className="text-[#8FA8C8]">Drops Partners работает для любого уровня — от блогера до матёрого арбитражника</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {personas.map((p, i) => (
              <div key={i} className="bg-[#0D1B2E] border border-[#1A2744] hover:border-[#2979FF]/30 rounded-2xl p-6 flex flex-col transition-all group">
                <div className="text-3xl mb-4">{p.emoji}</div>
                <h3 className="font-bold text-[#F0F4FF] text-base mb-2">{p.title}</h3>
                <p className="text-[#8FA8C8] text-sm leading-relaxed mb-5 flex-1">{p.desc}</p>
                <ul className="space-y-1.5 mb-5">
                  {p.points.map(pt => (
                    <li key={pt} className="flex items-center gap-2 text-xs text-[#C8DCFF]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2979FF] flex-shrink-0" />
                      {pt}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/register" className="flex items-center gap-1.5 text-sm text-[#2979FF] font-semibold group-hover:gap-2.5 transition-all">
                  Начать <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOP OFFERS ── */}
      <section className="py-20 border-b border-[#1A2744]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Топовые офферы</h2>
              <p className="text-[#8FA8C8]">Лучшие условия прямо сейчас — CR и ставки в реальном времени</p>
            </div>
            <Link href="/auth/register" className="hidden sm:flex items-center gap-1.5 text-sm text-[#2979FF] hover:underline">
              Все 156 офферов <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {topOffers.map((o, i) => (
              <div key={i} className="bg-[#0D1B2E] border border-[#1A2744] hover:border-[#2979FF]/40 rounded-2xl p-6 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="font-bold text-[#F0F4FF] text-base group-hover:text-[#2979FF] transition-colors">{o.name}</div>
                    <div className="text-xs text-[#8FA8C8] mt-0.5">{o.cat}</div>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    {o.hot && (
                      <span className="text-[10px] bg-[#FFB930]/15 text-[#FFB930] border border-[#FFB930]/25 px-2 py-0.5 rounded-full font-bold">HOT</span>
                    )}
                    <span className="text-[10px] bg-[#2979FF]/15 text-[#2979FF] border border-[#2979FF]/25 px-2 py-0.5 rounded-full font-bold">{o.type}</span>
                  </div>
                </div>
                <div className="flex items-end justify-between mt-2">
                  <div>
                    <div className="text-xs text-[#8FA8C8] mb-0.5">Выплата</div>
                    <div className="text-[#2979FF] font-bold text-xl">{o.payout}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-[#8FA8C8] mb-0.5">CR</div>
                    <div className="text-[#F0F4FF] font-semibold">{o.cr}</div>
                  </div>
                  <Link href="/auth/register" className="flex items-center gap-1.5 bg-[#2979FF]/10 hover:bg-[#2979FF]/25 text-[#2979FF] text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors">
                    Взять оффер <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR PRODUCTS ── */}
      <section className="py-20 border-b border-[#1A2744] bg-[#0D1B2E]/20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#2979FF]/10 border border-[#2979FF]/20 rounded-full px-4 py-1.5 text-xs text-[#2979FF] font-semibold mb-5">
              <Zap size={12} /> Уникальное преимущество
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Продвигай наши продукты — получай больше</h2>
            <p className="text-[#8FA8C8] max-w-xl mx-auto">
              Мы создаём собственные SaaS-инструменты. Ты их продвигаешь — они работают на тебя, принося пассивный доход каждый месяц
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5 mb-8">
            {ownProducts.map((prod, i) => {
              const Icon = prod.icon
              return (
                <div key={i} className="bg-[#0D1B2E] border border-[#1A2744] hover:border-[#2979FF]/30 rounded-2xl p-6 transition-all group">
                  <div className={`w-10 h-10 rounded-xl ${prod.bg} flex items-center justify-center mb-4`}>
                    <Icon size={20} className={prod.color} />
                  </div>
                  <h3 className="font-bold text-[#F0F4FF] mb-2">{prod.name}</h3>
                  <p className="text-[#8FA8C8] text-sm leading-relaxed">{prod.desc}</p>
                </div>
              )
            })}
          </div>
          <div className="text-center">
            <Link href="/products" className="inline-flex items-center gap-2 text-[#2979FF] hover:underline font-semibold text-sm">
              Все продукты → подробнее о комиссиях <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 border-b border-[#1A2744]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Что говорят партнёры</h2>
            <p className="text-[#8FA8C8]">Реальные результаты — реальные люди из нашей сети</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-6">
                <div className="flex items-center gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={13} className="text-[#FFB930] fill-[#FFB930]" />
                  ))}
                </div>
                <p className="text-sm text-[#C8DCFF] leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#2979FF]/20 border border-[#2979FF]/30 flex items-center justify-center text-xs font-bold text-[#2979FF]">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#F0F4FF]">{t.name}</div>
                      <div className="text-xs text-[#8FA8C8]">{t.role}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-400">{t.earned}</div>
                    <div className="text-xs text-[#8FA8C8]">{t.period}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EDUCATION ── */}
      <section className="py-20 border-b border-[#1A2744] bg-[#0D1B2E]/20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={16} className="text-[#2979FF]" />
                <span className="text-xs text-[#2979FF] font-semibold uppercase tracking-widest">База знаний</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Старт с нуля</h2>
              <p className="text-[#8FA8C8]">Бесплатные материалы для каждого уровня</p>
            </div>
            <Link href="/blog" className="hidden sm:flex items-center gap-1.5 text-sm text-[#2979FF] hover:underline">
              Читать все статьи <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {blogPreviews.map(article => (
              <Link key={article.slug} href={`/blog/${article.slug}`}
                className="bg-[#0D1B2E] border border-[#1A2744] hover:border-[#2979FF]/30 rounded-2xl overflow-hidden group transition-all">
                <div className="h-40 overflow-hidden">
                  <img src={article.image} alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-4">
                  <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded mb-2 ${article.catColor}`}>
                    {article.cat}
                  </span>
                  <h3 className="font-semibold text-[#F0F4FF] text-sm leading-snug group-hover:text-[#2979FF] transition-colors">
                    {article.title}
                  </h3>
                  <div className="text-[10px] text-[#8FA8C8] mt-2">{article.readMin} мин чтения</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-24 border-b border-[#1A2744]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-[#2979FF] opacity-[0.05] rounded-3xl blur-2xl pointer-events-none" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Готов начать?</h2>
              <p className="text-[#8FA8C8] text-lg mb-8 leading-relaxed max-w-lg mx-auto">
                Регистрация бесплатна. Первую реферальную ссылку получишь через 2 минуты — без верификации, без скрытых условий.
              </p>
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center gap-2 bg-[#2979FF] hover:bg-[#1565C0] text-white font-bold px-10 py-4 rounded-xl text-base transition-all hover:shadow-2xl hover:shadow-[#2979FF]/30"
              >
                Зарегистрироваться бесплатно <ArrowRight size={18} />
              </Link>
              <div className="flex flex-wrap items-center justify-center gap-5 mt-7 text-sm text-[#8FA8C8]">
                <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-green-400" /> Без опыта</span>
                <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-green-400" /> Бесплатно навсегда</span>
                <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-green-400" /> Поддержка 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#1A2744] py-12 bg-[#0D1B2E]/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-10">
            {/* Brand */}
            <div className="max-w-xs">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="relative w-8 h-8">
                  <div className="absolute inset-0 rounded-full bg-[#2979FF]" />
                  <div className="absolute inset-[28%] rounded-full bg-[#0D1B2E]" />
                  <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#00D4FF]" />
                </div>
                <div>
                  <div className="font-bold text-sm tracking-wide text-[#F0F4FF]">DROPS</div>
                  <div className="text-[#2979FF] text-[10px] font-semibold tracking-widest -mt-0.5">PARTNERS</div>
                </div>
              </div>
              <p className="text-xs text-[#8FA8C8] leading-relaxed">
                CPA-сеть с собственными продуктами, дропшиппингом от заводов и реальными выплатами каждый день.
              </p>
              <Link
                href="https://t.me/drops_partners_support"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-xs text-[#2979FF] hover:underline"
              >
                Telegram поддержки →
              </Link>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-10">
              <div>
                <div className="text-xs font-semibold text-[#F0F4FF] uppercase tracking-widest mb-3">Платформа</div>
                <div className="space-y-2.5">
                  {[
                    { label: 'Офферы', href: '/auth/register' },
                    { label: 'Блог', href: '/blog' },
                    { label: 'Продукты', href: '/products' },
                    { label: 'Обучение', href: '/blog' },
                  ].map(l => (
                    <div key={l.label}>
                      <Link href={l.href} className="text-sm text-[#8FA8C8] hover:text-white transition-colors">{l.label}</Link>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-[#F0F4FF] uppercase tracking-widest mb-3">Аккаунт</div>
                <div className="space-y-2.5">
                  {[
                    { label: 'Войти', href: '/auth/login' },
                    { label: 'Регистрация', href: '/auth/register' },
                    { label: 'Кабинет', href: '/dashboard' },
                    { label: 'Контакты', href: 'https://t.me/drops_partners_support' },
                  ].map(l => (
                    <div key={l.label}>
                      <Link href={l.href} className="text-sm text-[#8FA8C8] hover:text-white transition-colors">{l.label}</Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#1A2744] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8FA8C8]">
            <span>© 2024 Drops Partners. Все права защищены.</span>
            <div className="flex gap-4">
              <Link href="/admin" className="hover:text-white transition-colors">Админ</Link>
              <Link href="/advertiser" className="hover:text-white transition-colors">Рекламодателям</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
