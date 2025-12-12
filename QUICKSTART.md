# Quick Start Guide

## Installation

```bash
npm install
```

## Running the App

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## How to Use

1. **Select a Level**: Click on a level in the left panel (Tutorial, Rush Hour, or Banquet)
2. **Add Recipes**: Click on a recipe to add all its tasks to the timeline
3. **Schedule Tasks**: Drag task blocks to adjust their timing (they snap to 1-second intervals)
4. **Run Simulation**: Click "Run Simulation" to execute your schedule
5. **View Results**: Check the right panel for the simulation report and score

## Testing

```bash
npm test
```

## Key Files

- `src/App.tsx` - Main application (single-file demo with timeline + simulation)
- `src/data/recipes.json` - Recipe definitions
- `src/data/levels.json` - Level definitions
- `src/__tests__/simulation.test.ts` - Unit tests

## Next Steps

See `docs/MODULE_SPLIT_GUIDE.md` for how to refactor into a modular structure.

