-- ================================================================
-- DROPS PARTNERS — Full Database Schema
-- Run this in Supabase SQL Editor
-- ================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── PROFILES (extends Supabase auth.users) ──────────────────────
create table profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text unique not null,
  full_name     text,
  username      text unique,
  avatar_url    text,
  telegram      text,
  role          text not null default 'partner' check (role in ('partner','advertiser','admin')),
  ref_code      text unique not null default substr(md5(random()::text), 1, 8),
  referred_by   uuid references profiles(id),
  balance       numeric(12,2) not null default 0,
  total_earned  numeric(12,2) not null default 0,
  total_paid    numeric(12,2) not null default 0,
  status        text not null default 'active' check (status in ('active','suspended','pending')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ── CATEGORIES ──────────────────────────────────────────────────
create table categories (
  id          serial primary key,
  slug        text unique not null,
  name        text not null,
  icon        text,
  description text,
  sort_order  int default 0
);

insert into categories (slug, name, icon, description, sort_order) values
  ('ecom',      'Товары / Дропшиппинг', '📦', 'Физические товары от производителей', 1),
  ('crypto',    'Крипто-биржи',          '₿',  'Реферальные программы бирж и кошельков', 2),
  ('software',  'SaaS / Сервисы',        '💻', 'Подписки, VPN, инструменты', 3),
  ('education', 'Онлайн-школы',          '🎓', 'Курсы и образовательные платформы', 4),
  ('marketing', 'Маркетинг',             '📈', 'Услуги Drops: сайты, реклама, SEO', 5),
  ('finance',   'Финансы',               '💳', 'Банки, инвестиции, займы', 6),
  ('other',     'Прочее',                '🔗', 'Разные офферы', 7);

-- ── OFFERS ──────────────────────────────────────────────────────
create table offers (
  id               uuid primary key default uuid_generate_v4(),
  slug             text unique not null,
  title            text not null,
  description      text,
  full_description text,
  category_id      int references categories(id),
  type             text not null check (type in ('cpa','cpl','revshare','dropship','cps')),
  -- CPA/CPL: fixed amount per action
  payout_amount    numeric(10,2) default 0,
  -- RevShare: percent of sale
  payout_percent   numeric(5,2) default 0,
  currency         text default 'RUB',
  -- Target URL (where partner sends traffic)
  target_url       text not null,
  -- For dropship: product info
  product_price    numeric(10,2),
  product_image    text,
  product_sku      text,
  -- Advertiser
  advertiser_id    uuid references profiles(id),
  advertiser_name  text,
  -- Display
  logo_url         text,
  cover_url        text,
  tags             text[] default '{}',
  allowed_geos     text[] default '{}',
  allowed_traffic  text[] default '{}', -- ['social','seo','email','context']
  -- Stats (denormalized for speed)
  clicks_count     bigint default 0,
  conversions_count bigint default 0,
  cr_percent       numeric(5,2) default 0,
  -- Status
  status           text not null default 'draft' check (status in ('active','draft','paused','archived')),
  is_featured      boolean default false,
  is_top           boolean default false,
  cookie_days      int default 30,
  hold_days        int default 14,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ── REFERRAL LINKS ──────────────────────────────────────────────
create table referral_links (
  id          uuid primary key default uuid_generate_v4(),
  partner_id  uuid not null references profiles(id) on delete cascade,
  offer_id    uuid not null references offers(id) on delete cascade,
  code        text unique not null default substr(md5(random()::text||now()::text), 1, 12),
  custom_sub  text, -- sub1 for partner tracking
  is_active   boolean default true,
  clicks      bigint default 0,
  conversions bigint default 0,
  earnings    numeric(12,2) default 0,
  created_at  timestamptz not null default now(),
  unique(partner_id, offer_id)
);

-- ── CLICKS (traffic tracking) ────────────────────────────────────
create table clicks (
  id           uuid primary key default uuid_generate_v4(),
  ref_link_id  uuid not null references referral_links(id),
  partner_id   uuid not null references profiles(id),
  offer_id     uuid not null references offers(id),
  ip           text,
  country      text,
  city         text,
  device       text, -- desktop/mobile/tablet
  os           text,
  browser      text,
  referer      text,
  sub1         text,
  sub2         text,
  sub3         text,
  click_id     text unique not null default uuid_generate_v4()::text,
  converted    boolean default false,
  created_at   timestamptz not null default now()
);

-- ── CONVERSIONS ──────────────────────────────────────────────────
create table conversions (
  id            uuid primary key default uuid_generate_v4(),
  click_id      uuid references clicks(id),
  ref_link_id   uuid not null references referral_links(id),
  partner_id    uuid not null references profiles(id),
  offer_id      uuid not null references offers(id),
  type          text not null, -- 'lead','sale','install'
  amount        numeric(12,2) not null default 0, -- partner earning
  order_value   numeric(12,2), -- actual sale value (for revshare)
  status        text not null default 'pending' check (status in ('pending','approved','rejected','paid')),
  hold_until    timestamptz,
  comment       text,
  external_id   text, -- advertiser's order ID
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ── PAYOUTS ──────────────────────────────────────────────────────
create table payouts (
  id          uuid primary key default uuid_generate_v4(),
  partner_id  uuid not null references profiles(id),
  amount      numeric(12,2) not null,
  method      text not null, -- 'card','crypto','usdt','bank'
  details     text not null, -- wallet/card number
  status      text not null default 'pending' check (status in ('pending','processing','paid','rejected')),
  admin_note  text,
  paid_at     timestamptz,
  created_at  timestamptz not null default now()
);

-- ── BLOG POSTS ───────────────────────────────────────────────────
create table posts (
  id          uuid primary key default uuid_generate_v4(),
  slug        text unique not null,
  title       text not null,
  excerpt     text,
  content     text not null,
  cover_url   text,
  author_id   uuid references profiles(id),
  tags        text[] default '{}',
  category    text default 'news', -- 'news','tutorial','case','promo'
  status      text default 'draft' check (status in ('draft','published')),
  views       bigint default 0,
  published_at timestamptz,
  created_at  timestamptz not null default now()
);

-- ── LEARNING MODULES ─────────────────────────────────────────────
create table learn_modules (
  id          serial primary key,
  title       text not null,
  description text,
  cover_url   text,
  sort_order  int default 0,
  is_free     boolean default true,
  created_at  timestamptz not null default now()
);

create table learn_lessons (
  id          serial primary key,
  module_id   int not null references learn_modules(id) on delete cascade,
  title       text not null,
  content     text,
  video_url   text,
  duration_min int default 5,
  sort_order  int default 0,
  created_at  timestamptz not null default now()
);

-- ── NOTIFICATIONS ────────────────────────────────────────────────
create table notifications (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references profiles(id) on delete cascade,
  type        text not null, -- 'conversion','payout','news','system'
  title       text not null,
  body        text,
  is_read     boolean default false,
  link        text,
  created_at  timestamptz not null default now()
);

-- ── ADVERTISER APPLICATIONS ──────────────────────────────────────
create table advertiser_applications (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  email        text not null,
  company      text,
  website      text,
  offer_type   text,
  description  text,
  budget       text,
  status       text default 'new' check (status in ('new','reviewing','approved','rejected')),
  created_at   timestamptz not null default now()
);

-- ── INDEXES ──────────────────────────────────────────────────────
create index idx_clicks_partner on clicks(partner_id);
create index idx_clicks_offer on clicks(offer_id);
create index idx_clicks_created on clicks(created_at);
create index idx_conversions_partner on conversions(partner_id);
create index idx_conversions_status on conversions(status);
create index idx_referral_links_partner on referral_links(partner_id);
create index idx_offers_status on offers(status);
create index idx_offers_category on offers(category_id);

-- ── RLS POLICIES ─────────────────────────────────────────────────
alter table profiles enable row level security;
alter table referral_links enable row level security;
alter table clicks enable row level security;
alter table conversions enable row level security;
alter table payouts enable row level security;
alter table notifications enable row level security;

-- Profiles: user sees own, admin sees all
create policy "profiles_own" on profiles for all using (auth.uid() = id);

-- Referral links: partner sees own
create policy "ref_links_own" on referral_links for all using (auth.uid() = partner_id);

-- Conversions: partner sees own
create policy "conversions_own" on conversions for select using (auth.uid() = partner_id);

-- Payouts: partner sees own
create policy "payouts_own" on payouts for all using (auth.uid() = partner_id);

-- Notifications: user sees own
create policy "notifs_own" on notifications for all using (auth.uid() = user_id);

-- Offers: all can read active
create policy "offers_read_active" on offers for select using (status = 'active');

-- ── AUTO-UPDATE TIMESTAMPS ────────────────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger trg_profiles_updated before update on profiles
  for each row execute function update_updated_at();
create trigger trg_offers_updated before update on offers
  for each row execute function update_updated_at();
create trigger trg_conversions_updated before update on conversions
  for each row execute function update_updated_at();

-- ── AUTO-CREATE PROFILE ON SIGNUP ────────────────────────────────
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, full_name, ref_code)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    substr(md5(new.id::text), 1, 8)
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ── SEED: SAMPLE OFFERS ──────────────────────────────────────────
insert into offers (slug, title, description, category_id, type, payout_amount, target_url, status, is_featured, is_top, tags, allowed_traffic, cookie_days) values
  ('bybit-referral', 'Bybit — крипто-биржа', 'Зарабатывайте комиссию с торгового объёма рефералов. До 30% RevShare навсегда.', 2, 'revshare', 0, 'https://bybit.com', 'active', true, true, '{"крипта","биржа","revshare"}', '{"social","blog","seo","youtube"}', 365),
  ('nordvpn', 'NordVPN — подписка', 'CPS оффер. 40% с первой оплаты + 30% с продлений. Один из лучших VPN на рынке.', 3, 'cps', 1200, 'https://nordvpn.com', 'active', true, false, '{"vpn","saas","подписка"}', '{"social","context","seo"}', 30),
  ('drops-landing', 'Drops — Лендинг под ключ', 'Продавайте услуги Drops: лендинг за 3 дня. CPA 3000₽ за каждую оплаченную заявку.', 5, 'cpa', 3000, 'https://drops.agency', 'active', false, true, '{"маркетинг","сайт","b2b"}', '{"social","telegram","email"}', 30),
  ('drops-system', 'Drops — Пакет «Система»', 'Продавайте комплексный маркетинг от Drops. CPA 15 000₽ за заключённый договор.', 5, 'cpa', 15000, 'https://drops.agency', 'active', true, true, '{"маркетинг","b2b","агентство"}', '{"social","telegram","context"}', 60),
  ('skillbox', 'Skillbox — онлайн-курсы', 'CPL оффер. 500₽ за каждую заявку. Широкая аудитория, высокая конверсия лендингов.', 4, 'cpl', 500, 'https://skillbox.ru', 'active', false, false, '{"образование","курсы","edtech"}', '{"social","seo","email","youtube"}', 30);
