import React, { useRef, useState, useCallback } from 'react'
import { Stage, Layer, Rect, Text, Group, Line } from 'react-konva'
import type { ScheduledTask, Station, Recipe } from '../types'
import { STATIONS, STATION_COLORS, STATION_EMOJIS } from '../types'
import { TaskBlock } from './TaskBlock'
import { DependencyArrow } from './DependencyArrow'
import {
  SECOND_WIDTH,
  LANE_HEIGHT,
  TIMELINE_START_X,
  TIMELINE_START_Y,
  xToTime,
  yToLaneIndex,
  laneIndexToY,
  timeToX
} from '../utils/timeline'
import recipesData from '../data/recipes.json'

interface TimelineProps {
  scheduledTasks: ScheduledTask[]
  activeTaskIds?: Set<string>
  selectedTaskId?: string | null
  zoom?: number
  panX?: number
  draggingTask?: { recipe: Recipe; task: any; orderId: number } | null
  onTaskDrop?: (task: ScheduledTask, newStartTime: number, newStation: Station) => void
  onTaskUpdate?: (task: ScheduledTask, updates: Partial<ScheduledTask>) => void
  onTaskClick?: (task: ScheduledTask) => void
  onTaskResize?: (task: ScheduledTask, newDuration: number) => void
  showDependencies?: boolean
  width?: number
  height?: number
}

