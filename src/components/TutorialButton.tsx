
interface TutorialButtonProps {
  onClick: () => void
  onMenuClick?: () => void
  isActive?: boolean
}

export function TutorialButton({ onClick, onMenuClick, isActive }: TutorialButtonProps) {
  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      zIndex: 1000
    }}>
      {onMenuClick && (
        <button
          onClick={onMenuClick}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: '#555',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontSize: '20px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)'
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}
          title="Tutorial Menu"
        >
          📖
        </button>
      )}
      <button
        onClick={onClick}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: isActive ? '#4A90E2' : '#555',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          fontSize: '24px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)'
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.4)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)'
        }}
        title={isActive ? "Close Tutorial" : "Start Tutorial"}
      >
        {isActive ? '✕' : '📚'}
      </button>
    </div>
  )
}

