import React from 'react'

interface ZoomControlsProps {
  zoom: number
  panX: number
  onZoomChange: (zoom: number) => void
  onPanChange: (panX: number) => void
  onReset: () => void
}

export function ZoomControls({ zoom, panX, onZoomChange, onPanChange, onReset }: ZoomControlsProps) {
  return (
    <div 
      className="zoom-controls"
      style={{
        position: 'absolute',
        top: '60px',
        right: '220px',
        background: '#2a2a2a',
        padding: '8px',
        borderRadius: '4px',
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        zIndex: 10
      }}
    >
      <button
        onClick={() => onZoomChange(Math.max(0.5, zoom - 0.1))}
        style={{
          padding: '4px 8px',
          background: '#555',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        −
      </button>
      <span style={{ color: '#fff', fontSize: '12px', minWidth: '60px', textAlign: 'center' }}>
        {Math.round(zoom * 100)}%
      </span>
      <button
        onClick={() => onZoomChange(Math.min(3, zoom + 0.1))}
        style={{
          padding: '4px 8px',
          background: '#555',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        +
      </button>
      <button
        onClick={onReset}
        style={{
          padding: '4px 8px',
          background: '#555',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '10px'
        }}
      >
        Reset
      </button>
      <div style={{ 
        marginLeft: '8px', 
        paddingLeft: '8px', 
        borderLeft: '1px solid #555',
        fontSize: '10px',
        color: '#aaa'
      }}>
        Pan: {Math.round(panX)}
      </div>
    </div>
  )
}