export function Timeline({
  scheduledTasks,
  activeTaskIds = new Set(),
  selectedTaskId = null,
  zoom = 1,
  panX = 0,
  draggingTask: externalDraggingTask = null,
  onTaskDrop,
  onTaskUpdate,
  onTaskClick,
  onTaskResize,
  showDependencies = true,
  width = typeof window !== 'undefined' ? window.innerWidth - 400 : 1200,
  height = 600
}: TimelineProps) {
  const stageRef = useRef<any>(null)
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null)
  const [hoverLane, setHoverLane] = useState<number | null>(null)
  const draggingTask = externalDraggingTask

  const visibleWidth = width - TIMELINE_START_X
  const maxTime = Math.max(
    ...scheduledTasks.map(t => t.startTime + t.duration),
    100
  )
  const visibleTime = Math.ceil(visibleWidth / (SECOND_WIDTH * zoom))

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const stage = stageRef.current
    if (!stage || !draggingTask) return

    const pointerPos = stage.getPointerPosition()
    if (pointerPos) {
      setDragPosition(pointerPos)
      const y = pointerPos.y - TIMELINE_START_Y
      const laneIndex = yToLaneIndex(y)
      setHoverLane(laneIndex >= 0 && laneIndex < STATIONS.length ? laneIndex : null)
    }
  }, [draggingTask])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!draggingTask || !onTaskDrop) return

    const stage = stageRef.current
    if (!stage) return

    const pointerPos = stage.getPointerPosition()
    if (!pointerPos) return

    const x = pointerPos.x - TIMELINE_START_X - panX
    const y = pointerPos.y - TIMELINE_START_Y

    const snappedX = Math.max(0, Math.round(x / (SECOND_WIDTH * zoom)) * (SECOND_WIDTH * zoom))
    const laneIndex = yToLaneIndex(y)

    if (laneIndex >= 0 && laneIndex < STATIONS.length) {
      const station = STATIONS[laneIndex]
      if (station === draggingTask.task.station) {
        const startTime = xToTime(snappedX / zoom)
        onTaskDrop(draggingTask as any, startTime, station)
      }
    }

    setDraggingTask(null)
    setDragPosition(null)
    setHoverLane(null)
  }, [draggingTask, onTaskDrop, panX, zoom])

  // Build dependency map
  const dependencyMap = new Map<string, ScheduledTask[]>()
  if (showDependencies) {
    scheduledTasks.forEach(task => {
      task.dependencies.forEach(depId => {
        const depTask = scheduledTasks.find(
          t => t.orderId === task.orderId && t.taskId === depId
        )
        if (depTask) {
          const key = `${task.orderId}-${task.taskId}`
          if (!dependencyMap.has(key)) {
            dependencyMap.set(key, [])
          }
          dependencyMap.get(key)!.push(depTask)
        }
      })
    })
  }

  return (
    <div
      className="timeline-container"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{ width: '100%', height: '100%' }}
    >
      <Stage
        ref={stageRef}
        width={width}
        height={height}
        onMouseMove={(e) => {
          if (draggingTask) {
            const pos = e.target.getStage()?.getPointerPosition()
            if (pos) {
              setDragPosition(pos)
              const y = pos.y - TIMELINE_START_Y
              const laneIndex = yToLaneIndex(y)
              setHoverLane(laneIndex >= 0 && laneIndex < STATIONS.length ? laneIndex : null)
            }
          }
        }}
      >
        <Layer>
          {/* Station Lanes */}
          {STATIONS.map((station, idx) => (
            <Group key={station}>
              <Rect
                x={TIMELINE_START_X}
                y={TIMELINE_START_Y + idx * LANE_HEIGHT}
                width={visibleWidth}
                height={LANE_HEIGHT - 2}
                fill={idx % 2 === 0 ? '#2a2a2a' : '#252525'}
                stroke={hoverLane === idx ? '#4A90E2' : '#444'}
                strokeWidth={hoverLane === idx ? 2 : 1}
              />
              <Text
                x={10}
                y={TIMELINE_START_Y + idx * LANE_HEIGHT + 25}
                text={`${STATION_EMOJIS[station]} ${station}`}
                fontSize={14}
                fill="#fff"
              />
            </Group>
          ))}

          {/* Time markers */}
          {Array.from({ length: Math.floor(visibleTime / 10) + 1 }).map((_, i) => {
            const time = i * 10
            const x = TIMELINE_START_X + (time * SECOND_WIDTH * zoom) + panX
            return (
              <Group key={i}>
                <Line
                  points={[x, TIMELINE_START_Y, x, TIMELINE_START_Y + STATIONS.length * LANE_HEIGHT]}
                  stroke="#555"
                  strokeWidth={1}
                />
                <Text
                  x={x + 2}
                  y={TIMELINE_START_Y - 20}
                  text={`${time}s`}
                  fontSize={10}
                  fill="#888"
                />
              </Group>
            )
          })}

          {/* Dependency Arrows */}
          {showDependencies && Array.from(dependencyMap.entries()).map(([taskKey, deps]) => {
            const task = scheduledTasks.find(t => `${t.orderId}-${t.taskId}` === taskKey)
            if (!task) return null
            return deps.map((dep, idx) => (
              <DependencyArrow key={`${taskKey}-${dep.orderId}-${dep.taskId}-${idx}`} from={dep} to={task} />
            ))
          })}

          {/* Scheduled Task Blocks */}
          {scheduledTasks.map((task) => {
            const recipe = recipesData.find(r => r.id === task.recipeId) as Recipe
            const taskDef = recipe?.tasks.find(t => t.id === task.taskId)
            const taskKey = `${task.orderId}-${task.taskId}`
            const isActive = activeTaskIds.has(taskKey)
            const isSelected = selectedTaskId === taskKey

            return (
              <TaskBlock
                key={taskKey}
                task={{
                  ...task,
                  x: task.x * zoom + panX,
                  y: task.y
                }}
                taskName={taskDef?.name || task.taskId}
                isActive={isActive}
                isSelected={isSelected}
                onDragEnd={(updatedTask, newX, newY) => {
                  const adjustedX = (newX - panX) / zoom
                  const adjustedY = newY
                  const newStartTime = xToTime(adjustedX)
                  const laneIndex = yToLaneIndex(adjustedY)
                  const newStation = STATIONS[laneIndex]
                  
                  if (onTaskUpdate && newStation === task.station) {
                    onTaskUpdate(task, {
                      startTime: newStartTime,
                      x: timeToX(newStartTime),
                      y: laneIndexToY(laneIndex)
                    })
                  }
                }}
                onResize={(updatedTask, newDuration) => {
                  if (onTaskResize) {
                    onTaskResize(updatedTask, newDuration)
                  }
                }}
                onClick={onTaskClick}
                showResizeHandles={isSelected}
              />
            )
          })}

          {/* Dragging preview */}
          {draggingTask && dragPosition && hoverLane !== null && (
            <Group>
              <Rect
                x={dragPosition.x - 50}
                y={dragPosition.y - 20}
                width={draggingTask.task.duration * SECOND_WIDTH * zoom}
                height={40}
                fill={STATION_COLORS[draggingTask.task.station]}
                opacity={0.5}
                stroke="#fff"
                strokeWidth={2}
                cornerRadius={4}
              />
              <Text
                x={dragPosition.x - 45}
                y={dragPosition.y - 5}
                text={draggingTask.task.name}
                fontSize={11}
                fill="#fff"
              />
            </Group>
          )}
        </Layer>
      </Stage>
    </div>
  )
}

