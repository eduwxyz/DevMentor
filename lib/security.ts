import path from 'path';

/**
 * Validates a project ID to prevent directory traversal attacks
 * @param projectId - The project ID to validate
 * @returns true if valid, false otherwise
 */
export function isValidProjectId(projectId: string): boolean {
  // Check for null, undefined, or empty string
  if (!projectId || typeof projectId !== 'string') {
    return false;
  }

  // Check for directory traversal patterns
  const dangerousPatterns = [
    '..',      // Parent directory
    '/',       // Absolute path or directory separator
    '\\',      // Windows path separator
    '\0',      // Null byte
    '%',       // URL encoded characters
  ];

  for (const pattern of dangerousPatterns) {
    if (projectId.includes(pattern)) {
      return false;
    }
  }

  // Only allow alphanumeric characters, hyphens, and underscores
  const validProjectIdPattern = /^[a-zA-Z0-9_-]+$/;
  if (!validProjectIdPattern.test(projectId)) {
    return false;
  }

  // Reasonable length check (1-100 characters)
  if (projectId.length < 1 || projectId.length > 100) {
    return false;
  }

  return true;
}

/**
 * Safely constructs a workspace path after validating the project ID
 * @param projectId - The project ID
 * @returns The absolute path to the workspace
 * @throws Error if project ID is invalid
 */
export function getWorkspacePath(projectId: string): string {
  if (!isValidProjectId(projectId)) {
    throw new Error('Invalid project ID');
  }

  const workspaceDir = path.join(process.cwd(), 'workspaces', projectId);

  // Additional safety check: ensure the resolved path is within workspaces directory
  const workspacesBase = path.join(process.cwd(), 'workspaces');
  const resolvedPath = path.resolve(workspaceDir);

  if (!resolvedPath.startsWith(workspacesBase)) {
    throw new Error('Invalid workspace path');
  }

  return resolvedPath;
}

/**
 * Safely constructs a project path after validating the project ID
 * @param projectId - The project ID
 * @returns The absolute path to the project directory
 * @throws Error if project ID is invalid
 */
export function getProjectPath(projectId: string): string {
  if (!isValidProjectId(projectId)) {
    throw new Error('Invalid project ID');
  }

  const projectDir = path.join(process.cwd(), 'projects', projectId);

  // Additional safety check: ensure the resolved path is within projects directory
  const projectsBase = path.join(process.cwd(), 'projects');
  const resolvedPath = path.resolve(projectDir);

  if (!resolvedPath.startsWith(projectsBase)) {
    throw new Error('Invalid project path');
  }

  return resolvedPath;
}
