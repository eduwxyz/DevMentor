import { NextRequest, NextResponse } from 'next/server';
import { getChatHistory, addChatMessage, clearChatHistory } from '@/lib/db';

// GET - Load chat history
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const messages = getChatHistory(projectId);

    return NextResponse.json({
      projectId,
      messages,
      lastUpdated: messages.length > 0 ? messages[messages.length - 1].timestamp : null
    });

  } catch (error: any) {
    console.error('Error loading chat history:', error);
    return NextResponse.json(
      { error: 'Failed to load chat history', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Save chat history (supports both full replace and append)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const body = await req.json();
    const { messages, message, role } = body;

    // If single message provided, append it
    if (message && role) {
      const newMessage = addChatMessage(projectId, role, message);
      return NextResponse.json({
        success: true,
        message: newMessage
      });
    }

    // If array of messages provided, replace all
    if (messages && Array.isArray(messages)) {
      clearChatHistory(projectId);

      for (const msg of messages) {
        addChatMessage(projectId, msg.role, msg.content);
      }

      return NextResponse.json({
        success: true,
        lastUpdated: new Date().toISOString()
      });
    }

    return NextResponse.json(
      { error: 'Provide either "messages" array or "message" + "role"' },
      { status: 400 }
    );

  } catch (error: any) {
    console.error('Error saving chat history:', error);
    return NextResponse.json(
      { error: 'Failed to save chat history', details: error.message },
      { status: 500 }
    );
  }
}
