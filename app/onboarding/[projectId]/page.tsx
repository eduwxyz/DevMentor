"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Users,
  Target,
  Rocket,
  Clock,
  CheckCircle,
  Loader2
} from "lucide-react";
import { Project, TeamMember } from "@/types";

function getAvatarUrl(name: string, style: string = "avataaars") {
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
}

function TeamMemberCard({ member, index }: { member: TeamMember; index: number }) {
  const styles = ["avataaars", "personas", "lorelei"];
  const style = styles[index % styles.length];

  return (
    <div className="bg-background-tertiary border border-border rounded-xl p-4 flex flex-col items-center text-center hover:border-accent/50 transition-all">
      <img
        src={getAvatarUrl(member.name, style)}
        alt={member.name}
        className="w-20 h-20 rounded-full mb-3 bg-background"
      />
      <h3 className="font-semibold text-text-primary">{member.name}</h3>
      <span className="text-sm text-accent font-medium">{member.role}</span>
      <p className="text-xs text-text-tertiary mt-2 line-clamp-3">
        {member.description}
      </p>
    </div>
  );
}

export default function OnboardingPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProject() {
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        if (!res.ok) {
          throw new Error("Projeto nao encontrado");
        }
        const data = await res.json();
        setProject(data.project);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [projectId]);

  const handleStartProject = async () => {
    setStarting(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/start`, {
        method: "POST"
      });

      if (!res.ok) {
        throw new Error("Erro ao iniciar projeto");
      }

      router.push(`/workspace/${projectId}`);
    } catch (err: any) {
      setError(err.message);
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <p className="text-text-secondary mb-4">{error || "Projeto nao encontrado"}</p>
        <Link href="/" className="text-accent hover:underline">
          Voltar para inicio
        </Link>
      </div>
    );
  }

  const context = project.context;

  // If no context, go directly to workspace
  if (!context) {
    router.push(`/workspace/${projectId}`);
    return null;
  }

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
        <span className="ml-4 font-semibold text-text-primary">Briefing do Projeto</span>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Company Header */}
        <div className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Building2 size={32} className="text-accent" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Bem-vindo a {context.company}
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto">
            {project.description}
          </p>
        </div>

        {/* Situation */}
        <div className="bg-background-secondary border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Target size={20} className="text-yellow-500" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary">A Situacao</h2>
          </div>
          <p className="text-text-secondary leading-relaxed">
            {context.situation}
          </p>
        </div>

        {/* Team */}
        <div className="bg-background-secondary border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Users size={20} className="text-purple-500" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary">Seu Time</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {context.team.map((member, index) => (
              <TeamMemberCard key={member.name} member={member} index={index} />
            ))}
          </div>
        </div>

        {/* Your Mission */}
        <div className="bg-background-secondary border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Rocket size={20} className="text-green-500" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary">Sua Missao</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-text-tertiary">Cargo:</span>
              <span className="text-text-primary font-medium">{context.role}</span>
            </div>

            <div>
              <span className="text-text-tertiary">Stack:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-background-tertiary rounded-full text-sm text-text-primary"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2 text-sm text-text-tertiary">
              <div className="flex items-center gap-1">
                <CheckCircle size={16} />
                <span>{project.totalTasks} tasks</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>~{project.estimatedHours}h estimadas</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center pb-8">
          <button
            onClick={handleStartProject}
            disabled={starting}
            className="px-8 py-4 bg-accent text-white font-semibold rounded-xl hover:bg-accent/90 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3"
          >
            {starting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Preparando workspace...
              </>
            ) : (
              <>
                <Rocket size={20} />
                Aceitar Missao
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
