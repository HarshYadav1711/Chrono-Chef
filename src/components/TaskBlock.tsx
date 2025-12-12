import { useState } from 'react'
import { Group, Rect, Text, Circle } from 'react-konva'
import type { ScheduledTask } from '../types'
import { STATION_COLORS } from '../types'
import { SECOND_WIDTH, LANE_HEIGHT } from '../utils/timeline'

interface TaskBlockProps {
  task: ScheduledTask
  taskName: string
  isActive?: boolean
  isSelected?: boolean
  onDragEnd?: (task: ScheduledTask, newX: number, newY: number) => void
  onResize?: (task: ScheduledTask, newDuration: number) => void
  onClick?: (task: ScheduledTask) => void
  showResizeHandles?: boolean
}

export function TaskBlock({
  task,
  taskName,
  isActive = false,
  isSelected = false,
  onDragEnd,
  onResize,
  onClick,
  showResizeHandles = false
}: TaskBlockProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeStartX, setResizeStartX] = useState(0)

  const width = task.duration * SECOND_WIDTH
  const height = LANE_HEIGHT - 4

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDragEnd = (e: any) => {
    setIsDragging(false)
    if (onDragEnd) {
      const newX = e.target.x()
      const newY = e.target.y()
      onDragEnd(task, newX, newY)
      
      // Dispatch custom event for tutorial detection
      const dragEvent = new CustomEvent('taskBlockDragged', {
        detail: { task, newX, newY },
        bubbles: true
      })
      document.dispatchEvent(dragEvent)
    }
  }

  const handleResizeStart = (e: any) => {
    e.cancelBubble = true
    setIsResizing(true)
    setResizeStartX(e.evt.clientX)
  }

  const handleResizeMove = (e: any) => {
    if (!isResizing) return
    e.cancelBubble = true
    
    const deltaX = e.evt.clientX - resizeStartX
    const deltaSeconds = Math.round(deltaX / SECOND_WIDTH)
    const newDuration = Math.max(1, task.duration + deltaSeconds)
    
    if (onResize && newDuration !== task.duration) {
      onResize(task, newDuration)
      setResizeStartX(e.evt.clientX)
    }
  }

  const handleResizeEnd = () => {
    setIsResizing(false)
  }

  return (
    <Group
      className="task-block"
      x={task.x}
      y={task.y}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => onClick?.(task)}
      onMouseDown={(e) => {
        if (e.evt.button === 0) {
          e.cancelBubble = true
        }
      }}
    >
      <Rect
        width={width}
        height={height}
        fill={STATION_COLORS[task.station]}
        opacity={isActive ? 1 : isSelected ? 0.9 : 0.7}
        stroke={isSelected ? '#fff' : isActive ? '#ffff00' : '#fff'}
        strokeWidth={isSelected || isActive ? 2 : 1}
        cornerRadius={4}
        shadowBlur={isDragging ? 10 : 0}
        shadowColor="rgba(0,0,0,0.5)"
      />
      <Text
        x={4}
        y={20}
        text={taskName}
        fontSize={11}
        fill="#fff"
        width={width - 8}
        ellipsis
      />
      <Text
        x={4}
        y={35}
        text={`${task.duration}s`}
        fontSize={9}
        fill="#ddd"
      />
      {isActive && (
        <Circle
          x={width - 10}
          y={10}
          radius={4}
          fill="#ffff00"
        />
      )}
      {showResizeHandles && (
        <>
          <Rect
            x={width - 8}
            y={0}
            width={8}
            height={height}
            fill="rgba(255,255,255,0.3)"
            onMouseDown={handleResizeStart}
            onMouseMove={handleResizeMove}
            onMouseUp={handleResizeEnd}
            onMouseLeave={handleResizeEnd}
          />
        </>
      )}
    </Group>
  )
}

