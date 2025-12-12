import type { ScheduledTask } from '../types'

const STORAGE_KEY = 'chrono-chef-schedule'

export function saveSchedule(tasks: ScheduledTask[], levelId: string) {
  try {
    const data = {
      tasks,
      levelId,
      timestamp: Date.now()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return true
  } catch (error) {
    console.error('Failed to save schedule:', error)
    return false
  }
}

export function loadSchedule(): { tasks: ScheduledTask[]; levelId: string } | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return null
    
    const parsed = JSON.parse(data)
    return {
      tasks: parsed.tasks || [],
      levelId: parsed.levelId || ''
    }
  } catch (error) {
    console.error('Failed to load schedule:', error)
    return null
  }
}

export function clearSchedule() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (error) {
    console.error('Failed to clear schedule:', error)
    return false
  }
}

