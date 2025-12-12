import type { ScheduledTask, Level, RunReport } from './index'

export interface ReplayData {
  id: string
  timestamp: number
  levelId: string
  schedule: ScheduledTask[]
  report: RunReport
  seed: number
  duration: number
}

