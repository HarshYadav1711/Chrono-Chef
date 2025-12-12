# Chrono Chef - Acceptance Criteria Checklist

## Core Functionality

### Timeline UI
- [ ] **AC-001**: Timeline displays all station lanes (prep, stove, oven, fryer, blender, plating)
- [ ] **AC-002**: Task blocks can be dragged from recipe book to timeline
- [ ] **AC-003**: Task blocks snap to 1-second grid intervals
- [ ] **AC-004**: Tasks can only be dropped in their designated station lane
- [ ] **AC-005**: Timeline shows time markers (every 10 seconds)
- [ ] **AC-006**: Task blocks display task name and duration
- [ ] **AC-007**: Multiple tasks can be scheduled on the same timeline

### Recipe System
- [ ] **AC-008**: Recipes load from `recipes.json` successfully
- [ ] **AC-009**: Recipe book displays all available recipes
- [ ] **AC-010**: Clicking a recipe adds all its tasks to the timeline
- [ ] **AC-011**: Recipe tasks are initially staggered (not overlapping)
- [ ] **AC-012**: Recipe information (name, price, difficulty) displays correctly

### Level System
- [ ] **AC-013**: Levels load from `levels.json` successfully
- [ ] **AC-014**: Level selection updates available orders
- [ ] **AC-015**: Level station capacities are respected in simulation
- [ ] **AC-016**: Level time limits are enforced

### Simulation Engine
- [ ] **AC-017**: `simulateRun(schedule, level, seed)` runs deterministically
- [ ] **AC-018**: Same seed produces identical results
- [ ] **AC-019**: Simulation respects task dependencies (tasks don't start until dependencies complete)
- [ ] **AC-020**: Station resource locking prevents concurrent tasks beyond capacity
- [ ] **AC-021**: Simulation processes 1-second ticks correctly
- [ ] **AC-022**: Tasks complete after their duration expires
- [ ] **AC-023**: Orders complete when all tasks finish
- [ ] **AC-024**: Orders fail if patience timer expires

### Run Report
- [ ] **AC-025**: Run report includes `success` boolean
- [ ] **AC-026**: Run report includes `finalScore` number
- [ ] **AC-027**: Run report includes `completedOrders` count
- [ ] **AC-028**: Run report includes `failedOrders` count
- [ ] **AC-029**: Run report includes `taskEvents` array with start/end times
- [ ] **AC-030**: Run report includes `events` array with simulation log

### Scoring
- [ ] **AC-031**: Score calculation uses base price × completed orders
- [ ] **AC-032**: Score includes efficiency bonus (time remaining)
- [ ] **AC-033**: Score subtracts failure penalty (50% of price per failed order)
- [ ] **AC-034**: Score never goes below zero

## Unit Tests

### Simulation Functions
- [ ] **AC-035**: `dependenciesDone` returns true when all dependencies completed
- [ ] **AC-036**: `dependenciesDone` returns false when any dependency missing
- [ ] **AC-037**: `acquireReleaseResource` acquires resource when available
- [ ] **AC-038**: `acquireReleaseResource` blocks when station at capacity
- [ ] **AC-039**: `acquireReleaseResource` allows multiple resources up to limit
- [ ] **AC-040**: `acquireReleaseResource` releases resources correctly
- [ ] **AC-041**: `computeScore` calculates score with completion bonus
- [ ] **AC-042**: `computeScore` subtracts failure penalty
- [ ] **AC-043**: `computeScore` includes time bonus
- [ ] **AC-044**: `simulateRun` returns report with all required fields
- [ ] **AC-045**: `simulateRun` runs deterministically with same seed

## UI/UX

### Visual Feedback
- [ ] **AC-046**: Dragging task shows preview at cursor position
- [ ] **AC-047**: Valid drop zones highlight on hover
- [ ] **AC-048**: Invalid drop zones show error feedback
- [ ] **AC-049**: Task blocks use station-specific colors
- [ ] **AC-050**: Station lanes have distinct visual styling

### Controls
- [ ] **AC-051**: "Run Simulation" button starts simulation
- [ ] **AC-052**: "Reset" button clears schedule and report
- [ ] **AC-053**: Simulation can be run multiple times
- [ ] **AC-054**: Level selection updates immediately

### Information Display
- [ ] **AC-055**: Top bar shows current level name
- [ ] **AC-056**: Top bar shows current score (when available)
- [ ] **AC-057**: Order queue shows all level orders
- [ ] **AC-058**: Simulation report displays in right panel
- [ ] **AC-059**: Event log shows recent simulation events

## Data & Configuration

### JSON Files
- [ ] **AC-060**: `recipes.json` contains 5 valid recipes
- [ ] **AC-061**: `levels.json` contains 3 valid levels
- [ ] **AC-062**: Recipe JSON structure matches interface
- [ ] **AC-063**: Level JSON structure matches interface
- [ ] **AC-064**: All recipes have valid task dependencies

## Performance

- [ ] **AC-065**: Timeline renders smoothly with 50+ tasks
- [ ] **AC-066**: Simulation completes within 1 second for typical levels
- [ ] **AC-067**: No memory leaks during multiple simulation runs
- [ ] **AC-068**: UI remains responsive during simulation

## Browser Compatibility

- [ ] **AC-069**: App works in Chrome (latest)
- [ ] **AC-070**: App works in Firefox (latest)
- [ ] **AC-071**: App works in Safari (latest)
- [ ] **AC-072**: App works in Edge (latest)

## Manual Testing Checklist

1. **Timeline Interaction**
   - [ ] Drag omelette recipe → tasks appear on timeline
   - [ ] Drag task block to different time → position updates
   - [ ] Drag task to wrong station → rejected
   - [ ] Drag task to correct station → accepted

2. **Simulation Execution**
   - [ ] Schedule simple omelette → run simulation → order completes
   - [ ] Schedule overlapping tasks on same station → one blocks
   - [ ] Schedule tasks with dependencies → dependencies execute first
   - [ ] Run same simulation twice → identical results

3. **Scoring**
   - [ ] Complete all orders → positive score
   - [ ] Fail orders → score decreases
   - [ ] Complete quickly → efficiency bonus applied

4. **Level Progression**
   - [ ] Select Tutorial → simple orders appear
   - [ ] Select Rush Hour → 5 orders appear
   - [ ] Select Banquet → 8 orders appear

---

## Automated Test Coverage Goals

- **Unit Tests**: 80%+ coverage for simulation engine functions
- **Integration Tests**: Core simulation flow (schedule → run → report)
- **E2E Tests**: Full user flow (add recipe → schedule → simulate → view report)

---

## Definition of Done

A feature is considered "done" when:
1. All relevant acceptance criteria pass
2. Code is reviewed and follows project style
3. Unit tests are written and passing
4. Manual testing confirms functionality
5. Documentation is updated (if needed)

