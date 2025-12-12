import { useState, useCallback, useEffect } from 'react'
import recipesData from './data/recipes.json'
import levelsData from './data/levels.json'
import type { Recipe, Level, ScheduledTask, Station, Order } from './types'
import { useTimeline } from './hooks/useTimeline'
import { useSimulation } from './hooks/useSimulation'
import { Timeline } from './components/Timeline'
import { RecipeBook } from './components/RecipeBook'
import { OrderQueue } from './components/OrderQueue'
import { SimulationReport } from './components/SimulationReport'
import { Controls } from './components/Controls'
import { ZoomControls } from './components/ZoomControls'
import { Tutorial } from './components/Tutorial'
import { TutorialButton } from './components/TutorialButton'
import { TutorialMenu } from './components/TutorialMenu'
import { saveSchedule, loadSchedule } from './utils/storage'
import { timeToX } from './utils/timeline'
import { STATIONS } from './types'
import { useTutorial } from './hooks/useTutorial'
import { useUpgrades } from './hooks/useUpgrades'
import { useAchievements } from './hooks/useAchievements'
import { useReplay } from './hooks/useReplay'
import { useLeaderboard } from './hooks/useLeaderboard'
import { useSound } from './hooks/useSound'
import { useParticles } from './hooks/useParticles'
import { UpgradesPanel } from './components/UpgradesPanel'
import { AchievementsPanel } from './components/AchievementsPanel'
import { ReplayPanel } from './components/ReplayPanel'
import { LeaderboardPanel } from './components/LeaderboardPanel'
import { isPWAInstalled, isOnline } from './utils/pwa'

