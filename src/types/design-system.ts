/**
 * Design System Types
 * Defines the contracts for themes, variants, states, and navigation structures.
 */

export type ThemeMode = 'dark' | 'light';

export type AffinityTrackId = 'designer' | 'photo' | 'publisher' | 'scripting';

export interface AffinityTrackInfo {
  id: AffinityTrackId;
  name: string;
  tagline: string;
  accentColor: string;
  iconName: string;
  moduleCount: number;
  lessonCount: number;
}

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent-designer' | 'accent-photo' | 'accent-publisher' | 'accent-scripting';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  badge?: string;
}

export interface ModuleSummary {
  id: string;
  trackId: AffinityTrackId;
  moduleNumber: string; // e.g. "D01", "P04", "B02", "S08"
  title: string;
  description: string;
  lessonCount: number;
  estimatedMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  progressPercentage?: number;
}

export interface LessonSummary {
  id: string;
  moduleId: string;
  lessonNumber: number;
  title: string;
  durationMinutes: number;
  completed?: boolean;
}

export interface ToolEncyclopediaItem {
  id: string;
  name: string;
  app: 'designer' | 'photo' | 'publisher' | 'universal';
  persona: 'vector' | 'pixel' | 'export' | 'develop' | 'liquify';
  shortcut: {
    windows: string;
    mac: string;
  };
  description: string;
  modifiers?: {
    key: string;
    action: string;
  }[];
}

export interface ResourceItem {
  id: string;
  title: string;
  category: 'palette' | 'brush' | 'template' | 'vector' | 'cheatsheet';
  format: '.afpalette' | '.afbrushes' | '.aftemplate' | '.afassets' | '.pdf';
  fileSize: string;
  downloadsCount: number;
  description: string;
}
