import { useState, useCallback } from 'react'
import type { ScheduledTask, Recipe } from '../types'
import { STATIONS } from '../types'
import { timeToX, laneIndexToY } from '../utils/timeline'
import { useHistory } from './useHistory'

export function useTimeline() {
  const [scheduledTasks, setScheduledTasks] = useState<ScheduledTask[]>([])
  const [zoom, setZoom] = useState(1)
  const [panX, setPanX] = useState(0)
  
  const history = useHistory<ScheduledTask[]>([])

  const addRecipe = useCallback((recipe: Recipe, orderId: number) => {
    const tasks: ScheduledTask[] = recipe.tasks.map((task, idx) => ({
      taskId: task.id,
      recipeId: recipe.id,
      orderId,
      station: task.station,
      startTime: idx * 5,
      duration: task.duration,
      dependencies: task.dependencies,
      x: timeToX(idx * 5),
      y: laneIndexToY(STATIONS.indexOf(task.station))
    }))

    setScheduledTasks(prev => {
      const newTasks = [...prev, ...tasks]
      history.push(newTasks)
      return newTasks
    })
  }, [history])

  const updateTask = useCallback((taskId: string, orderId: number, updates: Partial<ScheduledTask>) => {
    setScheduledTasks(prev => {
      const newTasks = prev.map(task => {
        if (task.taskId === taskId && task.orderId === orderId) {
          const updated = { ...task, ...updates }
          // Recalculate x/y if startTime or station changed
          if (updates.startTime !== undefined) {
            updated.x = timeToX(updated.startTime)
          }
          if (updates.station !== undefined) {
            updated.y = laneIndexToY(STATIONS.indexOf(updated.station))
          }
          return updated
        }
        return task
      })
      history.push(newTasks)
      return newTasks
    })
  }, [history])

  const removeTask = useCallback((taskId: string, orderId: number) => {
    setScheduledTasks(prev => {
      const newTasks = prev.filter(
        task => !(task.taskId === taskId && task.orderId === orderId)
      )
      history.push(newTasks)
      return newTasks
    })
  }, [history])

  const removeOrder = useCallback((orderId: number) => {
    setScheduledTasks(prev => {
      const newTasks = prev.filter(task => task.orderId !== orderId)
      history.push(newTasks)
      return newTasks
    })
  }, [history])

  const clearAll = useCallback(() => {
    setScheduledTasks([])
    history.push([])
  }, [history])

  const undo = useCallback(() => {
    history.undo()
    setScheduledTasks(history.current)
  }, [history])

  const redo = useCallback(() => {
    history.redo()
    setScheduledTasks(history.current)
  }, [history])

  return {
    scheduledTasks,
    zoom,
    panX,
    setZoom,
    setPanX,
    addRecipe,
    updateTask,
    removeTask,
    removeOrder,
    clearAll,
    undo,
    redo,
    canUndo: history.canUndo,
    canRedo: history.canRedo
  }
}

