'use client'
import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle, ArrowLeft, Building2, TrendingUp, Users, Zap } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const benefits = [
  { icon: Users, title: 'Сеть 247+ партнёров', desc: 'Получайте клиентов через проверенную сеть арбитражников и владельцев трафика' },
  { icon: TrendingUp, title: 'Платите за результат', desc: 'CPA, CPL, RevShare — платите только за реальные конверсии, не за клики' },
  { icon: Zap, title: 'Быстрый старт', desc: 'Оффер выходит в каталог в течение 24 часов после одобрения' },
  { icon: Building2, title: 'B2B специализация', desc: 'Производства, строительство, заводы — наша аудитория знает B2B' },
]

export default function AdvertiserPage() {
  const [form, setForm] = useState({ name:'', email:'', company:'', website:'', offer_type:'cpa', description:'', budget:'' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setDone(true)
  }

  if (done) return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <CheckCircle size={56} className="text-green-400 mx-auto mb-4"/>
        <h2 className="text-xl font-bold text-[#F0F4FF] mb-2">Заявка отправлена!</h2>
        <p className="text-[#8FA8C8] text-sm mb-6">Мы рассмотрим вашу заявку в течение 24 часов и свяжемся с вами.</p>
        <Link href="/" className="inline-flex items-center gap-2 bg-[#2979FF] text-white font-semibold px-6 py-2.5 rounded-xl">
          На главную
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F0F4FF]">
      <nav className="border-b border-[#1A2744] bg-[#0A0A0F]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-[#8FA8C8] hover:text-white text-sm transition-colors">
            <ArrowLeft size={16}/> Назад
          </Link>
          <span className="font-bold text-sm tracking-wide">DROPS PARTNERS</span>
          <span className="text-[#2979FF] text-xs font-semibold tracking-widest">· ДЛЯ РЕКЛАМОДАТЕЛЕЙ</span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-3">Разместите свой оффер</h1>
          <p className="text-[#8FA8C8] max-w-xl mx-auto">Получайте клиентов через нашу партнёрскую сеть. Платите только за результат.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {benefits.map(b => (
            <div key={b.title} className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-5 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#2979FF]/10 flex items-center justify-center flex-shrink-0"><b.icon size={20} className="text-[#2979FF]"/></div>
              <div><h3 className="font-semibold text-[#F0F4FF] mb-1">{b.title}</h3><p className="text-sm text-[#8FA8C8]">{b.desc}</p></div>
            </div>
          ))}
        </div>

        <div className="max-w-xl mx-auto">
          <form onSubmit={submit} className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-6 space-y-4">
            <h2 className="font-bold text-[#F0F4FF] text-base mb-2">Заявка на размещение</h2>
            {[
              { label:'Контактное лицо', key:'name', type:'text', placeholder:'Иван Иванов', required:true },
              { label:'Email', key:'email', type:'email', placeholder:'ivan@company.ru', required:true },
              { label:'Компания', key:'company', type:'text', placeholder:'ООО Ромашка', required:true },
              { label:'Сайт', key:'website', type:'url', placeholder:'https://company.ru', required:false },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs text-[#8FA8C8] mb-1.5 block">{f.label}</label>
                <input type={f.type} value={(form as any)[f.key]} onChange={set(f.key)} placeholder={f.placeholder} required={f.required}
                  className="w-full bg-[#1A2744] border border-[#2979FF]/20 rounded-xl px-3 py-2.5 text-sm text-[#F0F4FF] placeholder-[#8FA8C8] outline-none focus:border-[#2979FF]"/>
              </div>
            ))}
            <div>
              <label className="text-xs text-[#8FA8C8] mb-1.5 block">Тип оффера</label>
              <select value={form.offer_type} onChange={set('offer_type')}
                className="w-full bg-[#1A2744] border border-[#2979FF]/20 rounded-xl px-3 py-2.5 text-sm text-[#F0F4FF] outline-none cursor-pointer">
                <option value="cpa">CPA — за целевое действие</option>
                <option value="cpl">CPL — за лид/заявку</option>
                <option value="revshare">RevShare — % от продажи</option>
                <option value="dropship">Дропшиппинг — товары от производителя</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-[#8FA8C8] mb-1.5 block">Описание оффера и продукта</label>
              <textarea value={form.description} onChange={set('description')} rows={3} required placeholder="Чем занимается компания, что хотите продвигать..."
                className="w-full bg-[#1A2744] border border-[#2979FF]/20 rounded-xl px-3 py-2.5 text-sm text-[#F0F4FF] placeholder-[#8FA8C8] outline-none resize-none focus:border-[#2979FF]"/>
            </div>
            <Button type="submit" loading={loading} className="w-full">Отправить заявку</Button>
          </form>
        </div>
      </div>
    </div>
  )
}
