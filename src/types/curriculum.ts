/**
 * Comprehensive Curriculum Schema for AFFINITY ACADEMY
 * Governs the 40 modules, 120 lessons, 10-part standard content, and interactive slide engine.
 */

export type AffinityTrackId = 'designer' | 'photo' | 'publisher' | 'scripting';

export type LessonDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type SlideType = 
  | 'intro'
  | 'theory'
  | 'tool-anatomy'
  | 'step-by-step'
  | 'guided-practice'
  | 'pitfalls'
  | 'quiz'
  | 'challenge'
  | 'summary';

export interface ShortcutKeycap {
  win: string;
  mac: string;
}

export interface StepInstruction {
  stepNumber: number;
  title: string;
  instruction: string;
  shortcutTip?: ShortcutKeycap;
}

export interface VisualExample {
  title: string;
  description: string;
  visualType: 'diagram' | 'code' | 'table' | 'callout' | 'comparison';
  visualContent: string;
}

export interface PitfallItem {
  pitfall: string;
  cause: string;
  solution: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type AssetStatus = 
  | 'REAL_AFFINITY_FILE'
  | 'GUIDE_DOCUMENT'
  | 'JAVASCRIPT_SCRIPT'
  | 'EXTERNAL_RESOURCE'
  | 'NOT_YET_AVAILABLE';

export type TechnicalClassification = 
  | 'VERIFIED'
  | 'DOCUMENTED'
  | 'UNVERIFIED'
  | 'INCORRECT';

export interface PracticeAssetInfo {
  filename: string;
  filepath: string;
  filesize: string;
  filetype: '.afdesign' | '.afphoto' | '.afpub' | '.js' | '.pdf' | '.md';
  assetStatus: AssetStatus;
  isVerified: boolean;
  statusNote: string;
}

export interface StandardLessonSections {
  learningObjectives: string[];
  foundationalKnowledge: string;
  technicalEvidence?: {
    classification: TechnicalClassification;
    source: string;
    verifiedInAffinityVersion?: string;
  };
  toolAndFeatureExplanation: {
    toolName: string;
    persona: string;
    shortcut: ShortcutKeycap;
    description: string;
    contextBarOptions: string[];
  };
  stepByStepInstructions: StepInstruction[];
  visualExamples: VisualExample[];
  guidedPractice: {
    title: string;
    taskDescription: string;
    checkpoints: string[];
    expectedOutcome: string;
  };
  independentChallenge: {
    title: string;
    prompt: string;
    starterAsset?: PracticeAssetInfo;
    challengeCriteria: string[];
    bonusGoal?: string;
  };
  commonPitfalls: PitfallItem[];
  knowledgeCheck: QuizQuestion[];
  summaryAndResources: {
    summaryPoints: string[];
    relatedResources: {
      title: string;
      target: string;
      type: 'doc' | 'asset' | 'next-lesson' | 'mcp-api';
    }[];
  };
}

export interface LessonSlide {
  id: string;
  slideNumber: number;
  type: SlideType;
  title: string;
  subtitle?: string;
  contentMarkdown: string;
  actionBox?: {
    label: string;
    text: string;
    shortcut?: ShortcutKeycap;
  };
  visual?: {
    type: 'diagram' | 'code' | 'badge-grid' | 'comparison' | 'callout';
    content: string;
  };
  quizData?: QuizQuestion;
  practiceData?: {
    prompt: string;
    starterAsset?: PracticeAssetInfo;
    checkpoints: string[];
  };
}

export interface CurriculumLesson {
  id: string; // e.g. "D01-01"
  moduleId: string; // e.g. "D01"
  trackId: AffinityTrackId;
  order: number; // 1, 2, 3
  title: string;
  subtitle: string;
  durationMinutes: number;
  difficulty: LessonDifficulty;
  standardSections: StandardLessonSections;
  slides: LessonSlide[];
}

export interface CurriculumModule {
  id: string; // e.g. "D01"
  trackId: AffinityTrackId;
  moduleNumber: string; // "D01"
  title: string;
  tagline: string;
  description: string;
  difficulty: LessonDifficulty;
  estimatedMinutes: number;
  prerequisites: string[];
  primaryPersona: string;
  starterAsset?: PracticeAssetInfo;
  lessons: CurriculumLesson[];
}

export interface CurriculumTrack {
  id: AffinityTrackId;
  title: string;
  tagline: string;
  description: string;
  accentColor: string;
  iconName: string;
  moduleCount: number;
  lessonCount: number;
  modules: CurriculumModule[];
}
