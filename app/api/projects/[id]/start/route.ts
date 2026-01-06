import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { createProjectProgress, isProjectStarted } from '@/lib/db';
import { isValidProjectId, getWorkspacePath, getProjectPath } from '@/lib/security';

// Helper function to recursively copy directory
function copyDirectory(src: string, dest: string) {
  // Create destination directory
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Read source directory
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Helper function to initialize git repository
function initializeGitRepo(workspaceDir: string) {
  try {
    // Initialize git repository
    execSync('git init', { cwd: workspaceDir, stdio: 'pipe' });

    // Configure git to avoid warnings
    execSync('git config user.name "DevMentor"', { cwd: workspaceDir, stdio: 'pipe' });
    execSync('git config user.email "devmentor@local"', { cwd: workspaceDir, stdio: 'pipe' });

    // Add all files
    execSync('git add .', { cwd: workspaceDir, stdio: 'pipe' });

    // Create initial commit
    execSync('git commit -m "Initial project setup"', { cwd: workspaceDir, stdio: 'pipe' });

    return true;
  } catch (error) {
    console.error('Error initializing git repository:', error);
    return false;
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;

    // Validate project ID to prevent directory traversal
    if (!isValidProjectId(projectId)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }

    const projectDir = getProjectPath(projectId);
    const starterDir = path.join(projectDir, 'starter');
    const workspaceDir = getWorkspacePath(projectId);

    // Check if project exists
    if (!fs.existsSync(projectDir)) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Check if starter directory exists
    if (!fs.existsSync(starterDir)) {
      return NextResponse.json(
        { error: 'Project starter template not found' },
        { status: 404 }
      );
    }

    // Check if project already started in database
    if (isProjectStarted(projectId)) {
      return NextResponse.json(
        {
          message: 'Project already started',
          alreadyStarted: true
        },
        { status: 200 }
      );
    }

    // Copy starter template to workspace
    copyDirectory(starterDir, workspaceDir);

    // Initialize git repository in workspace
    const gitInitialized = initializeGitRepo(workspaceDir);
    if (!gitInitialized) {
      console.warn('Failed to initialize git repository, but project was created');
    }

    // Create progress record in database
    const progress = createProjectProgress(projectId);

    return NextResponse.json({
      message: 'Project started successfully',
      workspacePath: workspaceDir,
      alreadyStarted: false,
      progress
    });

  } catch (error: any) {
    console.error('Error starting project:', error);
    return NextResponse.json(
      { error: 'Failed to start project', details: error.message },
      { status: 500 }
    );
  }
}
