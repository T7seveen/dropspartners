import Link from 'next/link'
import { ArrowRight, TrendingUp, Shield, Zap, Users, Package, BarChart3, BookOpen, ChevronRight, CheckCircle, Star, Clock, Globe, Layers } from 'lucide-react'

const stats = [
  { value: '247+', label: 'Активных партнёров' },
  { value: '23', label: 'Офферов в каталоге' },
  { value: '48K+', label: 'Кликов за месяц' },
  { value: '₽2.8M+', label: 'Выплачено партнёрам' },
]

const topOffers = [
  { name: 'Drops — Система', cat: 'Маркетинг', type: 'CPA', payout: '15 000 ₽', cr: '4.2%', hot: true },
  { name: 'Bybit RevShare', cat: 'Крипта', type: 'RevShare', payout: '30%', cr: '2.9%', hot: true },
  { name: 'NordVPN', cat: 'SaaS', type: 'CPS', payout: '1 200 ₽', cr: '3.5%', hot: false },
  { name: 'Skillbox', cat: 'Обучение', type: 'CPL', payout: '500 ₽', cr: '6.7%', hot: false },
  { name: 'ТрубМастер', cat: 'Дропшиппинг', type: 'RevShare', payout: '8%', cr: '4.8%', hot: false },
  { name: 'Drops — Лендинг', cat: 'Маркетинг', type: 'CPA', payout: '3 000 ₽', cr: '4.3%', hot: false },
]

const steps = [
  { n: '01', title: 'Регистрация', desc: 'Создайте аккаунт за 2 минуты. Верификация не нужна — сразу к делу.' },
  { n: '02', title: 'Выберите оффер', desc: 'Просматривайте каталог по нише и типу. CPA, RevShare, дроп.' },
  { n: '03', title: 'Получите ссылку', desc: 'Одна кнопка — и ссылка готова. Начинайте лить трафик сразу.' },
  { n: '04', title: 'Зарабатывайте', desc: 'Каждая конверсия — деньги на баланс. Вывод в любой день.' },
]

const features = [
  { icon: Package, title: 'Каталог 23+ офферов', desc: 'CPA, CPL, RevShare, дропшиппинг от производителей. Офферы Drops, крипто-биржи, VPN, онлайн-школы. Добавляем новые офферы каждую неделю.' },
  { icon: BarChart3, title: 'Аналитика в реальном времени', desc: 'Отслеживайте каждый клик, конверсию и рубль в реальном времени. Гео, устройства, источники трафика — всё в одном дашборде.' },
  { icon: Zap, title: 'Умные реферальные ссылки', desc: 'Одна кнопка — ссылка готова. Кастомные sub-параметры, UTM-метки. Cookie до 365 дней для максимальной атрибуции.' },
  { icon: BookOpen, title: 'База знаний и курсы', desc: 'Бесплатные и PRO-материалы по трафику, SEO, арбитражу и дропшиппингу. Учитесь и зарабатывайте больше.' },
  { icon: Shield, title: 'Гарантированные выплаты', desc: 'Карта РФ, USDT TRC20, Bitcoin, банковский перевод. Минимум 2 000 ₽. Обработка за 1 рабочий день.' },
  { icon: Layers, title: 'Ваши продукты под подписку', desc: 'Доступ к нашим обучающим курсам, шаблонам и инструментам по подписке. Новые материалы каждый месяц.' },
]

const testimonials = [
  {
    name: 'Алексей Трафиков',
    role: 'Арбитражник, Москва',
    avatar: 'АТ',
    text: 'Пришёл с нулём и за 3 месяца вышел на 120 000 ₽ в месяц. Drops Partners реально помогает — и обучение, и офферы с адекватными условиями. Сапорт отвечает быстро.',
    earned: '284 000 ₽',
    period: 'за 4 месяца',
  },
  {
    name: 'Мария Медиа',
    role: 'Инфлюенсер, Telegram',
    avatar: 'ММ',
    text: 'Монетизировала свой канал через Drops. Оффер на Bybit поставила — и RevShare капает каждый месяц. Самая пассивная часть дохода, буквально ничего не делаю.',
    earned: '196 000 ₽',
    period: 'за 3 месяца',
  },
  {
    name: 'Дропмастер Про',
    role: 'Дропшиппинг, Авито',
    avatar: 'ДП',
    text: 'Продаю трубы через Авито, отгрузка через завод-партнёр Drops. Не нужно склада, не нужно денег на товар. 8% с каждой продажи и растущий поток заказов.',
    earned: '128 000 ₽',
    period: 'за 2 месяца',
  },
]

