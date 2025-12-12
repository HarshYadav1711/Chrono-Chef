import { useState, useCallback } from 'react'
import type { ReplayData } from '../types/replay'
import type { ScheduledTask, Level } from '../types'

export function useReplay() {
  const [replays, setReplays] = useState<ReplayData[]>(() => {
    const saved = localStorage.getItem('chrono-chef-replays')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return []
      }
    }
    return []
  })

  const [currentReplay, setCurrentReplay] = useState<ReplayData | null>(null)
  const [replayTime, setReplayTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const saveReplay = useCallback((
    schedule: ScheduledTask[],
    level: Level,
    report: any,
    seed: number,
    duration: number
  ) => {
    const replay: ReplayData = {
      id: `replay-${Date.now()}`,
      timestamp: Date.now(),
      levelId: level.id,
      schedule: [...schedule],
      report,
      seed,
      duration
    }

    setReplays(prev => {
      const updated = [replay, ...prev].slice(0, 50) // Keep last 50
      localStorage.setItem('chrono-chef-replays', JSON.stringify(updated))
      return updated
    })

    return replay
  }, [])

  const loadReplay = useCallback((replayId: string) => {
    const replay = replays.find(r => r.id === replayId)
    if (replay) {
      setCurrentReplay(replay)
      setReplayTime(0)
      return replay
    }
    return null
  }, [replays])

  const playReplay = useCallback(() => {
    if (!currentReplay) return
    setIsPlaying(true)
    // Replay logic would go here - step through events
  }, [currentReplay])

  const pauseReplay = useCallback(() => {
    setIsPlaying(false)
  }, [])

  const stopReplay = useCallback(() => {
    setIsPlaying(false)
    setReplayTime(0)
  }, [])

  const deleteReplay = useCallback((replayId: string) => {
    setReplays(prev => {
      const updated = prev.filter(r => r.id !== replayId)
      localStorage.setItem('chrono-chef-replays', JSON.stringify(updated))
      return updated
    })
  }, [])

  return {
    replays,
    currentReplay,
    replayTime,
    isPlaying,
    saveReplay,
    loadReplay,
    playReplay,
    pauseReplay,
    stopReplay,
    deleteReplay
  }
}

