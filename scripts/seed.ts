/**
 * Drops Partners — Database Seed Script
 *
 * Usage:
 *   npx tsx scripts/seed.ts
 *
 * Requires env vars:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Creates:
 *   - 1 admin user
 *   - 3 advertiser users
 *   - 15 partner users
 *   - 10 learning modules with lessons
 *   - Seeds referral links + clicks + conversions for demo partners
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

// Load .env.local manually (tsx/node doesn't auto-load it)
try {
  const envPath = join(process.cwd(), '.env.local')
  const lines = readFileSync(envPath, 'utf8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx < 0) continue
    const key = trimmed.slice(0, idx).trim()
    const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[key]) process.env[key] = val
  }
} catch {
  // .env.local not found — rely on shell env vars
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ── Helpers ───────────────────────────────────────────────────────

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function daysAgo(n: number) {
  return new Date(Date.now() - n * 86400000).toISOString()
}

async function createAuthUser(email: string, password: string, meta: Record<string, string>) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: meta,
  })
  if (error) {
    if (error.message.includes('already registered')) {
      console.log(`  ⚠️  User ${email} already exists, skipping`)
      const { data: existingUsers } = await supabase.auth.admin.listUsers()
      return existingUsers?.users?.find(u => u.email === email) ?? null
    }
    console.error(`  ❌ Failed to create ${email}:`, error.message)
    return null
  }
  return data.user
}

// ── Main ──────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Seeding Drops Partners database...\n')

  // ── 1. Admin ──────────────────────────────────────────────────
  console.log('👤 Creating admin user...')
  const admin = await createAuthUser('admin@drops.agency', 'Admin123!@#', {
    full_name: 'Drops Admin',
  })
  if (admin) {
    await supabase
      .from('profiles')
      .update({ role: 'admin', username: 'drops_admin', status: 'active' })
      .eq('id', admin.id)
    console.log('  ✅ admin@drops.agency / Admin123!@#')
  }

  // ── 2. Advertisers ────────────────────────────────────────────
  console.log('\n🏢 Creating advertiser users...')
  const advertisers = [
    { email: 'bybit@advertiser.test', name: 'Bybit Marketing', username: 'bybit_ads' },
    { email: 'nordvpn@advertiser.test', name: 'NordVPN Team', username: 'nordvpn_ads' },
    { email: 'skillbox@advertiser.test', name: 'Skillbox Affiliates', username: 'skillbox_ads' },
  ]

  for (const adv of advertisers) {
    const user = await createAuthUser(adv.email, 'Advertiser123!', { full_name: adv.name })
    if (user) {
      await supabase
        .from('profiles')
        .update({ role: 'advertiser', username: adv.username, status: 'active' })
        .eq('id', user.id)
      console.log(`  ✅ ${adv.email}`)
    }
  }

  // ── 3. Partners ───────────────────────────────────────────────
  console.log('\n🤝 Creating partner users...')
  const partnerNames = [
    ['Алексей Смирнов', 'alex_smirn'],
    ['Мария Иванова', 'maria_iv'],
    ['Дмитрий Петров', 'dima_petrov'],
    ['Ольга Кузнецова', 'olga_kuz'],
    ['Иван Новиков', 'ivan_nov'],
    ['Анна Козлова', 'anna_koz'],
    ['Сергей Морозов', 'sergey_m'],
    ['Екатерина Попова', 'kate_pop'],
    ['Андрей Волков', 'andrey_v'],
    ['Наталья Соколова', 'natasha_s'],
    ['Павел Михайлов', 'pavel_m'],
    ['Юлия Новикова', 'yulia_n'],
    ['Роман Федоров', 'roman_f'],
    ['Светлана Орлова', 'sveta_o'],
    ['Кирилл Зайцев', 'kirill_z'],
  ]

  const partnerIds: string[] = []

  for (let i = 0; i < partnerNames.length; i++) {
    const [name, username] = partnerNames[i]
    const email = `partner${i + 1}@test.com`
    const user = await createAuthUser(email, 'Partner123!', { full_name: name })
    if (user) {
      const earned = randomBetween(5000, 250000)
      const paid = Math.floor(earned * randomBetween(30, 70) / 100)
      const balance = earned - paid
      await supabase
        .from('profiles')
        .update({
          role: 'partner',
          username,
          status: 'active',
          balance,
          total_earned: earned,
          total_paid: paid,
        })
        .eq('id', user.id)
      partnerIds.push(user.id)
      if ((i + 1) % 5 === 0) console.log(`  ✅ Created ${i + 1} partners...`)
    }
  }
  console.log(`  ✅ ${partnerIds.length} partners created`)

  // ── 4. Get offer IDs ─────────────────────────────────────────
  console.log('\n📦 Fetching offers...')
  const { data: offers } = await supabase
    .from('offers')
    .select('id, type, payout_amount, payout_percent, hold_days')
    .eq('status', 'active')

  if (!offers || offers.length === 0) {
    console.log('  ⚠️  No active offers found. Run supabase_schema.sql first.')
  } else {
    console.log(`  ✅ Found ${offers.length} active offers`)

    // ── 5. Referral links + clicks + conversions ──────────────
    console.log('\n🔗 Creating referral links and traffic data...')

    for (const partnerId of partnerIds.slice(0, 8)) {
      // Each top partner takes 2-3 offers
      const partnerOffers = offers.sort(() => Math.random() - 0.5).slice(0, randomBetween(2, 3))

      for (const offer of partnerOffers) {
        const code = `dp_${Math.random().toString(36).substr(2, 10)}`

        // Create referral link
        const { data: link } = await supabase
          .from('referral_links')
          .insert({
            partner_id: partnerId,
            offer_id: offer.id,
            code,
            is_active: true,
          })
          .select('id')
          .single()

        if (!link) continue

        // Generate clicks (last 30 days)
        const clickCount = randomBetween(50, 400)
        const clicks = Array.from({ length: clickCount }, (_, i) => ({
          ref_link_id: link.id,
          partner_id: partnerId,
          offer_id: offer.id,
          ip: `${randomBetween(1,255)}.${randomBetween(1,255)}.${randomBetween(1,255)}.${randomBetween(1,255)}`,
          device: randomFrom(['desktop', 'mobile', 'mobile', 'desktop']),
          browser: randomFrom(['Chrome', 'Chrome', 'Safari', 'Firefox', 'Edge']),
          referer: randomFrom(['', 'https://t.me', 'https://vk.com', 'https://instagram.com', '']),
          click_id: `${Date.now()}_${i}_${Math.random().toString(36).substr(2, 6)}`,
          converted: false,
          created_at: daysAgo(randomBetween(0, 30)),
        }))

        // Insert clicks in batches of 50
        for (let j = 0; j < clicks.length; j += 50) {
          await supabase.from('clicks').insert(clicks.slice(j, j + 50))
        }

        // ~4% conversion rate
        const convCount = Math.floor(clickCount * (randomBetween(2, 8) / 100))
        const convertedClicks = clicks.slice(0, convCount)

        const conversions = convertedClicks.map(c => {
          let amount = offer.payout_amount ?? 0
          if (offer.type === 'revshare' || offer.type === 'cps') {
            const orderValue = randomBetween(1000, 15000)
            amount = Math.round(orderValue * ((offer.payout_percent ?? 10) / 100))
          }
          const createdAt = c.created_at
          const holdDays = offer.hold_days ?? 14
          const holdDate = new Date(new Date(createdAt).getTime() + holdDays * 86400000)
          const isPastHold = holdDate < new Date()
          const status = isPastHold ? randomFrom(['approved', 'approved', 'paid']) : 'pending'

          return {
            ref_link_id: link.id,
            partner_id: partnerId,
            offer_id: offer.id,
            type: offer.type === 'cpl' ? 'lead' : 'sale',
            amount,
            status,
            hold_until: holdDate.toISOString(),
            created_at: createdAt,
          }
        })

        if (conversions.length > 0) {
          await supabase.from('conversions').insert(conversions)
        }

        // Update link stats
        const totalEarnings = conversions.reduce((s, c) => s + c.amount, 0)
        await supabase.from('referral_links').update({
          clicks: clickCount,
          conversions: convCount,
          earnings: totalEarnings,
        }).eq('id', link.id)
      }
    }
    console.log('  ✅ Traffic data created')
  }

  // ── 6. Learning modules ───────────────────────────────────────
  console.log('\n📚 Creating learning materials...')

  const modules = [
    {
      title: 'Введение в партнёрский маркетинг',
      description: 'Что такое CPA, CPL, RevShare. Как работает партнёрка.',
      sort_order: 1,
      is_free: true,
      lessons: [
        { title: 'Что такое партнёрский маркетинг', duration_min: 5 },
        { title: 'Типы офферов: CPA, CPL, CPS, RevShare', duration_min: 8 },
        { title: 'Как читать условия оффера', duration_min: 6 },
        { title: 'Первые шаги: выбор ниши', duration_min: 10 },
      ],
    },
    {
      title: 'Трафик для партнёров',
      description: 'Бесплатные и платные источники. SEO, Telegram, VK.',
      sort_order: 2,
      is_free: true,
      lessons: [
        { title: 'Обзор источников трафика', duration_min: 7 },
        { title: 'Telegram-каналы и группы', duration_min: 12 },
        { title: 'ВКонтакте: таргет и группы', duration_min: 15 },
        { title: 'SEO для партнёров: базовые принципы', duration_min: 20 },
      ],
    },
    {
      title: 'Работа с офферами Drops',
      description: 'Как продавать услуги Drops: сайты, реклама, SEO.',
      sort_order: 3,
      is_free: false,
      lessons: [
        { title: 'Пакет «Лендинг» — как продать', duration_min: 10 },
        { title: 'Пакет «Система» — аргументы для B2B', duration_min: 15 },
        { title: 'Скрипт звонка и переписки', duration_min: 12 },
        { title: 'Возражения и ответы', duration_min: 8 },
      ],
    },
    {
      title: 'Аналитика и оптимизация',
      description: 'UTM-метки, анализ CR, A/B тесты.',
      sort_order: 4,
      is_free: false,
      lessons: [
        { title: 'UTM-метки: зачем и как ставить', duration_min: 8 },
        { title: 'Анализ CR: что считать нормой', duration_min: 10 },
        { title: 'A/B тестирование крео', duration_min: 15 },
      ],
    },
    {
      title: 'Крипто-офферы',
      description: 'Bybit, Binance — как привлекать рефералов.',
      sort_order: 5,
      is_free: false,
      lessons: [
        { title: 'Аудитория крипто-офферов', duration_min: 8 },
        { title: 'Контент для YouTube и Telegram', duration_min: 20 },
        { title: 'Долгосрочная стратегия RevShare', duration_min: 12 },
      ],
    },
  ]

  for (const mod of modules) {
    const { data: module } = await supabase
      .from('learn_modules')
      .insert({
        title: mod.title,
        description: mod.description,
        sort_order: mod.sort_order,
        is_free: mod.is_free,
      })
      .select('id')
      .single()

    if (!module) continue

    const lessons = mod.lessons.map((l, idx) => ({
      module_id: module.id,
      title: l.title,
      duration_min: l.duration_min,
      sort_order: idx + 1,
      content: `# ${l.title}\n\nМатериал урока будет добавлен в ближайшее время.`,
    }))
    await supabase.from('learn_lessons').insert(lessons)
  }
  console.log(`  ✅ ${modules.length} modules with lessons created`)

  // ── 7. Notifications for demo partners ───────────────────────
  console.log('\n🔔 Creating sample notifications...')
  if (partnerIds.length > 0) {
    const sampleNotifs = [
      { type: 'conversion', title: 'Новая конверсия!', body: '+3 000 ₽ в ожидании (холд 14 дней)', link: '/dashboard/stats' },
      { type: 'system', title: 'Добро пожаловать в Drops Partners!', body: 'Перейдите в каталог офферов и выберите первый оффер', link: '/dashboard/offers' },
      { type: 'news', title: 'Новый оффер: Bybit +10%', body: 'RevShare увеличен до 30% на всё лето', link: '/dashboard/offers' },
    ]
    const notifs = partnerIds.slice(0, 5).flatMap(uid =>
      sampleNotifs.map(n => ({ user_id: uid, ...n }))
    )
    await supabase.from('notifications').insert(notifs)
    console.log('  ✅ Notifications created')
  }

  console.log('\n✅ Seed complete!\n')
  console.log('📋 Test accounts:')
  console.log('  Admin:      admin@drops.agency      / Admin123!@#')
  console.log('  Advertiser: bybit@advertiser.test   / Advertiser123!')
  console.log('  Partner:    partner1@test.com        / Partner123!')
  console.log('  Partner:    partner2@test.com        / Partner123!')
  console.log()
}

main().catch(err => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
