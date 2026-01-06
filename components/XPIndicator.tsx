"use client";

import { useState, useEffect } from "react";
import { UserProfile, LevelConfig, calculateLevel, calculateProgress } from "@/types";
import { Zap } from "lucide-react";
import Link from "next/link";

interface XPIndicatorProps {
  compact?: boolean;
}

export default function XPIndicator({ compact = false }: XPIndicatorProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [levelConfig, setLevelConfig] = useState<LevelConfig | null>(null);

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
      }
    }

    loadProfile();

    // Refresh every 5 seconds to catch updates
    const interval = setInterval(loadProfile, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!profile || !levelConfig) {
    return null;
  }

  const progress = calculateProgress(profile.xp);

  if (compact) {
    return (
      <Link
        href="/profile"
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background-tertiary border border-border hover:border-accent/50 transition-colors"
      >
        <Zap size={14} style={{ color: levelConfig.color }} />
        <span className="text-xs font-medium text-text-primary">
          {profile.xp} XP
        </span>
        <span
          className="text-xs font-bold px-1.5 py-0.5 rounded"
          style={{ backgroundColor: levelConfig.color + '20', color: levelConfig.color }}
        >
          {levelConfig.displayName}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href="/profile"
      className="flex items-center gap-3 px-4 py-2 rounded-lg bg-background-tertiary border border-border hover:border-accent/50 transition-colors"
    >
      <div className="flex items-center gap-2">
        <Zap size={18} style={{ color: levelConfig.color }} />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-text-primary">
            {profile.xp} XP
          </span>
          <span className="text-xs text-text-tertiary">
            {levelConfig.displayName}
          </span>
        </div>
      </div>

      <div className="w-20 h-2 bg-background rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%`, backgroundColor: levelConfig.color }}
        />
      </div>
    </Link>
  );
}