function App() {
  const [recipes] = useState<Recipe[]>(recipesData as Recipe[])
  const [levels] = useState<Level[]>(levelsData as Level[])
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(levels.length > 0 ? levels[0] : null)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [orderCounter, setOrderCounter] = useState(0)
  const [completedOrders, setCompletedOrders] = useState<Set<number>>(new Set())
  const [failedOrders, setFailedOrders] = useState<Set<number>>(new Set())
  const [draggingTask, setDraggingTask] = useState<{ recipe: Recipe; task: any; orderId: number } | null>(null)
  const [tutorialMenuOpen, setTutorialMenuOpen] = useState(false)
  const [upgradesPanelOpen, setUpgradesPanelOpen] = useState(false)
  const [achievementsPanelOpen, setAchievementsPanelOpen] = useState(false)
  const [replayPanelOpen, setReplayPanelOpen] = useState(false)
  const [leaderboardPanelOpen, setLeaderboardPanelOpen] = useState(false)
  const [money, setMoney] = useState(100)
  const [playerName] = useState('Player')
  const [orderQueue, setOrderQueue] = useState<Order[]>([])

  const timeline = useTimeline()
  const simulation = useSimulation()
  const tutorial = useTutorial()
  const upgrades = useUpgrades()
  const achievements = useAchievements()
  const replay = useReplay()
  const leaderboard = useLeaderboard()
  const sound = useSound()
  const particles = useParticles()

  // Load saved schedule on mount
  useEffect(() => {
    const saved = loadSchedule()
    if (saved) {
      const level = levels.find(l => l.id === saved.levelId)
      if (level) {
        setSelectedLevel(level)
        // Note: Would need to restore tasks here
      }
    }

    // Check if tutorial has been completed before
    const tutorialCompleted = localStorage.getItem('chrono-chef-tutorial-completed')
    if (!tutorialCompleted) {
      // Auto-start tutorial for first-time users after a short delay
      setTimeout(() => {
        tutorial.start()
      }, 1000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Toggle tutorial with 'T' key
      if (e.key === 't' || e.key === 'T') {
        if (tutorial.state.isActive) {
          tutorial.stop()
        } else {
          tutorial.start()
        }
      }
      // Open tutorial menu with 'M' key
      if (e.key === 'm' || e.key === 'M') {
        setTutorialMenuOpen(prev => !prev)
      }
      // Escape to close tutorial
      if (e.key === 'Escape' && tutorial.state.isActive) {
        tutorial.stop()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [tutorial.state.isActive, tutorial])

  const handleRecipeClick = useCallback((recipe: Recipe) => {
    sound.playSound('button_click').catch((e) => console.warn('Sound error:', e))
    const newOrderId = orderCounter
    setOrderCounter(prev => prev + 1)
    timeline.addRecipe(recipe, newOrderId)
    
    // Auto-advance tutorial if on recipes step
    if (tutorial.state.isActive && tutorial.currentStep?.id === 'recipes') {
      setTimeout(() => tutorial.nextStep(), 500)
    }
  }, [timeline, orderCounter, tutorial])

  const handleLevelSelect = useCallback((level: Level) => {
    setSelectedLevel(level)
    setOrderQueue([...level.orders])
    timeline.clearAll()
    setOrderCounter(0)
    setCompletedOrders(new Set())
    setFailedOrders(new Set())
    simulation.stop()
  }, [timeline, simulation])

  const handleOrderReorder = useCallback((fromIndex: number, toIndex: number) => {
    if (!selectedLevel) return
    setOrderQueue(prev => {
      const newOrders = [...prev]
      const [moved] = newOrders.splice(fromIndex, 1)
      newOrders.splice(toIndex, 0, moved)
      return newOrders
    })
  }, [selectedLevel])

  const handleOrderCancel = useCallback((orderIndex: number) => {
    setOrderQueue(prev => prev.filter((_, idx) => idx !== orderIndex))
  }, [])

  // Ensure we have a selected level
  useEffect(() => {
    if (!selectedLevel && levels.length > 0) {
      setSelectedLevel(levels[0])
    }
  }, [selectedLevel, levels])

  const handleTaskDrop = useCallback((task: any, newStartTime: number, newStation: Station) => {
    timeline.updateTask(task.taskId, task.orderId, {
      startTime: newStartTime,
      station: newStation,
      x: timeToX(newStartTime),
      y: laneIndexToY(STATIONS.indexOf(newStation))
    })
  }, [timeline])

  const handleTaskUpdate = useCallback((task: ScheduledTask, updates: Partial<ScheduledTask>) => {
    // Auto-advance tutorial if on drag step
    if (tutorial.state.isActive && tutorial.currentStep?.id === 'drag') {
      setTimeout(() => tutorial.nextStep(), 500)
    }
    timeline.updateTask(task.taskId, task.orderId, updates)
  }, [timeline])

  const handleTaskResize = useCallback((task: ScheduledTask, newDuration: number) => {
    timeline.updateTask(task.taskId, task.orderId, { duration: newDuration })
  }, [timeline])

  const handleTaskClick = useCallback((task: ScheduledTask) => {
    const taskKey = `${task.orderId}-${task.taskId}`
    setSelectedTaskId(selectedTaskId === taskKey ? null : taskKey)
    
    // Auto-advance tutorial if on select step
    if (tutorial.state.isActive && tutorial.currentStep?.id === 'select' && selectedTaskId !== taskKey) {
      setTimeout(() => tutorial.nextStep(), 500)
    }
  }, [selectedTaskId, tutorial])

  const handleRun = useCallback(() => {
    if (selectedLevel) {
      sound.playSound('simulation_start').catch(() => {}) // Ignore errors
      
      // Apply upgrades to level stations
      const upgradedLevel = {
        ...selectedLevel,
        stations: Object.fromEntries(
          Object.entries(selectedLevel.stations).map(([station, capacity]) => [
            station,
            upgrades.getStationCapacity(station as Station, capacity)
          ])
        ) as Record<Station, number>
      }

      const startTime = Date.now()
      simulation.run(timeline.scheduledTasks, upgradedLevel, 42)
      const duration = Math.floor((Date.now() - startTime) / 1000)

      // Check achievements
      if (simulation.report) {
        const newAchievements = achievements.checkAchievements(simulation.report, duration)
        if (newAchievements && newAchievements.length > 0) {
          // Play achievement sound and show particles
          sound.playSound('achievement_unlock').catch(() => {}) // Ignore errors
          newAchievements.forEach(() => {
            particles.addEffect(
              window.innerWidth / 2,
              window.innerHeight / 2,
              '#FFD700'
            )
          })
        }

        // Save replay
        replay.saveReplay(timeline.scheduledTasks, upgradedLevel, simulation.report, 42, duration)

        // Add to leaderboard
        if (selectedLevel) {
          leaderboard.addEntry(playerName, selectedLevel.id, simulation.report, duration, 42)
        }

        // Award money based on score
        setMoney(prev => prev + Math.floor(simulation.report.finalScore))
        
        sound.playSound('simulation_end').catch(() => {}) // Ignore errors
      }
      
      // Auto-advance tutorial if on simulate step
      if (tutorial.state.isActive && tutorial.currentStep?.id === 'simulate') {
        setTimeout(() => tutorial.nextStep(), 1000)
      }
    }
  }, [simulation, timeline.scheduledTasks, selectedLevel, tutorial, upgrades, achievements, replay, leaderboard, playerName, sound, particles])

  const handleRunRealtime = useCallback(() => {
    if (selectedLevel) {
      simulation.runRealtime(timeline.scheduledTasks, selectedLevel, 42)
    }
  }, [simulation, timeline.scheduledTasks, selectedLevel])

  const handleReset = useCallback(() => {
    timeline.clearAll()
    simulation.stop()
    setOrderCounter(0)
    setSelectedTaskId(null)
    setCompletedOrders(new Set())
    setFailedOrders(new Set())
  }, [timeline, simulation])

  const handleSave = useCallback(() => {
    if (selectedLevel) {
      saveSchedule(timeline.scheduledTasks, selectedLevel.id)
      alert('Schedule saved!')
    }
  }, [timeline.scheduledTasks, selectedLevel])

  const handleLoad = useCallback(() => {
    const saved = loadSchedule()
    if (saved) {
      const level = levels.find(l => l.id === saved.levelId)
      if (level) {
        setSelectedLevel(level)
        // Would restore tasks here
        alert('Schedule loaded!')
      }
    } else {
      alert('No saved schedule found')
    }
  }, [levels])

  // Update completed/failed orders from simulation report
  useEffect(() => {
    if (simulation.report && simulation.report.taskEvents && simulation.report.events) {
      const completed = new Set<number>()
      const failed = new Set<number>()
      
      // Extract order IDs from task events
      (simulation.report.taskEvents || []).forEach((event: any) => {
        const match = event.taskId.match(/^(\d+)-/)
        if (match) {
          const orderId = parseInt(match[1])
          if (event.success) {
            // Check if all tasks for this order are complete
            const orderTasks = timeline.scheduledTasks.filter(t => t.orderId === orderId)
            const completedTaskKeys = new Set<string>(
              (simulation.report?.taskEvents || [])
                .filter((e: any) => e.success)
                .map((e: any) => e.taskId)
            )
            if (orderTasks.every(t => completedTaskKeys.has(`${t.orderId}-${t.taskId}`))) {
              completed.add(orderId)
            }
          }
        }
      })

      // Check failed orders from events
      const previousCompleted = new Set(completedOrders)
      const previousFailed = new Set(failedOrders)
      
      // Track if we've played order sounds to avoid duplicates
      let orderCompletePlayed = false
      let orderFailedPlayed = false
      
      (simulation.report.events || []).forEach((event: any) => {
        if (event.type === 'order_failed') {
          const match = event.message.match(/Order (\d+)/)
          if (match) {
            const orderId = parseInt(match[1])
            failed.add(orderId)
            if (!previousFailed.has(orderId) && !orderFailedPlayed) {
              orderFailedPlayed = true
              sound.stopAllSounds() // Stop any playing sounds
              sound.playSound('order_failed').catch(() => {}) // Ignore errors
            }
          }
        } else if (event.type === 'order_complete') {
          const match = event.message.match(/Order (\d+)/)
          if (match) {
            const orderId = parseInt(match[1])
            completed.add(orderId)
            if (!previousCompleted.has(orderId) && !orderCompletePlayed) {
              orderCompletePlayed = true
              sound.stopAllSounds() // Stop any playing sounds
              sound.playSound('order_complete').catch(() => {}) // Ignore errors
              particles.addEffect(
                typeof window !== 'undefined' ? window.innerWidth / 2 : 400,
                typeof window !== 'undefined' ? window.innerHeight / 2 : 300,
                '#4A90E2'
              )
            }
          }
        } else if (event.type === 'task_start') {
          sound.playSound('task_start').catch(() => {}) // Ignore errors
        } else if (event.type === 'task_complete') {
          sound.playSound('task_complete').catch(() => {}) // Ignore errors
        }
      })

      setCompletedOrders(completed)
      setFailedOrders(failed)
    }
  }, [simulation.report, timeline.scheduledTasks, sound, particles, completedOrders, failedOrders])

  const handleTutorialActionComplete = useCallback((stepId: string) => {
    // Handle specific tutorial actions
    if (stepId === 'recipes') {
      // Recipe was clicked - ensure we have at least one task
      if (timeline.scheduledTasks.length === 0 && recipes.length > 0) {
        handleRecipeClick(recipes[0])
      }
    } else if (stepId === 'drag') {
      // Task was dragged - tutorial will auto-advance
    } else if (stepId === 'select') {
      // Task was selected - tutorial will auto-advance
      if (timeline.scheduledTasks.length > 0 && !selectedTaskId) {
        const firstTask = timeline.scheduledTasks[0]
        setSelectedTaskId(`${firstTask.orderId}-${firstTask.taskId}`)
      }
    } else if (stepId === 'simulate') {
      // Simulation was started
      if (simulation.mode === 'stopped' && timeline.scheduledTasks.length > 0) {
        handleRun()
      }
    }
  }, [timeline.scheduledTasks, recipes, handleRecipeClick, selectedTaskId, simulation.mode, handleRun])

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Tutorial */}
      <Tutorial tutorial={tutorial} onActionComplete={handleTutorialActionComplete} />
      <TutorialMenu
        isOpen={tutorialMenuOpen}
        onClose={() => setTutorialMenuOpen(false)}
        onStart={() => {
          tutorial.start()
          setTutorialMenuOpen(false)
        }}
        onGoToStep={(stepIndex) => {
          tutorial.goToStep(stepIndex)
          tutorial.start()
        }}
        completedSteps={tutorial.state.completedSteps}
        currentStep={tutorial.state.currentStep}
      />
      <TutorialButton 
        onClick={() => {
          if (tutorial.state.isActive) {
            tutorial.stop()
          } else {
            tutorial.start()
          }
        }}
        onMenuClick={() => setTutorialMenuOpen(true)}
        isActive={tutorial.state.isActive}
      />

      {/* Top Bar */}
      <div style={{ 
        padding: '10px 20px', 
        background: '#2a2a2a', 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #444'
      }}>
        <h1 style={{ fontSize: '24px', margin: 0, color: '#fff' }}>🍳 Chrono Chef</h1>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ color: '#fff' }}>Day: {selectedLevel?.name || 'Loading...'}</div>
          {simulation.report && (
            <div style={{ color: '#4A90E2', fontWeight: 'bold' }}>
              Score: {simulation.report.finalScore.toFixed(1)}
            </div>
          )}
          {simulation.mode !== 'stopped' && (
            <div style={{ color: '#4AE2A0' }}>Time: {simulation.currentTime}s</div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        {/* Left: Recipe Book & Levels */}
        <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
          <RecipeBook 
            recipes={recipes} 
            onRecipeClick={handleRecipeClick}
            onTaskDragStart={(recipe, task, orderId) => {
              setDraggingTask({ recipe, task, orderId })
            }}
          />
          <div style={{ 
            background: '#1a1a1a', 
            padding: '10px',
            borderTop: '1px solid #444',
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            <h3 style={{ marginBottom: '10px', color: '#fff', fontSize: '14px' }}>Levels</h3>
            {levels.map(level => (
              <div
                key={level.id}
                onClick={() => handleLevelSelect(level)}
                style={{
                  padding: '8px',
                  marginBottom: '8px',
                  background: selectedLevel?.id === level.id ? '#4A90E2' : '#333',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  color: '#fff',
                  fontSize: '12px'
                }}
              >
                {level.name}
              </div>
            ))}
          </div>
        </div>

        {/* Center: Timeline */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <ZoomControls
            zoom={timeline.zoom}
            panX={timeline.panX}
            onZoomChange={timeline.setZoom}
            onPanChange={timeline.setPanX}
            onReset={() => {
              timeline.setZoom(1)
              timeline.setPanX(0)
            }}
          />
          <Timeline
            scheduledTasks={timeline.scheduledTasks}
            activeTaskIds={simulation.activeTaskIds}
            selectedTaskId={selectedTaskId}
            zoom={timeline.zoom}
            panX={timeline.panX}
            draggingTask={draggingTask}
            onTaskDrop={(task, newStartTime, newStation) => {
              if (draggingTask) {
                const newOrderId = orderCounter
                setOrderCounter(prev => prev + 1)
                timeline.addRecipe(draggingTask.recipe, newOrderId)
                // Update the newly added task's position
                const newTask = timeline.scheduledTasks.find(
                  t => t.orderId === newOrderId && t.taskId === draggingTask.task.id
                )
                if (newTask) {
                  timeline.updateTask(newTask.taskId, newOrderId, {
                    startTime: newStartTime,
                    station: newStation
                  })
                }
              } else {
                handleTaskDrop(task, newStartTime, newStation)
              }
              setDraggingTask(null)
            }}
            onTaskUpdate={handleTaskUpdate}
            onTaskClick={handleTaskClick}
            onTaskResize={handleTaskResize}
            showDependencies={true}
            width={typeof window !== 'undefined' ? window.innerWidth - 400 : 1200}
            height={600}
          />
        </div>

        {/* Right: Order Queue & Report */}
        <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
          {selectedLevel && (
            <OrderQueue
              level={{ ...selectedLevel, orders: orderQueue.length > 0 ? orderQueue : (selectedLevel.orders || []) }}
              recipes={recipes}
              currentTime={simulation.currentTime}
              completedOrders={completedOrders}
              failedOrders={failedOrders}
              onReorder={handleOrderReorder}
              onCancel={handleOrderCancel}
              canReorder={true}
            />
          )}
          <div style={{ 
            borderTop: '1px solid #444',
            background: '#1a1a1a',
            flex: 1,
            overflow: 'hidden'
          }}>
            <SimulationReport report={simulation.report} />
          </div>
        </div>
      </div>

      {/* Levels Panel (for tutorial) */}
      <div className="levels-panel" style={{ display: 'none' }} />

      {/* Bottom: Controls */}
      <Controls
        mode={simulation.mode}
        canUndo={timeline.canUndo}
        canRedo={timeline.canRedo}
        onRun={handleRun}
        onRunRealtime={handleRunRealtime}
        onPause={simulation.pause}
        onResume={simulation.resume}
        onStep={simulation.step}
        onStop={simulation.stop}
        onReset={handleReset}
        onUndo={timeline.undo}
        onRedo={timeline.redo}
        onSave={handleSave}
        onLoad={handleLoad}
        onUpgrades={() => setUpgradesPanelOpen(true)}
        onReplays={() => setReplayPanelOpen(true)}
        onLeaderboard={() => setLeaderboardPanelOpen(true)}
        currentTime={simulation.currentTime}
        taskCount={timeline.scheduledTasks.length}
        levelName={selectedLevel?.name || ''}
      />

      {/* Modals */}
      {upgradesPanelOpen && selectedLevel && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => setUpgradesPanelOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <UpgradesPanel
              upgrades={upgrades.getAvailableUpgrades()}
              currentMoney={money}
              onPurchase={(upgrade) => {
                if (upgrades.purchaseUpgrade(upgrade, money)) {
                  setMoney(prev => prev - upgrade.cost)
                  sound.playSound('upgrade_purchase').catch(() => {}) // Ignore errors
                }
              }}
              stationCapacities={selectedLevel.stations}
              getUpgradedCapacity={(station) => 
                upgrades.getStationCapacity(station, selectedLevel.stations[station])
              }
            />
          </div>
        </div>
      )}

      {achievementsPanelOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => setAchievementsPanelOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <AchievementsPanel
              achievements={achievements.achievements}
              onClose={() => setAchievementsPanelOpen(false)}
            />
          </div>
        </div>
      )}

      {replayPanelOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => setReplayPanelOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <ReplayPanel
              replays={replay.replays}
              currentReplay={replay.currentReplay}
              onLoad={replay.loadReplay}
              onDelete={replay.deleteReplay}
              onClose={() => setReplayPanelOpen(false)}
            />
          </div>
        </div>
      )}

      {leaderboardPanelOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => setLeaderboardPanelOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <LeaderboardPanel
              entries={leaderboard.entries}
              onClose={() => setLeaderboardPanelOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
