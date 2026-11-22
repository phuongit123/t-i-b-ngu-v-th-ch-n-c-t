/**
 * AFFINITY ACADEMY — CAPSTONE ASSESSMENT DATA SCHEMA
 * Architecture for TASK-081 / REQ-LEARN-003: Independent Competency Evaluation
 */

export type RubricDimensionId =
  | 'brief_interpretation'
  | 'visual_communication'
  | 'tool_selection'
  | 'non_destructive'
  | 'iteration_critique'
  | 'production_readiness'
  | 'independent_transfer';

export type RubricLevelId = 1 | 2 | 3 | 4;

export interface RubricLevelDescription {
  level: RubricLevelId;
  label: string;
  points: number; // 1 to 4
  description: string;
  behavioralIndicator: string;
}

export interface RubricDimension {
  id: RubricDimensionId;
  title: string;
  titleVi: string;
  mappedPlo: string;
  weightPercentage: number; // e.g. 15 for 15%
  isCritical: boolean; // Must reach Level >= 3 to pass
  requiredEvidence: string;
  levels: Record<RubricLevelId, RubricLevelDescription>;
}

export interface CapstoneProjectSpec {
  id: string;
  title: string;
  titleVi: string;
  clientName: string;
  scenarioOverview: string;
  targetAudience: string;
  technicalConstraints: string[];
  deliverableRequirements: Array<{
    id: string;
    name: string;
    format: string;
    description: string;
    isMandatory: boolean;
  }>;
  starterAssets: Array<{
    filename: string;
    filesize: string;
    filetype: string;
    description: string;
  }>;
}

export interface SubmissionArtifacts {
  briefDeconstructionUrl: string; // PLO-07
  iterationLogUrl: string; // PLO-08
  designRationaleUrl: string; // PLO-10
  vectorSourcePath: string; // .afdesign file
  pixelSourcePath: string; // .afphoto file
  printPdfPath: string; // PDF/X-4 CMYK
  digitalWebpPath: string; // WebP/PNG 2x
  additionalNotes?: string;
}

export interface StudentSelfAssessment {
  scores: Record<RubricDimensionId, RubricLevelId>;
  justifications: Record<RubricDimensionId, string>;
  submittedAt: string;
}

export interface OfficialEvaluationResult {
  evaluatorId: string;
  evaluatorName: string;
  scores: Record<RubricDimensionId, RubricLevelId>;
  dimensionFeedback: Record<RubricDimensionId, string>;
  overallFeedback: string;
  weightedScore: number; // 0 to 100
  passed: boolean;
  criticalViolations: string[];
  evaluatedAt: string;
  certificateId?: string;
  isOfficial: boolean;
}

export type SubmissionStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'needs_revision';

export interface CapstoneSubmissionRecord {
  id: string;
  projectId: string;
  studentId: string;
  studentName: string;
  version: number;
  status: SubmissionStatus;
  artifacts: SubmissionArtifacts;
  selfAssessment?: StudentSelfAssessment;
  officialEvaluation?: OfficialEvaluationResult;
  createdAt: string;
  updatedAt: string;
}

export interface SubmissionHistoryEntry {
  version: number;
  timestamp: string;
  artifacts: SubmissionArtifacts;
  selfAssessment?: StudentSelfAssessment;
  officialEvaluation?: OfficialEvaluationResult;
  changelogSummary: string;
}
