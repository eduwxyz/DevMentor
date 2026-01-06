import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import { isValidProjectId, getWorkspacePath } from '@/lib/security';

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

interface ChatRequest {
  message: string;
  projectId: string;
  taskId: number;
  history?: Array<{ role: string; content: string }>;
}

function buildPrompt(request: ChatRequest): string {
  const systemContext = `Voce e um Tech Lead virtual brasileiro, mentor de programacao.

REGRAS FUNDAMENTAIS:
- NUNCA de codigo pronto. Use hints progressivos (perguntas, conceitos, exemplos genericos).
- Seja direto, objetivo e use linguagem informal brasileira.
- Foque em fazer o aluno pensar e descobrir a solucao.
- Se o aluno pedir codigo, ofereca pseudocodigo ou explique o conceito.
- Responda DIRETAMENTE sem usar ferramentas ou buscar informacoes externas.
- Use apenas o contexto fornecido abaixo.
- Se voce achar que o aluno completou a tarefa com sucesso baseado na conversa, termine sua resposta com: [TASK_COMPLETE]

PROJETO ATUAL: ${request.projectId}
TASK ATUAL: Task #${request.taskId}

HISTORICO DAS ULTIMAS MENSAGENS:
${request.history?.slice(-5).map(m => `${m.role}: ${m.content}`).join('\n\n') || 'Sem historico'}

MENSAGEM DO ALUNO:
${request.message}

Responda de forma breve e direta, como um mentor ajudando via chat.`;

  return systemContext;
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json();

    if (!body.message || !body.projectId || !body.taskId) {
      return NextResponse.json(
        { error: 'Missing required fields: message, projectId, taskId' },
        { status: 400 }
      );
    }

    // Validate project ID to prevent directory traversal
    if (!isValidProjectId(body.projectId)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
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

    // Define workspace path
    const workspaceDir = getWorkspacePath(body.projectId);

    // Create workspace if it doesn't exist
    if (!fs.existsSync(workspaceDir)) {
      fs.mkdirSync(workspaceDir, { recursive: true });
    }

    const prompt = buildPrompt(body);

    // Escape prompt for shell
    const escapedPrompt = prompt.replace(/'/g, "'\\''");

    // Run gemini with cwd set to the user's workspace
    const command = `echo '${escapedPrompt}' | gemini -y --model gemini-3-flash-preview`;

    const { stdout, stderr } = await execPromise(command, {
      cwd: workspaceDir, // Run in the workspace directory
      timeout: 60000, // 60s timeout
      maxBuffer: 1024 * 1024 // 1MB buffer
    });

    if (stderr) {
      console.error('Gemini stderr:', stderr);
    }

    const rawResponse = stdout.trim();

    // Check if task was marked as complete
    const taskCompleted = rawResponse.includes('[TASK_COMPLETE]');
    const response = rawResponse.replace('[TASK_COMPLETE]', '').trim();

    return NextResponse.json({
      response,
      taskCompleted,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Error calling Gemini CLI:', error);

    return NextResponse.json(
      {
        error: 'Failed to get response from AI',
        details: error.message
      },
      { status: 500 }
    );
  }
}
