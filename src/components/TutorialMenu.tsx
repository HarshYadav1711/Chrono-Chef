import { TUTORIAL_STEPS } from '../data/tutorial'

interface TutorialMenuProps {
  isOpen: boolean
  onClose: () => void
  onStart: () => void
  onGoToStep: (stepIndex: number) => void
  completedSteps: Set<string>
  currentStep?: number
}

export function TutorialMenu({
  isOpen,
  onClose,
  onStart,
  onGoToStep,
  completedSteps,
  currentStep
}: TutorialMenuProps) {
  if (!isOpen) return null

  const progress = (completedSteps.size / TUTORIAL_STEPS.length) * 100

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#2a2a2a',
          border: '2px solid #4A90E2',
          borderRadius: '8px',
          padding: '30px',
          maxWidth: '600px',
          maxHeight: '80vh',
          overflowY: 'auto',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: '24px',
            cursor: 'pointer',
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ×
        </button>

        <h2 style={{ color: '#fff', marginTop: 0, marginBottom: '20px' }}>
          Tutorial Guide 📚
        </h2>

        {/* Progress */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px',
            fontSize: '14px',
            color: '#aaa'
          }}>
            <span>Progress</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            background: '#444',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: '#4A90E2',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Tutorial Steps */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', fontSize: '16px', marginBottom: '10px' }}>
            Tutorial Steps
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {TUTORIAL_STEPS.map((step, index) => {
              const isCompleted = completedSteps.has(step.id)
              const isCurrent = currentStep === index

              return (
                <div
                  key={step.id}
                  onClick={() => {
                    onGoToStep(index)
                    onClose()
                  }}
                  style={{
                    padding: '12px',
                    background: isCurrent ? '#4A90E2' : isCompleted ? '#2a5a2a' : '#333',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    border: isCurrent ? '2px solid #6AB0E2' : '1px solid #555',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (!isCurrent) {
                      e.currentTarget.style.background = isCompleted ? '#2a6a2a' : '#3a3a3a'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isCurrent) {
                      e.currentTarget.style.background = isCompleted ? '#2a5a2a' : '#333'
                    }
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: isCompleted ? '#4a9a4a' : isCurrent ? '#fff' : '#555',
                      color: isCompleted || isCurrent ? '#fff' : '#aaa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        color: '#fff',
                        fontWeight: isCurrent ? 'bold' : 'normal',
                        fontSize: '14px'
                      }}>
                        {step.title}
                      </div>
                      <div style={{
                        color: '#aaa',
                        fontSize: '12px',
                        marginTop: '4px'
                      }}>
                        {step.description.substring(0, 60)}...
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={() => {
              onStart()
              onClose()
            }}
            style={{
              padding: '10px 20px',
              background: '#4A90E2',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            {completedSteps.size === 0 ? 'Start Tutorial' : 'Resume Tutorial'}
          </button>
        </div>
      </div>
    </div>
  )
}

