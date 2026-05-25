'use client'
import { useState } from 'react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { Button } from '@/components/ui/Button'
import { Copy, CheckCircle, User, Link2, Bell, Shield } from 'lucide-react'

const profile = {
  username: 'alex_traffic',
  email: 'alex@mail.ru',
  full_name: 'Алексей Трафиков',
  telegram: '@alex_tg',
  ref_code: 'dp_alex123',
  role: 'partner',
  balance: 35100,
  total_earned: 284000,
  total_paid: 187400,
  created_at: '2024-01-05',
}

export default function ProfilePage() {
  const [form, setForm] = useState({ full_name: profile.full_name, telegram: profile.telegram })
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  const refUrl = `https://partners.drops.agency/r/${profile.ref_code}`

  const save = async () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const copyRef = () => {
    navigator.clipboard.writeText(refUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <DashboardShell title="Профиль" balance={profile.balance}>
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left: Profile card */}
        <div className="space-y-4">
          <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-5 text-center">
            <div className="w-16 h-16 rounded-full bg-[#2979FF]/20 border-2 border-[#2979FF]/30 flex items-center justify-center text-2xl font-bold text-[#2979FF] mx-auto mb-3">
              {profile.full_name.split(' ').map(n=>n[0]).join('').slice(0,2)}
            </div>
            <div className="font-bold text-[#F0F4FF] text-base">{profile.full_name}</div>
            <div className="text-[#8FA8C8] text-sm">@{profile.username}</div>
            <div className="text-xs text-[#8FA8C8] mt-1">{profile.email}</div>
            <div className="mt-3 inline-flex items-center gap-1.5 bg-[#2979FF]/10 border border-[#2979FF]/20 rounded-full px-3 py-1 text-xs text-[#2979FF] font-semibold">
              <Shield size={10}/> Партнёр
            </div>
          </div>

          {/* Stats */}
          <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-4 space-y-3">
            {[
              { label: 'Баланс', value: `${profile.balance.toLocaleString('ru')} ₽`, color: 'text-[#2979FF]' },
              { label: 'Всего заработано', value: `${profile.total_earned.toLocaleString('ru')} ₽`, color: 'text-green-400' },
              { label: 'Выплачено', value: `${profile.total_paid.toLocaleString('ru')} ₽`, color: 'text-[#F0F4FF]' },
              { label: 'Партнёр с', value: '05.01.2024', color: 'text-[#8FA8C8]' },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between">
                <span className="text-xs text-[#8FA8C8]">{s.label}</span>
                <span className={`text-sm font-semibold ${s.color}`}>{s.value}</span>
              </div>
            ))}
          </div>

          {/* My ref link */}
          <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-4">
            <div className="text-xs font-semibold text-[#8FA8C8] mb-2 flex items-center gap-1.5"><Link2 size={12}/> Мой реферальный код</div>
            <div className="bg-[#1A2744] rounded-xl p-3 mb-2">
              <div className="font-mono text-xs text-[#2979FF] font-semibold mb-1">{profile.ref_code}</div>
              <div className="font-mono text-xs text-[#8FA8C8] truncate">{refUrl}</div>
            </div>
            <button onClick={copyRef} className="w-full flex items-center justify-center gap-2 py-2 bg-[#1A2744] hover:bg-[#243560] border border-[#2979FF]/20 rounded-xl text-xs text-[#C8DCFF] font-medium transition-colors">
              {copied ? <><CheckCircle size={12} className="text-green-400"/> Скопировано!</> : <><Copy size={12}/> Скопировать ссылку</>}
            </button>
            <div className="text-xs text-[#8FA8C8] mt-2 text-center">Приглашайте партнёров и получайте 5% от их дохода</div>
          </div>
        </div>

        {/* Right: Edit form */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-5">
            <h3 className="font-semibold text-[#F0F4FF] mb-4 flex items-center gap-2"><User size={16} className="text-[#2979FF]"/> Личные данные</h3>
            {saved && (
              <div className="mb-4 p-3 bg-green-950/40 border border-green-500/30 rounded-xl flex items-center gap-2 text-green-400 text-sm">
                <CheckCircle size={16}/> Изменения сохранены
              </div>
            )}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs text-[#8FA8C8] mb-1.5 block">Имя</label>
                <input value={form.full_name} onChange={e => setForm(f=>({...f, full_name:e.target.value}))}
                  className="w-full bg-[#1A2744] border border-[#2979FF]/20 rounded-xl px-3 py-2.5 text-sm text-[#F0F4FF] outline-none focus:border-[#2979FF]"/>
              </div>
              <div>
                <label className="text-xs text-[#8FA8C8] mb-1.5 block">Telegram</label>
                <input value={form.telegram} onChange={e => setForm(f=>({...f, telegram:e.target.value}))} placeholder="@username"
                  className="w-full bg-[#1A2744] border border-[#2979FF]/20 rounded-xl px-3 py-2.5 text-sm text-[#F0F4FF] outline-none focus:border-[#2979FF]"/>
              </div>
            </div>
            <div className="mb-4">
              <label className="text-xs text-[#8FA8C8] mb-1.5 block">Email (только для чтения)</label>
              <input value={profile.email} disabled
                className="w-full bg-[#0A0A0F] border border-[#1A2744] rounded-xl px-3 py-2.5 text-sm text-[#8FA8C8] outline-none cursor-not-allowed"/>
            </div>
            <Button onClick={save}>Сохранить изменения</Button>
          </div>

          <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-5">
            <h3 className="font-semibold text-[#F0F4FF] mb-4 flex items-center gap-2"><Bell size={16} className="text-[#2979FF]"/> Уведомления</h3>
            <div className="space-y-3">
              {[
                { label: 'Новые конверсии', sub: 'Уведомлять при каждой конверсии', checked: true },
                { label: 'Выплаты', sub: 'Статус заявок на выплату', checked: true },
                { label: 'Новые офферы', sub: 'Когда появляются новые топ-офферы', checked: false },
                { label: 'Email-дайджест', sub: 'Еженедельная статистика на почту', checked: true },
              ].map(n => (
                <div key={n.label} className="flex items-center justify-between p-3 bg-[#1A2744]/50 rounded-xl">
                  <div>
                    <div className="text-sm font-medium text-[#F0F4FF]">{n.label}</div>
                    <div className="text-xs text-[#8FA8C8]">{n.sub}</div>
                  </div>
                  <div className={`w-10 h-5 rounded-full transition-colors cursor-pointer ${n.checked ? 'bg-[#2979FF]' : 'bg-[#1A2744] border border-[#2979FF]/20'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white transition-all mt-0.5 ${n.checked ? 'ml-5.5' : 'ml-0.5'}`} style={{ marginLeft: n.checked ? '22px' : '2px' }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-5">
            <h3 className="font-semibold text-[#F0F4FF] mb-4 flex items-center gap-2"><Shield size={16} className="text-[#2979FF]"/> Безопасность</h3>
            <div className="space-y-2">
              <Button variant="secondary" size="sm">Изменить пароль</Button>
              <div className="text-xs text-[#8FA8C8] mt-2">Последний вход: сегодня в 14:23 · Москва</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
