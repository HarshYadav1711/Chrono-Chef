# Module Split Guide: From Single-File to Modular Architecture

This guide explains how to refactor `App.tsx` into a modular structure.

## Proposed File Structure

```
src/
├── types/
│   └── index.ts              # All TypeScript interfaces
├── engine/
│   ├── simulation.ts         # Simulation engine functions
│   ├── rng.ts                # Seeded RNG utilities
│   └── scoring.ts            # Score calculation
├── components/
│   ├── Timeline.tsx          # Timeline canvas component
│   ├── Lane.tsx              # Station lane component
│   ├── TaskBlock.tsx         # Draggable task block
│   ├── RecipeBook.tsx        # Recipe selection panel
│   ├── OrderQueue.tsx        # Customer order display
│   ├── SimulationReport.tsx  # Run report display
│   └── Controls.tsx          # Bottom control bar
├── hooks/
│   ├── useTimeline.ts        # Timeline state management
│   ├── useSimulation.ts      # Simulation state management
│   └── useDragDrop.ts        # Drag-and-drop logic
├── utils/
│   └── timeline.ts           # Timeline utilities (snap, grid, etc.)
└── App.tsx                   # Main app (orchestrates components)
```

## Step-by-Step Refactoring

### Step 1: Extract Types
Create `src/types/index.ts`:
```typescript
export type Station = 'prep' | 'stove' | 'oven' | 'fryer' | 'blender' | 'plating'
export interface Task { ... }
export interface Recipe { ... }
// ... all other interfaces
```

### Step 2: Extract Simulation Engine
Create `src/engine/simulation.ts`:
```typescript
import { dependenciesDone, acquireReleaseResource, computeScore } from './core'
import type { ScheduledTask, Level, RunReport } from '../types'

export function simulateRun(...) { ... }
```

Create `src/engine/core.ts`:
```typescript
export function dependenciesDone(...) { ... }
export function acquireReleaseResource(...) { ... }
export function computeScore(...) { ... }
```

### Step 3: Extract Components
Create `src/components/Timeline.tsx`:
```typescript
interface TimelineProps {
  scheduledTasks: ScheduledTask[]
  onTaskDrop: (task: ScheduledTask) => void
  // ...
}

export function Timeline({ ... }: TimelineProps) {
  // Timeline rendering logic
}
```

### Step 4: Extract Hooks
Create `src/hooks/useTimeline.ts`:
```typescript
export function useTimeline() {
  const [tasks, setTasks] = useState<ScheduledTask[]>([])
  // Timeline state management
  return { tasks, addTask, removeTask, updateTask }
}
```

### Step 5: Update App.tsx
```typescript
import { Timeline } from './components/Timeline'
import { RecipeBook } from './components/RecipeBook'
import { useTimeline } from './hooks/useTimeline'

function App() {
  const { tasks, addTask } = useTimeline()
  // ... orchestration logic
}
```

## Benefits of Modular Structure

1. **Testability**: Each module can be tested independently
2. **Maintainability**: Easier to locate and fix bugs
3. **Reusability**: Components can be reused in different contexts
4. **Performance**: Better code splitting and lazy loading
5. **Collaboration**: Multiple developers can work on different modules

## Migration Checklist

- [ ] Extract all types to `types/index.ts`
- [ ] Move simulation functions to `engine/`
- [ ] Split UI into component files
- [ ] Create custom hooks for state management
- [ ] Update imports throughout codebase
- [ ] Verify all tests still pass
- [ ] Update documentation

