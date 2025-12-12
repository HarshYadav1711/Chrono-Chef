import { useState, useCallback } from 'react'

interface ParticleEffect {
  id: string
  x: number
  y: number
  color: string
  timestamp: number
}

export function useParticles() {
  const [effects, setEffects] = useState<ParticleEffect[]>([])

  const addEffect = useCallback((x: number, y: number, color: string = '#4A90E2') => {
    const effect: ParticleEffect = {
      id: `particle-${Date.now()}-${Math.random()}`,
      x,
      y,
      color,
      timestamp: Date.now()
    }
    setEffects(prev => [...prev, effect])

    // Remove after animation completes
    setTimeout(() => {
      setEffects(prev => prev.filter(e => e.id !== effect.id))
    }, 1000)
  }, [])

  const clearEffects = useCallback(() => {
    setEffects([])
  }, [])

  return {
    effects,
    addEffect,
    clearEffects
  }
}

