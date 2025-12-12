import type { Station } from '../types'

/**
 * Check if all dependencies for a task are completed
 */
export function dependenciesDone(
  taskId: string,
  dependencies: string[],
  completedTasks: Set<string>
): boolean {
  return dependencies.every(dep => completedTasks.has(dep))
}

/**
 * Acquire a station resource (returns true if acquired, false if blocked)
 */
export function acquireReleaseResource(
  station: Station,
  stationCounts: Record<Station, number>,
  currentOccupancy: Map<Station, number>,
  acquire: boolean
): boolean {
  const maxCount = stationCounts[station] || 0
  const current = currentOccupancy.get(station) || 0
  
  if (acquire) {
    if (current < maxCount) {
      currentOccupancy.set(station, current + 1)
      return true
    }
    return false
  } else {
    currentOccupancy.set(station, Math.max(0, current - 1))
    return true
  }
}

/**
 * Compute final score based on completed orders, timing, and failures
 */
export function computeScore(
  completedOrders: number,
  failedOrders: number,
  totalOrders: number,
  timeBonus: number,
  basePrice: number
): number {
  const completionBonus = completedOrders * basePrice
  const failurePenalty = failedOrders * (basePrice * 0.5)
  const efficiencyBonus = timeBonus
  return Math.max(0, completionBonus - failurePenalty + efficiencyBonus)
}

