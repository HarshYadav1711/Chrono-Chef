import { useState, useCallback } from 'react'
import type { StationUpgrade, UpgradeState } from '../types/upgrades'
import upgradesData from '../data/upgrades.json'

export function useUpgrades() {
  const [state, setState] = useState<UpgradeState>({
    upgrades: new Map(),
    totalSpent: 0
  })

  const getUpgrade = useCallback((station: string): StationUpgrade | null => {
    return state.upgrades.get(station) || null
  }, [state.upgrades])

  const getStationCapacity = useCallback((station: string, baseCapacity: number): number => {
    const upgrade = state.upgrades.get(station)
    if (upgrade) {
      return baseCapacity + upgrade.capacityIncrease
    }
    return baseCapacity
  }, [state.upgrades])

  const purchaseUpgrade = useCallback((upgrade: StationUpgrade, currentMoney: number): boolean => {
    if (currentMoney < upgrade.cost) {
      return false
    }

    const existing = state.upgrades.get(upgrade.station)
    const newLevel = existing ? existing.level + 1 : 1
    
    setState(prev => {
      const newUpgrades = new Map(prev.upgrades)
      newUpgrades.set(upgrade.station, {
        ...upgrade,
        level: newLevel
      })
      return {
        upgrades: newUpgrades,
        totalSpent: prev.totalSpent + upgrade.cost
      }
    })

    return true
  }, [state.upgrades])

  const getAvailableUpgrades = useCallback((): StationUpgrade[] => {
    return upgradesData as StationUpgrade[]
  }, [])

  const reset = useCallback(() => {
    setState({
      upgrades: new Map(),
      totalSpent: 0
    })
  }, [])

  return {
    state,
    getUpgrade,
    getStationCapacity,
    purchaseUpgrade,
    getAvailableUpgrades,
    reset
  }
}

