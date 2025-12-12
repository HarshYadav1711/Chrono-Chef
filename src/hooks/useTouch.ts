import { useCallback, useRef } from 'react'

export function useTouch() {
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null)
  const touchMoveRef = useRef<{ x: number; y: number } | null>(null)

  const handleTouchStart = useCallback((e: React.TouchEvent, onStart?: (x: number, y: number) => void) => {
    const touch = e.touches[0]
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    }
    if (onStart) {
      onStart(touch.clientX, touch.clientY)
    }
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent, onMove?: (x: number, y: number, deltaX: number, deltaY: number) => void) => {
    if (!touchStartRef.current) return
    
    const touch = e.touches[0]
    const deltaX = touch.clientX - touchStartRef.current.x
    const deltaY = touch.clientY - touchStartRef.current.y
    
    touchMoveRef.current = {
      x: touch.clientX,
      y: touch.clientY
    }
    
    if (onMove) {
      onMove(touch.clientX, touch.clientY, deltaX, deltaY)
    }
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent, onClick?: (x: number, y: number) => void, onDragEnd?: (deltaX: number, deltaY: number) => void) => {
    if (!touchStartRef.current) return

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStartRef.current.x
    const deltaY = touch.clientY - touchStartRef.current.y
    const deltaTime = Date.now() - touchStartRef.current.time
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    // If moved less than 10px and took less than 300ms, treat as click
    if (distance < 10 && deltaTime < 300 && onClick) {
      onClick(touch.clientX, touch.clientY)
    } else if (distance >= 10 && onDragEnd) {
      onDragEnd(deltaX, deltaY)
    }

    touchStartRef.current = null
    touchMoveRef.current = null
  }, [])

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  }
}

