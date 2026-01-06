import Database from 'better-sqlite3';
import path from 'path';
import { UserProfile, Level, BADGES } from '@/types';

const DB_PATH = path.join(process.cwd(), 'data', 'devmentor.db');

// Ensure data directory exists
import fs from 'fs';
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY DEFAULT 1,
    xp INTEGER DEFAULT 0,
    level TEXT DEFAULT 'junior',
    tasks_completed INTEGER DEFAULT 0,
    projects_completed INTEGER DEFAULT 0,
    created_at TEXT,
    last_activity_at TEXT
  );

  CREATE TABLE IF NOT EXISTS badges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    badge_id TEXT UNIQUE,
    unlocked_at TEXT
  );

  CREATE TABLE IF NOT EXISTS project_progress (
    project_id TEXT PRIMARY KEY,
    current_task INTEGER DEFAULT 1,
    started_at TEXT
  );

  CREATE TABLE IF NOT EXISTS completed_tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id TEXT,
    task_id INTEGER,
    completed_at TEXT,
    UNIQUE(project_id, task_id)
  );

  CREATE TABLE IF NOT EXISTS chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id TEXT,
    role TEXT,
    content TEXT,
    timestamp TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_chat_project ON chat_messages(project_id);
  CREATE INDEX IF NOT EXISTS idx_completed_project ON completed_tasks(project_id);
`);

// Profile functions
export function getProfile(): UserProfile {
  const row = db.prepare('SELECT * FROM profile WHERE id = 1').get() as any;

  if (!row) {
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO profile (id, xp, level, tasks_completed, projects_completed, created_at, last_activity_at)
      VALUES (1, 0, 'junior', 0, 0, ?, ?)
    `).run(now, now);

    return {
      xp: 0,
      level: 'junior',
      tasksCompleted: 0,
      projectsCompleted: 0,
      badges: [],
      createdAt: now,
      lastActivityAt: now
    };
  }

  const badges = db.prepare('SELECT badge_id FROM badges').all() as { badge_id: string }[];

  return {
    xp: row.xp,
    level: row.level as Level,
    tasksCompleted: row.tasks_completed,
    projectsCompleted: row.projects_completed,
    badges: badges.map(b => b.badge_id),
    createdAt: row.created_at,
    lastActivityAt: row.last_activity_at
  };
}

export function updateProfile(updates: Partial<{
  xp: number;
  level: Level;
  tasksCompleted: number;
  projectsCompleted: number;
}>): void {
  const fields: string[] = [];
  const values: any[] = [];

  if (updates.xp !== undefined) {
    fields.push('xp = ?');
    values.push(updates.xp);
  }
  if (updates.level !== undefined) {
    fields.push('level = ?');
    values.push(updates.level);
  }
  if (updates.tasksCompleted !== undefined) {
    fields.push('tasks_completed = ?');
    values.push(updates.tasksCompleted);
  }
  if (updates.projectsCompleted !== undefined) {
    fields.push('projects_completed = ?');
    values.push(updates.projectsCompleted);
  }

  fields.push('last_activity_at = ?');
  values.push(new Date().toISOString());

  if (fields.length > 0) {
    db.prepare(`UPDATE profile SET ${fields.join(', ')} WHERE id = 1`).run(...values);
  }
}

export function addBadge(badgeId: string): boolean {
  try {
    db.prepare('INSERT OR IGNORE INTO badges (badge_id, unlocked_at) VALUES (?, ?)').run(
      badgeId,
      new Date().toISOString()
    );
    return true;
  } catch {
    return false;
  }
}

export function checkAndAwardBadges(profile: UserProfile): string[] {
  const newBadges: string[] = [];

  for (const badge of BADGES) {
    if (profile.badges.includes(badge.id)) continue;

    let earned = false;
    switch (badge.requirement.type) {
      case 'tasks_completed':
        earned = profile.tasksCompleted >= badge.requirement.value;
        break;
      case 'projects_completed':
        earned = profile.projectsCompleted >= badge.requirement.value;
        break;
      case 'xp_earned':
        earned = profile.xp >= badge.requirement.value;
        break;
    }

    if (earned && addBadge(badge.id)) {
      newBadges.push(badge.id);
    }
  }

  return newBadges;
}

// Project Progress functions
export interface ProjectProgress {
  projectId: string;
  currentTask: number;
  completedTasks: number[];
  startedAt: string;
}

export function getProjectProgress(projectId: string): ProjectProgress | null {
  const row = db.prepare('SELECT * FROM project_progress WHERE project_id = ?').get(projectId) as any;

  if (!row) return null;

  const completedTasks = db.prepare(
    'SELECT task_id FROM completed_tasks WHERE project_id = ? ORDER BY task_id'
  ).all(projectId) as { task_id: number }[];

  return {
    projectId: row.project_id,
    currentTask: row.current_task,
    completedTasks: completedTasks.map(t => t.task_id),
    startedAt: row.started_at
  };
}

export function createProjectProgress(projectId: string): ProjectProgress {
  const now = new Date().toISOString();

  db.prepare(`
    INSERT OR REPLACE INTO project_progress (project_id, current_task, started_at)
    VALUES (?, 1, ?)
  `).run(projectId, now);

  return {
    projectId,
    currentTask: 1,
    completedTasks: [],
    startedAt: now
  };
}

export function updateProjectProgress(projectId: string, currentTask: number): void {
  db.prepare('UPDATE project_progress SET current_task = ? WHERE project_id = ?').run(
    currentTask,
    projectId
  );
}

export function completeTask(projectId: string, taskId: number): void {
  db.prepare(`
    INSERT OR IGNORE INTO completed_tasks (project_id, task_id, completed_at)
    VALUES (?, ?, ?)
  `).run(projectId, taskId, new Date().toISOString());
}

export function isProjectStarted(projectId: string): boolean {
  const row = db.prepare('SELECT 1 FROM project_progress WHERE project_id = ?').get(projectId);
  return !!row;
}

// Chat functions
export interface ChatMessage {
  id: number;
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
}

export function getChatHistory(projectId: string): ChatMessage[] {
  const rows = db.prepare(`
    SELECT id, role, content, timestamp
    FROM chat_messages
    WHERE project_id = ?
    ORDER BY id ASC
  `).all(projectId) as any[];

  return rows.map(row => ({
    id: row.id,
    role: row.role as 'assistant' | 'user',
    content: row.content,
    timestamp: row.timestamp
  }));
}

export function addChatMessage(projectId: string, role: 'assistant' | 'user', content: string): ChatMessage {
  const timestamp = new Date().toISOString();

  const result = db.prepare(`
    INSERT INTO chat_messages (project_id, role, content, timestamp)
    VALUES (?, ?, ?, ?)
  `).run(projectId, role, content, timestamp);

  return {
    id: Number(result.lastInsertRowid),
    role,
    content,
    timestamp
  };
}

export function clearChatHistory(projectId: string): void {
  db.prepare('DELETE FROM chat_messages WHERE project_id = ?').run(projectId);
}

// Export database for direct queries if needed
export { db };
