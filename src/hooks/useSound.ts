import { useState, useCallback, useRef, useEffect } from 'react'

export type SoundType = 
  | 'task_start'
  | 'task_complete'
  | 'order_complete'
  | 'order_failed'
  | 'button_click'
  | 'upgrade_purchase'
  | 'achievement_unlock'
  | 'simulation_start'
  | 'simulation_end'

interface SoundConfig {
  volume: number
  enabled: boolean
}

// Web Audio API sound generator (no external files needed)
class SoundGenerator {
  private audioContext: AudioContext | null = null
  private enabled: boolean = true
  private volume: number = 0.5 // Increased from 0.3 for better audibility
  private initialized: boolean = false
  private activeOscillators: Set<OscillatorNode> = new Set() // Track active sounds

  async init() {
    if (typeof window === 'undefined') return
    
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        console.log('[Sound] AudioContext created, state:', this.audioContext.state)
      } catch (e) {
        console.warn('[Sound] Failed to create AudioContext:', e)
        return
      }
    }
    
    // Resume AudioContext if suspended (required by browser autoplay policy)
    // This MUST happen synchronously within the user gesture handler
    if (this.audioContext.state === 'suspended') {
      try {
        console.log('[Sound] Resuming suspended AudioContext...')
        await this.audioContext.resume()
        console.log('[Sound] AudioContext resumed, new state:', this.audioContext.state)
      } catch (e) {
        console.warn('[Sound] Failed to resume AudioContext:', e)
        return
      }
    }
    
    if (this.audioContext.state === 'running') {
      this.initialized = true
      console.log('[Sound] AudioContext is ready!')
    } else {
      console.warn('[Sound] AudioContext state is:', this.audioContext.state, '- not ready')
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume))
  }

  playTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.enabled || !this.audioContext || this.audioContext.state === 'closed') {
      console.warn('[Sound] Cannot play tone - context not ready')
      return
    }

    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.frequency.value = frequency
      oscillator.type = type

      const now = this.audioContext.currentTime
      gainNode.gain.setValueAtTime(0, now)
      gainNode.gain.linearRampToValueAtTime(this.volume, now + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration)

      // Track this oscillator
      this.activeOscillators.add(oscillator)
      
      // Remove from tracking when it stops
      oscillator.addEventListener('ended', () => {
        this.activeOscillators.delete(oscillator)
      })

      oscillator.start(now)
      oscillator.stop(now + duration)
      
      console.log('[Sound] Playing tone:', frequency, 'Hz for', duration, 's')
    } catch (e) {
      console.error('[Sound] Failed to play tone:', e)
    }
  }

  stopAllSounds() {
    console.log('[Sound] Stopping all active sounds, count:', this.activeOscillators.size)
    this.activeOscillators.forEach(oscillator => {
      try {
        oscillator.stop()
        oscillator.disconnect()
      } catch (e) {
        // Oscillator may already be stopped
      }
    })
    this.activeOscillators.clear()
  }

  async playSound(type: SoundType) {
    if (!this.enabled) {
      console.log('[Sound] Sound disabled, skipping:', type)
      return
    }

    // Initialize and resume AudioContext if needed
    if (!this.initialized || !this.audioContext || this.audioContext.state === 'suspended') {
      console.log('[Sound] Initializing AudioContext for:', type)
      await this.init()
    }

    if (!this.audioContext) {
      console.warn('[Sound] AudioContext not available')
      return
    }

    if (this.audioContext.state === 'closed') {
      console.warn('[Sound] AudioContext is closed')
      return
    }

    if (this.audioContext.state === 'suspended') {
      console.log('[Sound] Resuming suspended AudioContext')
      try {
        await this.audioContext.resume()
      } catch (e) {
        console.warn('[Sound] Failed to resume AudioContext:', e)
        return
      }
    }

    console.log('[Sound] Playing sound:', type, 'Context state:', this.audioContext.state)

    switch (type) {
      case 'task_start':
        this.playTone(400, 0.1, 'square')
        break
      case 'task_complete':
        this.playTone(600, 0.15, 'sine')
        this.playTone(800, 0.1, 'sine')
        break
      case 'order_complete':
        // Stop any existing sounds first
        this.stopAllSounds()
        // Success chord - play sequentially with proper timing
        const now = this.audioContext.currentTime
        this.playTone(523, 0.15, 'sine') // C
        setTimeout(() => {
          this.playTone(659, 0.15, 'sine') // E
        }, 100)
        setTimeout(() => {
          this.playTone(784, 0.2, 'sine') // G
        }, 200)
        break
      case 'order_failed':
        // Stop any existing sounds first
        this.stopAllSounds()
        // Failure sound - shorter duration
        this.playTone(200, 0.25, 'sawtooth')
        setTimeout(() => {
          this.playTone(150, 0.25, 'sawtooth')
        }, 50)
        break
      case 'button_click':
        this.playTone(300, 0.05, 'square')
        break
      case 'upgrade_purchase':
        this.playTone(500, 0.2, 'sine')
        this.playTone(700, 0.2, 'sine')
        break
      case 'achievement_unlock':
        // Fanfare
        this.playTone(523, 0.15, 'sine')
        setTimeout(() => this.playTone(659, 0.15, 'sine'), 100)
        setTimeout(() => this.playTone(784, 0.15, 'sine'), 200)
        setTimeout(() => this.playTone(1047, 0.3, 'sine'), 300)
        break
      case 'simulation_start':
        this.playTone(400, 0.2, 'square')
        break
      case 'simulation_end':
        this.playTone(300, 0.3, 'sine')
        break
    }
  }
}

