'use client'
import { useState } from 'react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { Bell, Mail, Send, Package, Eye, BarChart3, User, Lock, Trash2, CheckCircle, AlertTriangle } from 'lucide-react'

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        checked ? 'bg-[#2979FF]' : 'bg-[#1A2744]'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#0D1B2E] border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-xl shadow-lg animate-fadeIn">
      <CheckCircle size={16} />
      {message}
      <button onClick={onClose} className="ml-2 text-[#8FA8C8] hover:text-white text-xs">✕</button>
    </div>
  )
}

export default function SettingsPage() {
  // Notification toggles
  const [emailNotif, setEmailNotif] = useState(true)
  const [telegramNotif, setTelegramNotif] = useState(false)
  const [newOfferAlerts, setNewOfferAlerts] = useState(true)

  // Privacy toggles
  const [showLeaderboard, setShowLeaderboard] = useState(true)
  const [shareStats, setShareStats] = useState(false)

  // Email form
  const [newEmail, setNewEmail] = useState('')
  const [confirmEmail, setConfirmEmail] = useState('')

  // Password form
  const [currentPass, setCurrentPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')

  // Danger zone
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleteInput, setDeleteInput] = useState('')

  // Toast
  const [toast, setToast] = useState<string | null>(null)
  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }

  const handleEmailSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEmail || newEmail !== confirmEmail) return
    showToast('Email успешно обновлён')
    setNewEmail('')
    setConfirmEmail('')
  }

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPass || !newPass || newPass !== confirmPass) return
    showToast('Пароль успешно изменён')
    setCurrentPass('')
    setNewPass('')
    setConfirmPass('')
  }

  return (
    <DashboardShell title="Настройки">
      <div className="max-w-2xl space-y-6">

        {/* Notifications */}
        <section className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-[#1A2744] flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#2979FF]/10 flex items-center justify-center">
              <Bell size={16} className="text-[#2979FF]" />
            </div>
            <div>
              <h2 className="font-semibold text-[#F0F4FF] text-sm">Уведомления</h2>
              <p className="text-xs text-[#8FA8C8]">Настройте как и о чём вас уведомлять</p>
            </div>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail size={15} className="text-[#8FA8C8]" />
                <div>
                  <div className="text-sm text-[#F0F4FF]">Email-уведомления</div>
                  <div className="text-xs text-[#8FA8C8]">Выплаты, конверсии, важные события</div>
                </div>
              </div>
              <Toggle checked={emailNotif} onChange={v => { setEmailNotif(v); showToast(v ? 'Email-уведомления включены' : 'Email-уведомления отключены') }} />
            </div>
            <div className="h-px bg-[#1A2744]" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Send size={15} className="text-[#8FA8C8]" />
                <div>
                  <div className="text-sm text-[#F0F4FF]">Telegram-уведомления</div>
                  <div className="text-xs text-[#8FA8C8]">Моментальные уведомления в бот</div>
                </div>
              </div>
              <Toggle checked={telegramNotif} onChange={v => { setTelegramNotif(v); showToast(v ? 'Telegram-уведомления включены' : 'Telegram-уведомления отключены') }} />
            </div>
            <div className="h-px bg-[#1A2744]" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Package size={15} className="text-[#8FA8C8]" />
                <div>
                  <div className="text-sm text-[#F0F4FF]">Новые офферы</div>
                  <div className="text-xs text-[#8FA8C8]">Сообщать о новых офферах в сети</div>
                </div>
              </div>
              <Toggle checked={newOfferAlerts} onChange={v => { setNewOfferAlerts(v); showToast(v ? 'Уведомления о новых офферах включены' : 'Уведомления о новых офферах отключены') }} />
            </div>
          </div>
        </section>

        {/* Account */}
        <section className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-[#1A2744] flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#2979FF]/10 flex items-center justify-center">
              <User size={16} className="text-[#2979FF]" />
            </div>
            <div>
              <h2 className="font-semibold text-[#F0F4FF] text-sm">Аккаунт</h2>
              <p className="text-xs text-[#8FA8C8]">Обновите данные для входа</p>
            </div>
          </div>

          {/* Change email */}
          <div className="p-5 border-b border-[#1A2744]">
            <h3 className="text-sm font-semibold text-[#F0F4FF] mb-4 flex items-center gap-2">
              <Mail size={14} className="text-[#8FA8C8]" /> Смена email
            </h3>
            <form onSubmit={handleEmailSave} className="space-y-3">
              <div>
                <label className="block text-xs text-[#8FA8C8] mb-1.5">Новый email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="new@email.com"
                  className="w-full bg-[#0A0A0F] border border-[#1A2744] rounded-xl px-3 py-2.5 text-sm text-[#F0F4FF] placeholder-[#4A6080] outline-none focus:border-[#2979FF]/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-[#8FA8C8] mb-1.5">Подтвердите email</label>
                <input
                  type="email"
                  value={confirmEmail}
                  onChange={e => setConfirmEmail(e.target.value)}
                  placeholder="new@email.com"
                  className="w-full bg-[#0A0A0F] border border-[#1A2744] rounded-xl px-3 py-2.5 text-sm text-[#F0F4FF] placeholder-[#4A6080] outline-none focus:border-[#2979FF]/50 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={!newEmail || newEmail !== confirmEmail}
                className="px-4 py-2 bg-[#2979FF] hover:bg-[#1565C0] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Сохранить email
              </button>
            </form>
          </div>

          {/* Change password */}
          <div className="p-5">
            <h3 className="text-sm font-semibold text-[#F0F4FF] mb-4 flex items-center gap-2">
              <Lock size={14} className="text-[#8FA8C8]" /> Смена пароля
            </h3>
            <form onSubmit={handlePasswordSave} className="space-y-3">
              <div>
                <label className="block text-xs text-[#8FA8C8] mb-1.5">Текущий пароль</label>
                <input
                  type="password"
                  value={currentPass}
                  onChange={e => setCurrentPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0A0A0F] border border-[#1A2744] rounded-xl px-3 py-2.5 text-sm text-[#F0F4FF] placeholder-[#4A6080] outline-none focus:border-[#2979FF]/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-[#8FA8C8] mb-1.5">Новый пароль</label>
                <input
                  type="password"
                  value={newPass}
                  onChange={e => setNewPass(e.target.value)}
                  placeholder="Минимум 8 символов"
                  className="w-full bg-[#0A0A0F] border border-[#1A2744] rounded-xl px-3 py-2.5 text-sm text-[#F0F4FF] placeholder-[#4A6080] outline-none focus:border-[#2979FF]/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-[#8FA8C8] mb-1.5">Подтвердите пароль</label>
                <input
                  type="password"
                  value={confirmPass}
                  onChange={e => setConfirmPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0A0A0F] border border-[#1A2744] rounded-xl px-3 py-2.5 text-sm text-[#F0F4FF] placeholder-[#4A6080] outline-none focus:border-[#2979FF]/50 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={!currentPass || !newPass || newPass !== confirmPass}
                className="px-4 py-2 bg-[#2979FF] hover:bg-[#1565C0] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Сменить пароль
              </button>
            </form>
          </div>
        </section>

        {/* Privacy */}
        <section className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-[#1A2744] flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#2979FF]/10 flex items-center justify-center">
              <Eye size={16} className="text-[#2979FF]" />
            </div>
            <div>
              <h2 className="font-semibold text-[#F0F4FF] text-sm">Приватность</h2>
              <p className="text-xs text-[#8FA8C8]">Управляйте видимостью вашего профиля</p>
            </div>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User size={15} className="text-[#8FA8C8]" />
                <div>
                  <div className="text-sm text-[#F0F4FF]">Показывать в рейтинге</div>
                  <div className="text-xs text-[#8FA8C8]">Ваш ник появится в таблице лидеров</div>
                </div>
              </div>
              <Toggle checked={showLeaderboard} onChange={v => { setShowLeaderboard(v); showToast(v ? 'Вы добавлены в рейтинг' : 'Вы скрыты из рейтинга') }} />
            </div>
            <div className="h-px bg-[#1A2744]" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BarChart3 size={15} className="text-[#8FA8C8]" />
                <div>
                  <div className="text-sm text-[#F0F4FF]">Делиться статистикой</div>
                  <div className="text-xs text-[#8FA8C8]">Разрешить другим видеть ваши достижения</div>
                </div>
              </div>
              <Toggle checked={shareStats} onChange={v => { setShareStats(v); showToast(v ? 'Статистика открыта для просмотра' : 'Статистика скрыта') }} />
            </div>
          </div>
        </section>

        {/* Danger zone */}
        <section className="bg-[#0D1B2E] border border-red-500/20 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-red-500/20 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center">
              <AlertTriangle size={16} className="text-red-400" />
            </div>
            <div>
              <h2 className="font-semibold text-red-400 text-sm">Опасная зона</h2>
              <p className="text-xs text-[#8FA8C8]">Необратимые действия с аккаунтом</p>
            </div>
          </div>
          <div className="p-5">
            {!deleteConfirm ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-[#F0F4FF]">Удалить аккаунт</div>
                  <div className="text-xs text-[#8FA8C8] mt-0.5">Все данные и статистика будут удалены без возможности восстановления</div>
                </div>
                <button
                  onClick={() => setDeleteConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-400 text-sm font-semibold rounded-xl transition-colors"
                >
                  <Trash2 size={14} /> Удалить
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                  <div className="flex items-start gap-2 text-sm text-red-300">
                    <AlertTriangle size={15} className="flex-shrink-0 mt-0.5" />
                    <span>Это действие необратимо. Введите <strong>УДАЛИТЬ</strong> для подтверждения.</span>
                  </div>
                </div>
                <input
                  type="text"
                  value={deleteInput}
                  onChange={e => setDeleteInput(e.target.value)}
                  placeholder="Введите УДАЛИТЬ"
                  className="w-full bg-[#0A0A0F] border border-red-500/30 rounded-xl px-3 py-2.5 text-sm text-[#F0F4FF] placeholder-[#4A6080] outline-none focus:border-red-500/60 transition-colors"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => { setDeleteConfirm(false); setDeleteInput('') }}
                    className="flex-1 px-4 py-2 bg-[#1A2744] hover:bg-[#243560] text-[#F0F4FF] text-sm font-semibold rounded-xl transition-colors"
                  >
                    Отмена
                  </button>
                  <button
                    disabled={deleteInput !== 'УДАЛИТЬ'}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 size={14} /> Удалить навсегда
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </DashboardShell>
  )
}
