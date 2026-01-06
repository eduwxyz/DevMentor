"use client";

import { Project } from "@/types";
import { Clock, ListTodo } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProjectCardProps {
    project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
    const router = useRouter();
    const isStarted = project.currentTask !== null;

    const handleStart = () => {
        if (isStarted) {
            // Project already started, go directly to workspace
            router.push(`/workspace/${project.id}`);
        } else {
            // New project, go to onboarding first
            router.push(`/onboarding/${project.id}`);
        }
    };

    return (
        <div className="group relative bg-background-secondary border border-border rounded-lg p-6 transition-all duration-200 hover:border-accent hover:scale-[1.02] flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-text-primary group-hover:text-accent transition-colors">
                    {project.title}
                </h3>
                {project.difficulty === "beginner" && (
                    <span className="text-xs px-2 py-1 bg-green-500/10 text-green-500 rounded-full border border-green-500/20">
                        Iniciante
                    </span>
                )}
                {project.difficulty === "intermediate" && (
                    <span className="text-xs px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded-full border border-yellow-500/20">
                        Intermediário
                    </span>
                )}
                {project.difficulty === "advanced" && (
                    <span className="text-xs px-2 py-1 bg-red-500/10 text-red-500 rounded-full border border-red-500/20">
                        Avançado
                    </span>
                )}
            </div>

            <p className="text-text-secondary text-sm mb-6 flex-grow">
                {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
                {project.stack.map((tech) => (
                    <span
                        key={tech}
                        className="text-xs px-2 py-1 bg-background-tertiary text-text-tertiary border border-border rounded"
                    >
                        {tech}
                    </span>
                ))}
            </div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                <div className="flex gap-4 text-xs text-text-secondary">
                    <div className="flex items-center gap-1">
                        <ListTodo size={14} />
                        <span>{project.totalTasks} tasks</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>~{project.estimatedHours}h</span>
                    </div>
                </div>

                <button
                    onClick={handleStart}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${isStarted
                        ? "bg-transparent border border-border text-text-primary hover:bg-background-tertiary"
                        : "bg-accent text-white hover:bg-accent-hover"
                        }`}
                >
                    {isStarted ? "Continuar" : "Iniciar"}
                </button>
            </div>
        </div>
    );
}
