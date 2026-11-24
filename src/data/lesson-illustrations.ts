import illustratedSteps from '../../curriculum/lesson-illustrations.json';
import firstProject from '../../curriculum/first-project.json';
import { getLessonStepImagePath } from '@/lib/lesson-visuals';

interface IllustratedStep {
  step: number;
  tool: string;
  before: { label: string };
  after: { label: string };
  lookFor: string;
}

export interface LessonLightboxVisual {
  src: string;
  mobileSrc?: string;
  alt: string;
  caption?: string;
}

export interface LessonStepVisual extends LessonLightboxVisual {
  step: number;
  tool: string;
  caption: string;
}

const lessonIllustrations: Record<string, readonly IllustratedStep[]> = {
  ...illustratedSteps,
  'starter-poster': firstProject,
};

export function getLessonIllustrations(lessonId: string): LessonStepVisual[] {
  return (lessonIllustrations[lessonId] ?? []).map(({ step, tool, before, after, lookFor }) => ({
    step,
    tool,
    src: getLessonStepImagePath(lessonId, step),
    mobileSrc: getLessonStepImagePath(lessonId, step, true),
    alt: `Bước ${step}, ${tool}. ${before.label} → ${after.label}.`,
    caption: lookFor,
  }));
}
