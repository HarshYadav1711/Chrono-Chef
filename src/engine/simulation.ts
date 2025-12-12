import type { ScheduledTask, Level, RunReport } from '../types'
import { dependenciesDone, acquireReleaseResource, computeScore } from './core'
import { mulberry32 } from './rng'
import recipesData from '../data/recipes.json'
import type { Recipe } from '../types'

/**
 * Deterministic simulation runner
 */
export function simulateRun(
  schedule: ScheduledTask[],
  level: Level,
  seed: number = 0
): RunReport {
  mulberry32(seed) // Initialize RNG with seed
  const state = {
    currentTime: 0,
    activeTasks: new Map<string, { taskId: string; endTime: number; station: any }>(),
    completedTasks: new Set<string>(),
    stationOccupancy: new Map<any, number>(),
    score: 0,
    events: [] as Array<{ time: number; type: string; message: string }>
  }

  const orders = level.orders.map((order, idx) => ({ ...order, id: idx }))
  const completedOrders = new Set<number>()
  const failedOrders = new Set<number>()
  const taskEvents: RunReport['taskEvents'] = []
  
  // Sort schedule by start time
  const sortedSchedule = [...schedule].sort((a, b) => a.startTime - b.startTime)
  const pendingTasks = new Map<string, ScheduledTask>()
  sortedSchedule.forEach(task => {
    pendingTasks.set(`${task.orderId}-${task.taskId}`, task)
  })

  // Simulation loop (1 second ticks)
  while (state.currentTime <= level.timeLimit) {
    // Check for order arrivals and patience expiration
    orders.forEach(order => {
      if (order.arrivalTime <= state.currentTime && 
          !completedOrders.has((order as any).id) && 
          !failedOrders.has((order as any).id)) {
        if (state.currentTime > order.arrivalTime + order.patience) {
          failedOrders.add((order as any).id)
          state.events.push({
            time: state.currentTime,
            type: 'order_failed',
            message: `Order ${(order as any).id} (${order.recipeId}) failed - patience expired`
          })
        }
      }
    })

    // Complete active tasks
    const toComplete: string[] = []
    state.activeTasks.forEach((active, key) => {
      if (state.currentTime >= active.endTime) {
        toComplete.push(key)
        state.completedTasks.add(active.taskId)
        acquireReleaseResource(active.station, level.stations, state.stationOccupancy, false)
        const task = schedule.find(t => `${t.orderId}-${t.taskId}` === key)
        taskEvents.push({
          taskId: key,
          startTime: active.endTime - (task?.duration || 0),
          endTime: active.endTime,
          success: true
        })
        state.events.push({
          time: state.currentTime,
          type: 'task_complete',
          message: `Task ${key} completed`
        })
      }
    })
    toComplete.forEach(key => state.activeTasks.delete(key))

    // Start pending tasks
    pendingTasks.forEach((task, key) => {
      if (task.startTime <= state.currentTime &&
          !state.activeTasks.has(key) &&
          !state.completedTasks.has(`${task.orderId}-${task.taskId}`)) {
        
        // Check dependencies
        const allDepsDone = dependenciesDone(
          `${task.orderId}-${task.taskId}`,
          task.dependencies.map(dep => `${task.orderId}-${dep}`),
          state.completedTasks
        )

        if (allDepsDone) {
          // Try to acquire station
          if (acquireReleaseResource(task.station, level.stations, state.stationOccupancy, true)) {
            state.activeTasks.set(key, {
              taskId: `${task.orderId}-${task.taskId}`,
              endTime: state.currentTime + task.duration,
              station: task.station
            })
            state.events.push({
              time: state.currentTime,
              type: 'task_start',
              message: `Task ${key} started on ${task.station}`
            })
          } else {
            state.events.push({
              time: state.currentTime,
              type: 'task_blocked',
              message: `Task ${key} blocked - ${task.station} unavailable`
            })
          }
        }
      }
    })

    // Check for completed orders
    orders.forEach(order => {
      if (completedOrders.has((order as any).id) || failedOrders.has((order as any).id)) return
      
      const recipe = recipesData.find(r => r.id === order.recipeId) as Recipe
      if (!recipe) return
      
      const orderTaskKeys = recipe.tasks.map(t => `${(order as any).id}-${t.id}`)
      if (orderTaskKeys.every(key => state.completedTasks.has(key))) {
        completedOrders.add((order as any).id)
        state.events.push({
          time: state.currentTime,
          type: 'order_complete',
          message: `Order ${(order as any).id} (${order.recipeId}) completed!`
        })
      }
    })

    state.currentTime++
  }

  // Calculate final score
  const basePrice = orders.reduce((sum, order) => {
    const recipe = recipesData.find(r => r.id === order.recipeId) as Recipe
    return sum + (recipe?.price || 0)
  }, 0) / orders.length

  const timeBonus = Math.max(0, level.timeLimit - state.currentTime) * 0.1
  const finalScore = computeScore(
    completedOrders.size,
    failedOrders.size,
    orders.length,
    timeBonus,
    basePrice
  )

  return {
    success: completedOrders.size >= level.targetScore / 10,
    finalScore,
    completedOrders: completedOrders.size,
    failedOrders: failedOrders.size,
    taskEvents,
    events: state.events
  }
}

