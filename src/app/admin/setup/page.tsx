'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
  Database, Bot, Key, CheckCircle2, Copy, ExternalLink,
  ChevronDown, ChevronRight, ArrowLeft, Zap,
} from 'lucide-react'

function CopyBlock({ code, lang = 'bash' }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="relative group">
      <pre className="bg-[#0A0A0F] border border-[#1A2744] rounded-xl p-4 text-xs text-[#C8DCFF] font-mono overflow-x-auto whitespace-pre-wrap">
        {code}
      </pre>
      <button
        onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
        className="absolute top-2 right-2 flex items-center gap-1.5 bg-[#1A2744] hover:bg-[#243560] text-[#8FA8C8] hover:text-white text-[10px] px-2 py-1 rounded-lg transition-all opacity-0 group-hover:opacity-100"
      >
        {copied ? <CheckCircle2 size={10} className="text-green-400" /> : <Copy size={10} />}
        {copied ? 'Скопировано' : 'Копировать'}
      </button>
    </div>
  )
}

function Step({ n, title, done, children }: { n: number; title: string; done?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(n === 1)
  return (
    <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-4 p-5 hover:bg-[#1A2744]/30 transition-colors text-left"
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${done ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-[#2979FF]/15 text-[#2979FF] border border-[#2979FF]/25'}`}>
          {done ? <CheckCircle2 size={16} /> : n}
        </div>
        <span className="font-semibold text-[#F0F4FF] flex-1">{title}</span>
        {open ? <ChevronDown size={16} className="text-[#8FA8C8]" /> : <ChevronRight size={16} className="text-[#8FA8C8]" />}
      </button>
      {open && <div className="px-5 pb-5 space-y-4 border-t border-[#1A2744]">{children}</div>}
    </div>
  )
}

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      {/* Header */}
      <div className="border-b border-[#1A2744] bg-[#0D1B2E] px-6 py-4 flex items-center gap-4">
        <Link href="/admin" className="flex items-center gap-1.5 text-[#8FA8C8] hover:text-white transition-colors text-sm">
          <ArrowLeft size={14} /> Назад
        </Link>
        <div className="h-4 w-px bg-[#1A2744]" />
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-[#2979FF]" />
          <span className="font-bold text-[#F0F4FF]">Настройка платформы</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#F0F4FF] mb-2">Запуск Drops Partners</h1>
          <p className="text-[#8FA8C8]">Следуйте шагам ниже, чтобы подключить базу данных, Telegram-бота и запустить платформу.</p>
        </div>

        {/* ── Step 1: Supabase project ── */}
        <Step n={1} title="Создать проект Supabase (база данных)">
          <p className="text-sm text-[#8FA8C8] pt-3">Supabase — бесплатная облачная PostgreSQL. Бесплатный план включает 500MB и до 50 000 пользователей.</p>

          <ol className="space-y-2 text-sm text-[#C8DCFF]">
            <li className="flex gap-2"><span className="text-[#2979FF] font-bold shrink-0">1.</span> Перейдите на <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-[#2979FF] hover:underline inline-flex items-center gap-1">supabase.com <ExternalLink size={12}/></a> и нажмите <b>New project</b></li>
            <li className="flex gap-2"><span className="text-[#2979FF] font-bold shrink-0">2.</span> Выберите регион <b>EU West</b> или <b>US East</b>, задайте название и пароль БД</li>
            <li className="flex gap-2"><span className="text-[#2979FF] font-bold shrink-0">3.</span> Дождитесь запуска (~1 минута), перейдите в <b>Settings → API</b></li>
            <li className="flex gap-2"><span className="text-[#2979FF] font-bold shrink-0">4.</span> Скопируйте <b>Project URL</b>, <b>anon key</b> и <b>service_role key</b></li>
          </ol>
        </Step>

        {/* ── Step 2: Run SQL ── */}
        <Step n={2} title="Применить схему базы данных">
          <p className="text-sm text-[#8FA8C8] pt-3">В Supabase → <b>SQL Editor</b> выполните эти два файла по порядку:</p>

          <div className="space-y-3">
            <div>
              <div className="text-xs text-[#8FA8C8] mb-1.5 font-semibold uppercase tracking-wide">1. Основная схема (supabase_schema.sql)</div>
              <div className="flex gap-2">
                <a href="https://github.com/T7seveen/dropspartners/blob/master/supabase_schema.sql" target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs text-[#2979FF] hover:underline">
                  <ExternalLink size={12} /> Открыть на GitHub
                </a>
              </div>
            </div>
            <div>
              <div className="text-xs text-[#8FA8C8] mb-1.5 font-semibold uppercase tracking-wide">2. Миграции (supabase_migrations.sql)</div>
              <div className="flex gap-2">
                <a href="https://github.com/T7seveen/dropspartners/blob/master/supabase_migrations.sql" target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs text-[#2979FF] hover:underline">
                  <ExternalLink size={12} /> Открыть на GitHub
                </a>
              </div>
            </div>
          </div>

          <div className="p-3 bg-amber-950/30 border border-amber-500/20 rounded-xl text-amber-400 text-xs">
            ⚠️ Выполняйте файлы строго в порядке: сначала schema.sql, потом migrations.sql
          </div>
        </Step>

        {/* ── Step 3: .env.local ── */}
        <Step n={3} title="Настроить переменные окружения (.env.local)">
          <p className="text-sm text-[#8FA8C8] pt-3">Создайте файл <code className="text-[#C8DCFF] bg-[#1A2744] px-1.5 py-0.5 rounded">.env.local</code> в корне проекта:</p>

          <CopyBlock code={`# Supabase (из Settings → API вашего проекта)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# URL вашего сайта
NEXT_PUBLIC_APP_URL=https://ваш-домен.ru

# Ключ для вебхуков конверсий (придумайте любой)
CONVERSION_API_KEY=secret-key-123

# Telegram бот (из @BotFather)
TELEGRAM_BOT_TOKEN=1234567890:AABBCCDDEEFFaabbccddeeff
TELEGRAM_ADMIN_CHAT_ID=ваш-chat-id

# Секрет для cron-задачи
CRON_SECRET=cron-secret-123`} />
        </Step>

        {/* ── Step 4: Telegram bot ── */}
        <Step n={4} title="Создать Telegram-бот для уведомлений">
          <div className="pt-3 space-y-3">
            <ol className="space-y-2 text-sm text-[#C8DCFF]">
              <li className="flex gap-2"><span className="text-[#2979FF] font-bold shrink-0">1.</span> Откройте <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" className="text-[#2979FF] hover:underline">@BotFather</a> в Telegram</li>
              <li className="flex gap-2"><span className="text-[#2979FF] font-bold shrink-0">2.</span> Отправьте <code className="bg-[#1A2744] px-1 rounded">/newbot</code>, задайте имя и username (должен заканчиваться на <code className="bg-[#1A2744] px-1 rounded">_bot</code>)</li>
              <li className="flex gap-2"><span className="text-[#2979FF] font-bold shrink-0">3.</span> Скопируйте токен — вставьте в <code className="bg-[#1A2744] px-1 rounded">TELEGRAM_BOT_TOKEN</code></li>
              <li className="flex gap-2"><span className="text-[#2979FF] font-bold shrink-0">4.</span> Узнайте свой chat_id — напишите боту <a href="https://t.me/userinfobot" target="_blank" rel="noreferrer" className="text-[#2979FF] hover:underline">@userinfobot</a> — вставьте в <code className="bg-[#1A2744] px-1 rounded">TELEGRAM_ADMIN_CHAT_ID</code></li>
            </ol>

            <div className="p-3 bg-[#1A2744]/50 rounded-xl text-xs text-[#8FA8C8]">
              Бот нужен для: уведомлений об новых конверсиях партнёров, запросах на вывод, и связки аккаунта с Telegram через профиль.
            </div>
          </div>
        </Step>

        {/* ── Step 5: First admin user ── */}
        <Step n={5} title="Создать первого администратора">
          <div className="pt-3 space-y-3">
            <ol className="space-y-2 text-sm text-[#C8DCFF]">
              <li className="flex gap-2"><span className="text-[#2979FF] font-bold shrink-0">1.</span> Зарегистрируйтесь через <Link href="/auth/register" className="text-[#2979FF] hover:underline">/auth/register</Link></li>
              <li className="flex gap-2"><span className="text-[#2979FF] font-bold shrink-0">2.</span> В Supabase → <b>Table Editor → profiles</b> найдите свою запись</li>
              <li className="flex gap-2"><span className="text-[#2979FF] font-bold shrink-0">3.</span> Измените поле <code className="bg-[#1A2744] px-1 rounded">role</code> с <code className="bg-[#1A2744] px-1 rounded">partner</code> на <code className="bg-[#1A2744] px-1 rounded">admin</code></li>
              <li className="flex gap-2"><span className="text-[#2979FF] font-bold shrink-0">4.</span> Перезайдите — увидите раздел «Админ» в меню</li>
            </ol>
          </div>
        </Step>

        {/* ── Step 6: Deploy ── */}
        <Step n={6} title="Деплой на Vercel (production)">
          <div className="pt-3 space-y-3">
            <ol className="space-y-2 text-sm text-[#C8DCFF]">
              <li className="flex gap-2"><span className="text-[#2979FF] font-bold shrink-0">1.</span> Зайдите на <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-[#2979FF] hover:underline">vercel.com</a>, импортируйте репозиторий <code className="bg-[#1A2744] px-1 rounded">T7seveen/dropspartners</code></li>
              <li className="flex gap-2"><span className="text-[#2979FF] font-bold shrink-0">2.</span> В разделе <b>Environment Variables</b> добавьте все переменные из .env.local</li>
              <li className="flex gap-2"><span className="text-[#2979FF] font-bold shrink-0">3.</span> Нажмите <b>Deploy</b>. Cron-задача на обработку холда уже настроена в <code className="bg-[#1A2744] px-1 rounded">vercel.json</code> (ежедневно в 03:00)</li>
            </ol>

            <div className="p-3 bg-green-950/30 border border-green-500/20 rounded-xl text-green-400 text-xs">
              ✅ После деплоя обновите <code className="bg-green-950/50 px-1 rounded">NEXT_PUBLIC_APP_URL</code> на реальный домен и передеплойте.
            </div>
          </div>
        </Step>

        {/* ── Step 7: Test referral flow ── */}
        <Step n={7} title="Проверить работу реферальных ссылок">
          <div className="pt-3 space-y-3">
            <p className="text-sm text-[#8FA8C8]">Убедитесь, что полная цепочка работает:</p>
            <ol className="space-y-2 text-sm text-[#C8DCFF]">
              <li className="flex gap-2"><span className="text-[#2979FF] font-bold shrink-0">1.</span> Зайдите под партнёром → Офферы → <b>Взять оффер</b> → скопируйте ссылку</li>
              <li className="flex gap-2"><span className="text-[#2979FF] font-bold shrink-0">2.</span> Перейдите по ссылке в новой вкладке — в Мои ссылки должен появиться +1 клик</li>
              <li className="flex gap-2"><span className="text-[#2979FF] font-bold shrink-0">3.</span> Эмулируйте конверсию curl-запросом:</li>
            </ol>
            <CopyBlock lang="bash" code={`curl -X POST https://ваш-домен.ru/api/track/conversion \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ваш-CONVERSION_API_KEY" \\
  -d '{"click_id":"<uuid из dp_click cookie>","offer_id":"<id оффера>","type":"sale"}'`} />
            <p className="text-xs text-[#8FA8C8]">После запроса конверсия появится в дашборде со статусом «В ожидании» (холд 14 дней). После одобрения — сумма зачислится на баланс.</p>
          </div>
        </Step>

        {/* Quick links */}
        <div className="bg-[#0D1B2E] border border-[#1A2744] rounded-2xl p-5">
          <h3 className="font-semibold text-[#F0F4FF] mb-4 flex items-center gap-2">
            <Key size={16} className="text-[#2979FF]" /> Полезные ссылки
          </h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { label: 'Supabase Dashboard', href: 'https://supabase.com/dashboard', icon: Database },
              { label: 'Telegram BotFather', href: 'https://t.me/BotFather', icon: Bot },
              { label: 'GitHub репозиторий', href: 'https://github.com/T7seveen/dropspartners', icon: ExternalLink },
              { label: 'Vercel Deploy', href: 'https://vercel.com/new', icon: Zap },
            ].map(({ label, href, icon: Icon }) => (
              <a key={href} href={href} target="_blank" rel="noreferrer"
                className="flex items-center gap-2.5 px-3 py-2.5 bg-[#1A2744]/50 hover:bg-[#1A2744] rounded-xl text-sm text-[#C8DCFF] hover:text-white transition-all">
                <Icon size={14} className="text-[#2979FF]" />
                {label}
                <ExternalLink size={10} className="ml-auto text-[#8FA8C8]" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
