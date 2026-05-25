'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // const supabase = createClient()
    // const { error } = await supabase.auth.signInWithPassword({ email, password })
    // if (!error) router.push('/dashboard')
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    window.location.href = '/dashboard'
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
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
          <h1 className="text-xl font-bold text-[#F0F4FF]">Войдите в аккаунт</h1>
          <p className="text-[#8FA8C8] text-sm mt-1">Добро пожаловать обратно</p>
        </div>

        <form onSubmit={handleLogin} className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-xs text-[#8FA8C8] mb-1.5 block font-medium">Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="you@email.com"
              className="w-full bg-[#1A2744] border border-[#2979FF]/20 rounded-xl px-3 py-2.5 text-sm text-[#F0F4FF] placeholder-[#8FA8C8] outline-none focus:border-[#2979FF] transition-colors"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs text-[#8FA8C8] font-medium">Пароль</label>
              <Link href="/auth/forgot" className="text-xs text-[#2979FF] hover:underline">Забыли?</Link>
            </div>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="••••••••"
                className="w-full bg-[#1A2744] border border-[#2979FF]/20 rounded-xl px-3 py-2.5 pr-10 text-sm text-[#F0F4FF] placeholder-[#8FA8C8] outline-none focus:border-[#2979FF] transition-colors"
              />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8FA8C8] hover:text-white">
                {show ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>
            </div>
          </div>
          <Button type="submit" loading={loading} className="w-full">
            Войти <ArrowRight size={16}/>
          </Button>
        </form>

        <p className="text-center text-sm text-[#8FA8C8] mt-4">
          Нет аккаунта?{' '}
          <Link href="/auth/register" className="text-[#2979FF] hover:underline font-medium">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  )
}
