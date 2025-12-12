import React, { useState } from 'react'
import type { LeaderboardEntry, LeaderboardFilter } from '../types/leaderboard'

interface LeaderboardPanelProps {
  entries: LeaderboardEntry[]
  onClose?: () => void
}

export function LeaderboardPanel({ entries, onClose }: LeaderboardPanelProps) {
  const [filter, setFilter] = useState<LeaderboardFilter>('all')
  const [levelFilter, setLevelFilter] = useState<string>('')

  const filtered = entries
    .filter(e => !levelFilter || e.levelId === levelFilter)
    .filter(e => {
      if (filter === 'all') return true
      if (filter === 'daily') {
        const dayStart = new Date().setHours(0, 0, 0, 0)
        return e.timestamp >= dayStart
      }
      if (filter === 'weekly') {
        const weekStart = new Date().setDate(new Date().getDate() - 7)
        return e.timestamp >= weekStart
      }
      return true
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 50)

  const levels = Array.from(new Set(entries.map(e => e.levelId)))

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
      maxWidth: '800px',
      maxHeight: '80vh',
      overflowY: 'auto',
      zIndex: 10001,
      width: '90%'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#fff', margin: 0 }}>🏆 Leaderboard</h2>
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

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as LeaderboardFilter)}
          style={{
            padding: '6px 12px',
            background: '#333',
            border: '1px solid #555',
            borderRadius: '4px',
            color: '#fff',
            fontSize: '12px'
          }}
        >
          <option value="all">All Time</option>
          <option value="daily">Today</option>
          <option value="weekly">This Week</option>
        </select>
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          style={{
            padding: '6px 12px',
            background: '#333',
            border: '1px solid #555',
            borderRadius: '4px',
            color: '#fff',
            fontSize: '12px'
          }}
        >
          <option value="">All Levels</option>
          {levels.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#888', padding: '40px' }}>
          No entries yet. Be the first to set a score!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '50px 1fr 100px 100px 100px 120px',
            gap: '10px',
            padding: '10px',
            background: '#333',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#fff'
          }}>
            <div>Rank</div>
            <div>Player</div>
            <div>Score</div>
            <div>Completed</div>
            <div>Failed</div>
            <div>Time</div>
          </div>
          {filtered.map((entry, idx) => (
            <div
              key={entry.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '50px 1fr 100px 100px 100px 120px',
                gap: '10px',
                padding: '10px',
                background: idx < 3 ? '#333' : '#2a2a2a',
                borderRadius: '4px',
                border: idx === 0 ? '2px solid #FFD700' : idx === 1 ? '2px solid #C0C0C0' : idx === 2 ? '2px solid #CD7F32' : '1px solid #555'
              }}
            >
              <div style={{ color: idx < 3 ? '#FFD700' : '#fff', fontWeight: 'bold' }}>
                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
              </div>
              <div style={{ color: '#fff' }}>{entry.playerName}</div>
              <div style={{ color: '#4A90E2', fontWeight: 'bold' }}>{entry.score.toFixed(1)}</div>
              <div style={{ color: '#4a9a4a' }}>{entry.completedOrders}</div>
              <div style={{ color: '#9a4a4a' }}>{entry.failedOrders}</div>
              <div style={{ color: '#aaa', fontSize: '11px' }}>
                {new Date(entry.timestamp).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

