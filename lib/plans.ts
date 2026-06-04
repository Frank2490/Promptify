export type PlanId = 'free' | 'pro' | 'creator'

export interface PlanConfig {
  name: string
  price?: number
  dailyLimit: number | null
  models: string[]
  historyDays: number | null
  favoritesLimit: number | null
  apiAccess?: boolean
}

export const PLANS: Record<PlanId, PlanConfig> = {
  free: {
    name: 'Free',
    dailyLimit: 10,
    models: ['dalle3'],
    historyDays: 7,
    favoritesLimit: 5,
  },
  pro: {
    name: 'Pro',
    price: 29,
    dailyLimit: 50,
    models: ['dalle3', 'midjourney', 'sdxl', 'flux', 'nanobanana'],
    historyDays: 30,
    favoritesLimit: null,
  },
  creator: {
    name: 'Creator',
    price: 79,
    dailyLimit: null,
    models: ['dalle3', 'midjourney', 'sdxl', 'flux', 'nanobanana'],
    historyDays: null,
    favoritesLimit: null,
    apiAccess: true,
  },
}

export function getPlanConfig(plan: string): PlanConfig {
  return PLANS[plan as PlanId] ?? PLANS.free
}
