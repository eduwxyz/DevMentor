import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import YAML from 'yaml';
import { isValidProjectId, getWorkspacePath, getProjectPath } from '@/lib/security';

const execPromise = promisify(exec);

// Check if Gemini CLI is installed
async function checkGeminiCLI(): Promise<boolean> {
  try {
    await execPromise('which gemini', { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

interface ReviewRequest {
  taskId: number;
}

function getProjectYamlPath(projectId: string): string {
  return path.join(process.cwd(), 'projects', projectId, 'project.yaml');
}

// POST - Review code using git diff
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const body: ReviewRequest = await req.json();
    const { taskId } = body;

    if (!taskId) {
      return NextResponse.json(
        { error: 'Missing required field: taskId' },
        { status: 400 }
      );
    }

    // Validate project ID to prevent directory traversal
    if (!isValidProjectId(projectId)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }

    const workspaceDir = getWorkspacePath(projectId);

    if (!fs.existsSync(workspaceDir)) {
      return NextResponse.json(
        { error: 'Workspace not found. Start the project first.' },
        { status: 404 }
      );
    }

    // Load project to get task info
    const projectYamlPath = getProjectYamlPath(projectId);
    const projectYaml = fs.readFileSync(projectYamlPath, 'utf8');
    const project = YAML.parse(projectYaml);
    const task = project.tasks?.find((t: any) => t.id === taskId);

    if (!task) {
      return NextResponse.json(
        { error: `Task ${taskId} not found` },
        { status: 404 }
      );
    }

    // Run git diff in workspace
    let gitDiff = '';
    try {
      // First check if it's a git repo
      await execPromise('git rev-parse --is-inside-work-tree', {
        cwd: workspaceDir,
        timeout: 5000
      });

      // Get staged and unstaged changes
      const { stdout: diffOutput } = await execPromise('git diff HEAD 2>/dev/null || git diff', {
        cwd: workspaceDir,
        timeout: 10000,
        maxBuffer: 1024 * 1024
      });

      // If no diff with HEAD, try to show all files (for new repos)
      if (!diffOutput.trim()) {
        const { stdout: statusOutput } = await execPromise('git status --porcelain', {
          cwd: workspaceDir,
          timeout: 5000
        });

        if (statusOutput.trim()) {
          // There are changes but no commits yet, show the content of new files
          const { stdout: diffCached } = await execPromise('git diff --cached 2>/dev/null || echo ""', {
            cwd: workspaceDir,
            timeout: 10000,
            maxBuffer: 1024 * 1024
          });
          gitDiff = diffCached || `Arquivos modificados:\n${statusOutput}`;
        } else {
          gitDiff = 'Nenhuma alteração detectada no código.';
        }
      } else {
        gitDiff = diffOutput;
      }
    } catch (gitError) {
      // Not a git repo or git not available, try to list files
      gitDiff = 'Workspace não é um repositório git. Inicialize com: git init && git add .';
    }

    // Check if Gemini CLI is available
    const hasGemini = await checkGeminiCLI();
    if (!hasGemini) {
      return NextResponse.json(
        {
          error: 'Gemini CLI is not installed',
          details: 'Please install the Gemini CLI: npm install -g @google/generative-ai-cli'
        },
        { status: 503 }
      );
    }

    // Build prompt for Gemini
    const successCriteriaList = task.successCriteria?.join('\n- ') || 'Não especificados';

    const prompt = `Você é um Tech Lead brasileiro revisando o código de um aluno.

CONTEXTO:
- Projeto: ${projectId}
- Task atual: #${taskId} - ${task.title}
- Descrição: ${task.description}

CRITÉRIOS DE SUCESSO DESTA TASK:
- ${successCriteriaList}

GIT DIFF DO WORKSPACE DO ALUNO:
\`\`\`diff
${gitDiff.slice(0, 8000)}
\`\`\`

INSTRUÇÕES:
1. Analise as mudanças no código
2. Verifique se o código atende aos critérios de sucesso
3. Dê feedback construtivo e específico
4. Se o código está bom e atende TODOS os critérios, termine sua resposta com: [TASK_COMPLETE]
5. Se precisar de ajustes, explique o que precisa melhorar (sem dar código pronto)

Seja direto, objetivo e use linguagem informal brasileira.`;

    // Escape prompt for shell
    const escapedPrompt = prompt.replace(/'/g, "'\\''");
    const command = `echo '${escapedPrompt}' | gemini -y --model gemini-3-flash-preview`;

    const { stdout, stderr } = await execPromise(command, {
      cwd: workspaceDir,
      timeout: 60000,
      maxBuffer: 1024 * 1024
    });

    if (stderr) {
      console.error('Gemini stderr:', stderr);
    }

    const response = stdout.trim();
    const taskCompleted = response.includes('[TASK_COMPLETE]');
    const cleanResponse = response.replace('[TASK_COMPLETE]', '').trim();

    return NextResponse.json({
      response: cleanResponse,
      taskCompleted,
      taskId,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Error reviewing code:', error);
    return NextResponse.json(
      { error: 'Failed to review code', details: error.message },
      { status: 500 }
    );
  }
}
