import type { ScheduledTask, Station } from '../types'

export const SECOND_WIDTH = 4
export const LANE_HEIGHT = 80
export const TIMELINE_START_X = 200
export const TIMELINE_START_Y = 100

/**
 * Snap a time value to the nearest second
 */
export function snapToGrid(time: number): number {
  return Math.round(time)
}

/**
 * Convert time (seconds) to x position
 */
export function timeToX(time: number): number {
  return time * SECOND_WIDTH
}

/**
 * Convert x position to time (seconds)
 */
export function xToTime(x: number): number {
  return Math.max(0, Math.round(x / SECOND_WIDTH))
}

/**
 * Get lane index from y position
 */
export function yToLaneIndex(y: number): number {
  return Math.floor(y / LANE_HEIGHT)
}

/**
 * Get y position from lane index
 */
export function laneIndexToY(laneIndex: number): number {
  return laneIndex * LANE_HEIGHT
}

/**
 * Check if a task overlaps with another task on the same station
 */
export function hasOverlap(
  task1: ScheduledTask,
  task2: ScheduledTask
): boolean {
  if (task1.station !== task2.station) return false
  if (task1.orderId === task2.orderId && task1.taskId === task2.taskId) return false
  
  const task1End = task1.startTime + task1.duration
  const task2End = task2.startTime + task2.duration
  
  return !(task1End <= task2.startTime || task2End <= task1.startTime)
}

/**
 * Find all tasks that overlap with a given task
 */
export function findOverlappingTasks(
  task: ScheduledTask,
  allTasks: ScheduledTask[]
): ScheduledTask[] {
  return allTasks.filter(t => hasOverlap(task, t))
}

