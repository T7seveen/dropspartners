-- ================================================================
-- DROPS PARTNERS — Additional Migrations
-- Run AFTER supabase_schema.sql
-- ================================================================

-- ── ADD COLUMNS TO EXISTING TABLES ───────────────────────────────

-- profiles: telegram chat id for bot notifications
alter table profiles
  add column if not exists telegram_chat_id text,
  add column if not exists onboarding_done boolean default false,
  add column if not exists plan text default 'free' check (plan in ('free','pro','team')),
  add column if not exists traffic_source text;

-- offers: gambling/adult validation helper column
alter table offers
  add column if not exists is_allowed boolean default true;

-- ── TELEGRAM LINKS TABLE ──────────────────────────────────────────
-- Stores one-time tokens for linking Telegram accounts

create table if not exists telegram_links (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references profiles(id) on delete cascade,
  token       text unique not null,
  used        boolean default false,
  expires_at  timestamptz not null default (now() + interval '15 minutes'),
  created_at  timestamptz not null default now()
);

create index if not exists idx_telegram_links_token on telegram_links(token);
create index if not exists idx_telegram_links_user on telegram_links(user_id);

-- ── OFFER TOOLS TABLE ─────────────────────────────────────────────
-- Creatives, banners, scripts for each offer

create table if not exists offer_tools (
  id          uuid primary key default uuid_generate_v4(),
  offer_id    uuid not null references offers(id) on delete cascade,
  type        text not null check (type in ('banner','text','script','landing','video')),
  title       text not null,
  url         text,
  content     text,
  size        text, -- e.g. '300x250', '728x90'
  created_at  timestamptz not null default now()
);

create index if not exists idx_offer_tools_offer on offer_tools(offer_id);

-- ── RLS for new tables ────────────────────────────────────────────

alter table telegram_links enable row level security;
create policy if not exists "tg_links_own" on telegram_links for all using (auth.uid() = user_id);

alter table offer_tools enable row level security;
create policy if not exists "offer_tools_read" on offer_tools for select using (true);

-- ── STORED PROCEDURES ─────────────────────────────────────────────

-- increment_clicks: atomically update referral_link and offer click counts
create or replace function increment_clicks(p_link_id uuid, p_offer_id uuid)
returns void as $$
begin
  update referral_links set clicks = clicks + 1 where id = p_link_id;
  update offers set clicks_count = clicks_count + 1 where id = p_offer_id;
end;
$$ language plpgsql security definer;

-- increment_conversions: atomically update link + offer conversion counts and earnings
create or replace function increment_conversions(p_link_id uuid, p_offer_id uuid, p_amount numeric)
returns void as $$
begin
  update referral_links
    set conversions = conversions + 1,
        earnings    = earnings + p_amount
  where id = p_link_id;

  update offers
    set conversions_count = conversions_count + 1,
        cr_percent = case
          when clicks_count > 0
          then round(((conversions_count + 1)::numeric / clicks_count * 100), 2)
          else 0
        end
  where id = p_offer_id;
end;
$$ language plpgsql security definer;

-- increment_balance: add to partner balance and total_earned
create or replace function increment_balance(p_user_id uuid, p_amount numeric)
returns void as $$
begin
  update profiles
  set balance      = balance + p_amount,
      total_earned = total_earned + p_amount
  where id = p_user_id;
end;
$$ language plpgsql security definer;

-- deduct_balance: remove from balance (for payout requests)
create or replace function deduct_balance(p_user_id uuid, p_amount numeric)
returns void as $$
declare
  v_balance numeric;
begin
  select balance into v_balance from profiles where id = p_user_id for update;
  if v_balance < p_amount then
    raise exception 'Insufficient balance: % < %', v_balance, p_amount;
  end if;
  update profiles
  set balance = balance - p_amount
  where id = p_user_id;
end;
$$ language plpgsql security definer;

-- approve_held_conversions: move approved hold-expired conversions to partner balance
-- Call this from a cron job or admin action
create or replace function approve_held_conversions()
returns int as $$
declare
  v_count int := 0;
  v_partner uuid;
  v_total numeric;
  rec record;
begin
  for rec in
    select partner_id, sum(amount) as total
    from conversions
    where status = 'pending'
      and hold_until <= now()
    group by partner_id
  loop
    -- Update conversions to approved
    update conversions
    set status     = 'approved',
        updated_at = now()
    where partner_id = rec.partner_id
      and status     = 'pending'
      and hold_until <= now();

    -- Add to partner balance
    perform increment_balance(rec.partner_id, rec.total);

    -- Notify partner
    insert into notifications (user_id, type, title, body, link)
    values (
      rec.partner_id,
      'conversion',
      'Конверсии подтверждены!',
      rec.total::text || ' ₽ зачислено на ваш баланс',
      '/dashboard/wallet'
    );

    v_count := v_count + 1;
  end loop;
  return v_count;
end;
$$ language plpgsql security definer;

-- payout_approved: admin approves a payout (sets status + updates total_paid)
create or replace function approve_payout(p_payout_id uuid)
returns void as $$
declare
  v_payout payouts%rowtype;
begin
  select * into v_payout from payouts where id = p_payout_id for update;
  if not found then
    raise exception 'Payout % not found', p_payout_id;
  end if;
  if v_payout.status <> 'pending' then
    raise exception 'Payout is not in pending state';
  end if;

  update payouts
  set status  = 'paid',
      paid_at = now()
  where id = p_payout_id;

  update profiles
  set total_paid = total_paid + v_payout.amount
  where id = v_payout.partner_id;

  insert into notifications (user_id, type, title, body, link)
  values (
    v_payout.partner_id,
    'payout',
    'Выплата отправлена!',
    v_payout.amount::text || ' ₽ переведено на ' || v_payout.method,
    '/dashboard/wallet'
  );
end;
$$ language plpgsql security definer;

-- reject_payout: admin rejects a payout and refunds balance
create or replace function reject_payout(p_payout_id uuid, p_note text default null)
returns void as $$
declare
  v_payout payouts%rowtype;
begin
  select * into v_payout from payouts where id = p_payout_id for update;
  if not found or v_payout.status <> 'pending' then
    raise exception 'Payout not found or not pending';
  end if;

  update payouts
  set status     = 'rejected',
      admin_note = p_note
  where id = p_payout_id;

  -- Refund balance
  update profiles
  set balance = balance + v_payout.amount
  where id = v_payout.partner_id;

  insert into notifications (user_id, type, title, body, link)
  values (
    v_payout.partner_id,
    'payout',
    'Выплата отклонена',
    coalesce(p_note, 'Обратитесь в поддержку'),
    '/dashboard/wallet'
  );
end;
$$ language plpgsql security definer;

-- ── ADMIN READ POLICIES ───────────────────────────────────────────
-- Allow admin role to read everything (requires checking role in app)

create policy if not exists "profiles_admin_read" on profiles
  for select using (
    exists (
      select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ── INDEX ADDITIONS ───────────────────────────────────────────────
create index if not exists idx_clicks_click_id      on clicks(click_id);
create index if not exists idx_conversions_hold      on conversions(hold_until) where status = 'pending';
create index if not exists idx_payouts_status        on payouts(status);
create index if not exists idx_profiles_ref_code     on profiles(ref_code);
create index if not exists idx_profiles_telegram     on profiles(telegram_chat_id);
