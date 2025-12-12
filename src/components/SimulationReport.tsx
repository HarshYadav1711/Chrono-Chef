import { useState } from 'react'
import type { RunReport } from '../types'

interface SimulationReportProps {
  report: RunReport | null
}

export function SimulationReport({ report }: SimulationReportProps) {
  const [filter, setFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  if (!report) {
    return (
      <div style={{ 
        width: '200px', 
        background: '#252525', 
        padding: '10px',
        height: '100%'
      }}>
        <h3 style={{ color: '#fff' }}>Simulation Report</h3>
        <div style={{ fontSize: '12px', color: '#888', marginTop: '10px' }}>
          Run simulation to see results
        </div>
      </div>
    )
  }

  const filteredEvents = report.events.filter(event => {
    if (filter !== 'all' && event.type !== filter) return false
    if (searchTerm && !event.message.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  return (
    <div 
      className="simulation-report"
      style={{ 
        width: '200px', 
        background: '#252525', 
        padding: '10px',
        overflowY: 'auto',
        height: '100%'
      }}
    >
      <h3 style={{ color: '#fff', marginBottom: '10px' }}>Simulation Report</h3>
      
      <div style={{ fontSize: '12px', marginBottom: '10px' }}>
        <div style={{ color: report.success ? '#4a9a4a' : '#9a4a4a', fontWeight: 'bold' }}>
          {report.success ? '✓ Success' : '✗ Failed'}
        </div>
        <div style={{ color: '#fff', marginTop: '4px' }}>
          Score: <span style={{ fontWeight: 'bold' }}>{report.finalScore.toFixed(1)}</span>
        </div>
        <div style={{ color: '#4a9a4a', marginTop: '4px' }}>
          Completed: {report.completedOrders}
        </div>
        <div style={{ color: '#9a4a4a', marginTop: '4px' }}>
          Failed: {report.failedOrders}
        </div>
      </div>

      <div style={{ marginTop: '15px', marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '4px',
            background: '#333',
            border: '1px solid #555',
            borderRadius: '4px',
            color: '#fff',
            fontSize: '11px'
          }}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            width: '100%',
            padding: '4px',
            background: '#333',
            border: '1px solid #555',
            borderRadius: '4px',
            color: '#fff',
            fontSize: '11px'
          }}
        >
          <option value="all">All Events</option>
          <option value="task_start">Task Start</option>
          <option value="task_complete">Task Complete</option>
          <option value="task_blocked">Task Blocked</option>
          <option value="order_complete">Order Complete</option>
          <option value="order_failed">Order Failed</option>
        </select>
      </div>

      <div style={{ 
        maxHeight: '300px', 
        overflowY: 'auto',
        fontSize: '10px'
      }}>
        {filteredEvents.slice(-50).map((event, idx) => (
          <div 
            key={idx} 
            style={{ 
              color: '#aaa', 
              marginBottom: '4px',
              padding: '4px',
              background: '#2a2a2a',
              borderRadius: '2px',
              borderLeft: `3px solid ${
                event.type === 'task_start' ? '#4A90E2' :
                event.type === 'task_complete' ? '#4a9a4a' :
                event.type === 'task_blocked' ? '#E24A4A' :
                event.type === 'order_complete' ? '#4a9a4a' :
                event.type === 'order_failed' ? '#9a4a4a' : '#888'
              }`
            }}
          >
            <div style={{ color: '#888' }}>[{event.time}s]</div>
            <div style={{ color: '#ddd', marginTop: '2px' }}>{event.message}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

