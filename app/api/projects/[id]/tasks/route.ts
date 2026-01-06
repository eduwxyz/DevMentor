import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

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

    return NextResponse.json({
      tasks: projectData.tasks || []
    });

  } catch (error: any) {
    console.error('Error loading tasks:', error);
    return NextResponse.json(
      { error: 'Failed to load tasks', details: error.message },
      { status: 500 }
    );
  }
}
