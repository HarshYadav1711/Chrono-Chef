# Chrono Chef: Time-Managed Culinary Planner 🍳

A timeline-based cooking simulation game where players schedule recipe tasks on a visual timeline, then watch the kitchen execute the plan. Correct scheduling and resource management maximize score.

![Chrono Chef](https://img.shields.io/badge/Version-1.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![React](https://img.shields.io/badge/React-18.2-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎮 Features

### Core Gameplay
- **Visual Timeline**: Drag-and-drop task scheduling on station lanes
- **Deterministic Simulation**: Seeded RNG for reproducible runs
- **Resource Management**: Station capacity limits and locking
- **Dependency System**: Tasks wait for dependencies to complete
- **Scoring System**: Base score + efficiency bonus - failure penalty

### Advanced Features
- **Station Upgrades**: Purchase capacity increases with earned money
- **Achievement System**: 7 achievements to unlock
- **Replay System**: Auto-save and replay past runs
- **Leaderboard**: Local leaderboard with filtering
- **Interactive Tutorial**: 15-step guided tutorial
- **Order Management**: Reorder and cancel orders
- **Undo/Redo**: Full history management

### Polish & UX
- **Sound Effects**: Procedural sound generation (no external files)
- **Particle Effects**: Visual feedback for task completion
- **Mobile Responsive**: Touch controls and mobile-optimized UI
- **PWA Support**: Installable, works offline
- **Performance Optimized**: Code splitting, memoization, 60fps target

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test
```

### First Time Setup

1. Open http://localhost:3000 in your browser
2. The tutorial will auto-start for first-time users
3. Click a recipe to add tasks to the timeline
4. Drag tasks to schedule them
5. Click "Run" to simulate your kitchen
6. Earn money and unlock achievements!

## 📁 Project Structure

```
chrono-chef/
├── src/
│   ├── components/          # React components
│   │   ├── Timeline.tsx    # Main timeline canvas
│   │   ├── TaskBlock.tsx   # Draggable task blocks
│   │   ├── RecipeBook.tsx  # Recipe selection
│   │   ├── OrderQueue.tsx  # Customer orders
│   │   ├── Controls.tsx     # Control buttons
│   │   ├── Tutorial.tsx    # Tutorial overlay
│   │   ├── Particles.tsx   # Particle effects
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   │   ├── useTimeline.ts  # Timeline state
│   │   ├── useSimulation.ts # Simulation state
│   │   ├── useSound.ts     # Sound effects
│   │   ├── useParticles.ts # Particle effects
│   │   └── ...
│   ├── engine/             # Simulation engine
│   │   ├── simulation.ts  # Main simulation runner
│   │   ├── core.ts        # Core functions
│   │   └── rng.ts         # Seeded RNG
│   ├── types/             # TypeScript types
│   ├── utils/             # Utility functions
│   ├── data/              # JSON data files
│   │   ├── recipes.json   # Recipe definitions
│   │   ├── levels.json    # Level definitions
│   │   ├── achievements.json
│   │   └── upgrades.json
│   └── App.tsx            # Main app component
├── public/
│   ├── manifest.json      # PWA manifest
│   ├── sw.js             # Service worker
│   └── icon-*.png        # App icons
├── docs/                  # Documentation
│   ├── ROADMAP.md        # Development roadmap
│   ├── GDD.md            # Game design document
│   └── ...
└── package.json
```

## 🎯 How to Play

### Basic Gameplay

1. **Select a Level**: Choose from Tutorial, Rush Hour, or Banquet
2. **Add Recipes**: Click recipes in the left panel to add their tasks
3. **Schedule Tasks**: Drag task blocks along the timeline
4. **Manage Dependencies**: Yellow arrows show task dependencies
5. **Run Simulation**: Click "Run" to execute your schedule
6. **View Results**: Check the report panel for score and events

### Advanced Strategies

- **Optimize Timing**: Schedule tasks to minimize idle time
- **Manage Stations**: Watch station capacity - upgrade if needed
- **Handle Dependencies**: Ensure prerequisites complete before dependent tasks
- **Customer Patience**: Complete orders before patience timers expire
- **Earn Money**: Use money from runs to purchase station upgrades
- **Unlock Achievements**: Complete challenges to unlock achievements

### Controls

- **Mouse**: Click and drag to schedule tasks
- **Keyboard**:
  - `T` - Toggle tutorial
  - `M` - Open tutorial menu
  - `ESC` - Close tutorial
- **Touch**: Full touch support on mobile devices

## 🏆 Achievements

- 🏆 **First Victory**: Complete your first level
- ⚡ **Speed Demon**: Complete a level in under 30 seconds
- ✨ **Perfect Service**: Complete a level with no failed orders
- 💯 **High Roller**: Score over 100 points in a single run
- 📊 **Efficiency Expert**: Achieve 90%+ efficiency rating
- 🔥 **Combo Master**: Complete 5 orders in quick succession
- 💎 **Flawless**: Complete a level with zero failures

## 📱 Mobile & PWA

### Mobile Support
- Responsive design for tablets and phones
- Touch-optimized controls
- Minimum 44px touch targets
- Optimized font sizes

### PWA Features
- **Installable**: Add to home screen
- **Offline Support**: Works without internet
- **App-like Experience**: Standalone mode
- **Fast Loading**: Service worker caching

### Installing as PWA

1. Visit the app in a supported browser (Chrome, Edge, Safari)
2. Look for the install prompt or use browser menu
3. Click "Install" to add to home screen
4. Launch from home screen like a native app

## 🛠️ Development

### Tech Stack

- **React 18.2**: UI framework
- **TypeScript 5.3**: Type safety
- **Vite 5.0**: Build tool and dev server
- **React-Konva**: Canvas rendering for timeline
- **Jest**: Testing framework

### Code Quality

- TypeScript strict mode
- Modular architecture
- Pure functions for simulation
- Comprehensive error handling
- Performance optimizations

### Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage
```

## 📊 Performance

- **Target**: 60fps during simulation
- **Optimizations**:
  - Code splitting (React/Konva vendors)
  - Memoization of expensive calculations
  - Lazy loading of components
  - Efficient canvas rendering
  - Debounced event handlers

## 🐛 Known Issues

- Special events framework ready but not fully implemented
- Multi-player mode pending
- Some mobile browsers may have touch event quirks

## 📝 License

MIT License - feel free to use this project for learning or as a base for your own games!

## 🙏 Credits

- Built with React + TypeScript + Vite
- Canvas rendering via React-Konva
- Sound effects via Web Audio API
- PWA support via Vite PWA plugin

## 🔮 Future Enhancements

- Recipe editor (create custom recipes)
- Mod support (custom stations, mechanics)
- Campaign mode (story progression)
- Daily challenges
- Social features (share schedules, compete)
- Advanced AI (suggest optimal schedules)
- Special events (rush orders, equipment breakdowns)
- Multi-player mode (compare schedules)

## 📖 Documentation

- [Game Design Document](docs/GDD.md)
- [Development Roadmap](docs/ROADMAP.md)
- [Tutorial Guide](docs/TUTORIAL_GUIDE.md)
- [Features Implemented](docs/FEATURES_IMPLEMENTED.md)
- [Acceptance Criteria](docs/ACCEPTANCE_CRITERIA.md)

## 🤝 Contributing

This is a learning project, but suggestions and improvements are welcome!

## 📧 Support

For issues or questions, please check the documentation or open an issue.

---

**Enjoy cooking with time! 🍳⏰**
