import { DEFAULT_LUMINA_PROJECT, CAPSTONE_RUBRIC_DIMENSIONS } from './capstone-service';
import { getSupabaseClient } from './supabase/client';
import type { Database, Json } from '../types/database.types';
import type { CapstoneSubmissionRecord, OfficialEvaluationResult, SubmissionArtifacts, StudentSelfAssessment, RubricDimensionId, RubricLevelId } from '../types/capstone';

type Submission = Database['public']['Tables']['assessment_submissions']['Row'];
type Result = Database['public']['Tables']['assessment_results']['Row'];

function client() {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error('Dịch vụ hồ sơ chưa được cấu hình.');
  return supabase;
}

function mapSubmission(row: Submission, result?: Result): CapstoneSubmissionRecord {
  let official: OfficialEvaluationResult | undefined;
  if (result) {
    const payload = result.official_scores_json as unknown as {
      scores: OfficialEvaluationResult['scores'];
      feedback: OfficialEvaluationResult['dimensionFeedback'];
      criticalFailures?: string[];
    };
    official = {
      evaluatorId: result.evaluator_id ?? '', evaluatorName: result.evaluator_name,
      scores: payload.scores ?? {} as OfficialEvaluationResult['scores'],
      dimensionFeedback: payload.feedback ?? {} as OfficialEvaluationResult['dimensionFeedback'],
      overallFeedback: result.evaluator_notes ?? '', weightedScore: Number(result.total_weighted_score),
      passed: result.is_passed, criticalViolations: (payload.criticalFailures ?? []).map(id =>
        CAPSTONE_RUBRIC_DIMENSIONS.find(dimension => dimension.id === id)?.titleVi ?? id),
      evaluatedAt: result.created_at, certificateId: result.certificate_id ?? undefined, isOfficial: true,
    };
  }
  return {
    id: row.id, projectId: row.assessment_id, studentId: row.user_id, studentName: '',
    version: row.version, status: official ? official.passed ? 'approved' : 'needs_revision' : 'submitted',
    artifacts: row.artifacts_json as unknown as SubmissionArtifacts,
    selfAssessment: row.self_assessment_json as unknown as StudentSelfAssessment,
    officialEvaluation: official, createdAt: row.created_at, updatedAt: row.updated_at,
  };
}

export async function listCloudSubmissions(userId?: string): Promise<CapstoneSubmissionRecord[]> {
  const supabase = client();
  const query = supabase.from('assessment_submissions').select('*').eq('assessment_id', DEFAULT_LUMINA_PROJECT.id)
    .order('submitted_at', { ascending: false }).limit(100);
  const { data, error } = await (userId ? query.eq('user_id', userId) : query);
  if (error) throw error;
  if (!data.length) return [];
  const { data: results, error: resultError } = await supabase.from('assessment_results')
    .select('*').in('submission_id', data.map(row => row.id));
  if (resultError) throw resultError;
  const bySubmission = new Map(results.map(row => [row.submission_id, row]));
  return data.map(row => mapSubmission(row, bySubmission.get(row.id)));
}

export async function submitCloudCapstone(files: SubmissionArtifacts, review: StudentSelfAssessment) {
  const { error } = await client().rpc('submit_lumina_capstone', {
    files: files as unknown as Json, self_review: review as unknown as Json,
  });
  if (error) throw error;
}

export async function gradeCloudCapstone(id: string, levels: Record<RubricDimensionId, RubricLevelId>,
  feedback: Record<RubricDimensionId, string>, notes: string): Promise<void> {
  const { error } = await client().rpc('evaluate_lumina_capstone', { submission: id, levels, feedback, notes });
  if (error) throw error;
}
