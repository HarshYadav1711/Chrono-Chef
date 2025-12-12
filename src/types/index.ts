export type Station = 'prep' | 'stove' | 'oven' | 'fryer' | 'blender' | 'plating'

export interface Task {
  id: string
  name: string
  station: Station
  duration: number
  dependencies: string[]
}

export interface Recipe {
  id: string
  name: string
  difficulty: number
  price: number
  tasks: Task[]
}

export interface ScheduledTask {
  taskId: string
  recipeId: string
  orderId: number
  station: Station
  startTime: number
  duration: number
  dependencies: string[]
  x: number
  y: number
}

export interface Order {
  recipeId: string
  arrivalTime: number
  patience: number
}

export interface Level {
  id: string
  name: string
  description: string
  orders: Order[]
  stations: Record<Station, number>
  timeLimit: number
  targetScore: number
}

export interface SimulationState {
  currentTime: number
  activeTasks: Map<string, { taskId: string; endTime: number; station: Station }>
  completedTasks: Set<string>
  stationOccupancy: Map<Station, number>
  score: number
  events: Array<{ time: number; type: string; message: string }>
}

export interface RunReport {
  success: boolean
  finalScore: number
  completedOrders: number
  failedOrders: number
  taskEvents: Array<{ taskId: string; startTime: number; endTime: number; success: boolean }>
  events: Array<{ time: number; type: string; message: string }>
}

export const STATIONS: Station[] = ['prep', 'stove', 'oven', 'fryer', 'blender', 'plating']

export const STATION_COLORS: Record<Station, string> = {
  prep: '#4A90E2',
  stove: '#E24A4A',
  oven: '#E2A04A',
  fryer: '#E2E24A',
  blender: '#4AE2A0',
  plating: '#A04AE2'
}

export const STATION_EMOJIS: Record<Station, string> = {
  prep: '🔪',
  stove: '🔥',
  oven: '🔥',
  fryer: '🍟',
  blender: '🌀',
  plating: '🍽️'
}

