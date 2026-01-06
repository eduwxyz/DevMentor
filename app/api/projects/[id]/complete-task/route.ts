import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import YAML from 'yaml';
import {
  getProjectProgress,
  updateProjectProgress,
  completeTask as markTaskComplete,
  getProfile,
  updateProfile,
  checkAndAwardBadges
} from '@/lib/db';
import { XP_REWARDS, calculateLevel } from '@/types';

function getProjectPath(projectId: string): string {
  return path.join(process.cwd(), 'projects', projectId, 'project.yaml');
}

// POST - Mark task as complete and advance to next
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const body = await req.json();
    const { taskId } = body;

    if (typeof taskId !== 'number') {
      return NextResponse.json(
        { error: 'Missing required field: taskId (number)' },
        { status: 400 }
      );
    }

    const progress = getProjectProgress(projectId);

    if (!progress) {
      return NextResponse.json(
        { error: 'Project not started' },
        { status: 404 }
      );
    }

    // Load project to get total tasks
    const projectPath = getProjectPath(projectId);
    const projectYaml = fs.readFileSync(projectPath, 'utf8');
    const project = YAML.parse(projectYaml);
    const totalTasks = project.totalTasks || project.tasks?.length || 0;

    // Validate that we're completing the current task
    if (taskId !== progress.currentTask) {
      return NextResponse.json(
        { error: `Cannot complete task ${taskId}. Current task is ${progress.currentTask}` },
        { status: 400 }
      );
    }

    // Mark task as complete in database
    markTaskComplete(projectId, taskId);

    // Advance to next task if not the last one
    const isLastTask = taskId >= totalTasks;
    if (!isLastTask) {
      updateProjectProgress(projectId, taskId + 1);
    }

    // Award XP for completing the task
    let profile = getProfile();
    let xpGained = 0;

    // XP for task completion
    profile.tasksCompleted += 1;
    xpGained += XP_REWARDS.TASK_COMPLETED;

    // First task bonus
    if (profile.tasksCompleted === 1) {
      xpGained += XP_REWARDS.FIRST_TASK_BONUS;
    }

    // If project is complete, award project XP
    if (isLastTask) {
      profile.projectsCompleted += 1;
      xpGained += XP_REWARDS.PROJECT_COMPLETED;

      // First project bonus
      if (profile.projectsCompleted === 1) {
        xpGained += XP_REWARDS.FIRST_PROJECT_BONUS;
      }
    }

    profile.xp += xpGained;
    const newLevel = calculateLevel(profile.xp).name;

    updateProfile({
      xp: profile.xp,
      level: newLevel,
      tasksCompleted: profile.tasksCompleted,
      projectsCompleted: profile.projectsCompleted
    });

    // Check for new badges
    profile = getProfile();
    const newBadges = checkAndAwardBadges(profile);

    // Get updated progress
    const updatedProgress = getProjectProgress(projectId);

    return NextResponse.json({
      success: true,
      completedTaskId: taskId,
      newCurrentTask: updatedProgress?.currentTask || taskId,
      completedTasks: updatedProgress?.completedTasks || [taskId],
      isProjectComplete: isLastTask,
      xpGained,
      newBadges,
      totalXP: profile.xp,
      level: newLevel
    });

  } catch (error: any) {
    console.error('Error completing task:', error);
    return NextResponse.json(
      { error: 'Failed to complete task', details: error.message },
      { status: 500 }
    );
  }
}
