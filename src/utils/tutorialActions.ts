import type { TutorialStep } from '../types/tutorial'

/**
 * Check if a tutorial action has been completed
 */
export function checkTutorialAction(step: TutorialStep): boolean {
  if (!step.action) return true

  const { type } = step.action

  switch (type) {
    case 'click':
      // For click actions, we rely on the component to notify completion
      // This is a placeholder - actual detection happens in components
      return false

    case 'drag':
      // For drag actions, we rely on the component to notify completion
      return false

    case 'wait':
      // Wait actions complete automatically after a delay
      return true

    default:
      return false
  }
}

/**
 * Set up event listeners for tutorial actions
 */
export function setupTutorialListeners(
  step: TutorialStep,
  onComplete: () => void
): () => void {
  if (!step.action || !step.action.selector) {
    return () => {}
  }

  const { type, selector } = step.action
  const elements = document.querySelectorAll(selector)
  const cleanup: (() => void)[] = []

  elements.forEach(element => {
    switch (type) {
      case 'click':
        const clickHandler = () => {
          onComplete()
        }
        element.addEventListener('click', clickHandler, { once: true })
        cleanup.push(() => {
          element.removeEventListener('click', clickHandler)
        })
        break

      case 'drag':
        // Listen for custom drag event dispatched by TaskBlock
        const dragHandler = (e: Event) => {
          const customEvent = e as CustomEvent
          if (customEvent.detail) {
            onComplete()
          }
        }
        document.addEventListener('taskBlockDragged', dragHandler)
        cleanup.push(() => {
          document.removeEventListener('taskBlockDragged', dragHandler)
        })
        break
    }
  })

  return () => {
    cleanup.forEach(fn => fn())
  }
}

