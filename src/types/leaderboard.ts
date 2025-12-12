export interface LeaderboardEntry {
  id: string
  playerName: string
  levelId: string
  score: number
  completedOrders: number
  failedOrders: number
  time: number
  timestamp: number
  seed: number
}

export type LeaderboardFilter = 'all' | 'daily' | 'weekly' | 'level'

