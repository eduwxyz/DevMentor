"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Zap, Trophy, Target, CheckCircle, Lock } from "lucide-react";
import { UserProfile, LevelConfig, Badge, BADGES, LEVELS, calculateLevel, calculateProgress } from "@/types";

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [levelConfig, setLevelConfig] = useState<LevelConfig | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProfile() {
            try {
                const res = await fetch('/api/profile');
                if (res.ok) {
                    const data = await res.json();
                    setProfile(data.profile);
                    setLevelConfig(data.levelConfig);
                }
            } catch (error) {
                console.error('Error loading profile:', error);
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <div className="text-text-secondary">Carregando perfil...</div>
            </div>
        );
    }

    if (!profile || !levelConfig) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <div className="text-text-secondary">Erro ao carregar perfil</div>
            </div>
        );
    }

    const progress = calculateProgress(profile.xp);
    const nextLevel = LEVELS.find(l => l.minXP > profile.xp);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="h-14 bg-background-secondary border-b border-border flex items-center px-6">
                <Link
                    href="/"
                    className="p-1 hover:bg-background-tertiary rounded-full text-text-secondary transition-colors"
                >
                    <ArrowLeft size={20} />
                </Link>
                <span className="ml-4 font-semibold text-text-primary">Meu Perfil</span>
            </header>

            <div className="max-w-4xl mx-auto p-6 space-y-8">
                {/* Level Card */}
                <div className="bg-background-secondary border border-border rounded-xl p-6">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: levelConfig.color + '20' }}
                                >
                                    <Zap size={24} style={{ color: levelConfig.color }} />
                                </div>
                                <div>
                                    <h1
                                        className="text-2xl font-bold"
                                        style={{ color: levelConfig.color }}
                                    >
                                        {levelConfig.displayName}
                                    </h1>
                                    <p className="text-text-secondary text-sm">
                                        {profile.xp} XP total
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-text-secondary">Progresso para {nextLevel?.displayName || 'Max'}</span>
                            <span className="text-text-primary font-medium">
                                {nextLevel ? `${profile.xp} / ${nextLevel.minXP} XP` : 'Nivel maximo!'}
                            </span>
                        </div>
                        <div className="h-3 bg-background rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{ width: `${progress}%`, backgroundColor: levelConfig.color }}
                            />
                        </div>
                    </div>

                    {/* Level progression */}
                    <div className="flex justify-between mt-6 pt-4 border-t border-border">
                        {LEVELS.map((level, index) => (
                            <div key={level.name} className="flex flex-col items-center">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1
                                        ${profile.xp >= level.minXP ? '' : 'opacity-30'}`}
                                    style={{
                                        backgroundColor: profile.xp >= level.minXP ? level.color + '20' : '#333',
                                        color: profile.xp >= level.minXP ? level.color : '#666'
                                    }}
                                >
                                    {index + 1}
                                </div>
                                <span className={`text-xs ${profile.xp >= level.minXP ? 'text-text-primary' : 'text-text-tertiary'}`}>
                                    {level.displayName}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-background-secondary border border-border rounded-xl p-4">
                        <div className="flex items-center gap-2 text-text-tertiary mb-2">
                            <Zap size={16} />
                            <span className="text-xs uppercase tracking-wider">XP Total</span>
                        </div>
                        <div className="text-2xl font-bold text-text-primary">{profile.xp}</div>
                    </div>

                    <div className="bg-background-secondary border border-border rounded-xl p-4">
                        <div className="flex items-center gap-2 text-text-tertiary mb-2">
                            <CheckCircle size={16} />
                            <span className="text-xs uppercase tracking-wider">Tasks</span>
                        </div>
                        <div className="text-2xl font-bold text-text-primary">{profile.tasksCompleted}</div>
                    </div>

                    <div className="bg-background-secondary border border-border rounded-xl p-4">
                        <div className="flex items-center gap-2 text-text-tertiary mb-2">
                            <Target size={16} />
                            <span className="text-xs uppercase tracking-wider">Projetos</span>
                        </div>
                        <div className="text-2xl font-bold text-text-primary">{profile.projectsCompleted}</div>
                    </div>

                    <div className="bg-background-secondary border border-border rounded-xl p-4">
                        <div className="flex items-center gap-2 text-text-tertiary mb-2">
                            <Trophy size={16} />
                            <span className="text-xs uppercase tracking-wider">Badges</span>
                        </div>
                        <div className="text-2xl font-bold text-text-primary">{profile.badges.length}</div>
                    </div>
                </div>

                {/* Badges */}
                <div className="bg-background-secondary border border-border rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                        <Trophy size={20} className="text-accent" />
                        Conquistas
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {BADGES.map((badge) => {
                            const isUnlocked = profile.badges.includes(badge.id);
                            return (
                                <div
                                    key={badge.id}
                                    className={`relative p-4 rounded-lg border transition-all
                                        ${isUnlocked
                                            ? 'bg-background-tertiary border-accent/30'
                                            : 'bg-background border-border opacity-50'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`text-3xl ${!isUnlocked && 'grayscale'}`}>
                                            {badge.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className={`font-medium truncate ${isUnlocked ? 'text-text-primary' : 'text-text-tertiary'}`}>
                                                    {badge.name}
                                                </h3>
                                                {!isUnlocked && <Lock size={12} className="text-text-tertiary flex-shrink-0" />}
                                            </div>
                                            <p className="text-xs text-text-tertiary mt-1">
                                                {badge.description}
                                            </p>
                                        </div>
                                    </div>
                                    {isUnlocked && (
                                        <div className="absolute top-2 right-2">
                                            <CheckCircle size={16} className="text-green-500" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* XP Guide */}
                <div className="bg-background-secondary border border-border rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-text-primary mb-4">Como ganhar XP</h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center py-2 border-b border-border">
                            <span className="text-text-secondary">Completar uma task</span>
                            <span className="text-accent font-medium">+50 XP</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-border">
                            <span className="text-text-secondary">Completar um projeto</span>
                            <span className="text-accent font-medium">+200 XP</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-border">
                            <span className="text-text-secondary">Bonus: Primeira task</span>
                            <span className="text-green-500 font-medium">+25 XP</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-text-secondary">Bonus: Primeiro projeto</span>
                            <span className="text-green-500 font-medium">+100 XP</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
