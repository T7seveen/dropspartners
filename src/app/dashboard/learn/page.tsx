import { DashboardShell } from '@/components/layout/DashboardShell'
import { BookOpen, Play, Clock, CheckCircle, Lock } from 'lucide-react'

const modules = [
  {
    id:1, title:'Основы партнёрского маркетинга', icon:'🚀', free:true, progress:100,
    lessons:[
      { title:'Что такое CPA, CPL, RevShare и дропшиппинг', done:true, duration:8 },
      { title:'Как работает трекинг и реферальная ссылка', done:true, duration:6 },
      { title:'Выбор первого оффера: на что смотреть', done:true, duration:10 },
      { title:'Как считать ROI и окупаемость', done:true, duration:7 },
    ]
  },
  {
    id:2, title:'Привлечение трафика из соцсетей', icon:'📱', free:true, progress:50,
    lessons:[
      { title:'Трафик из Instagram: Reels и Stories', done:true, duration:12 },
      { title:'Telegram-каналы и рассылки', done:true, duration:9 },
      { title:'TikTok для партнёрских ссылок', done:false, duration:11 },
      { title:'ВКонтакте: паблики и таргет', done:false, duration:8 },
    ]
  },
  {
    id:3, title:'SEO и контент-маркетинг', icon:'🔍', free:true, progress:0,
    lessons:[
      { title:'Создание нишевого сайта под оффер', done:false, duration:15 },
      { title:'Написание обзоров и сравнений', done:false, duration:10 },
      { title:'Ключевые слова и семантика', done:false, duration:12 },
    ]
  },
  {
    id:4, title:'Платный трафик и арбитраж', icon:'💰', free:false, progress:0,
    lessons:[
      { title:'Яндекс.Директ для CPA', done:false, duration:18 },
      { title:'ВКонтакте Ads: настройка и оптимизация', done:false, duration:14 },
      { title:'Таргет на зарубежные офферы', done:false, duration:16 },
      { title:'Аналитика и масштабирование связок', done:false, duration:20 },
    ]
  },
  {
    id:5, title:'Дропшиппинг: полный курс', icon:'📦', free:false, progress:0,
    lessons:[
      { title:'Как выбрать товар и нишу', done:false, duration:13 },
      { title:'Авито и маркетплейсы для дропа', done:false, duration:11 },
      { title:'Автоматизация заказов и логистики', done:false, duration:15 },
    ]
  },
]

export default function LearnPage() {
  const totalDone = modules.reduce((s,m) => s + m.lessons.filter(l=>l.done).length, 0)
  const totalLessons = modules.reduce((s,m) => s + m.lessons.length, 0)

  return (
    <DashboardShell title="Центр обучения">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#2979FF]/15 to-[#0D1B2E] border border-[#2979FF]/25 rounded-2xl p-5 mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-bold text-[#F0F4FF] text-lg">Изучайте партнёрский маркетинг</h2>
          <p className="text-[#8FA8C8] text-sm mt-1">Пошаговые курсы от практиков — от нуля до стабильного дохода</p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-[#2979FF]">{totalDone}/{totalLessons}</div>
          <div className="text-xs text-[#8FA8C8]">уроков пройдено</div>
          <div className="mt-2 h-2 w-32 bg-[#1A2744] rounded-full overflow-hidden">
            <div className="h-full bg-[#2979FF] rounded-full transition-all" style={{ width:`${(totalDone/totalLessons*100).toFixed(0)}%` }}/>
          </div>
        </div>
      </div>

      {/* Modules */}
      <div className="space-y-4">
        {modules.map(m => (
          <div key={m.id} className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl overflow-hidden">
            <div className="p-4 flex items-center gap-4">
              <span className="text-2xl">{m.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-[#F0F4FF] text-sm">{m.title}</h3>
                  {!m.free && <span className="text-[10px] bg-[#FFB930]/20 text-[#FFB930] border border-[#FFB930]/30 px-2 py-0.5 rounded-full font-semibold">PRO</span>}
                  {m.free && <span className="text-[10px] bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full font-semibold">БЕСПЛАТНО</span>}
                </div>
                <div className="flex items-center gap-3 text-xs text-[#8FA8C8]">
                  <span className="flex items-center gap-1"><BookOpen size={11}/> {m.lessons.length} уроков</span>
                  <span className="flex items-center gap-1"><Clock size={11}/> {m.lessons.reduce((s,l)=>s+l.duration,0)} мин</span>
                  {m.progress > 0 && <span className="text-[#2979FF]">{m.progress}% пройдено</span>}
                </div>
              </div>
              {m.progress > 0 && (
                <div className="w-16">
                  <div className="h-1.5 bg-[#1A2744] rounded-full overflow-hidden">
                    <div className="h-full bg-[#2979FF] rounded-full" style={{ width:`${m.progress}%` }}/>
                  </div>
                </div>
              )}
            </div>

            {/* Lessons */}
            <div className="border-t border-[#1A2744] divide-y divide-[#1A2744]">
              {m.lessons.map((l, li) => (
                <div key={li} className="px-4 py-3 flex items-center gap-3 hover:bg-[#1A2744]/30 transition-colors">
                  <div className="w-5 h-5 flex-shrink-0">
                    {l.done
                      ? <CheckCircle size={18} className="text-green-400"/>
                      : !m.free
                        ? <Lock size={16} className="text-[#8FA8C8]/50"/>
                        : <div className="w-5 h-5 rounded-full border-2 border-[#2979FF]/40"/>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm truncate ${l.done ? 'text-[#8FA8C8]' : !m.free ? 'text-[#8FA8C8]/50' : 'text-[#F0F4FF]'}`}>
                      {l.title}
                    </div>
                  </div>
                  <span className="text-xs text-[#8FA8C8] flex-shrink-0 flex items-center gap-1">
                    <Clock size={10}/> {l.duration} мин
                  </span>
                  {(m.free || l.done) && (
                    <button className="flex-shrink-0 w-7 h-7 rounded-lg bg-[#2979FF]/10 hover:bg-[#2979FF]/20 flex items-center justify-center transition-colors">
                      <Play size={12} className="text-[#2979FF]"/>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  )
}
