import { useState, useCallback, useEffect, useRef } from 'react'
import type { TutorialStep, TutorialState } from '../types/tutorial'
import { TUTORIAL_STEPS } from '../data/tutorial'
import { setupTutorialListeners } from '../utils/tutorialActions'

export function useTutorial() {
  const [state, setState] = useState<TutorialState>({
    isActive: false,
    currentStep: 0,
    completedSteps: new Set(),
    isPaused: false
  })

  const observerRef = useRef<MutationObserver | null>(null)
  const actionCheckIntervalRef = useRef<number | null>(null)

  const start = useCallback(() => {
    setState(prev => {
      // If tutorial was already active, don't reset - just ensure it stays active
      if (prev.isActive) {
        // Ensure currentStep is valid
        const validStep = Math.max(0, Math.min(prev.currentStep, TUTORIAL_STEPS.length - 1))
        return {
          ...prev,
          isActive: true,
          currentStep: validStep,
          isPaused: false
        }
      }
      return {
        ...prev,
        isActive: true,
        currentStep: 0,
        isPaused: false
      }
    })
  }, [])

  const pause = useCallback(() => {
    setState(prev => ({ ...prev, isPaused: true }))
  }, [])

  const resume = useCallback(() => {
    setState(prev => ({ ...prev, isPaused: false }))
  }, [])

  const stop = useCallback(() => {
    setState(prev => {
      // Mark tutorial as completed if all steps are done
      const allStepsCompleted = prev.completedSteps.size === TUTORIAL_STEPS.length
      if (allStepsCompleted) {
        localStorage.setItem('chrono-chef-tutorial-completed', 'true')
      }
      
      return {
        ...prev,
        isActive: false,
        isPaused: false
      }
    })
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }
    if (actionCheckIntervalRef.current) {
      clearInterval(actionCheckIntervalRef.current)
      actionCheckIntervalRef.current = null
    }
  }, [])

  const nextStep = useCallback(() => {
    setState(prev => {
      // Ensure we don't go out of bounds
      if (!prev.isActive) {
        console.warn('[Tutorial] nextStep called but tutorial is not active')
        return prev
      }
      
      const currentStepIndex = Math.max(0, Math.min(prev.currentStep, TUTORIAL_STEPS.length - 1))
      const currentStepData = TUTORIAL_STEPS[currentStepIndex]
      
      if (currentStepIndex < TUTORIAL_STEPS.length - 1) {
        return {
          ...prev,
          currentStep: currentStepIndex + 1,
          completedSteps: new Set([...prev.completedSteps, currentStepData.id])
        }
      } else {
        // Tutorial complete
        return {
          ...prev,
          isActive: false,
          completedSteps: new Set([...prev.completedSteps, currentStepData.id])
        }
      }
    })
  }, [])

  const previousStep = useCallback(() => {
    setState(prev => {
      if (!prev.isActive) {
        console.warn('[Tutorial] previousStep called but tutorial is not active')
        return prev
      }
      if (prev.currentStep > 0) {
        return {
          ...prev,
          currentStep: prev.currentStep - 1
        }
      }
      return prev
    })
  }, [])

  const skipStep = useCallback(() => {
    nextStep()
  }, [nextStep])

  const goToStep = useCallback((stepIndex: number) => {
    setState(prev => {
      const validStep = Math.max(0, Math.min(stepIndex, TUTORIAL_STEPS.length - 1))
      return {
        ...prev,
        isActive: true, // Ensure tutorial is active when going to a step
        currentStep: validStep
      }
    })
  }, [])

  const getCurrentStep = useCallback((): TutorialStep | null => {
    // Ensure currentStep is always valid
    const validStep = Math.max(0, Math.min(state.currentStep, TUTORIAL_STEPS.length - 1))
    if (validStep >= 0 && validStep < TUTORIAL_STEPS.length) {
      return TUTORIAL_STEPS[validStep]
    }
    return TUTORIAL_STEPS[0] || null // Fallback to first step if available
  }, [state.currentStep])

  // Monitor for action completion
  useEffect(() => {
    if (!state.isActive || state.isPaused) {
      if (actionCheckIntervalRef.current) {
        clearInterval(actionCheckIntervalRef.current)
        actionCheckIntervalRef.current = null
      }
      return
    }

    const currentStep = getCurrentStep()
    if (!currentStep) {
      console.warn('[Tutorial] No current step available, but tutorial is active')
      return
    }
    
    if (!currentStep.action) {
      // No action required for this step, listeners not needed
      return
    }

    // Set up event listeners for interactive steps
    let cleanupFn: (() => void) | undefined
    try {
      cleanupFn = setupTutorialListeners(currentStep, () => {
        // Action completed - auto-advance if it's an interactive step
        if (currentStep.action?.type === 'click' || currentStep.action?.type === 'drag') {
          setTimeout(() => {
            // Check if tutorial is still active before advancing
            setState(prev => {
              if (!prev.isActive) {
                console.warn('[Tutorial] Attempted to advance but tutorial is not active')
                return prev
              }
              const stepIndex = Math.max(0, Math.min(prev.currentStep, TUTORIAL_STEPS.length - 1))
              if (stepIndex < TUTORIAL_STEPS.length - 1) {
                const stepData = TUTORIAL_STEPS[stepIndex]
                return {
                  ...prev,
                  currentStep: stepIndex + 1,
                  completedSteps: new Set([...prev.completedSteps, stepData.id])
                }
              } else {
                const stepData = TUTORIAL_STEPS[stepIndex]
                return {
                  ...prev,
                  isActive: false,
                  completedSteps: new Set([...prev.completedSteps, stepData.id])
                }
              }
            })
          }, 500) // Small delay for visual feedback
        }
      })
    } catch (error) {
      console.error('[Tutorial] Error setting up listeners:', error)
    }

    return () => {
      if (cleanupFn) {
        try {
          cleanupFn()
        } catch (error) {
          console.error('[Tutorial] Error cleaning up listeners:', error)
        }
      }
    }
  }, [state.isActive, state.isPaused, state.currentStep, getCurrentStep, nextStep])

  return {
    state,
    currentStep: getCurrentStep(),
    totalSteps: TUTORIAL_STEPS.length,
    start,
    pause,
    resume,
    stop,
    nextStep,
    previousStep,
    skipStep,
    goToStep,
    isFirstStep: state.currentStep === 0,
    isLastStep: state.currentStep === TUTORIAL_STEPS.length - 1
  }
}

