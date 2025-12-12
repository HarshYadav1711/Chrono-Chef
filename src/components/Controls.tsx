import type { SimulationMode } from '../hooks/useSimulation'

interface ControlsProps {
  mode: SimulationMode
  canUndo: boolean
  canRedo: boolean
  onRun: () => void
  onRunRealtime: () => void
  onPause: () => void
  onResume: () => void
  onStep: () => void
  onStop: () => void
  onReset: () => void
  onUndo: () => void
  onRedo: () => void
  onSave: () => void
  onLoad: () => void
  onUpgrades?: () => void
  onReplays?: () => void
  onLeaderboard?: () => void
  currentTime?: number
  taskCount?: number
  levelName?: string
}

export function Controls({
  mode,
  canUndo,
  canRedo,
  onRun,
  onRunRealtime,
  onPause,
  onResume,
  onStep,
  onStop,
  onReset,
  onUndo,
  onRedo,
  onSave,
  onLoad,
  onUpgrades: _onUpgrades,
  onReplays: _onReplays,
  onLeaderboard: _onLeaderboard,
  currentTime = 0,
  taskCount = 0,
  levelName = ''
}: ControlsProps) {
  return (
    <div style={{ 
      padding: '10px 20px', 
      background: '#2a2a2a', 
      display: 'flex', 
      gap: '10px',
      alignItems: 'center',
      flexWrap: 'wrap'
    }}>
      {/* Simulation Controls */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {mode === 'stopped' && (
          <>
            <button
              className="controls-run"
              onClick={onRun}
              style={{
                padding: '8px 16px',
                background: '#4A90E2',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Run
            </button>
            <button
              onClick={onRunRealtime}
              style={{
                padding: '8px 16px',
                background: '#4AE2A0',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Run Real-time
            </button>
          </>
        )}
        {mode === 'running' && (
          <>
            <button
              onClick={onPause}
              style={{
                padding: '8px 16px',
                background: '#E2A04A',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Pause
            </button>
            <button
              onClick={onStop}
              style={{
                padding: '8px 16px',
                background: '#E24A4A',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Stop
            </button>
          </>
        )}
        {mode === 'paused' && (
          <>
            <button
              onClick={onResume}
              style={{
                padding: '8px 16px',
                background: '#4AE2A0',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Resume
            </button>
            <button
              onClick={onStep}
              style={{
                padding: '8px 16px',
                background: '#4A90E2',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Step
            </button>
            <button
              onClick={onStop}
              style={{
                padding: '8px 16px',
                background: '#E24A4A',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Stop
            </button>
          </>
        )}
      </div>

      {/* History Controls */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          className="controls-undo"
          onClick={onUndo}
          disabled={!canUndo}
          style={{
            padding: '8px 16px',
            background: canUndo ? '#555' : '#333',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: canUndo ? 'pointer' : 'not-allowed',
            opacity: canUndo ? 1 : 0.5
          }}
        >
          Undo
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          style={{
            padding: '8px 16px',
            background: canRedo ? '#555' : '#333',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: canRedo ? 'pointer' : 'not-allowed',
            opacity: canRedo ? 1 : 0.5
          }}
        >
          Redo
        </button>
      </div>

      {/* Save/Load */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          className="controls-save"
          onClick={onSave}
          style={{
            padding: '8px 16px',
            background: '#555',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Save
        </button>
        <button
          onClick={onLoad}
          style={{
            padding: '8px 16px',
            background: '#555',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Load
        </button>
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        style={{
          padding: '8px 16px',
          background: '#E24A4A',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Reset
      </button>

      {/* Status */}
      <div style={{ 
        marginLeft: 'auto', 
        fontSize: '12px', 
        color: '#aaa', 
        display: 'flex', 
        gap: '15px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        {mode !== 'stopped' && <div>Time: {currentTime}s</div>}
        <div>Tasks: {taskCount}</div>
        <div>Level: {levelName}</div>
      </div>
    </div>
  )
}

