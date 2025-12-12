import React from 'react'
import { Arrow } from 'react-konva'
import type { ScheduledTask } from '../types'
import { SECOND_WIDTH, LANE_HEIGHT, TIMELINE_START_X, TIMELINE_START_Y } from '../utils/timeline'

interface DependencyArrowProps {
  from: ScheduledTask
  to: ScheduledTask
  color?: string
}

export function DependencyArrow({ from, to, color = '#ffff00' }: DependencyArrowProps) {
  const fromX = TIMELINE_START_X + from.x + (from.duration * SECOND_WIDTH)
  const fromY = TIMELINE_START_Y + from.y + (LANE_HEIGHT / 2)
  
  const toX = TIMELINE_START_X + to.x
  const toY = TIMELINE_START_Y + to.y + (LANE_HEIGHT / 2)

  // Only show arrow if tasks are different
  if (from.orderId === to.orderId && from.taskId === to.taskId) {
    return null
  }

  return (
    <Arrow
      className="dependency-arrow"
      points={[fromX, fromY, toX, toY]}
      stroke={color}
      strokeWidth={2}
      fill={color}
      pointerLength={8}
      pointerWidth={8}
      opacity={0.6}
    />
  )
}

