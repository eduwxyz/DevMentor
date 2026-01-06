export type Difficulty = "beginner" | "intermediate" | "advanced"
export type Category = "software" | "data-engineering" | "analytics-engineer" | "ai-engineer"

// Team and Context Types (for immersive onboarding)
export interface TeamMember {
  name: string
  role: string
  description: string
}

export interface ProjectContext {
  company: string
  role: string
  team: TeamMember[]
  situation: string
}

export interface Project {
  id: string
  title: string
  description: string
  category: Category
  stack: string[]
  difficulty: Difficulty
  totalTasks: number
  estimatedHours: number
  currentTask: number | null
  context?: ProjectContext
}

export interface Task {
  id: number
  title: string
  description: string
  steps: string[]
  successCriteria: string[]
  context?: string
}

export interface Message {
  id: number
  role: "assistant" | "user"
  content: string
  timestamp?: Date
}

export interface ChatState {
  messages: Message[]
  isLoading: boolean
  sendMessage: (content: string) => void
}

// Gamification Types

export type Level = "junior" | "pleno" | "senior" | "staff" | "principal"

export interface LevelConfig {
  name: Level
  displayName: string
  minXP: number
  maxXP: number
  color: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt?: string
  requirement: {
    type: "tasks_completed" | "projects_completed" | "first_task" | "first_project" | "xp_earned"
    value: number
  }
}

export interface UserProfile {
  xp: number
  level: Level
  tasksCompleted: number
  projectsCompleted: number
  badges: string[]
  createdAt: string
  lastActivityAt: string
}

export const LEVELS: LevelConfig[] = [
  { name: "junior", displayName: "Junior", minXP: 0, maxXP: 500, color: "#22c55e" },
  { name: "pleno", displayName: "Pleno", minXP: 500, maxXP: 1500, color: "#3b82f6" },
  { name: "senior", displayName: "Senior", minXP: 1500, maxXP: 3500, color: "#8b5cf6" },
  { name: "staff", displayName: "Staff", minXP: 3500, maxXP: 7000, color: "#f59e0b" },
  { name: "principal", displayName: "Principal", minXP: 7000, maxXP: 99999, color: "#ef4444" },
]

export const BADGES: Badge[] = [
  {
    id: "first_blood",
    name: "Primeira Task",
    description: "Completou sua primeira task",
    icon: "🎯",
    requirement: { type: "tasks_completed", value: 1 }
  },
  {
    id: "getting_started",
    name: "Primeiros Passos",
    description: "Completou seu primeiro projeto",
    icon: "🚀",
    requirement: { type: "projects_completed", value: 1 }
  },
  {
    id: "consistent",
    name: "Consistente",
    description: "Completou 10 tasks",
    icon: "⚡",
    requirement: { type: "tasks_completed", value: 10 }
  },
  {
    id: "dedicated",
    name: "Dedicado",
    description: "Completou 25 tasks",
    icon: "💪",
    requirement: { type: "tasks_completed", value: 25 }
  },
  {
    id: "machine",
    name: "Maquina",
    description: "Completou 50 tasks",
    icon: "🤖",
    requirement: { type: "tasks_completed", value: 50 }
  },
  {
    id: "full_stack",
    name: "Full Stack",
    description: "Completou 2 projetos",
    icon: "🏆",
    requirement: { type: "projects_completed", value: 2 }
  },
  {
    id: "master",
    name: "Mestre",
    description: "Completou todos os 3 projetos",
    icon: "👑",
    requirement: { type: "projects_completed", value: 3 }
  },
  {
    id: "xp_hunter",
    name: "Cacador de XP",
    description: "Acumulou 1000 XP",
    icon: "💎",
    requirement: { type: "xp_earned", value: 1000 }
  },
  {
    id: "xp_legend",
    name: "Lenda",
    description: "Acumulou 5000 XP",
    icon: "🌟",
    requirement: { type: "xp_earned", value: 5000 }
  },
]

// XP rewards
export const XP_REWARDS = {
  TASK_COMPLETED: 50,
  PROJECT_COMPLETED: 200,
  FIRST_TASK_BONUS: 25,
  FIRST_PROJECT_BONUS: 100,
}

export function calculateLevel(xp: number): LevelConfig {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) {
      return LEVELS[i]
    }
  }
  return LEVELS[0]
}

export function calculateProgress(xp: number): number {
  const level = calculateLevel(xp)
  const xpInLevel = xp - level.minXP
  const xpForLevel = level.maxXP - level.minXP
  return Math.min((xpInLevel / xpForLevel) * 100, 100)
}
