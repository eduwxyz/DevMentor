import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import { Project } from '@/types';
import { getProjectProgress } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const yamlPath = path.join(process.cwd(), 'projects', projectId, 'project.yaml');

    if (!fs.existsSync(yamlPath)) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const fileContents = fs.readFileSync(yamlPath, 'utf8');
    const projectData = yaml.parse(fileContents);

    // Get current task from database
    const progress = getProjectProgress(projectId);
    const currentTask = progress?.currentTask || null;

    const project: Project = {
      id: projectData.id,
      title: projectData.title,
      description: projectData.description,
      category: projectData.category,
      stack: projectData.stack,
      difficulty: projectData.difficulty,
      totalTasks: projectData.totalTasks,
      estimatedHours: projectData.estimatedHours,
      currentTask: currentTask,
      context: projectData.context || undefined
    };

    return NextResponse.json({ project });

  } catch (error: any) {
    console.error('Error loading project:', error);
    return NextResponse.json(
      { error: 'Failed to load project', details: error.message },
      { status: 500 }
    );
  }
}
