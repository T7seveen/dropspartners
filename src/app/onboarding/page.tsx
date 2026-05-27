'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowRight, ArrowLeft, CheckCircle, Loader2,
  Globe, MessageSquare, Video, Mail, Search, TrendingUp, Layers,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

// ── Step 1: traffic source ─────────────────────────────────────────────────
const TRAFFIC_SOURCES = [
  { id: 'seo',     label: 'SEO / Блог',          icon: Search },
  { id: 'social',  label: 'Соцсети',             icon: Globe },
  { id: 'tg',      label: 'Telegram-канал',      icon: MessageSquare },
  { id: 'youtube', label: 'YouTube',             icon: Video },
  { id: 'email',   label: 'Email-рассылки',      icon: Mail },
  { id: 'context', label: 'Контекстная реклама', icon: TrendingUp },
  { id: 'other',   label: 'Другое',              icon: Layers },
]

// ── Step 3: first offer pick ───────────────────────────────────────────────
const STARTER_OFFERS = [
  { id: 'drops-system', title: 'Drops — Пакет «Система»', payout: '15 000 ₽', type: 'CPA', desc: 'Полный пакет для бизнеса. Высокая конверсия.' },
  { id: 'drops-landing', title: 'Drops — Лендинг под ключ', payout: '3 000 ₽', type: 'CPA', desc: 'Быстрый старт. Широкая аудитория.' },
  { id: 'drops-seo', title: 'Drops — SEO-продвижение', payout: '1 000 ₽', type: 'CPL', desc: 'Платим за лид. Подходит под SEO и блог.' },
  { id: 'skip', title: 'Выберу позже', payout: '', type: '', desc: 'Посмотрю каталог офферов самостоятельно.' },
]

