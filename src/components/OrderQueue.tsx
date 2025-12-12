import React from 'react'
import type { Order, Recipe, Level } from '../types'

interface OrderQueueProps {
  level: Level
  recipes: Recipe[]
  currentTime?: number
  completedOrders?: Set<number>
  failedOrders?: Set<number>
  onReorder?: (fromIndex: number, toIndex: number) => void
  onCancel?: (orderIndex: number) => void
  canReorder?: boolean
}

export function OrderQueue({ 
  level, 
  recipes, 
  currentTime = 0,
  completedOrders = new Set(),
  failedOrders = new Set(),
  onReorder,
  onCancel,
  canReorder = false
}: OrderQueueProps) {
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null)
  return (
    <div 
      className="order-queue"
      style={{ 
        width: '200px', 
        background: '#252525', 
        padding: '10px',
        overflowY: 'auto',
        height: '100%'
      }}
    >
      <h3 style={{ marginBottom: '10px', color: '#fff' }}>Orders</h3>
      {level.orders.map((order, idx) => {
        const recipe = recipes.find(r => r.id === order.recipeId)
        const isCompleted = completedOrders.has(idx)
        const isFailed = failedOrders.has(idx)
        const hasArrived = currentTime >= order.arrivalTime
        const timeRemaining = hasArrived 
          ? Math.max(0, order.patience - (currentTime - order.arrivalTime))
          : order.arrivalTime - currentTime
        const patiencePercent = hasArrived 
          ? (timeRemaining / order.patience) * 100
          : 100

        return (
          <div 
            key={idx} 
            draggable={canReorder && !isCompleted && !isFailed}
            onDragStart={(e) => {
              if (canReorder) {
                setDraggedIndex(idx)
                e.dataTransfer.effectAllowed = 'move'
              }
            }}
            onDragOver={(e) => {
              if (canReorder && draggedIndex !== null && draggedIndex !== idx) {
                e.preventDefault()
                e.dataTransfer.dropEffect = 'move'
              }
            }}
            onDrop={(e) => {
              e.preventDefault()
              if (canReorder && draggedIndex !== null && onReorder && draggedIndex !== idx) {
                onReorder(draggedIndex, idx)
                setDraggedIndex(null)
              }
            }}
            onDragEnd={() => setDraggedIndex(null)}
            style={{ 
              padding: '8px', 
              marginBottom: '8px', 
              background: isCompleted ? '#2a5a2a' : isFailed ? '#5a2a2a' : '#333', 
              borderRadius: '4px',
              border: isCompleted ? '1px solid #4a9a4a' : isFailed ? '1px solid #9a4a4a' : '1px solid transparent',
              cursor: canReorder && !isCompleted && !isFailed ? 'grab' : 'default',
              opacity: draggedIndex === idx ? 0.5 : 1,
              transition: 'all 0.2s'
            }}
          >
            <div style={{ color: '#fff', fontWeight: 'bold' }}>
              {recipe?.name || order.recipeId}
            </div>
            <div style={{ fontSize: '10px', color: '#aaa', marginTop: '4px' }}>
              {hasArrived ? 'Arrived' : `Arrives in ${timeRemaining}s`}
            </div>
            {hasArrived && (
              <div style={{ marginTop: '6px' }}>
                <div style={{ 
                  height: '4px', 
                  background: '#444', 
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${patiencePercent}%`,
                    background: patiencePercent > 50 ? '#4A90E2' : patiencePercent > 25 ? '#E2A04A' : '#E24A4A',
                    transition: 'width 0.3s'
                  }} />
                </div>
                <div style={{ fontSize: '9px', color: '#888', marginTop: '2px' }}>
                  {Math.ceil(timeRemaining)}s patience
                </div>
              </div>
            )}
            {isCompleted && (
              <div style={{ fontSize: '10px', color: '#4a9a4a', marginTop: '4px' }}>
                ✓ Completed
              </div>
            )}
            {isFailed && (
              <div style={{ fontSize: '10px', color: '#9a4a4a', marginTop: '4px' }}>
                ✗ Failed
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

