"use client";

import { useState, useEffect } from "react";
import ProjectCard from "@/components/ProjectCard";
import { Project, Category } from "@/types";
import { Terminal, Code, Database, BarChart3, Brain } from "lucide-react";

const CATEGORIES: { id: Category; label: string; icon: any }[] = [
  { id: "software", label: "Desenvolvimento", icon: Code },
  { id: "data-engineering", label: "Engenharia de Dados", icon: Database },
  { id: "analytics-engineer", label: "Analytics Engineer", icon: BarChart3 },
  { id: "ai-engineer", label: "AI Engineer", icon: Brain }
];

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await fetch('/api/projects');
        const data = await response.json();
        setProjects(data.projects || []);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  const filteredProjects = selectedCategory === "all"
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  return (
    <main className="min-h-screen bg-background flex flex-col items-center py-16 px-4 sm:px-6">
      <div className="w-full max-w-6xl">
        <header className="flex items-center gap-2 mb-12">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
            <Terminal className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            DevMentor
          </h1>
        </header>

        <section>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3 text-text-primary">Escolha seu projeto</h2>
            <p className="text-text-secondary text-lg">
              Aprenda na prática com projetos guiados e um Tech Lead virtual.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-3 mb-8 flex-wrap justify-center">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === "all"
                  ? "bg-accent text-white"
                  : "bg-background-secondary text-text-secondary hover:text-text-primary border border-border"
              }`}
            >
              Todos
            </button>
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === cat.id
                      ? "bg-accent text-white"
                      : "bg-background-secondary text-text-secondary hover:text-text-primary border border-border"
                  }`}
                >
                  <Icon size={18} />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="text-center text-text-secondary py-12">
              Carregando projetos...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center text-text-secondary py-12">
              Nenhum projeto disponível nesta categoria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
