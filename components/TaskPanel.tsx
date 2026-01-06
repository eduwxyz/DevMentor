import { Task } from "@/types";
import { FolderOpen, HelpCircle, CheckCircle, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useState } from "react";

interface TaskPanelProps {
    task: Task;
    projectId: string;
    currentTaskIndex: number;
    totalTasks: number;
    onPrevious: () => void;
    onNext: () => void;
    onRequestHelp: () => void;
    onReviewCode: () => void;
    isReviewing: boolean;
}

export default function TaskPanel({
    task,
    projectId,
    currentTaskIndex,
    totalTasks,
    onPrevious,
    onNext,
    onRequestHelp,
    onReviewCode,
    isReviewing
}: TaskPanelProps) {
    const [checkedCriteria, setCheckedCriteria] = useState<number[]>([]);

    const toggleCriterion = (index: number) => {
        setCheckedCriteria(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    const isFirstTask = currentTaskIndex === 0;
    const isLastTask = currentTaskIndex === totalTasks - 1;

    return (
        <div className="w-full md:w-[380px] flex-shrink-0 bg-background-secondary border-r border-border h-full flex flex-col md:h-[calc(100vh-56px)] overflow-y-auto">
            <div className="p-6 flex flex-col gap-6">
                {/* Title */}
                <div>
                    <span className="text-xs font-medium text-text-tertiary uppercase tracking-wider">
                        Task {currentTaskIndex + 1} de {totalTasks}
                    </span>
                    <h2 className="text-2xl font-semibold text-text-primary mt-1">
                        {task.title}
                    </h2>
                </div>

                {/* Navigation */}
                <div className="flex gap-2">
                    <button
                        onClick={onPrevious}
                        disabled={isFirstTask}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md border transition-colors font-medium text-sm
                            ${isFirstTask
                                ? "border-border text-text-tertiary cursor-not-allowed opacity-50"
                                : "border-border text-text-primary hover:bg-background-tertiary"
                            }`}
                    >
                        <ChevronLeft size={16} />
                        <span>Anterior</span>
                    </button>
                    <button
                        onClick={onNext}
                        disabled={isLastTask}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md border transition-colors font-medium text-sm
                            ${isLastTask
                                ? "border-border text-text-tertiary cursor-not-allowed opacity-50"
                                : "border-border text-text-primary hover:bg-background-tertiary"
                            }`}
                    >
                        <span>Proxima</span>
                        <ChevronRight size={16} />
                    </button>
                </div>

                <div className="h-px bg-border" />

                {/* Description */}
                <p className="text-text-secondary leading-relaxed">
                    {task.description}
                </p>

                <div className="h-px bg-border" />

                {/* Steps */}
                <div>
                    <h3 className="text-sm font-medium text-text-tertiary mb-3">
                        O que voce precisa fazer:
                    </h3>
                    <ul className="space-y-3">
                        {task.steps.map((step, index) => (
                            <li key={index} className="flex gap-3 text-sm text-text-secondary">
                                <span className="text-accent">•</span>
                                <span>{step}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="h-px bg-border" />

                {/* Criteria */}
                <div>
                    <h3 className="text-sm font-medium text-text-tertiary mb-3">
                        Criterios de sucesso:
                    </h3>
                    <div className="space-y-3">
                        {task.successCriteria.map((criteria, index) => (
                            <label
                                key={index}
                                className="flex items-start gap-3 p-3 rounded-md bg-background-tertiary/50 hover:bg-background-tertiary cursor-pointer transition-colors"
                            >
                                <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors ${checkedCriteria.includes(index)
                                        ? "bg-accent border-accent"
                                        : "border-text-tertiary"
                                    }`}>
                                    {checkedCriteria.includes(index) && (
                                        <CheckCircle size={12} className="text-white" />
                                    )}
                                </div>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={checkedCriteria.includes(index)}
                                    onChange={() => toggleCriterion(index)}
                                />
                                <span className={`text-sm ${checkedCriteria.includes(index)
                                        ? "text-text-secondary line-through"
                                        : "text-text-primary"
                                    }`}>
                                    {criteria}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="h-px bg-border" />

                {/* Location */}
                <div className="bg-background-tertiary rounded-lg p-4 border border-border">
                    <div className="flex items-center gap-2 text-text-primary font-medium mb-1">
                        <FolderOpen size={18} className="text-accent" />
                        <span>workspaces/{projectId}/</span>
                    </div>
                    <p className="text-xs text-text-tertiary ml-6">
                        Abra esta pasta na sua IDE
                    </p>
                </div>

                <div className="h-px bg-border" />

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={onRequestHelp}
                        className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-md border border-border text-text-primary hover:bg-background-tertiary transition-colors font-medium"
                    >
                        <HelpCircle size={18} />
                        <span>Preciso de ajuda</span>
                    </button>

                    <button
                        onClick={onReviewCode}
                        disabled={isReviewing}
                        className={`flex items-center justify-center gap-2 w-full py-3 px-4 rounded-md bg-accent text-white transition-colors font-medium shadow-lg shadow-blue-500/10
                            ${isReviewing ? "opacity-70 cursor-not-allowed" : "hover:bg-accent-hover"}`}
                    >
                        {isReviewing ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>Analisando...</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle size={18} />
                                <span>Revisar meu codigo</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Extra spacing for mobile/scroll */}
                <div className="h-4 md:hidden" />
            </div>
        </div>
    );
}
