export interface StationUpgrade {
  station: string
  level: number
  capacityIncrease: number
  cost: number
  name: string
  description: string
}

export interface UpgradeState {
  upgrades: Map<string, StationUpgrade> // station -> upgrade
  totalSpent: number
}

