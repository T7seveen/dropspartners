'use client'
import { useState } from 'react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { Plus, Edit2, Eye, Trash2, FileText, Send } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'

const posts = [
  { id:'1', title:'Как заработать на крипто-трафике в 2024', category:'tutorial', status:'published', views:1842, date:'2024-01-20' },
  { id:'2', title:'Топ-10 офферов января: разбираем условия', category:'promo', status:'published', views:967, date:'2024-01-15' },
  { id:'3', title:'Дропшиппинг от производителя: как это работает у нас', category:'case', status:'published', views:534, date:'2024-01-10' },
  { id:'4', title:'Новые офферы февраля — анонс', category:'news', status:'draft', views:0, date:'2024-01-25' },
]

const catLabel: Record<string,string> = { tutorial:'Обучение', promo:'Акция', case:'Кейс', news:'Новость' }
const catVariant: Record<string,any> = { tutorial:'blue', promo:'amber', case:'green', news:'purple' }

export default function AdminBlogPage() {
  const [showEditor, setShowEditor] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('news')

  return (
    <DashboardShell title="Блог и контент" role="admin">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 text-sm text-[#8FA8C8]">
          <FileText size={16}/> {posts.length} материалов · {posts.filter(p=>p.status==='published').length} опубликовано
        </div>
        <Button onClick={() => setShowEditor(!showEditor)}>
          <Plus size={16}/> Новая статья
        </Button>
      </div>

      {/* Editor */}
      {showEditor && (
        <div className="bg-[#0D1B2E] border border-[#2979FF]/30 rounded-2xl p-5 mb-5 animate-fadeIn space-y-3">
          <h3 className="font-semibold text-[#F0F4FF]">Новая статья</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#8FA8C8] mb-1 block">Заголовок</label>
              <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Заголовок статьи..."
                className="w-full bg-[#1A2744] border border-[#2979FF]/20 rounded-xl px-3 py-2 text-sm text-[#F0F4FF] placeholder-[#8FA8C8] outline-none focus:border-[#2979FF]"/>
            </div>
            <div>
              <label className="text-xs text-[#8FA8C8] mb-1 block">Категория</label>
              <select value={category} onChange={e=>setCategory(e.target.value)}
                className="w-full bg-[#1A2744] border border-[#2979FF]/20 rounded-xl px-3 py-2 text-sm text-[#F0F4FF] outline-none cursor-pointer">
                <option value="news">Новость</option>
                <option value="tutorial">Обучение</option>
                <option value="case">Кейс</option>
                <option value="promo">Акция</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-[#8FA8C8] mb-1 block">Контент (Markdown поддерживается)</label>
            <textarea value={content} onChange={e=>setContent(e.target.value)} rows={8}
              placeholder="# Заголовок&#10;&#10;Ваш текст здесь...&#10;&#10;**Жирный** и *курсив* поддерживаются."
              className="w-full bg-[#1A2744] border border-[#2979FF]/20 rounded-xl px-3 py-2.5 text-sm text-[#F0F4FF] placeholder-[#8FA8C8] outline-none resize-none font-mono focus:border-[#2979FF]"/>
          </div>
          <div className="flex gap-2">
            <Button size="sm"><Send size={14}/> Опубликовать</Button>
            <Button variant="secondary" size="sm">Сохранить черновик</Button>
            <Button variant="ghost" size="sm" onClick={()=>setShowEditor(false)}>Отмена</Button>
          </div>
        </div>
      )}

      {/* Posts list */}
      <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1A2744]">
              {['Статья','Категория','Статус','Просмотры','Дата','Действия'].map(h=>(
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#8FA8C8] uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A2744]">
            {posts.map(p=>(
              <tr key={p.id} className="hover:bg-[#1A2744]/20 transition-colors">
                <td className="px-4 py-3 max-w-xs">
                  <div className="text-sm font-medium text-[#F0F4FF] line-clamp-1">{p.title}</div>
                </td>
                <td className="px-4 py-3"><Badge variant={catVariant[p.category]}>{catLabel[p.category]}</Badge></td>
                <td className="px-4 py-3">
                  <Badge variant={p.status==='published'?'green':'default'}>
                    {p.status==='published'?'Опубликовано':'Черновик'}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-[#F0F4FF]">{p.views.toLocaleString('ru')}</td>
                <td className="px-4 py-3 text-sm text-[#8FA8C8]">{formatDate(p.date)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="text-[#8FA8C8] hover:text-[#2979FF]"><Edit2 size={14}/></button>
                    <button className="text-[#8FA8C8] hover:text-[#F0F4FF]"><Eye size={14}/></button>
                    <button className="text-[#8FA8C8] hover:text-red-400"><Trash2 size={14}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  )
}
