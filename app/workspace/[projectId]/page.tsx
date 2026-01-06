"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import TaskPanel from "@/components/TaskPanel";
import Chat from "@/components/Chat";
import { useChat } from "@/hooks/useChat";
import { Task, Project, Message } from "@/types";
import { Menu, MessageSquare, Layout } from "lucide-react";

export default function WorkspacePage() {
    const params = useParams();
    const projectId = params.projectId as string;

    const [project, setProject] = useState<Project | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isReviewing, setIsReviewing] = useState(false);

    const [activeTab, setActiveTab] = useState<"task" | "chat">("chat");
    const [isTaskPanelOpen, setIsTaskPanelOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    // Load project and tasks
    useEffect(() => {
        async function loadData() {
            try {
                // Load project
                const projectRes = await fetch(`/api/projects/${projectId}`);
                const projectData = await projectRes.json();
                setProject(projectData.project);

                // Load tasks
                const tasksRes = await fetch(`/api/projects/${projectId}/tasks`);
                const tasksData = await tasksRes.json();
                setTasks(tasksData.tasks || []);

                // Set current task index (from progress or default to first task)
                const currentTaskId = projectData.project.currentTask || 1;
                const taskIndex = tasksData.tasks.findIndex((t: Task) => t.id === currentTaskId);
                setCurrentTaskIndex(taskIndex >= 0 ? taskIndex : 0);

            } catch (error) {
                console.error('Error loading workspace data:', error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [projectId]);

    const currentTask = tasks[currentTaskIndex];

    const {
        messages,
        isLoading: chatLoading,
        sendMessage,
        addMessage,
        taskCompleted,
        resetTaskCompleted
    } = useChat({
        projectId,
        taskId: currentTask?.id || 1,
        projectTitle: project?.title || ""
    });

    // Handle task completion
    useEffect(() => {
        if (taskCompleted && currentTask) {
            handleTaskComplete();
        }
    }, [taskCompleted]);

    const handleTaskComplete = async () => {
        try {
            const res = await fetch(`/api/projects/${projectId}/complete-task`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ taskId: currentTask.id })
            });

            if (res.ok) {
                const data = await res.json();
                if (!data.isProjectComplete) {
                    // Move to next task
                    setCurrentTaskIndex(prev => prev + 1);
                }
            }
        } catch (error) {
            console.error('Error completing task:', error);
        } finally {
            resetTaskCompleted();
        }
    };

    // Navigation handlers
    const handlePreviousTask = useCallback(async () => {
        if (currentTaskIndex > 0) {
            const newIndex = currentTaskIndex - 1;
            const newTaskId = tasks[newIndex].id;

            // Update local state
            setCurrentTaskIndex(newIndex);

            // Update progress on server
            try {
                await fetch(`/api/projects/${projectId}/progress`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ currentTask: newTaskId })
                });
            } catch (error) {
                console.error('Error updating progress:', error);
            }
        }
    }, [currentTaskIndex, tasks, projectId]);

    const handleNextTask = useCallback(async () => {
        if (currentTaskIndex < tasks.length - 1) {
            const newIndex = currentTaskIndex + 1;
            const newTaskId = tasks[newIndex].id;

            // Update local state
            setCurrentTaskIndex(newIndex);

            // Update progress on server
            try {
                await fetch(`/api/projects/${projectId}/progress`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ currentTask: newTaskId })
                });
            } catch (error) {
                console.error('Error updating progress:', error);
            }
        }
    }, [currentTaskIndex, tasks, projectId]);

    // Help handler
    const handleRequestHelp = useCallback(() => {
        sendMessage("Estou travado nessa tarefa. Pode me dar uma dica de como comecar?");
        // Switch to chat on mobile
        if (isMobile) {
            setActiveTab("chat");
        }
    }, [sendMessage, isMobile]);

    // Review code handler
    const handleReviewCode = useCallback(async () => {
        if (!currentTask || isReviewing) return;

        setIsReviewing(true);

        // Switch to chat on mobile
        if (isMobile) {
            setActiveTab("chat");
        }

        // Add user message indicating review request
        const userMessage: Message = {
            id: Date.now(),
            role: "user",
            content: "Pode revisar meu codigo? Fiz um git diff pra voce analisar.",
            timestamp: new Date()
        };
        addMessage(userMessage);

        try {
            const res = await fetch(`/api/projects/${projectId}/review`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ taskId: currentTask.id })
            });

            if (!res.ok) {
                throw new Error('Failed to review code');
            }

            const data = await res.json();

            // Add Tech Lead response
            const assistantMessage: Message = {
                id: Date.now() + 1,
                role: "assistant",
                content: data.response,
                timestamp: new Date()
            };
            addMessage(assistantMessage);

            // If task was completed, handle it
            if (data.taskCompleted) {
                await handleTaskComplete();
            }
        } catch (error) {
            console.error('Error reviewing code:', error);

            const errorMessage: Message = {
                id: Date.now() + 1,
                role: "assistant",
                content: "Nao consegui revisar o codigo. Verifica se o workspace tem um repositorio git inicializado e se voce fez alteracoes.",
                timestamp: new Date()
            };
            addMessage(errorMessage);
        } finally {
            setIsReviewing(false);
        }
    }, [currentTask, projectId, addMessage, isMobile, isReviewing]);

    // Responsive check
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 1024 && window.innerWidth >= 768) {
                setIsTaskPanelOpen(false); // Default closed on tablet
            } else if (window.innerWidth >= 1024) {
                setIsTaskPanelOpen(true); // Default open on desktop
            }
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    if (loading || !project || !currentTask) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <div className="text-center">
                    <div className="text-text-secondary">Carregando workspace...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-background overflow-hidden font-sans">
            <Header
                projectName={project.title}
                currentTask={currentTaskIndex + 1}
                totalTasks={tasks.length}
            />

            <div className="flex flex-1 overflow-hidden relative">
                {/* Mobile Tabs Content */}
                {isMobile ? (
                    <>
                        {activeTab === "task" && (
                            <div className="w-full h-full overflow-y-auto pb-16">
                                <TaskPanel
                                    task={currentTask}
                                    projectId={projectId}
                                    currentTaskIndex={currentTaskIndex}
                                    totalTasks={tasks.length}
                                    onPrevious={handlePreviousTask}
                                    onNext={handleNextTask}
                                    onRequestHelp={handleRequestHelp}
                                    onReviewCode={handleReviewCode}
                                    isReviewing={isReviewing}
                                />
                            </div>
                        )}
                        {activeTab === "chat" && (
                            <div className="w-full h-full flex flex-col pb-16">
                                <Chat messages={messages} isLoading={chatLoading || isReviewing} onSendMessage={sendMessage} />
                            </div>
                        )}
                    </>
                ) : (
                    /* Desktop/Tablet Layout */
                    <>
                        {/* Task Panel Drawer/Sidebar */}
                        <div
                            className={`transition-all duration-300 ease-in-out border-r border-border bg-background-secondary ${isTaskPanelOpen ? "w-[380px] translate-x-0" : "w-0 -translate-x-full overflow-hidden border-none"
                                }`}
                        >
                            <div className="w-[380px] h-full">
                                <TaskPanel
                                    task={currentTask}
                                    projectId={projectId}
                                    currentTaskIndex={currentTaskIndex}
                                    totalTasks={tasks.length}
                                    onPrevious={handlePreviousTask}
                                    onNext={handleNextTask}
                                    onRequestHelp={handleRequestHelp}
                                    onReviewCode={handleReviewCode}
                                    isReviewing={isReviewing}
                                />
                            </div>
                        </div>

                        {/* Toggle Button for Tablet/Desktop */}
                        <div className={`absolute top-4 z-10 transition-all duration-300 ${isTaskPanelOpen ? "left-[396px]" : "left-4"}`}>
                            <button
                                onClick={() => setIsTaskPanelOpen(!isTaskPanelOpen)}
                                className="hidden md:flex p-2 bg-background-tertiary border border-border rounded-md hover:bg-background-secondary text-text-secondary"
                                title={isTaskPanelOpen ? "Fechar painel" : "Abrir painel"}
                            >
                                {isTaskPanelOpen ? <Menu size={20} /> : <Layout size={20} />}
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 flex flex-col min-w-0">
                            <Chat messages={messages} isLoading={chatLoading || isReviewing} onSendMessage={sendMessage} />
                        </div>
                    </>
                )}
            </div>

            {/* Mobile Bottom Navigation */}
            {isMobile && (
                <div className="h-16 bg-background-secondary border-t border-border flex items-center justify-around fixed bottom-0 w-full z-50">
                    <button
                        onClick={() => setActiveTab("task")}
                        className={`flex flex-col items-center gap-1 ${activeTab === "task" ? "text-accent" : "text-text-tertiary"
                            }`}
                    >
                        <Layout size={24} />
                        <span className="text-xs font-medium">Task</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("chat")}
                        className={`flex flex-col items-center gap-1 ${activeTab === "chat" ? "text-accent" : "text-text-tertiary"
                            }`}
                    >
                        <MessageSquare size={24} />
                        <span className="text-xs font-medium">Chat</span>
                    </button>
                </div>
            )}
        </div>
    );
}
