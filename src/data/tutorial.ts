import type { TutorialStep } from '../types/tutorial'

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Chrono Chef! 👋',
    description: 'You\'re a time-management chef! Schedule recipe tasks on a timeline, then watch your kitchen execute the plan. Let\'s learn the basics!',
    position: 'center',
    skipable: true
  },
  {
    id: 'recipes',
    title: 'Step 1: Choose a Recipe',
    description: 'Click on a recipe in the left panel to add it to your timeline. Each recipe has multiple tasks that need to be scheduled.',
    target: '.recipe-book',
    position: 'right',
    action: {
      type: 'click',
      selector: '.recipe-item',
      description: 'Click any recipe to continue'
    }
  },
  {
    id: 'timeline',
    title: 'Step 2: Understand the Timeline',
    description: 'This is your timeline! Each row is a cooking station (prep, stove, fryer, etc.). Tasks appear as colored blocks. Time flows from left to right.',
    target: '.timeline-container',
    position: 'top',
    skipable: true
  },
  {
    id: 'tasks',
    title: 'Step 3: Your Tasks',
    description: 'These colored blocks are your tasks. Each task belongs to a specific station and has a duration. Notice how tasks from the same recipe are connected!',
    target: '.task-block',
    position: 'bottom',
    skipable: true
  },
  {
    id: 'drag',
    title: 'Step 4: Move Tasks',
    description: 'Click and drag a task block to move it along the timeline. Tasks snap to 1-second intervals. Try moving a task now!',
    target: '.task-block',
    position: 'top',
    action: {
      type: 'drag',
      selector: '.task-block',
      description: 'Drag any task block to a new position'
    }
  },
  {
    id: 'dependencies',
    title: 'Step 5: Task Dependencies',
    description: 'See those yellow arrows? They show task dependencies. A task can only start after its dependencies are complete. This is crucial for planning!',
    target: '.dependency-arrow',
    position: 'center',
    skipable: true
  },
  {
    id: 'select',
    title: 'Step 6: Select and Resize',
    description: 'Click on a task to select it. Selected tasks show resize handles on the right edge. Drag the handle to change the task duration.',
    target: '.task-block',
    position: 'top',
    action: {
      type: 'click',
      selector: '.task-block',
      description: 'Click a task to select it, then try resizing'
    }
  },
  {
    id: 'zoom',
    title: 'Step 7: Zoom and Pan',
    description: 'Use the zoom controls in the top-right to zoom in/out on the timeline. This helps when scheduling many tasks!',
    target: '.zoom-controls',
    position: 'left',
    skipable: true
  },
  {
    id: 'orders',
    title: 'Step 8: Customer Orders',
    description: 'The right panel shows customer orders. Each order has a patience timer - complete it before time runs out!',
    target: '.order-queue',
    position: 'left',
    skipable: true
  },
  {
    id: 'simulate',
    title: 'Step 9: Run Simulation',
    description: 'Once you\'ve scheduled your tasks, click "Run" to simulate your kitchen. Watch as tasks execute in real-time!',
    target: '.controls-run',
    position: 'top',
    action: {
      type: 'click',
      selector: '.controls-run',
      description: 'Click the "Run" button to start simulation'
    }
  },
  {
    id: 'report',
    title: 'Step 10: View Results',
    description: 'After simulation, check the report panel. See your score, completed orders, and a detailed event log. Filter events to analyze what happened!',
    target: '.simulation-report',
    position: 'left',
    skipable: true
  },
  {
    id: 'undo',
    title: 'Step 11: Undo/Redo',
    description: 'Made a mistake? Use Undo to go back, or Redo to reapply changes. Your timeline history is saved!',
    target: '.controls-undo',
    position: 'top',
    skipable: true
  },
  {
    id: 'save',
    title: 'Step 12: Save Your Work',
    description: 'Click "Save" to store your schedule in the browser. Use "Load" to restore it later. Your progress is saved automatically!',
    target: '.controls-save',
    position: 'top',
    skipable: true
  },
  {
    id: 'levels',
    title: 'Step 13: Try Different Levels',
    description: 'Switch between levels in the left panel. Each level has different challenges - more orders, tighter timing, or limited stations!',
    target: '.levels-panel',
    position: 'right',
    skipable: true
  },
  {
    id: 'complete',
    title: 'Tutorial Complete! 🎉',
    description: 'You\'re ready to cook! Remember: plan carefully, watch dependencies, and manage your stations. Good luck, chef!',
    position: 'center',
    skipable: true
  }
]

