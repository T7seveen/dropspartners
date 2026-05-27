'use client'
import { useState, useEffect } from 'react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { Button } from '@/components/ui/Button'
import {
  Copy, CheckCircle, User, Link2, Bell, Shield,
  MessageCircle, ExternalLink, Unlink, Loader2, AlertCircle,
} from 'lucide-react'
import { formatMoney, formatDate } from '@/lib/utils'

interface Profile {
  id: string
  email?: string
  full_name: string | null
  username: string | null
  telegram: string | null
  telegram_chat_id: string | null
  ref_code: string
  role: string
  balance: number
  total_earned: number
  total_paid: number
  created_at: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [copied, setCopied] = useState(false)
  const [tgLinking, setTgLinking] = useState(false)
  const [tgLink, setTgLink] = useState('')
  const [tgUnlinking, setTgUnlinking] = useState(false)
  const [form, setForm] = useState({ full_name: '', telegram: '' })

  // Empty-state profile for dev/demo mode (no fake data)
  const emptyProfile: Profile = {
    id: 'demo', full_name: null, username: null,
    telegram: null, telegram_chat_id: null,
    ref_code: 'dp_demo0000', role: 'partner',
    balance: 0, total_earned: 0, total_paid: 0,
    created_at: new Date().toISOString(),
  }

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.json())
      .then(d => {
        const p = d.profile ?? emptyProfile
        setProfile(p)
        setEmail(d.email ?? '')
        setForm({ full_name: p.full_name ?? '', telegram: p.telegram ?? '' })
      })
      .catch(() => {
        setProfile(emptyProfile)
        setForm({ full_name: '', telegram: '' })
      })
      .finally(() => setLoading(false))
  }, [])

  const save = async () => {
    setSaveError('')
    setSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const d = await res.json()
      if (!res.ok) { setSaveError(d.error ?? 'Ошибка сохранения'); return }
      setSaved(true)
      setProfile(p => p ? { ...p, ...form } : p)
      setTimeout(() => setSaved(false), 3000)
    } catch { setSaveError('Ошибка соединения') }
    finally { setSaving(false) }
  }

  const generateTelegramLink = async () => {
    setTgLinking(true)
    try {
      const res = await fetch('/api/profile/telegram-link', { method: 'POST' })
      const d = await res.json()
      setTgLink(d.link ?? '')
    } catch {}
    finally { setTgLinking(false) }
  }

  const unlinkTelegram = async () => {
    setTgUnlinking(true)
    try {
      await fetch('/api/profile/telegram-link', { method: 'DELETE' })
      setProfile(p => p ? { ...p, telegram_chat_id: null } : p)
      setTgLink('')
    } catch {}
    finally { setTgUnlinking(false) }
  }

  const copyRef = () => {
    const url = `${window.location.origin}/ref/${profile?.ref_code}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const initials = (profile?.full_name ?? 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://partners.drops.agency'
  const refUrl = `${appUrl}/ref/${profile?.ref_code ?? '...'}`

  return (
    <DashboardShell title="Профиль" balance={profile?.balance ?? 0}>
      {loading ? (
        <div className="flex items-center justify-center py-24 text-[#8FA8C8]">
          <Loader2 size={24} className="animate-spin mr-2"/> Загрузка...
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-5">
          {/* ── Left column ── */}
          <div className="space-y-4">
            {/* Avatar + info */}
            <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-5 text-center">
              <div className="w-16 h-16 rounded-full bg-[#2979FF]/20 border-2 border-[#2979FF]/30 flex items-center justify-center text-2xl font-bold text-[#2979FF] mx-auto mb-3">
                {initials}
              </div>
              <div className="font-bold text-[#F0F4FF] text-base">{profile?.full_name ?? '—'}</div>
              {profile?.username && <div className="text-[#8FA8C8] text-sm">@{profile.username}</div>}
              <div className="text-xs text-[#8FA8C8] mt-1">{email}</div>
              <div className="mt-3 inline-flex items-center gap-1.5 bg-[#2979FF]/10 border border-[#2979FF]/20 rounded-full px-3 py-1 text-xs text-[#2979FF] font-semibold">
                <Shield size={10}/> {profile?.role === 'admin' ? 'Администратор' : profile?.role === 'advertiser' ? 'Рекламодатель' : 'Партнёр'}
              </div>
            </div>

            {/* Balance stats */}
            <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-4 space-y-3">
              {[
                { label: 'Баланс', value: formatMoney(profile?.balance ?? 0), color: 'text-[#2979FF]' },
                { label: 'Всего заработано', value: formatMoney(profile?.total_earned ?? 0), color: 'text-green-400' },
                { label: 'Выплачено', value: formatMoney(profile?.total_paid ?? 0), color: 'text-[#F0F4FF]' },
                { label: 'Партнёр с', value: profile?.created_at ? formatDate(profile.created_at) : '—', color: 'text-[#8FA8C8]' },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-xs text-[#8FA8C8]">{s.label}</span>
                  <span className={`text-sm font-semibold ${s.color}`}>{s.value}</span>
                </div>
              ))}
            </div>

            {/* Partner ref link */}
            <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-4">
              <div className="text-xs font-semibold text-[#8FA8C8] mb-2 flex items-center gap-1.5">
                <Link2 size={12}/> Реферальная ссылка
              </div>
              <div className="bg-[#1A2744] rounded-xl p-3 mb-2">
                <div className="font-mono text-xs text-[#2979FF] font-semibold mb-1">{profile?.ref_code}</div>
                <div className="font-mono text-[10px] text-[#8FA8C8] truncate">{refUrl}</div>
              </div>
              <button onClick={copyRef} className="w-full flex items-center justify-center gap-2 py-2 bg-[#1A2744] hover:bg-[#243560] border border-[#2979FF]/20 rounded-xl text-xs text-[#C8DCFF] font-medium transition-colors">
                {copied ? <><CheckCircle size={12} className="text-green-400"/> Скопировано!</> : <><Copy size={12}/> Скопировать</>}
              </button>
              <div className="text-[10px] text-[#8FA8C8] mt-2 text-center">Приглашайте партнёров — зарабатывайте 5% от их дохода</div>
            </div>
          </div>

          {/* ── Right column ── */}
          <div className="lg:col-span-2 space-y-4">
            {/* Personal data */}
            <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-5">
              <h3 className="font-semibold text-[#F0F4FF] mb-4 flex items-center gap-2">
                <User size={16} className="text-[#2979FF]"/> Личные данные
              </h3>

              {saved && (
                <div className="mb-4 p-3 bg-green-950/40 border border-green-500/30 rounded-xl flex items-center gap-2 text-green-400 text-sm">
                  <CheckCircle size={16}/> Изменения сохранены
                </div>
              )}
              {saveError && (
                <div className="mb-4 p-3 bg-red-950/40 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle size={16}/> {saveError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs text-[#8FA8C8] mb-1.5 block">Имя</label>
                  <input
                    value={form.full_name}
                    onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                    placeholder="Ваше имя"
                    className="w-full bg-[#1A2744] border border-[#2979FF]/20 rounded-xl px-3 py-2.5 text-sm text-[#F0F4FF] outline-none focus:border-[#2979FF] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8FA8C8] mb-1.5 block">Telegram username</label>
                  <input
                    value={form.telegram}
                    onChange={e => setForm(f => ({ ...f, telegram: e.target.value }))}
                    placeholder="@username"
                    className="w-full bg-[#1A2744] border border-[#2979FF]/20 rounded-xl px-3 py-2.5 text-sm text-[#F0F4FF] outline-none focus:border-[#2979FF] transition-colors"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="text-xs text-[#8FA8C8] mb-1.5 block">Email (только для чтения)</label>
                <input
                  value={email}
                  disabled
                  className="w-full bg-[#0A0A0F] border border-[#1A2744] rounded-xl px-3 py-2.5 text-sm text-[#8FA8C8] outline-none cursor-not-allowed"
                />
              </div>
              <Button onClick={save} loading={saving}>Сохранить изменения</Button>
            </div>

            {/* Telegram bot linking */}
            <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-5">
              <h3 className="font-semibold text-[#F0F4FF] mb-1 flex items-center gap-2">
                <MessageCircle size={16} className="text-[#2979FF]"/> Telegram Bot
              </h3>
              <p className="text-xs text-[#8FA8C8] mb-4">
                Привяжите Telegram для получения мгновенных уведомлений о конверсиях и выплатах.
              </p>

              {profile?.telegram_chat_id ? (
                <div className="flex items-center justify-between p-3 bg-green-950/30 border border-green-500/20 rounded-xl">
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <CheckCircle size={16}/> Telegram привязан
                  </div>
                  <button
                    onClick={unlinkTelegram}
                    disabled={tgUnlinking}
                    className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    {tgUnlinking ? <Loader2 size={12} className="animate-spin"/> : <Unlink size={12}/>}
                    Отвязать
                  </button>
                </div>
              ) : tgLink ? (
                <div className="space-y-3">
                  <div className="p-3 bg-[#1A2744] rounded-xl">
                    <div className="text-xs text-[#8FA8C8] mb-2">Перейдите по ссылке и нажмите <b className="text-[#F0F4FF]">Старт</b> в боте:</div>
                    <a
                      href={tgLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-[#2979FF] text-sm font-medium hover:underline"
                    >
                      <ExternalLink size={14}/> Открыть Telegram Bot
                    </a>
                  </div>
                  <p className="text-[10px] text-[#8FA8C8]">Ссылка действительна 15 минут. После нажатия Старт страницу можно закрыть.</p>
                </div>
              ) : (
                <Button
                  variant="secondary"
                  onClick={generateTelegramLink}
                  loading={tgLinking}
                >
                  <MessageCircle size={16}/> Привязать Telegram
                </Button>
              )}
            </div>

            {/* Security */}
            <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-5">
              <h3 className="font-semibold text-[#F0F4FF] mb-4 flex items-center gap-2">
                <Shield size={16} className="text-[#2979FF]"/> Безопасность
              </h3>
              <div className="space-y-2">
                <Button variant="secondary" size="sm" onClick={() => alert('Письмо для смены пароля отправлено на ' + email)}>
                  Изменить пароль
                </Button>
                <div className="text-xs text-[#8FA8C8] mt-2">
                  Для смены пароля воспользуйтесь ссылкой в письме.
                </div>
              </div>
            </div>

            {/* Notifications (static toggles — extend with real API later) */}
            <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-5">
              <h3 className="font-semibold text-[#F0F4FF] mb-4 flex items-center gap-2">
                <Bell size={16} className="text-[#2979FF]"/> Уведомления
              </h3>
              <div className="space-y-2">
                {[
                  { label: 'Новые конверсии', sub: 'В приложении и Telegram', on: true },
                  { label: 'Статус выплат', sub: 'При изменении статуса запроса', on: true },
                  { label: 'Новые офферы', sub: 'Когда добавляются топ-офферы', on: false },
                ].map(n => (
                  <div key={n.label} className="flex items-center justify-between p-3 bg-[#1A2744]/50 rounded-xl">
                    <div>
                      <div className="text-sm font-medium text-[#F0F4FF]">{n.label}</div>
                      <div className="text-xs text-[#8FA8C8]">{n.sub}</div>
                    </div>
                    <div
                      className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${n.on ? 'bg-[#2979FF]' : 'bg-[#1A2744] border border-[#2979FF]/20'}`}
                    >
                      <div className="absolute w-4 h-4 rounded-full bg-white top-0.5 transition-all"
                        style={{ left: n.on ? '22px' : '2px' }}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  )
}
