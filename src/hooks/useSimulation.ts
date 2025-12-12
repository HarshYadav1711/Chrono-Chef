import { useState, useRef, useCallback } from 'react'
import type { ScheduledTask, Level, RunReport } from '../types'
import { simulateRun } from '../engine/simulation'

export type SimulationMode = 'stopped' | 'running' | 'paused' | 'stepping'

export function useSimulation() {
  const [mode, setMode] = useState<SimulationMode>('stopped')
  const [currentTime, setCurrentTime] = useState(0)
  const [report, setReport] = useState<RunReport | null>(null)
  const [activeTaskIds, setActiveTaskIds] = useState<Set<string>>(new Set())
  const intervalRef = useRef<number | null>(null)

  const run = useCallback((schedule: ScheduledTask[], level: Level, seed: number = 42) => {
    setMode('running')
    setCurrentTime(0)
    setActiveTaskIds(new Set())
    
    // Run full simulation
    const result = simulateRun(schedule, level, seed)
    setReport(result)
    setMode('stopped')
  }, [])

  const runRealtime = useCallback((schedule: ScheduledTask[], level: Level, seed: number = 42) => {
    setMode('running')
    setCurrentTime(0)
    setActiveTaskIds(new Set())
    setReport(null)

    // Simulate in real-time (1 second per tick)
    let time = 0
    const activeTasks = new Map<string, { endTime: number }>()
    const completedTasks = new Set<string>()
    const stationOccupancy = new Map<any, number>()

    const tick = () => {
      if (time > level.timeLimit) {
        // Complete simulation
        const result = simulateRun(schedule, level, seed)
        setReport(result)
        setMode('stopped')
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        return
      }

      setCurrentTime(time)

      // Update active tasks
      const newActiveIds = new Set<string>()
      activeTasks.forEach((task, key) => {
        if (time < task.endTime) {
          newActiveIds.add(key)
        } else {
          activeTasks.delete(key)
          completedTasks.add(key)
        }
      })
      setActiveTaskIds(newActiveIds)

      // Start new tasks
      schedule.forEach(task => {
        const key = `${task.orderId}-${task.taskId}`
        if (task.startTime === time && !activeTasks.has(key) && !completedTasks.has(key)) {
          activeTasks.set(key, { endTime: time + task.duration })
          newActiveIds.add(key)
        }
      })
      setActiveTaskIds(newActiveIds)

      time++
    }

    // Run at 1 tick per second (1000ms)
    intervalRef.current = window.setInterval(tick, 1000)
    tick() // Initial tick
  }, [])

  const pause = useCallback(() => {
    setMode('paused')
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const resume = useCallback(() => {
    setMode('running')
    // Resume logic would go here
  }, [])

  const step = useCallback(() => {
    setMode('stepping')
    // Step logic would go here
  }, [])

  const stop = useCallback(() => {
    setMode('stopped')
    setCurrentTime(0)
    setActiveTaskIds(new Set())
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  return {
    mode,
    currentTime,
    report,
    activeTaskIds,
    run,
    runRealtime,
    pause,
    resume,
    step,
    stop
  }
}

