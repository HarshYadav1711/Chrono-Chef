import { useState, useCallback, useEffect } from 'react'
import type { Achievement } from '../types/achievements'
import achievementsData from '../data/achievements.json'
import type { RunReport } from '../types'

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('chrono-chef-achievements')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return achievementsData as Achievement[]
      }
    }
    return achievementsData as Achievement[]
  })

  useEffect(() => {
    localStorage.setItem('chrono-chef-achievements', JSON.stringify(achievements))
  }, [achievements])

  const checkAchievements = useCallback((report: RunReport, levelTime: number) => {
    const newAchievements: Achievement[] = []
    const updated = achievements.map(ach => {
      if (ach.unlocked) return ach

      let shouldUnlock = false
      let progress = ach.progress || 0

      switch (ach.id) {
        case 'first_win':
          if (report.success && report.completedOrders > 0) {
            shouldUnlock = true
          }
          break

        case 'speed_run_30':
          if (levelTime <= 30 && report.success) {
            shouldUnlock = true
          }
          progress = Math.min(progress, levelTime)
          break

        case 'perfect_order':
          if (report.failedOrders === 0 && report.completedOrders > 0) {
            shouldUnlock = true
          }
          break

        case 'high_score_100':
          if (report.finalScore >= 100) {
            shouldUnlock = true
          }
          progress = Math.max(progress, report.finalScore)
          break

        case 'efficiency_90':
          const efficiency = report.completedOrders > 0 
            ? (report.completedOrders / (report.completedOrders + report.failedOrders)) * 100
            : 0
          if (efficiency >= 90) {
            shouldUnlock = true
          }
          progress = Math.max(progress, efficiency)
          break

        case 'no_failures':
          if (report.failedOrders === 0 && report.completedOrders > 0) {
            shouldUnlock = true
          }
          break
      }

      if (shouldUnlock) {
        newAchievements.push({
          ...ach,
          unlocked: true,
          unlockedAt: Date.now(),
          progress: progress || undefined
        })
        return {
          ...ach,
          unlocked: true,
          unlockedAt: Date.now(),
          progress: progress || undefined
        }
      }

      return {
        ...ach,
        progress: progress || undefined
      }
    })

    setAchievements(updated)
    return newAchievements
  }, [achievements])

  const getUnlockedCount = useCallback((): number => {
    return achievements.filter(a => a.unlocked).length
  }, [achievements])

  const reset = useCallback(() => {
    const reset = achievementsData.map(ach => ({
      ...ach,
      unlocked: false,
      unlockedAt: undefined,
      progress: 0
    }))
    setAchievements(reset as Achievement[])
  }, [])

  return {
    achievements,
    checkAchievements,
    getUnlockedCount,
    reset
  }
}

