export type ProjectStatus = 'draft' | 'active' | 'closed' | 'successful'

export type Profile = {
  id: string
  display_name: string
  bio: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export type Project = {
  id: string
  owner_id: string
  title: string
  description: string
  goal_amount: number
  current_amount: number
  deadline: string
  category: string
  thumbnail_url: string | null
  status: ProjectStatus
  revenue_share_rate: number
  return_period_years: number
  return_cap_multiplier: number
  created_at: string
  updated_at: string
  profiles?: Profile
}

export type Pledge = {
  id: string
  project_id: string
  backer_id: string
  amount: number
  created_at: string
}

export type Update = {
  id: string
  project_id: string
  title: string
  body: string
  created_at: string
}

export const CATEGORIES = [
  'テクノロジー',
  'アプリ・SaaS',
  'AI・機械学習',
  'ゲーム',
  'クリエイティブ',
  'ソーシャル',
  'その他',
] as const
