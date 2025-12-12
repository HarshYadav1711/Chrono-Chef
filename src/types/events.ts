export type SpecialEventType = 
  | 'rush_order'
  | 'equipment_breakdown'
  | 'bonus_time'
  | 'double_score'
  | 'station_boost'

export interface SpecialEvent {
  id: string
  type: SpecialEventType
  name: string
  description: string
  triggerTime: number
  duration?: number
  effect: {
    station?: string
    multiplier?: number
    bonusTime?: number
  }
}

