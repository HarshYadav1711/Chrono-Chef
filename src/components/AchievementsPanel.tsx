import React from 'react'
import type { Achievement } from '../types/achievements'

interface AchievementsPanelProps {
  achievements: Achievement[]
  onClose?: () => void
}

export function AchievementsPanel({ achievements, onClose }: AchievementsPanelProps) {
  const unlocked = achievements.filter(a => a.unlocked)
  const locked = achievements.filter(a => !a.unlocked)

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
      maxWidth: '600px',
      maxHeight: '80vh',
      overflowY: 'auto',
      zIndex: 10001,
      width: '90%'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#fff', margin: 0 }}>🏆 Achievements</h2>
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

      <div style={{ marginBottom: '15px', fontSize: '14px', color: '#aaa' }}>
        {unlocked.length} / {achievements.length} Unlocked
      </div>

      {unlocked.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#4A90E2', fontSize: '16px', marginBottom: '10px' }}>Unlocked</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '10px' }}>
            {unlocked.map(ach => (
              <div
                key={ach.id}
                style={{
                  padding: '12px',
                  background: '#333',
                  borderRadius: '4px',
                  border: '1px solid #4A90E2'
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '4px' }}>{ach.icon}</div>
                <div style={{ fontWeight: 'bold', color: '#fff', marginBottom: '4px' }}>
                  {ach.name}
                </div>
                <div style={{ fontSize: '11px', color: '#aaa' }}>
                  {ach.description}
                </div>
                {ach.unlockedAt && (
                  <div style={{ fontSize: '9px', color: '#888', marginTop: '4px' }}>
                    Unlocked: {new Date(ach.unlockedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {locked.length > 0 && (
        <div>
          <h3 style={{ color: '#888', fontSize: '16px', marginBottom: '10px' }}>Locked</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '10px' }}>
            {locked.map(ach => (
              <div
                key={ach.id}
                style={{
                  padding: '12px',
                  background: '#2a2a2a',
                  borderRadius: '4px',
                  border: '1px solid #555',
                  opacity: 0.6
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '4px', filter: 'grayscale(100%)' }}>
                  {ach.icon}
                </div>
                <div style={{ fontWeight: 'bold', color: '#888', marginBottom: '4px' }}>
                  ???
                </div>
                <div style={{ fontSize: '11px', color: '#666' }}>
                  {ach.description}
                </div>
                {ach.progress !== undefined && ach.target && (
                  <div style={{ marginTop: '6px' }}>
                    <div style={{
                      height: '4px',
                      background: '#444',
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${Math.min(100, (ach.progress / ach.target) * 100)}%`,
                        background: '#4A90E2'
                      }} />
                    </div>
                    <div style={{ fontSize: '9px', color: '#666', marginTop: '2px' }}>
                      {ach.progress} / {ach.target}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

