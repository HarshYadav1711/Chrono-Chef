export interface TutorialStep {
  id: string
  title: string
  description: string
  target?: string // CSS selector or element ID to highlight
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center'
  action?: {
    type: 'click' | 'drag' | 'wait'
    selector?: string
    description?: string
  }
  skipable?: boolean
  onComplete?: () => void
}

export interface TutorialState {
  isActive: boolean
  currentStep: number
  completedSteps: Set<string>
  isPaused: boolean
}

