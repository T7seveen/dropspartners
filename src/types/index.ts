export type UserRole = 'partner' | 'advertiser' | 'admin'
export type OfferType = 'cpa' | 'cpl' | 'revshare' | 'dropship' | 'cps'
export type OfferStatus = 'active' | 'draft' | 'paused' | 'archived'
export type ConversionStatus = 'pending' | 'approved' | 'rejected' | 'paid'
export type PayoutStatus = 'pending' | 'processing' | 'paid' | 'rejected'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  username: string | null
  avatar_url: string | null
  telegram: string | null
  role: UserRole
  ref_code: string
  referred_by: string | null
  balance: number
  total_earned: number
  total_paid: number
  status: 'active' | 'suspended' | 'pending'
  created_at: string
  updated_at: string
}

export interface Category {
  id: number
  slug: string
  name: string
  icon: string | null
  description: string | null
  sort_order: number
}

export interface Offer {
  id: string
  slug: string
  title: string
  description: string | null
  full_description: string | null
  category_id: number | null
  type: OfferType
  payout_amount: number
  payout_percent: number
  currency: string
  target_url: string
  product_price: number | null
  product_image: string | null
  advertiser_name: string | null
  logo_url: string | null
  cover_url: string | null
  tags: string[]
  allowed_geos: string[]
  allowed_traffic: string[]
  clicks_count: number
  conversions_count: number
  cr_percent: number
  status: OfferStatus
  is_featured: boolean
  is_top: boolean
  cookie_days: number
  hold_days: number
  created_at: string
  updated_at: string
  categories?: Category
}

export interface ReferralLink {
  id: string
  partner_id: string
  offer_id: string
  code: string
  custom_sub: string | null
  is_active: boolean
  clicks: number
  conversions: number
  earnings: number
  created_at: string
  offers?: Offer
}

export interface Click {
  id: string
  ref_link_id: string
  partner_id: string
  offer_id: string
  ip: string | null
  country: string | null
  device: string | null
  os: string | null
  browser: string | null
  referer: string | null
  sub1: string | null
  click_id: string
  converted: boolean
  created_at: string
}

export interface Conversion {
  id: string
  click_id: string | null
  ref_link_id: string
  partner_id: string
  offer_id: string
  type: string
  amount: number
  order_value: number | null
  status: ConversionStatus
  hold_until: string | null
  comment: string | null
  created_at: string
  offers?: Pick<Offer, 'title' | 'logo_url'>
}

export interface Payout {
  id: string
  partner_id: string
  amount: number
  method: string
  details: string
  status: PayoutStatus
  admin_note: string | null
  paid_at: string | null
  created_at: string
}

export interface Post {
  id: string
  slug: string
  title: string
  excerpt: string | null
  content: string
  cover_url: string | null
  tags: string[]
  category: string
  status: 'draft' | 'published'
  views: number
  published_at: string | null
  created_at: string
}

export interface DashboardStats {
  clicks: number
  conversions: number
  cr: number
  earnings: number
  pending: number
  balance: number
  topOffer: string | null
}

export interface ChartPoint {
  date: string
  clicks: number
  conversions: number
  earnings: number
}