const soundGenerator = new SoundGenerator()

export function useSound() {
  const [config, setConfig] = useState<SoundConfig>(() => {
    const saved = localStorage.getItem('chrono-chef-sound-config')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return { volume: 0.5, enabled: true } // Increased default volume
      }
    }
    return { volume: 0.5, enabled: true }
  })

  useEffect(() => {
    soundGenerator.setEnabled(config.enabled)
    soundGenerator.setVolume(config.volume)
    localStorage.setItem('chrono-chef-sound-config', JSON.stringify(config))
    
    // Initialize AudioContext on first user interaction
    // CRITICAL: Must create and resume AudioContext synchronously within user gesture
    let initialized = false
    
    const initOnInteraction = (eventType: string) => {
      if (initialized) return
      console.log('[Sound] User interaction detected:', eventType)
      
      // Create AudioContext immediately (synchronously) within the user gesture
      if (!soundGenerator['audioContext']) {
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
          soundGenerator['audioContext'] = new AudioContextClass()
          console.log('[Sound] AudioContext created, state:', soundGenerator['audioContext'].state)
        } catch (e) {
          console.error('[Sound] Failed to create AudioContext:', e)
          return
        }
      }
      
      const ctx = soundGenerator['audioContext']
      if (!ctx) return
      
      // Resume immediately if suspended (must be in same call stack as user gesture)
      if (ctx.state === 'suspended') {
        console.log('[Sound] Resuming AudioContext...')
        ctx.resume().then(() => {
          console.log('[Sound] AudioContext resumed, state:', ctx.state)
          if (ctx.state === 'running') {
            initialized = true
            soundGenerator['initialized'] = true
            console.log('[Sound] ✅ AudioContext is ready!')
          }
        }).catch((e) => {
          console.error('[Sound] Failed to resume AudioContext:', e)
        })
      } else if (ctx.state === 'running') {
        initialized = true
        soundGenerator['initialized'] = true
        console.log('[Sound] ✅ AudioContext already running!')
      }
      
      // Remove listeners after first interaction
      document.removeEventListener('click', clickHandler)
      document.removeEventListener('touchstart', touchHandler)
      document.removeEventListener('keydown', keyHandler)
    }
    
    const clickHandler = () => initOnInteraction('click')
    const touchHandler = () => initOnInteraction('touchstart')
    const keyHandler = () => initOnInteraction('keydown')
    
    // Wait for user interaction before initializing AudioContext
    document.addEventListener('click', clickHandler, { once: true })
    document.addEventListener('touchstart', touchHandler, { once: true })
    document.addEventListener('keydown', keyHandler, { once: true })
    
    return () => {
      document.removeEventListener('click', clickHandler)
      document.removeEventListener('touchstart', touchHandler)
      document.removeEventListener('keydown', keyHandler)
    }
  }, [config])

  const playSound = useCallback(async (type: SoundType) => {
    await soundGenerator.playSound(type)
  }, [])

  const setEnabled = useCallback((enabled: boolean) => {
    setConfig(prev => ({ ...prev, enabled }))
  }, [])

  const setVolume = useCallback((volume: number) => {
    setConfig(prev => ({ ...prev, volume }))
  }, [])

  const stopAllSounds = useCallback(() => {
    soundGenerator.stopAllSounds()
  }, [])

  return {
    playSound,
    stopAllSounds,
    enabled: config.enabled,
    volume: config.volume,
    setEnabled,
    setVolume
  }
}

