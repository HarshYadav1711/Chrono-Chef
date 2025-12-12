import { useState, useCallback, useEffect } from 'react'
import type { LeaderboardEntry, LeaderboardFilter } from '../types/leaderboard'
import type { RunReport } from '../types'

export function useLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>(() => {
    const saved = localStorage.getItem('chrono-chef-leaderboard')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return []
      }
    }
    return []
  })

  useEffect(() => {
    localStorage.setItem('chrono-chef-leaderboard', JSON.stringify(entries))
  }, [entries])

  const addEntry = useCallback((
    playerName: string,
    levelId: string,
    report: RunReport,
    time: number,
    seed: number
  ) => {
    const entry: LeaderboardEntry = {
      id: `entry-${Date.now()}-${Math.random()}`,
      playerName,
      levelId,
      score: report.finalScore,
      completedOrders: report.completedOrders,
      failedOrders: report.failedOrders,
      time,
      timestamp: Date.now(),
      seed
    }

    setEntries(prev => {
      const updated = [...prev, entry]
        .sort((a, b) => b.score - a.score)
        .slice(0, 100) // Keep top 100
      return updated
    })

    return entry
  }, [])

  const getLeaderboard = useCallback((filter: LeaderboardFilter = 'all', levelId?: string) => {
    let filtered = [...entries]

    if (levelId) {
      filtered = filtered.filter(e => e.levelId === levelId)
    }

    switch (filter) {
      case 'daily':
        const dayStart = new Date().setHours(0, 0, 0, 0)
        filtered = filtered.filter(e => e.timestamp >= dayStart)
        break
      case 'weekly':
        const weekStart = new Date().setDate(new Date().getDate() - 7)
        filtered = filtered.filter(e => e.timestamp >= weekStart)
        break
    }

    return filtered.sort((a, b) => b.score - a.score)
  }, [entries])

  const getPlayerRank = useCallback((entryId: string): number => {
    const sorted = [...entries].sort((a, b) => b.score - a.score)
    return sorted.findIndex(e => e.id === entryId) + 1
  }, [entries])

  const clearLeaderboard = useCallback(() => {
    setEntries([])
  }, [])

  return {
    entries,
    addEntry,
    getLeaderboard,
    getPlayerRank,
    clearLeaderboard
  }
}

