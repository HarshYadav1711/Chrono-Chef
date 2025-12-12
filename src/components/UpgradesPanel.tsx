import React from 'react'
import type { StationUpgrade } from '../types/upgrades'
import type { Station } from '../types'

interface UpgradesPanelProps {
  upgrades: StationUpgrade[]
  currentMoney: number
  onPurchase: (upgrade: StationUpgrade) => void
  stationCapacities: Record<Station, number>
  getUpgradedCapacity: (station: Station) => number
}

export function UpgradesPanel({
  upgrades,
  currentMoney,
  onPurchase,
  stationCapacities,
  getUpgradedCapacity
}: UpgradesPanelProps) {
  return (
    <div style={{
      width: '200px',
      background: '#252525',
      padding: '10px',
      overflowY: 'auto',
      height: '100%'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#fff', margin: 0 }}>⚙️ Station Upgrades</h2>
        <button
          onClick={() => {/* Close handled by parent */}}
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
      </div>
      <div style={{ 
        marginBottom: '10px', 
        padding: '8px', 
        background: '#333', 
        borderRadius: '4px',
        fontSize: '12px',
        color: '#fff'
      }}>
        Money: ${currentMoney}
      </div>
      
      {upgrades.map((upgrade, idx) => {
        const currentCapacity = stationCapacities[upgrade.station as Station] || 0
        const upgradedCapacity = getUpgradedCapacity(upgrade.station as Station)
        const canAfford = currentMoney >= upgrade.cost

        return (
          <div
            key={idx}
            style={{
              padding: '10px',
              marginBottom: '8px',
              background: canAfford ? '#333' : '#2a2a2a',
              borderRadius: '4px',
              border: '1px solid #555',
              opacity: canAfford ? 1 : 0.6
            }}
          >
            <div style={{ fontWeight: 'bold', color: '#fff', marginBottom: '4px' }}>
              {upgrade.name}
            </div>
            <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '6px' }}>
              {upgrade.description}
            </div>
            <div style={{ fontSize: '10px', color: '#888', marginBottom: '6px' }}>
              Capacity: {currentCapacity} → {upgradedCapacity}
            </div>
            <button
              onClick={() => onPurchase(upgrade)}
              disabled={!canAfford}
              style={{
                width: '100%',
                padding: '6px',
                background: canAfford ? '#4A90E2' : '#555',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: canAfford ? 'pointer' : 'not-allowed',
                fontSize: '11px',
                fontWeight: 'bold'
              }}
            >
              ${upgrade.cost}
            </button>
          </div>
        )
      })}
    </div>
  )
}

