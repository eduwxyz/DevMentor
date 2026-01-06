import { NextRequest, NextResponse } from 'next/server';
import { getProfile, updateProfile, checkAndAwardBadges, addBadge } from '@/lib/db';
import { XP_REWARDS, calculateLevel } from '@/types';

// GET - Load profile
export async function GET() {
  try {
    const profile = getProfile();
    const levelConfig = calculateLevel(profile.xp);

    return NextResponse.json({
      profile,
      levelConfig,
      nextLevelXP: levelConfig.maxXP,
      xpToNextLevel: levelConfig.maxXP - profile.xp
    });
  } catch (error: any) {
    console.error('Error loading profile:', error);
    return NextResponse.json(
      { error: 'Failed to load profile', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Add XP and check badges
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, amount } = body;

    let profile = getProfile();
    let xpGained = 0;

    switch (action) {
      case 'task_completed':
        profile.tasksCompleted += 1;
        xpGained = XP_REWARDS.TASK_COMPLETED;
        if (profile.tasksCompleted === 1) {
          xpGained += XP_REWARDS.FIRST_TASK_BONUS;
        }
        break;

      case 'project_completed':
        profile.projectsCompleted += 1;
        xpGained = XP_REWARDS.PROJECT_COMPLETED;
        if (profile.projectsCompleted === 1) {
          xpGained += XP_REWARDS.FIRST_PROJECT_BONUS;
        }
        break;

      case 'add_xp':
        xpGained = amount || 0;
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: task_completed, project_completed, add_xp' },
          { status: 400 }
        );
    }

    profile.xp += xpGained;
    const newLevel = calculateLevel(profile.xp).name;

    updateProfile({
      xp: profile.xp,
      level: newLevel,
      tasksCompleted: profile.tasksCompleted,
      projectsCompleted: profile.projectsCompleted
    });

    // Refresh profile to get updated badges
    profile = getProfile();
    profile.xp = profile.xp; // Already updated above
    profile.level = newLevel;

    // Check for new badges
    const newBadges = checkAndAwardBadges(profile);

    // Get final profile state
    const finalProfile = getProfile();
    const levelConfig = calculateLevel(finalProfile.xp);

    return NextResponse.json({
      profile: finalProfile,
      xpGained,
      newBadges,
      levelConfig,
      leveledUp: newBadges.length > 0 || xpGained > 0
    });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile', details: error.message },
      { status: 500 }
    );
  }
}