const STEP_LABELS = ['Источник трафика', 'Ваш профиль', 'Первый оффер']

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [traffic, setTraffic] = useState('')
  const [fullName, setFullName] = useState('')
  const [telegram, setTelegram] = useState('')
  const [offerId, setOfferId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const canNext = [
    !!traffic,
    fullName.trim().length >= 2,
    true, // offer optional
  ]

  const finish = async () => {
    setLoading(true)
    setError('')
    try {
      // Save profile + mark onboarding done
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName.trim(),
          telegram: telegram.trim() || null,
          onboarding_done: true,
          traffic_source: traffic,
        }),
      })
      if (!res.ok) {
        const d = await res.json()
        setError(d.error ?? 'Ошибка сохранения')
        return
      }

      // Take first offer if selected
      if (offerId && offerId !== 'skip') {
        await fetch(`/api/offers/${offerId}/take`, { method: 'POST' }).catch(() => {})
      }

      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Ошибка соединения')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center px-4 py-8">
      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-10">
        <div className="relative w-8 h-8">
          <div className="absolute inset-0 rounded-full bg-[#2979FF]" />
          <div className="absolute inset-[30%] rounded-full bg-[#0A0A0F]" />
          <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#00D4FF]" />
        </div>
        <div>
          <span className="font-bold text-[#F0F4FF] text-sm tracking-wide">DROPS</span>
          <span className="text-[#2979FF] text-xs font-semibold tracking-widest block -mt-0.5">PARTNERS</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-md mb-8">
        <div className="flex items-center justify-between mb-2">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className="flex flex-col items-center gap-1 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i < step ? 'bg-green-500 text-white' :
                i === step ? 'bg-[#2979FF] text-white ring-2 ring-[#2979FF]/30' :
                'bg-[#1A2744] text-[#8FA8C8]'
              }`}>
                {i < step ? <CheckCircle size={14} /> : i + 1}
              </div>
              <span className={`text-[10px] font-medium hidden sm:block ${i === step ? 'text-[#F0F4FF]' : 'text-[#8FA8C8]'}`}>
                {label}
              </span>
            </div>
          ))}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 hidden" />
        </div>
        {/* Track */}
        <div className="relative h-1 bg-[#1A2744] rounded-full mt-1">
          <div
            className="h-full bg-[#2979FF] rounded-full transition-all duration-500"
            style={{ width: `${(step / (STEP_LABELS.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-6">

        {/* ── Step 0: Traffic source ── */}
        {step === 0 && (
          <div>
            <h2 className="text-lg font-bold text-[#F0F4FF] mb-1">Откуда вы ведёте трафик?</h2>
            <p className="text-[#8FA8C8] text-sm mb-5">Поможем подобрать подходящие офферы.</p>
            <div className="grid grid-cols-2 gap-2">
              {TRAFFIC_SOURCES.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTraffic(id)}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                    traffic === id
                      ? 'border-[#2979FF] bg-[#2979FF]/10 text-[#F0F4FF]'
                      : 'border-[#1A2744] hover:border-[#2979FF]/40 text-[#8FA8C8] hover:text-[#F0F4FF]'
                  }`}
                >
                  <Icon size={16} className={traffic === id ? 'text-[#2979FF]' : 'text-[#8FA8C8]'} />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 1: Profile ── */}
        {step === 1 && (
          <div>
            <h2 className="text-lg font-bold text-[#F0F4FF] mb-1">Расскажите о себе</h2>
            <p className="text-[#8FA8C8] text-sm mb-5">Эти данные видны только вам и администраторам.</p>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-[#8FA8C8] mb-1.5 block font-medium">
                  Имя или псевдоним <span className="text-red-400">*</span>
                </label>
                <input
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Иван или @my_channel"
                  autoFocus
                  className="w-full bg-[#1A2744] border border-[#2979FF]/20 rounded-xl px-3 py-2.5 text-sm text-[#F0F4FF] placeholder-[#8FA8C8] outline-none focus:border-[#2979FF] transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-[#8FA8C8] mb-1.5 block font-medium">
                  Telegram (необязательно)
                </label>
                <input
                  value={telegram}
                  onChange={e => setTelegram(e.target.value.replace(/^@/, ''))}
                  placeholder="username (без @)"
                  className="w-full bg-[#1A2744] border border-[#2979FF]/20 rounded-xl px-3 py-2.5 text-sm text-[#F0F4FF] placeholder-[#8FA8C8] outline-none focus:border-[#2979FF] transition-colors"
                />
                <p className="text-[10px] text-[#8FA8C8] mt-1">
                  Для уведомлений о конверсиях и выплатах. Можно добавить позже в профиле.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: First offer ── */}
        {step === 2 && (
          <div>
            <h2 className="text-lg font-bold text-[#F0F4FF] mb-1">Выберите первый оффер</h2>
            <p className="text-[#8FA8C8] text-sm mb-5">Реферальная ссылка будет создана автоматически.</p>
            <div className="space-y-2">
              {STARTER_OFFERS.map(offer => (
                <button
                  key={offer.id}
                  onClick={() => setOfferId(offer.id)}
                  className={`w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                    offerId === offer.id
                      ? 'border-[#2979FF] bg-[#2979FF]/10'
                      : 'border-[#1A2744] hover:border-[#2979FF]/40'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 transition-all ${
                    offerId === offer.id ? 'border-[#2979FF] bg-[#2979FF]' : 'border-[#4A6080]'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[#F0F4FF]">{offer.title}</div>
                    <div className="text-xs text-[#8FA8C8] mt-0.5">{offer.desc}</div>
                  </div>
                  {offer.payout && (
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-bold text-[#2979FF]">{offer.payout}</div>
                      <div className="text-[10px] text-[#8FA8C8]">{offer.type}</div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          {step > 0 ? (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-1.5 text-sm text-[#8FA8C8] hover:text-[#F0F4FF] transition-colors"
            >
              <ArrowLeft size={16} /> Назад
            </button>
          ) : (
            <div />
          )}

          {step < 2 ? (
            <Button
              onClick={() => setStep(s => s + 1)}
              disabled={!canNext[step]}
              size="sm"
            >
              Далее <ArrowRight size={16} />
            </Button>
          ) : (
            <Button onClick={finish} loading={loading} size="sm">
              {loading ? <><Loader2 size={14} className="animate-spin" /> Сохранение…</> : <>Начать работу <ArrowRight size={16} /></>}
            </Button>
          )}
        </div>
      </div>

      <p className="text-xs text-[#4A6080] mt-6">
        Шаг {step + 1} из {STEP_LABELS.length}
      </p>
    </div>
  )
}
