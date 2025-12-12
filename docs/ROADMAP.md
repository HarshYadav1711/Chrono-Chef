# Chrono Chef - 6-Week Development Roadmap

## Week 1: Core Prototype ✅ (Current)
**Deliverables:**
- [x] Project setup (React + TypeScript + Vite)
- [x] Basic timeline UI with draggable task blocks
- [x] Simulation engine with deterministic execution
- [x] Sample recipes (5) and levels (3)
- [x] Unit test stubs for core functions
- [x] Single-file demo (App.tsx)

**Acceptance Criteria:**
- Timeline accepts drag-and-drop tasks
- Simulation runs deterministically
- Station resource locking works
- Unit tests pass

---

## Week 2: UI Polish & Interaction ✅
**Deliverables:**
- [x] Improved drag-and-drop with visual feedback
- [x] Task dependency visualization (arrows between tasks)
- [x] Timeline zoom/pan controls
- [x] Task block resizing (adjust duration)
- [x] Undo/redo functionality
- [x] Better visual styling (colors, icons, animations)

**Acceptance Criteria:**
- Smooth drag interactions with snap-to-grid
- Clear dependency connections visible
- Timeline navigation works smoothly
- Undo/redo maintains state correctly

---

## Week 3: Simulation Enhancements ✅
**Deliverables:**
- [x] Real-time simulation visualization (tasks highlight as they execute)
- [x] Pause/resume simulation
- [x] Step-by-step execution mode
- [x] Enhanced event log with filtering
- [x] Performance metrics (throughput, efficiency)
- [x] Save/load schedule functionality

**Acceptance Criteria:**
- Simulation can be paused and resumed
- Step mode allows one-tick-at-a-time execution
- Event log is searchable and filterable
- Schedules persist in localStorage

---

## Week 4: Gameplay Features ✅
**Deliverables:**
- [x] Customer patience timers with visual indicators
- [x] Order queue management (reorder, cancel)
- [x] Recipe difficulty scaling (displayed in UI)
- [x] Station upgrades (increase capacity)
- [x] Achievement system (speed runs, perfect orders)
- [x] Level progression and unlocks (level selection works)

**Acceptance Criteria:**
- Patience timers count down visually ✅
- Orders can be reordered in queue ✅
- Upgrades affect simulation behavior ✅
- Achievements unlock correctly ✅

---

## Week 5: Advanced Mechanics ✅
**Deliverables:**
- [x] Recipe variations (customize difficulty) - via difficulty scaling
- [ ] Special events (rush orders, equipment breakdowns) - framework ready
- [ ] Multi-player mode (compare schedules) - pending
- [x] Replay system (watch past runs)
- [x] Leaderboard (local storage)
- [x] Tutorial system with guided steps

**Acceptance Criteria:**
- Recipe variations work correctly ✅
- Special events trigger appropriately (framework ready)
- Replays match original runs exactly ✅
- Tutorial guides new players effectively ✅

---

## Week 6: Polish & Release Prep ✅
**Deliverables:**
- [x] Sound effects and background music (procedural Web Audio API)
- [x] Particle effects for task completion
- [x] Mobile responsiveness (touch controls)
- [x] PWA support (offline play)
- [x] Performance optimization (code splitting, memoization)
- [x] Final bug fixes and balancing
- [x] Documentation and README

**Acceptance Criteria:**
- App works on mobile devices ✅
- PWA installs and works offline ✅
- Performance is smooth (60fps) ✅
- All known bugs fixed ✅
- README is comprehensive ✅

---

## Future Enhancements (Post-MVP)
- Recipe editor (create custom recipes)
- Mod support (custom stations, mechanics)
- Campaign mode (story progression)
- Daily challenges
- Social features (share schedules, compete)
- Advanced AI (suggest optimal schedules)

