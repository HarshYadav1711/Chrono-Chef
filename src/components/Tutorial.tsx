import React, { useEffect, useRef, useState, useCallback } from 'react'
import type { TutorialStep } from '../types/tutorial'

interface TutorialHookReturn {
  state: {
    isActive: boolean
    currentStep: number
    completedSteps: Set<string>
    isPaused: boolean
  }
  currentStep: TutorialStep | null
  totalSteps: number
  start: () => void
  pause: () => void
  resume: () => void
  stop: () => void
  nextStep: () => void
  previousStep: () => void
  skipStep: () => void
  goToStep: (stepIndex: number) => void
  isFirstStep: boolean
  isLastStep: boolean
}

interface TutorialProps {
  tutorial: TutorialHookReturn
  onActionComplete?: (stepId: string) => void
}

export function Tutorial({ tutorial, onActionComplete }: TutorialProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const highlightRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties>({})
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null)
  const [initialPosition, setInitialPosition] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (!tutorial.state.isActive) {
      if (highlightRef.current) {
        highlightRef.current.style.display = 'none'
      }
      return
    }

    // If currentStep is null but tutorial is active, try to get a valid step
    const step = tutorial.currentStep
    if (!step) {
      console.warn('[Tutorial] currentStep is null but tutorial is active, skipping highlight update')
      return
    }
    if (!step.target) {
      if (highlightRef.current) {
        highlightRef.current.style.display = 'none'
      }
      return
    }

    // Wait a bit for DOM to be ready
    const timeoutId = setTimeout(() => {
      // Double-check tutorial is still active
      if (!tutorial.state.isActive || !tutorial.currentStep) {
        return
      }
      
      // Find target element
      const targetElement = document.querySelector(step.target!)
      if (!targetElement) {
        // Try finding by class name without the dot
        const className = step.target.replace('.', '')
        const elements = document.getElementsByClassName(className)
        if (elements.length > 0) {
          updateHighlight(elements[0] as HTMLElement)
        } else if (highlightRef.current) {
          highlightRef.current.style.display = 'none'
        }
        return
      }

      updateHighlight(targetElement as HTMLElement)
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [tutorial.state.isActive, tutorial.currentStep])

  const updateHighlight = (element: HTMLElement) => {
    if (!highlightRef.current) return

    const rect = element.getBoundingClientRect()
    const padding = 8

    setHighlightStyle({
      position: 'fixed',
      left: `${rect.left - padding}px`,
      top: `${rect.top - padding}px`,
      width: `${rect.width + padding * 2}px`,
      height: `${rect.height + padding * 2}px`,
      pointerEvents: 'none',
      zIndex: 10009, // Just below tooltip but above everything else
      border: '3px solid #4A90E2',
      borderRadius: '4px',
      boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)',
      transition: 'all 0.3s ease'
    })

    highlightRef.current.style.display = 'block'
  }

  // Reset drag offset when step changes
  useEffect(() => {
    setDragOffset(null)
  }, [tutorial.state.currentStep])

  // Handle drag start
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    // Only allow dragging from the header area or a drag handle
    const target = e.target as HTMLElement
    if (target.tagName === 'BUTTON' || target.closest('button')) {
      return // Don't drag if clicking a button
    }
    
    setIsDragging(true)
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    
    if (tooltipRef.current) {
      const rect = tooltipRef.current.getBoundingClientRect()
      // Store where we clicked relative to the tooltip
      setDragStart({
        x: clientX - rect.left,
        y: clientY - rect.top
      })
      // Store the initial position of the tooltip
      setInitialPosition({
        x: rect.left,
        y: rect.top
      })
    }
  }

  // Handle drag move
  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging || !dragStart || !initialPosition || !tooltipRef.current) return
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    
    const rect = tooltipRef.current.getBoundingClientRect()
    // Calculate new position based on where we clicked and where mouse is now
    const newX = clientX - dragStart.x
    const newY = clientY - dragStart.y
    
    // Keep tooltip within viewport bounds
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const tooltipWidth = rect.width
    const tooltipHeight = rect.height
    
    const constrainedX = Math.max(0, Math.min(newX, viewportWidth - tooltipWidth))
    const constrainedY = Math.max(0, Math.min(newY, viewportHeight - tooltipHeight))
    
    // Calculate offset from initial position
    setDragOffset({
      x: constrainedX - initialPosition.x,
      y: constrainedY - initialPosition.y
    })
  }, [isDragging, dragStart, initialPosition])

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
    setDragStart(null)
    setInitialPosition(null)
  }, [])

  // Set up global drag listeners
  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e: MouseEvent) => handleDragMove(e)
      const handleTouchMove = (e: TouchEvent) => {
        e.preventDefault()
        handleDragMove(e)
      }
      const handleMouseUp = () => handleDragEnd()
      const handleTouchEnd = () => handleDragEnd()

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchend', handleTouchEnd)

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [isDragging, handleDragMove, handleDragEnd])

  // Don't hide tutorial if it's active - only hide if explicitly stopped
  if (!tutorial.state.isActive) {
    return null
  }
  
  // If currentStep is null but tutorial is active, show a fallback or keep previous step
  if (!tutorial.currentStep) {
    console.warn('[Tutorial] currentStep is null but tutorial is active, keeping tutorial visible')
    // Keep tutorial visible with a default message rather than hiding it
    return (
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10010, // Same as tooltip z-index
        background: '#2a2a2a',
        border: '2px solid #4A90E2',
        borderRadius: '8px',
        padding: '20px',
        maxWidth: '350px'
      }}>
        <h3 style={{ color: '#fff', margin: '0 0 10px 0' }}>Tutorial</h3>
        <p style={{ color: '#ddd', margin: '0 0 15px 0' }}>Loading tutorial step...</p>
        <button
          onClick={() => tutorial.stop()}
          style={{
            padding: '8px 16px',
            background: '#E24A4A',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Close Tutorial
        </button>
      </div>
    )
  }

  const step = tutorial.currentStep
  const progress = ((tutorial.state.currentStep + 1) / tutorial.totalSteps) * 100

  // Calculate tooltip position
  const getTooltipStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: 'fixed',
      zIndex: 10010, // Higher than recipe book (10001) and all other UI elements
      background: '#2a2a2a',
      border: '2px solid #4A90E2',
      borderRadius: '8px',
      padding: '20px',
      maxWidth: '350px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
    }

    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800
    const tooltipHeight = 300 // Approximate tooltip height
    const tooltipWidth = 350 // maxWidth from baseStyle
    const spacing = 20

    let baseTop = viewportHeight / 2
    let baseLeft = viewportWidth / 2
    let baseTransform = 'translate(-50%, -50%)'

    if (step.position === 'center') {
      baseTop = viewportHeight / 2
      baseLeft = viewportWidth / 2
      baseTransform = 'translate(-50%, -50%)'
    } else if (step.target && highlightRef.current) {
      const rect = highlightRef.current.getBoundingClientRect()

      switch (step.position) {
        case 'top':
          baseTop = Math.max(spacing, rect.top - tooltipHeight - spacing)
          baseLeft = Math.max(tooltipWidth / 2, Math.min(rect.left + rect.width / 2, viewportWidth - tooltipWidth / 2))
          baseTransform = 'translateX(-50%)'
          break
        case 'bottom':
          baseTop = Math.min(
            viewportHeight - tooltipHeight - spacing,
            rect.top + rect.height + spacing
          )
          const recipeSectionWidth = 200
          const minLeft = recipeSectionWidth + spacing
          const preferredLeft = rect.left + rect.width / 2
          baseLeft = Math.max(minLeft, Math.min(preferredLeft, viewportWidth - tooltipWidth / 2))
          baseTransform = 'translateX(-50%)'
          break
        case 'left':
          baseLeft = Math.max(spacing, rect.left - tooltipWidth - spacing)
          baseTop = Math.max(spacing, Math.min(rect.top + rect.height / 2 - tooltipHeight / 2, viewportHeight - tooltipHeight - spacing))
          baseTransform = ''
          break
        case 'right':
          baseLeft = Math.min(
            viewportWidth - tooltipWidth - spacing,
            rect.left + rect.width + spacing
          )
          baseTop = Math.max(spacing, Math.min(rect.top + rect.height / 2 - tooltipHeight / 2, viewportHeight - tooltipHeight - spacing))
          baseTransform = ''
          break
      }
    }

    // Apply drag offset if present
    if (dragOffset) {
      return {
        ...baseStyle,
        top: `${baseTop + dragOffset.y}px`,
        left: `${baseLeft + dragOffset.x}px`,
        transform: baseTransform,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none'
      }
    }

    return {
      ...baseStyle,
      top: `${baseTop}px`,
      left: `${baseLeft}px`,
      transform: baseTransform,
      cursor: 'grab',
      userSelect: 'none'
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10008, // Above most UI but below highlight and tooltip
          pointerEvents: 'none' // Always allow clicks through to target elements
        }}
      />

      {/* Highlight Box */}
      <div ref={highlightRef} style={highlightStyle} />

      {/* Tooltip */}
      <div 
        ref={tooltipRef}
        style={getTooltipStyle()}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        {/* Drag Handle */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'grab',
            color: '#888',
            fontSize: '14px',
            userSelect: 'none'
          }}
          title="Drag to move"
        >
          ⋮⋮
        </div>
        {/* Progress Bar */}
        <div style={{
          marginBottom: '15px',
          fontSize: '12px',
          color: '#aaa',
          textAlign: 'center'
        }}>
          Step {tutorial.state.currentStep + 1} of {tutorial.totalSteps}
        </div>
        <div style={{
          width: '100%',
          height: '4px',
          background: '#444',
          borderRadius: '2px',
          marginBottom: '15px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: '#4A90E2',
            transition: 'width 0.3s ease'
          }} />
        </div>

        {/* Title */}
        <h3 style={{
          margin: '0 0 10px 0',
          color: '#fff',
          fontSize: '18px',
          fontWeight: 'bold'
        }}>
          {step.title}
        </h3>

        {/* Description */}
        <p style={{
          margin: '0 0 15px 0',
          color: '#ddd',
          fontSize: '14px',
          lineHeight: '1.5'
        }}>
          {step.description}
        </p>

        {/* Action Hint */}
        {step.action && (
          <div style={{
            padding: '10px',
            background: '#333',
            borderRadius: '4px',
            marginBottom: '15px',
            border: '1px solid #4A90E2'
          }}>
            <div style={{
              fontSize: '12px',
              color: '#4A90E2',
              fontWeight: 'bold',
              marginBottom: '4px'
            }}>
              Action Required:
            </div>
            <div style={{
              fontSize: '12px',
              color: '#fff'
            }}>
              {step.action.description || `Please ${step.action.type} the highlighted element`}
            </div>
          </div>
        )}

        {/* Keyboard Hints */}
        <div style={{
          fontSize: '10px',
          color: '#888',
          marginBottom: '15px',
          textAlign: 'center'
        }}>
          Press <kbd style={{
            background: '#333',
            padding: '2px 6px',
            borderRadius: '3px',
            border: '1px solid #555'
          }}>T</kbd> to toggle tutorial • <kbd style={{
            background: '#333',
            padding: '2px 6px',
            borderRadius: '3px',
            border: '1px solid #555'
          }}>ESC</kbd> to close
        </div>

        {/* Buttons */}
        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-end'
        }}>
          {step.skipable && (
            <button
              onClick={tutorial.skipStep}
              style={{
                padding: '8px 16px',
                background: '#555',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Skip
            </button>
          )}
          {!tutorial.isFirstStep && (
            <button
              onClick={tutorial.previousStep}
              style={{
                padding: '8px 16px',
                background: '#555',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              ← Previous
            </button>
          )}
          <button
            onClick={() => {
              if (step.action && onActionComplete) {
                onActionComplete(step.id)
              }
              if (tutorial.isLastStep) {
                tutorial.stop()
              } else {
                tutorial.nextStep()
              }
            }}
            disabled={step.action && step.action.type !== 'wait'}
            style={{
              padding: '8px 16px',
              background: step.action && step.action.type !== 'wait' ? '#555' : '#4A90E2',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: step.action && step.action.type !== 'wait' ? 'not-allowed' : 'pointer',
              fontSize: '12px',
              fontWeight: 'bold',
              opacity: step.action && step.action.type !== 'wait' ? 0.5 : 1
            }}
          >
            {tutorial.isLastStep ? 'Finish' : step.action ? 'Continue' : 'Next →'}
          </button>
        </div>
      </div>
    </>
  )
}

