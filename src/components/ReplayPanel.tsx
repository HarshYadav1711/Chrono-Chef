import type { ReplayData } from '../types/replay'

interface ReplayPanelProps {
  replays: ReplayData[]
  currentReplay: ReplayData | null
  onLoad: (replayId: string) => void
  onDelete: (replayId: string) => void
  onClose?: () => void
}

export function ReplayPanel({ replays, currentReplay, onLoad, onDelete, onClose }: ReplayPanelProps) {
  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: '#2a2a2a',
      border: '2px solid #4A90E2',
      borderRadius: '8px',
      padding: '20px',
      maxWidth: '700px',
      maxHeight: '80vh',
      overflowY: 'auto',
      zIndex: 10001,
      width: '90%'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#fff', margin: 0 }}>📹 Replays</h2>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '0',
              width: '30px',
              height: '30px'
            }}
          >
            ×
          </button>
        )}
      </div>

      {replays.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#888', padding: '40px' }}>
          No replays saved yet. Complete a level to save a replay!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {replays.map(replay => (
            <div
              key={replay.id}
              style={{
                padding: '12px',
                background: currentReplay?.id === replay.id ? '#333' : '#2a2a2a',
                borderRadius: '4px',
                border: currentReplay?.id === replay.id ? '2px solid #4A90E2' : '1px solid #555'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', color: '#fff', marginBottom: '4px' }}>
                    {replay.levelId} - {new Date(replay.timestamp).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '8px' }}>
                    Score: {replay.report.finalScore.toFixed(1)} • 
                    Completed: {replay.report.completedOrders} • 
                    Failed: {replay.report.failedOrders} • 
                    Time: {replay.duration}s
                  </div>
                  <div style={{ fontSize: '11px', color: '#888' }}>
                    {replay.schedule.length} tasks scheduled
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => onLoad(replay.id)}
                    style={{
                      padding: '6px 12px',
                      background: '#4A90E2',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Load
                  </button>
                  <button
                    onClick={() => onDelete(replay.id)}
                    style={{
                      padding: '6px 12px',
                      background: '#E24A4A',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