const plans = [
  {
    name: 'Стартер',
    price: 'Бесплатно',
    period: '',
    desc: 'Для тех, кто только начинает',
    features: [
      'Доступ к каталогу офферов',
      'Базовые реферальные ссылки',
      'Статистика по кликам',
      '3 бесплатных курса',
      'Выплаты от 2 000 ₽',
    ],
    cta: 'Начать бесплатно',
    href: '/auth/register',
    accent: false,
  },
  {
    name: 'PRO',
    price: '1 490 ₽',
    period: '/ месяц',
    desc: 'Для серьёзных партнёров',
    features: [
      'Всё из Стартера',
      'Приоритетный доступ к топ-офферам',
      'Все PRO-курсы и материалы',
      'Расширенная аналитика',
      'Приоритетная поддержка',
      'Эксклюзивные офферы',
    ],
    cta: 'Попробовать PRO',
    href: '/auth/register?plan=pro',
    accent: true,
  },
  {
    name: 'Команда',
    price: '3 990 ₽',
    period: '/ месяц',
    desc: 'Для команд и агентств',
    features: [
      'Всё из PRO',
      'До 5 суб-аккаунтов',
      'API-доступ',
      'Персональный менеджер',
      'Кастомные условия выплат',
      'Совместная аналитика',
    ],
    cta: 'Написать нам',
    href: '/advertiser',
    accent: false,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F0F4FF]">
      {/* NAV */}
      <nav className="border-b border-[#1A2744] bg-[#0A0A0F]/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative w-7 h-7 flex-shrink-0">
              <div className="absolute inset-0 rounded-full bg-[#2979FF]" />
              <div className="absolute inset-[28%] rounded-full bg-[#0A0A0F]" />
              <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#00D4FF]" />
            </div>
            <span className="font-bold text-sm tracking-wide">DROPS</span>
            <span className="text-[#2979FF] text-xs font-semibold tracking-widest">PARTNERS</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-[#8FA8C8]">
            <Link href="#offers" className="hover:text-white transition-colors">Офферы</Link>
            <Link href="#how" className="hover:text-white transition-colors">Как работает</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Тарифы</Link>
            <Link href="/advertiser" className="hover:text-white transition-colors">Рекламодателям</Link>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/auth/login" className="text-sm text-[#8FA8C8] hover:text-white px-3 py-1.5 transition-colors">Войти</Link>
            <Link href="/auth/register" className="bg-[#2979FF] hover:bg-[#1565C0] text-white text-sm font-semibold px-4 py-1.5 rounded-xl transition-colors">
              Начать бесплатно
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2979FF] opacity-[0.06] rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#00D4FF] opacity-[0.04] rounded-full blur-3xl -translate-x-1/3 translate-y-1/3 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 pt-20 pb-16 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#2979FF]/10 border border-[#2979FF]/20 rounded-full px-4 py-1.5 text-sm text-[#2979FF] font-medium mb-6">
              <span className="w-2 h-2 bg-[#2979FF] rounded-full" />
              Партнёрская платформа нового поколения
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-5">
              Монетизируй трафик.<br />
              <span className="text-[#2979FF]">Зарабатывай с каждой<br />продажи.</span>
            </h1>
            <p className="text-[#8FA8C8] text-lg max-w-2xl mb-8 leading-relaxed">
              Drops Partners — экосистема для арбитражников, блогеров и владельцев трафика.
              CPA офферы, дропшиппинг от заводов, крипто-биржи, обучающие материалы и сервисы.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-12">
              <Link href="/auth/register" className="inline-flex items-center justify-center gap-2 bg-[#2979FF] hover:bg-[#1565C0] text-white font-bold px-7 py-3.5 rounded-xl text-base transition-all hover:shadow-lg hover:shadow-[#2979FF]/20">
                Начать зарабатывать <ArrowRight size={18} />
              </Link>
              <Link href="/advertiser" className="inline-flex items-center justify-center gap-2 bg-[#0D1B2E] border border-[#1A2744] hover:border-[#2979FF]/40 text-[#F0F4FF] font-medium px-7 py-3.5 rounded-xl text-base transition-all">
                Разместить оффер <ChevronRight size={18} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {stats.map(s => (
                <div key={s.label} className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-4">
                  <div className="text-2xl font-bold text-[#2979FF]">{s.value}</div>
                  <div className="text-xs text-[#8FA8C8] mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TOP OFFERS */}
      <section id="offers" className="py-16 border-t border-[#1A2744]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Горячие офферы</h2>
              <p className="text-[#8FA8C8] text-sm mt-1">Лучшие условия прямо сейчас</p>
            </div>
            <Link href="/auth/register" className="text-sm text-[#2979FF] hover:underline flex items-center gap-1">
              Все офферы <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topOffers.map((o, i) => (
              <div key={i} className="bg-[#0D1B2E] border border-[#1A2744] hover:border-[#2979FF]/40 rounded-2xl p-4 transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold text-[#F0F4FF] group-hover:text-[#2979FF] transition-colors">{o.name}</div>
                    <div className="text-xs text-[#8FA8C8] mt-0.5">{o.cat}</div>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    {o.hot && (
                      <span className="text-[10px] bg-[#FFB930]/15 text-[#FFB930] border border-[#FFB930]/25 px-2 py-0.5 rounded-full font-bold">HOT</span>
                    )}
                    <span className="text-[10px] bg-[#2979FF]/15 text-[#2979FF] border border-[#2979FF]/25 px-2 py-0.5 rounded-full font-bold">{o.type}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-[#8FA8C8]">Выплата</div>
                    <div className="text-[#2979FF] font-bold text-lg">{o.payout}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-[#8FA8C8]">CR</div>
                    <div className="text-[#F0F4FF] font-semibold">{o.cr}</div>
                  </div>
                  <Link href="/auth/register" className="flex items-center gap-1.5 bg-[#2979FF]/10 hover:bg-[#2979FF]/20 text-[#2979FF] text-xs font-semibold px-3 py-2 rounded-xl transition-colors">
                    Взять <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-16 border-t border-[#1A2744] bg-[#0D1B2E]/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-2">Как начать зарабатывать</h2>
            <p className="text-[#8FA8C8] text-sm">Четыре шага до первого дохода</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step, i) => (
              <div key={i} className="relative bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-5">
                <div className="text-4xl font-bold text-[#2979FF]/15 mb-3 font-mono leading-none">{step.n}</div>
                <div className="font-semibold text-[#F0F4FF] mb-2">{step.title}</div>
                <div className="text-sm text-[#8FA8C8] leading-relaxed">{step.desc}</div>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 z-10 text-[#1A2744]">
                    <ChevronRight size={20} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 border-t border-[#1A2744]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-2">Всё что нужно для работы</h2>
            <p className="text-[#8FA8C8] text-sm">Инструменты для роста дохода и обучения</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <div key={i} className="bg-[#0D1B2E] border border-[#1A2744] hover:border-[#2979FF]/30 rounded-2xl p-5 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-[#2979FF]/10 flex items-center justify-center mb-4 group-hover:bg-[#2979FF]/20 transition-colors">
                  <f.icon size={20} className="text-[#2979FF]" />
                </div>
                <h3 className="font-semibold text-[#F0F4FF] mb-2">{f.title}</h3>
                <p className="text-sm text-[#8FA8C8] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 border-t border-[#1A2744] bg-[#0D1B2E]/20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-2">Что говорят партнёры</h2>
            <p className="text-[#8FA8C8] text-sm">Реальные результаты реальных людей</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-5">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={14} className="text-[#FFB930] fill-[#FFB930]" />
                  ))}
                </div>
                <p className="text-sm text-[#C8DCFF] leading-relaxed mb-4">"{t.text}"</p>
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

      {/* PRICING */}
      <section id="pricing" className="py-16 border-t border-[#1A2744]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-2">Тарифные планы</h2>
            <p className="text-[#8FA8C8] text-sm max-w-xl mx-auto">
              Начните бесплатно и переходите на PRO когда будете готовы. Без скрытых платежей.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <div key={i} className={`relative rounded-2xl border p-6 flex flex-col ${
                plan.accent
                  ? 'bg-[#2979FF]/8 border-[#2979FF]/40'
                  : 'bg-[#0D1B2E] border-[#1A2744]'
              }`}>
                {plan.accent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2979FF] text-white text-xs font-bold px-4 py-1 rounded-full">
                    Популярный
                  </div>
                )}
                <div className="mb-5">
                  <div className="text-xs font-semibold text-[#8FA8C8] uppercase tracking-widest mb-2">{plan.name}</div>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl font-bold ${plan.accent ? 'text-[#2979FF]' : 'text-[#F0F4FF]'}`}>{plan.price}</span>
                    {plan.period && <span className="text-[#8FA8C8] text-sm">{plan.period}</span>}
                  </div>
                  <div className="text-sm text-[#8FA8C8] mt-1">{plan.desc}</div>
                </div>
                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle size={15} className={`flex-shrink-0 mt-0.5 ${plan.accent ? 'text-[#2979FF]' : 'text-green-400'}`} />
                      <span className="text-[#C8DCFF]">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  plan.accent
                    ? 'bg-[#2979FF] hover:bg-[#1565C0] text-white'
                    : 'bg-[#1A2744] hover:bg-[#243560] border border-[#2979FF]/20 text-[#F0F4FF]'
                }`}>
                  {plan.cta} <ArrowRight size={15} />
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-[#8FA8C8] mt-6">
            Все тарифы включают отмену в любой момент. Годовая оплата со скидкой 30%.
          </p>
        </div>
      </section>

      {/* TRUST SIGNALS */}
      <section className="py-12 border-t border-[#1A2744] bg-[#0D1B2E]/20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: Shield, label: 'Верифицированные офферы', sub: 'Проверяем каждого рекламодателя' },
              { icon: Clock, label: 'Выплата за 1 день', sub: 'Быстрая обработка заявок' },
              { icon: Globe, label: 'РФ, СНГ и весь мир', sub: 'Офферы для любой аудитории' },
              { icon: TrendingUp, label: 'Растущая сеть', sub: '+40 новых партнёров в месяц' },
            ].map((t, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-11 h-11 rounded-2xl bg-[#2979FF]/10 border border-[#2979FF]/15 flex items-center justify-center">
                  <t.icon size={20} className="text-[#2979FF]" />
                </div>
                <div className="font-semibold text-sm text-[#F0F4FF]">{t.label}</div>
                <div className="text-xs text-[#8FA8C8]">{t.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-[#1A2744]">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Готов начать?</h2>
          <p className="text-[#8FA8C8] mb-8 leading-relaxed">
            Регистрация бесплатна. Первую реферальную ссылку получишь через 2 минуты.
            Никакой верификации, никакого скрытого.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth/register" className="inline-flex items-center justify-center gap-2 bg-[#2979FF] hover:bg-[#1565C0] text-white font-bold px-8 py-4 rounded-xl text-base transition-all hover:shadow-lg hover:shadow-[#2979FF]/20">
              Создать аккаунт <ArrowRight size={18} />
            </Link>
            <Link href="/auth/register?type=advertiser" className="inline-flex items-center justify-center gap-2 bg-[#0D1B2E] border border-[#1A2744] hover:border-[#2979FF]/30 text-[#F0F4FF] font-medium px-8 py-4 rounded-xl text-base transition-all">
              Я рекламодатель
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#1A2744] py-10 bg-[#0D1B2E]/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="relative w-7 h-7">
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
                Партнёрская платформа Drops Agency. Монетизируйте трафик с лучшими офферами на рынке.
              </p>
            </div>
            <div>
              <div className="text-xs font-semibold text-[#F0F4FF] uppercase tracking-wider mb-3">Партнёрам</div>
              <div className="space-y-2">
                {[
                  { label: 'Каталог офферов', href: '/auth/register' },
                  { label: 'Как работает', href: '#how' },
                  { label: 'Тарифы', href: '#pricing' },
                  { label: 'Центр обучения', href: '/auth/register' },
                ].map(l => (
                  <div key={l.label}>
                    <Link href={l.href} className="text-sm text-[#8FA8C8] hover:text-white transition-colors">{l.label}</Link>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-[#F0F4FF] uppercase tracking-wider mb-3">Рекламодателям</div>
              <div className="space-y-2">
                {[
                  { label: 'Разместить оффер', href: '/advertiser' },
                  { label: 'Условия размещения', href: '/advertiser' },
                  { label: 'Типы офферов', href: '/advertiser' },
                ].map(l => (
                  <div key={l.label}>
                    <Link href={l.href} className="text-sm text-[#8FA8C8] hover:text-white transition-colors">{l.label}</Link>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-[#F0F4FF] uppercase tracking-wider mb-3">Поддержка</div>
              <div className="space-y-2">
                {[
                  { label: 'Личный кабинет', href: '/dashboard' },
                  { label: 'Telegram поддержки', href: 'https://t.me/drops_partners_support' },
                ].map(l => (
                  <div key={l.label}>
                    <Link href={l.href} className="text-sm text-[#8FA8C8] hover:text-white transition-colors">{l.label}</Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-[#1A2744] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8FA8C8]">
            <span>© {new Date().getFullYear()} Drops Agency. Все права защищены.</span>
            <div className="flex gap-5">
              <Link href="/admin" className="hover:text-white transition-colors">Админ-панель</Link>
              <span>ИП Иванов Иван Иванович · ИНН 000000000000</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
