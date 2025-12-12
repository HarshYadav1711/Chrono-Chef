import { useState, useCallback } from 'react'

/**
 * Undo/Redo hook for timeline state management
 */
export function useHistory<T>(initialState: T) {
  const [history, setHistory] = useState<T[]>([initialState])
  const [historyIndex, setHistoryIndex] = useState(0)

  const current = history[historyIndex]

  const push = useCallback((newState: T) => {
    setHistory(prev => {
      // Remove any future history if we're not at the end
      const newHistory = prev.slice(0, historyIndex + 1)
      newHistory.push(newState)
      // Limit history to 50 states
      if (newHistory.length > 50) {
        newHistory.shift()
        return newHistory
      }
      return newHistory
    })
    setHistoryIndex(prev => Math.min(prev + 1, history.length))
  }, [historyIndex, history.length])

  const undo = useCallback(() => {
    setHistoryIndex(prev => Math.max(0, prev - 1))
  }, [])

  const redo = useCallback(() => {
    setHistoryIndex(prev => Math.min(history.length - 1, prev + 1))
  }, [history.length])

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  return {
    current,
    push,
    undo,
    redo,
    canUndo,
    canRedo
  }
}

