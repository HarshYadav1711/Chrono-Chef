export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: number
  progress?: number
  target?: number
}

export type AchievementType = 
  | 'speed_run'
  | 'perfect_order'
  | 'no_failures'
  | 'high_score'
  | 'efficiency'
  | 'combo'
  | 'first_win'

