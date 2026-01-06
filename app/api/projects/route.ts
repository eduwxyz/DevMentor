import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import { Project } from '@/types';
import { getProjectProgress } from '@/lib/db';

export async function GET() {
  try {
    const projectsDir = path.join(process.cwd(), 'projects');

    // Read all directories in projects/
    const projectFolders = fs.readdirSync(projectsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    const projects: Project[] = [];

    // Read each project.yaml
    for (const folder of projectFolders) {
      const yamlPath = path.join(projectsDir, folder, 'project.yaml');

      if (fs.existsSync(yamlPath)) {
        const fileContents = fs.readFileSync(yamlPath, 'utf8');
        const projectData = yaml.parse(fileContents);

        // Get current task from database
        const progress = getProjectProgress(folder);
        const currentTask = progress?.currentTask || null;

        projects.push({
          id: projectData.id,
          title: projectData.title,
          description: projectData.description,
          category: projectData.category,
          stack: projectData.stack,
          difficulty: projectData.difficulty,
          totalTasks: projectData.totalTasks,
          estimatedHours: projectData.estimatedHours,
          currentTask: currentTask
        });
      }
    }

    return NextResponse.json({ projects });

  } catch (error: any) {
    console.error('Error loading projects:', error);
    return NextResponse.json(
      { error: 'Failed to load projects', details: error.message },
      { status: 500 }
    );
  }
}
