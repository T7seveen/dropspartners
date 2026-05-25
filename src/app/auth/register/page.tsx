'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function RegisterPage() {
  const [form, setForm] = useState({ name:'', email:'', password:'', ref:'' })
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'form'|'done'>('form')

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // const supabase = createClient()
    // const { error } = await supabase.auth.signUp({ email: form.email, password: form.password, options: { data: { full_name: form.name } } })
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setStep('done')
  }

  if (step === 'done') {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-4">
        <div className="text-center">
          <CheckCircle size={56} className="text-green-400 mx-auto mb-4"/>
          <h2 className="text-xl font-bold text-[#F0F4FF] mb-2">Аккаунт создан!</h2>
          <p className="text-[#8FA8C8] text-sm mb-6">Проверьте почту для подтверждения.</p>
          <Link href="/auth/login" className="inline-flex items-center gap-2 bg-[#2979FF] text-white font-semibold px-6 py-2.5 rounded-xl">
            Войти <ArrowRight size={16}/>
          </Link>
        </div>
      </div>
    )
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
          {[
            { label:'Ваше имя', key:'name', type:'text', placeholder:'Иван Иванов' },
            { label:'Email', key:'email', type:'email', placeholder:'you@email.com' },
            { label:'Пароль', key:'password', type:'password', placeholder:'Минимум 8 символов' },
            { label:'Реферальный код (если есть)', key:'ref', type:'text', placeholder:'dp_xxxxxxxx' },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs text-[#8FA8C8] mb-1.5 block font-medium">{f.label}</label>
              <input
                type={f.type} value={(form as any)[f.key]} onChange={set(f.key)}
                placeholder={f.placeholder} required={f.key !== 'ref'}
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
