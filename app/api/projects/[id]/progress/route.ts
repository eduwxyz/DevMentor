import { NextRequest, NextResponse } from 'next/server';
import { getProjectProgress, updateProjectProgress } from '@/lib/db';

// POST - Update current task
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const body = await req.json();
    const { currentTask } = body;

    if (typeof currentTask !== 'number') {
      return NextResponse.json(
        { error: 'Missing required field: currentTask (number)' },
        { status: 400 }
      );
    }

    const progress = getProjectProgress(projectId);

    if (!progress) {
      return NextResponse.json(
        { error: 'Project not started. Start the project first.' },
        { status: 404 }
      );
    }

    updateProjectProgress(projectId, currentTask);

    const updatedProgress = getProjectProgress(projectId);

    return NextResponse.json({
      success: true,
      currentTask: updatedProgress?.currentTask,
      completedTasks: updatedProgress?.completedTasks || []
    });

  } catch (error: any) {
    console.error('Error updating progress:', error);
    return NextResponse.json(
      { error: 'Failed to update progress', details: error.message },
      { status: 500 }
    );
  }
}
