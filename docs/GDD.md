# Chrono Chef - Game Design Document (Excerpt)

## Core Systems

### 1. Timeline Planning System
- **Visual Timeline**: Horizontal timeline with station lanes (prep, stove, oven, fryer, blender, plating)
- **Task Blocks**: Draggable blocks representing recipe tasks that snap to 1-second grid
- **Dependency Visualization**: Visual indicators showing task dependencies (arrows/connections)
- **Multi-Order Planning**: Players can schedule multiple orders simultaneously on the same timeline

### 2. Simulation Engine
- **Deterministic Execution**: Seeded RNG ensures reproducible runs for testing and replay
- **Resource Locking**: Stations have capacity limits (e.g., 2 prep stations, 1 stove)
- **Task Execution**: Tasks run for their duration, blocking the station until completion
- **Dependency Resolution**: Tasks only start when all dependencies are completed
- **Event Logging**: Comprehensive event log for debugging and player feedback

### 3. Scoring System
- **Base Score**: Recipe price × completed orders
- **Efficiency Bonus**: Time remaining bonus (0.1 × remaining seconds)
- **Failure Penalty**: 50% of recipe price per failed order (patience expired)
- **Final Score**: `max(0, completion_bonus - failure_penalty + efficiency_bonus)`

### 4. Level Progression
- **Tutorial**: 1-2 simple orders, introduces basic mechanics
- **Rush Hour**: 5 concurrent orders, introduces station conflicts
- **Banquet**: 8+ complex orders, long-duration tasks, multiple station types

## UI Wireframe

```
┌─────────────────────────────────────────────────────────────┐
│ [🍳 Chrono Chef]              [Day: Tutorial] [Score: 0]    │
├──────────┬──────────────────────────────────────┬───────────┤
│          │                                      │           │
│ RECIPES  │         TIMELINE CANVAS              │  ORDERS   │
│          │    ┌────────────────────────────┐   │           │
│ Omelette │    │ 🔪 prep    [task][task]    │   │ Order 1   │
│ Burger   │    │ 🔥 stove   [task]          │   │ Order 2   │
│ Fries    │    │ 🍟 fryer   [task]          │   │           │
│ Smoothie │    │ 🍽️ plating [task]          │   │ REPORT    │
│ Pasta    │    │                            │   │ Score: 25 │
│          │    │ 0s  10s  20s  30s  40s     │   │ Completed │
│ LEVELS   │    └────────────────────────────┘   │ Failed: 0 │
│ Tutorial │                                      │           │
│ Rush Hour│                                      │           │
│ Banquet  │                                      │           │
├──────────┴──────────────────────────────────────┴───────────┤
│ [Run Simulation] [Reset]              Tasks: 8 | Level: ... │
└─────────────────────────────────────────────────────────────┘
```

## Core Mechanics

### Task Scheduling
- Click recipe → auto-adds all tasks to timeline at staggered times
- Drag task blocks to reposition (snaps to seconds)
- Tasks must be placed in correct station lane
- Visual feedback for valid/invalid drop zones

### Simulation Execution
- Click "Run Simulation" → engine processes 1-second ticks
- Tasks start when: (1) start time reached, (2) dependencies done, (3) station available
- Real-time event log shows task starts, completions, blocks, order completions
- Final report shows score, completed/failed orders, and event summary

### Resource Management
- Each station has a capacity (defined in level JSON)
- Multiple tasks can use same station if capacity allows
- Blocked tasks wait until station becomes available
- Visual indicators show station occupancy during simulation

## Technical Notes

- **Timeline Resolution**: 1 second per tick (UI shows 10-second markers)
- **State Management**: Immutable updates for undo/redo support (future)
- **Determinism**: Seeded RNG (mulberry32) for reproducible runs
- **Pure Functions**: Simulation engine is pure and testable
- **Debug Mode**: Toggle for verbose logging during development

