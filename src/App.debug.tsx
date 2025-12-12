// Debug version - minimal app to test rendering
import React from 'react'

export default function AppDebug() {
  console.log('AppDebug rendering')
  
  try {
    const recipesData = require('./data/recipes.json')
    const levelsData = require('./data/levels.json')
    console.log('Recipes loaded:', recipesData?.length)
    console.log('Levels loaded:', levelsData?.length)
  } catch (error) {
    console.error('Error loading data:', error)
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#1a1a1a',
      color: '#fff',
      fontSize: '24px'
    }}>
      <div>
        <h1>Chrono Chef Debug</h1>
        <p>If you see this, React is working!</p>
        <p>Check console for data loading status.</p>
      </div>
    </div>
  )
}

