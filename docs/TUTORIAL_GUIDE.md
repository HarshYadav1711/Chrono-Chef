# Chrono Chef - Tutorial System Guide

## Overview

The tutorial system provides an interactive, step-by-step guide for new players to learn Chrono Chef. It's accessible, revisitable, and designed to be as simple as possible to understand.

## Features

### ✅ Interactive Tutorial
- **15 comprehensive steps** covering all game mechanics
- **Visual highlighting** of UI elements
- **Action-based learning** - players perform actions to progress
- **Progress tracking** with visual progress bar
- **Skip functionality** for optional steps

### ✅ Accessibility
- **Always accessible** via floating button (bottom-right)
- **Tutorial menu** to review all steps and jump to specific sections
- **Keyboard shortcuts**:
  - `T` - Toggle tutorial on/off
  - `M` - Open tutorial menu
  - `ESC` - Close tutorial
- **Auto-start** for first-time users

### ✅ User Experience
- **Non-intrusive** - can be paused/closed at any time
- **Revisitable** - progress is saved, can resume anytime
- **Visual feedback** - highlighted elements, tooltips, progress indicators
- **Context-aware** - tooltips positioned relative to highlighted elements

## Tutorial Steps

1. **Welcome** - Introduction to Chrono Chef
2. **Choose a Recipe** - How to add recipes to timeline
3. **Understand the Timeline** - Timeline layout and stations
4. **Your Tasks** - Task blocks and their properties
5. **Move Tasks** - Drag and drop functionality
6. **Task Dependencies** - Understanding dependency arrows
7. **Select and Resize** - Task selection and duration adjustment
8. **Zoom and Pan** - Timeline navigation
9. **Customer Orders** - Order queue and patience timers
10. **Run Simulation** - Executing your schedule
11. **View Results** - Understanding the simulation report
12. **Undo/Redo** - History management
13. **Save Your Work** - Persistence features
14. **Try Different Levels** - Level selection
15. **Tutorial Complete** - Congratulations message

## Implementation Details

### Components

- **`Tutorial.tsx`** - Main tutorial overlay with tooltips and highlighting
- **`TutorialButton.tsx`** - Floating action button to start/stop tutorial
- **`TutorialMenu.tsx`** - Menu to review steps and jump to sections
- **`useTutorial.ts`** - Hook managing tutorial state and progression

### Data

- **`tutorial.ts`** - Step definitions with metadata
- **`tutorialActions.ts`** - Action detection and event handling

### Features

1. **Element Highlighting**
   - Dark overlay with highlighted target element
   - Smooth transitions and animations
   - Non-intrusive pointer events

2. **Action Detection**
   - Automatic detection of clicks, drags, and other actions
   - Auto-advance on action completion
   - Manual progression for non-interactive steps

3. **Progress Tracking**
   - Visual progress bar
   - Step counter (X of Y)
   - Completion status per step
   - Saved to localStorage

4. **Navigation**
   - Previous/Next buttons
   - Skip button for optional steps
   - Jump to specific step from menu
   - Keyboard navigation support

## Usage

### Starting the Tutorial

1. Click the floating 📚 button (bottom-right)
2. Press `T` key
3. Open tutorial menu (📖 button) and click "Start Tutorial"
4. Auto-starts for first-time users

### During Tutorial

- Follow highlighted elements
- Complete required actions to progress
- Use Previous/Next to navigate
- Skip optional steps if desired
- Press ESC to close anytime

### Tutorial Menu

- Click 📖 button to open menu
- View all steps with completion status
- Click any step to jump to it
- See overall progress percentage

## Customization

### Adding New Steps

Edit `src/data/tutorial.ts`:

```typescript
{
  id: 'new_step',
  title: 'Step Title',
  description: 'Step description...',
  target: '.css-selector', // Element to highlight
  position: 'top' | 'bottom' | 'left' | 'right' | 'center',
  action: {
    type: 'click' | 'drag' | 'wait',
    selector: '.target-element',
    description: 'Action hint text'
  },
  skipable: true
}
```

### Modifying Behavior

- **Auto-advance timing**: Adjust delays in `App.tsx` action handlers
- **Highlight style**: Modify styles in `Tutorial.tsx`
- **Action detection**: Extend `tutorialActions.ts`

## Best Practices

1. **Keep steps simple** - One concept per step
2. **Use clear language** - Avoid jargon, be concise
3. **Provide context** - Explain why, not just how
4. **Make it interactive** - Let players do, not just read
5. **Allow skipping** - Don't force players through everything
6. **Save progress** - Let players resume later

## Future Enhancements

- [ ] Video tutorials for complex concepts
- [ ] Contextual help system
- [ ] Tutorial achievements
- [ ] Multi-language support
- [ ] Voice narration
- [ ] Interactive challenges

