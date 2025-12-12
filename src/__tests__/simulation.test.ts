import { dependenciesDone, acquireReleaseResource, computeScore } from '../engine/core'
import { simulateRun } from '../engine/simulation'
import recipesData from '../data/recipes.json'
import levelsData from '../data/levels.json'
import type { Station } from '../types'

describe('Simulation Engine', () => {
  describe('dependenciesDone', () => {
    it('should return true when all dependencies are completed', () => {
      const completed = new Set<string>(['task1', 'task2', 'task3'])
      expect(dependenciesDone('task4', ['task1', 'task2'], completed)).toBe(true)
    })

    it('should return false when any dependency is missing', () => {
      const completed = new Set<string>(['task1'])
      expect(dependenciesDone('task3', ['task1', 'task2'], completed)).toBe(false)
    })

    it('should return true when there are no dependencies', () => {
      const completed = new Set<string>()
      expect(dependenciesDone('task1', [], completed)).toBe(true)
    })
  })

  describe('acquireReleaseResource', () => {
    const stationCounts: Record<Station, number> = { prep: 2, stove: 1, oven: 0, fryer: 1, blender: 0, plating: 1 }
    const occupancy = new Map<Station, number>()

    beforeEach(() => {
      occupancy.clear()
    })

    it('should acquire resource when available', () => {
      const result = acquireReleaseResource('prep', stationCounts, occupancy, true)
      expect(result).toBe(true)
      expect(occupancy.get('prep')).toBe(1)
    })

    it('should block when station is at capacity', () => {
      occupancy.set('stove', 1)
      const result = acquireReleaseResource('stove', stationCounts, occupancy, true)
      expect(result).toBe(false)
      expect(occupancy.get('stove')).toBe(1)
    })

    it('should allow multiple resources up to limit', () => {
      acquireReleaseResource('prep', stationCounts, occupancy, true)
      const result = acquireReleaseResource('prep', stationCounts, occupancy, true)
      expect(result).toBe(true)
      expect(occupancy.get('prep')).toBe(2)
      
      // Third should fail
      const result2 = acquireReleaseResource('prep', stationCounts, occupancy, true)
      expect(result2).toBe(false)
    })

    it('should release resource correctly', () => {
      occupancy.set('prep', 2)
      acquireReleaseResource('prep', stationCounts, occupancy, false)
      expect(occupancy.get('prep')).toBe(1)
      
      acquireReleaseResource('prep', stationCounts, occupancy, false)
      expect(occupancy.get('prep')).toBe(0)
    })

    it('should not go below zero when releasing', () => {
      occupancy.set('prep', 0)
      acquireReleaseResource('prep', stationCounts, occupancy, false)
      expect(occupancy.get('prep')).toBe(0)
    })
  })

  describe('computeScore', () => {
    it('should calculate score with completion bonus', () => {
      const score = computeScore(3, 0, 3, 10, 5)
      expect(score).toBe(3 * 5 + 10) // 25
    })

    it('should subtract failure penalty', () => {
      const score = computeScore(2, 1, 3, 5, 5)
      expect(score).toBe(2 * 5 - 1 * 2.5 + 5) // 12.5
    })

    it('should not go below zero', () => {
      const score = computeScore(0, 5, 5, 0, 5)
      expect(score).toBe(0)
    })

    it('should include time bonus', () => {
      const score = computeScore(1, 0, 1, 20, 10)
      expect(score).toBe(30)
    })
  })

  describe('simulateRun', () => {
    const level = levelsData[0] as any
    const recipe = recipesData[0] as any

    it('should run deterministically with same seed', () => {
      const schedule = recipe.tasks.map((task: any, idx: number) => ({
        taskId: task.id,
        recipeId: recipe.id,
        orderId: 0,
        station: task.station,
        startTime: idx * 5,
        duration: task.duration,
        dependencies: task.dependencies,
        x: 0,
        y: 0
      }))

      const result1 = simulateRun(schedule, level, 42)
      const result2 = simulateRun(schedule, level, 42)
      
      expect(result1.finalScore).toBe(result2.finalScore)
      expect(result1.completedOrders).toBe(result2.completedOrders)
    })

    it('should return run report with required fields', () => {
      const schedule = recipe.tasks.map((task: any, idx: number) => ({
        taskId: task.id,
        recipeId: recipe.id,
        orderId: 0,
        station: task.station,
        startTime: idx * 5,
        duration: task.duration,
        dependencies: task.dependencies,
        x: 0,
        y: 0
      }))

      const result = simulateRun(schedule, level, 0)
      
      expect(result).toHaveProperty('success')
      expect(result).toHaveProperty('finalScore')
      expect(result).toHaveProperty('completedOrders')
      expect(result).toHaveProperty('failedOrders')
      expect(result).toHaveProperty('taskEvents')
      expect(result).toHaveProperty('events')
      expect(Array.isArray(result.taskEvents)).toBe(true)
      expect(Array.isArray(result.events)).toBe(true)
    })

    it('should respect station resource limits', () => {
      // Create schedule with overlapping tasks on same station
      const schedule = [
        {
          taskId: 'task1',
          recipeId: 'test',
          orderId: 0,
          station: 'stove' as const,
          startTime: 0,
          duration: 10,
          dependencies: [],
          x: 0,
          y: 0
        },
        {
          taskId: 'task2',
          recipeId: 'test',
          orderId: 1,
          station: 'stove' as const,
          startTime: 5, // Overlaps with task1
          duration: 10,
          dependencies: [],
          x: 0,
          y: 0
        }
      ]

      const limitedLevel = { ...level, stations: { ...level.stations, stove: 1 } }
      const result = simulateRun(schedule, limitedLevel, 0)
      
      // At least one task should be blocked or delayed
      const blockedEvents = result.events.filter(e => e.type === 'task_blocked')
      expect(blockedEvents.length).toBeGreaterThan(0)
    })
  })
})

