/**
 * AFFINITY ACADEMY — SUPABASE DATABASE TYPES
 * Generated & typed according to Postgres schema migrations 20261116000001 - 20261116000005
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'student' | 'evaluator' | 'admin';
export type LessonProgressStatus = 'not_started' | 'in_progress' | 'completed';
export type AssessmentType = 'capstone' | 'challenge' | 'milestone';
export type ResourceCategory = 'designer' | 'photo' | 'publisher' | 'scripting' | 'common';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string; // UUID references auth.users
          email: string;
          display_name: string;
          avatar_url: string | null;
          career_track: string;
          experience_level: string;
          shortcut_modifier: 'windows' | 'mac';
          auto_save_progress: boolean;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string;
          avatar_url?: string | null;
          career_track?: string;
          experience_level?: string;
          shortcut_modifier?: 'windows' | 'mac';
          auto_save_progress?: boolean;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string;
          avatar_url?: string | null;
          career_track?: string;
          experience_level?: string;
          shortcut_modifier?: 'windows' | 'mac';
          auto_save_progress?: boolean;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      tracks: {
        Row: {
          id: string;
          name: string;
          label_vi: string;
          tagline_vi: string;
          description_vi: string;
          order_index: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          label_vi: string;
          tagline_vi: string;
          description_vi: string;
          order_index?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          label_vi?: string;
          tagline_vi?: string;
          description_vi?: string;
          order_index?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      modules: {
        Row: {
          id: string;
          track_id: string;
          module_number: string;
          title_vi: string;
          title_en: string;
          description_vi: string;
          difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
          estimated_minutes: number;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          track_id: string;
          module_number: string;
          title_vi: string;
          title_en: string;
          description_vi: string;
          difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
          estimated_minutes?: number;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          track_id?: string;
          module_number?: string;
          title_vi?: string;
          title_en?: string;
          description_vi?: string;
          difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
          estimated_minutes?: number;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      lessons: {
        Row: {
          id: string;
          module_id: string;
          track_id: string;
          order_index: number;
          title_vi: string;
          title_en: string;
          duration_minutes: number;
          difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
          content_json: Json;
          practice_asset_path: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          module_id: string;
          track_id: string;
          order_index?: number;
          title_vi: string;
          title_en: string;
          duration_minutes?: number;
          difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
          content_json?: Json;
          practice_asset_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          module_id?: string;
          track_id?: string;
          order_index?: number;
          title_vi?: string;
          title_en?: string;
          duration_minutes?: number;
          difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
          content_json?: Json;
          practice_asset_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      learning_resources: {
        Row: {
          id: string;
          title: string;
          filename: string;
          category: ResourceCategory;
          extension: string;
          file_size_bytes: number;
          storage_path: string;
          is_public: boolean;
          download_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          filename: string;
          category: ResourceCategory;
          extension: string;
          file_size_bytes?: number;
          storage_path: string;
          is_public?: boolean;
          download_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          filename?: string;
          category?: ResourceCategory;
          extension?: string;
          file_size_bytes?: number;
          storage_path?: string;
          is_public?: boolean;
          download_count?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      lesson_progress: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          status: LessonProgressStatus;
          last_slide_index: number;
          quiz_score: number | null;
          completed_at: string | null;
          client_updated_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id: string;
          status?: LessonProgressStatus;
          last_slide_index?: number;
          quiz_score?: number | null;
          completed_at?: string | null;
          client_updated_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          lesson_id?: string;
          status?: LessonProgressStatus;
          last_slide_index?: number;
          quiz_score?: number | null;
          completed_at?: string | null;
          client_updated_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      assessments: {
        Row: {
          id: string;
          type: AssessmentType;
          title_vi: string;
          scenario_overview: string;
          rubric_spec: Json;
          starter_assets: Json;
          pass_threshold_score: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          type: AssessmentType;
          title_vi: string;
          scenario_overview: string;
          rubric_spec?: Json;
          starter_assets?: Json;
          pass_threshold_score?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          type?: AssessmentType;
          title_vi?: string;
          scenario_overview?: string;
          rubric_spec?: Json;
          starter_assets?: Json;
          pass_threshold_score?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      assessment_submissions: {
        Row: {
          id: string;
          user_id: string;
          assessment_id: string;
          version: number;
          artifacts_json: Json;
          self_assessment_json: Json;
          student_notes: string | null;
          submitted_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          assessment_id: string;
          version?: number;
          artifacts_json?: Json;
          self_assessment_json?: Json;
          student_notes?: string | null;
          submitted_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          assessment_id?: string;
          version?: number;
          artifacts_json?: Json;
          self_assessment_json?: Json;
          student_notes?: string | null;
          submitted_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      assessment_results: {
        Row: {
          id: string;
          submission_id: string;
          user_id: string;
          evaluator_id: string | null;
          evaluator_name: string;
          total_weighted_score: number;
          is_passed: boolean;
          official_scores_json: Json;
          evaluator_notes: string | null;
          certificate_id: string | null;
          certified_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          submission_id: string;
          user_id: string;
          evaluator_id?: string | null;
          evaluator_name?: string;
          total_weighted_score: number;
          is_passed?: boolean;
          official_scores_json?: Json;
          evaluator_notes?: string | null;
          certificate_id?: string | null;
          certified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          submission_id?: string;
          user_id?: string;
          evaluator_id?: string | null;
          evaluator_name?: string;
          total_weighted_score?: number;
          is_passed?: boolean;
          official_scores_json?: Json;
          evaluator_notes?: string | null;
          certificate_id?: string | null;
          certified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      submit_lumina_capstone: { Args: { files: Json; self_review: Json }; Returns: string };
      evaluate_lumina_capstone: { Args: { submission: string; levels: Json; feedback: Json; notes: string }; Returns: string };
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      is_evaluator_or_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
  };
}
