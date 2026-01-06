"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProgressBar from "./ProgressBar";
import XPIndicator from "./XPIndicator";

interface HeaderProps {
    projectName: string;
    currentTask: number;
    totalTasks: number;
}

export default function Header({ projectName, currentTask, totalTasks }: HeaderProps) {
    return (
        <header className="h-14 bg-background-secondary border-b border-border flex items-center justify-between px-4 md:px-6 shrink-0">
            <div className="flex items-center gap-3 md:gap-4">
                <Link
                    href="/"
                    className="p-1 hover:bg-background-tertiary rounded-full text-text-secondary transition-colors"
                >
                    <ArrowLeft size={20} />
                </Link>
                <span className="font-semibold text-text-primary text-sm md:text-base truncate max-w-[120px] md:max-w-none">
                    {projectName}
                </span>
            </div>

            <div className="hidden md:flex items-center gap-2 text-sm text-text-secondary">
                <span>Task {currentTask} de {totalTasks}</span>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
                <div className="hidden sm:block">
                    <ProgressBar total={totalTasks} current={currentTask} />
                </div>
                <XPIndicator compact />
            </div>
        </header>
    );
}
