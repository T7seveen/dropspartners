'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', ref: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.password.length < 8) {
      setError('Пароль должен содержать минимум 8 символов')
      return
    }

    setLoading(true)
    try {
      // Server-side rate-limited register (max 3 attempts / 5 min per IP)
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          full_name: form.name,
          ref_code: form.ref || undefined,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Ошибка регистрации')
        return
      }

      if (data.dev) {
        // Dev/demo mode — go straight to onboarding
        router.push('/onboarding')
        router.refresh()
        return
      }

      // Sync session & redirect to onboarding wizard
      const supabase = createClient()
      await supabase.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      })
      router.push('/onboarding')
      router.refresh()
    } catch {
      setError('Ошибка соединения. Попробуйте позже.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 justify-center mb-4">
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 rounded-full bg-[#2979FF]"/>
              <div className="absolute inset-[30%] rounded-full bg-[#0A0A0F]"/>
              <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#00D4FF]"/>
            </div>
            <div>
              <div className="font-bold text-[#F0F4FF] text-base tracking-wide">DROPS</div>
              <div className="text-[#2979FF] text-xs font-semibold tracking-widest -mt-0.5">PARTNERS</div>
            </div>
          </Link>
          <h1 className="text-xl font-bold text-[#F0F4FF]">Создать аккаунт</h1>
          <p className="text-[#8FA8C8] text-sm mt-1">Бесплатно. Без верификации.</p>
        </div>

        <form onSubmit={handleRegister} className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-red-400 text-sm">
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          {[
            { label: 'Ваше имя', key: 'name', type: 'text', placeholder: 'Иван Иванов', autocomplete: 'name' },
            { label: 'Email', key: 'email', type: 'email', placeholder: 'you@email.com', autocomplete: 'email' },
            { label: 'Пароль (минимум 8 символов)', key: 'password', type: 'password', placeholder: '••••••••', autocomplete: 'new-password' },
            { label: 'Реферальный код (если есть)', key: 'ref', type: 'text', placeholder: 'dp_xxxxxxxx', autocomplete: 'off' },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs text-[#8FA8C8] mb-1.5 block font-medium">{f.label}</label>
              <input
                type={f.type}
                value={(form as any)[f.key]}
                onChange={set(f.key)}
                placeholder={f.placeholder}
                autoComplete={f.autocomplete}
                required={f.key !== 'ref'}
                minLength={f.key === 'password' ? 8 : undefined}
                className="w-full bg-[#1A2744] border border-[#2979FF]/20 rounded-xl px-3 py-2.5 text-sm text-[#F0F4FF] placeholder-[#8FA8C8] outline-none focus:border-[#2979FF] transition-colors"
              />
            </div>
          ))}

          <Button type="submit" loading={loading} className="w-full">
            Зарегистрироваться <ArrowRight size={16}/>
          </Button>

          <p className="text-center text-xs text-[#8FA8C8]">
            Регистрируясь, вы принимаете{' '}
            <Link href="/terms" className="text-[#2979FF] hover:underline">условия использования</Link>
          </p>
        </form>

        <p className="text-center text-sm text-[#8FA8C8] mt-4">
          Уже есть аккаунт?{' '}
          <Link href="/auth/login" className="text-[#2979FF] hover:underline font-medium">Войти</Link>
        </p>
      </div>
    </div>
  )
}
