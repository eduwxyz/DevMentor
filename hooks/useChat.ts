import { Message, ChatState } from "@/types";
import { useState, useCallback, useMemo, useEffect } from "react";

interface UseChatProps {
    projectId: string;
    taskId: number;
    projectTitle: string;
}

interface UseChatReturn extends ChatState {
    addMessage: (message: Message) => void;
    taskCompleted: boolean;
    resetTaskCompleted: () => void;
}

export function useChat({ projectId, taskId, projectTitle }: UseChatProps): UseChatReturn {
    const initialMessage = useMemo(() => ({
        id: 1,
        role: "assistant" as const,
        content: `Fala! Voce comecou o projeto ${projectTitle}. Esse projeto vai te ensinar na pratica atraves de tasks guiadas.\n\nA primeira task ta explicada no painel ao lado. Le com calma e me avisa quando quiser comecar ou se tiver alguma duvida.`,
        timestamp: new Date()
    }), [projectTitle]);

    const [messages, setMessages] = useState<Message[]>([initialMessage]);
    const [isLoading, setIsLoading] = useState(false);
    const [historyLoaded, setHistoryLoaded] = useState(false);
    const [taskCompleted, setTaskCompleted] = useState(false);

    // Load chat history on mount
    useEffect(() => {
        async function loadHistory() {
            try {
                const res = await fetch(`/api/projects/${projectId}/chat-history`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.messages && data.messages.length > 0) {
                        // Convert timestamp strings back to Date objects
                        const loadedMessages = data.messages.map((m: any) => ({
                            ...m,
                            timestamp: m.timestamp ? new Date(m.timestamp) : undefined
                        }));
                        setMessages(loadedMessages);
                    }
                }
            } catch (error) {
                console.error('Error loading chat history:', error);
            } finally {
                setHistoryLoaded(true);
            }
        }

        loadHistory();
    }, [projectId]);

    // Save chat history when messages change
    useEffect(() => {
        if (!historyLoaded || messages.length <= 1) return;

        async function saveHistory() {
            try {
                await fetch(`/api/projects/${projectId}/chat-history`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messages })
                });
            } catch (error) {
                console.error('Error saving chat history:', error);
            }
        }

        // Debounce save
        const timeout = setTimeout(saveHistory, 500);
        return () => clearTimeout(timeout);
    }, [messages, projectId, historyLoaded]);

    const addMessage = useCallback((message: Message) => {
        setMessages(prev => [...prev, message]);
    }, []);

    const resetTaskCompleted = useCallback(() => {
        setTaskCompleted(false);
    }, []);

    const sendMessage = useCallback(async (content: string) => {
        // Add user message
        const userMessage: Message = {
            id: Date.now(),
            role: "user",
            content,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            // Call Gemini API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: content,
                    projectId,
                    taskId,
                    history: messages.map(m => ({
                        role: m.role,
                        content: m.content
                    }))
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get response from AI');
            }

            const data = await response.json();

            // Check if task was completed
            if (data.taskCompleted) {
                setTaskCompleted(true);
            }

            const assistantMessage: Message = {
                id: Date.now() + 1,
                role: "assistant",
                content: data.response,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error sending message:', error);

            // Fallback error message
            const errorMessage: Message = {
                id: Date.now() + 1,
                role: "assistant",
                content: "Desculpa, tive um problema aqui. Tenta de novo? Se o erro persistir, verifica se o Gemini CLI ta instalado e configurado.",
                timestamp: new Date()
            };

            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [messages, projectId, taskId]);

    return {
        messages,
        isLoading,
        sendMessage,
        addMessage,
        taskCompleted,
        resetTaskCompleted
    };
}
