export type UserRole = "hr" | "proposer" | "admin";

export type FileType = "employee_master" | "project_allocation" | "working_hours";

export type SubmissionStatus =
  | "draft" | "submitted" | "validation_failed" | "under_review"
  | "approved" | "rejected"
  | "executed_synthetic" | "executed_real" | "execution_failed";

export type ProposalStatus =
  | "draft" | "submitted" | "under_review"
  | "approved" | "rejected"
  | "executed_synthetic" | "executed_real" | "execution_failed";

export type ReviewAction = "approve" | "reject" | "comment";

export type ExecutionMode = "synthetic" | "real";

export type DataRequestStatus = "open" | "in_progress" | "completed" | "closed";

export interface User {
  user_id: string;
  display_name: string;
  role: UserRole;
  department: string;
}

export interface DatasetFile {
  file_type: FileType;
  file_path: string;
  created_at: string;
}

export interface SyntheticArtifact {
  file_type: FileType;
  file_path: string;
  seed: number;
  created_at: string;
}

export interface FileQualityReport {
  file_type: FileType;
  row_count_original: number;
  row_count_synthetic: number;
  column_correlation: number;
  distribution_similarity: number;
  statistical_parity: number;
}

export interface QualityReport {
  overall_score: number;
  file_reports: FileQualityReport[];
}

export interface ColumnStats {
  count: number;
  null_count: number;
  unique_count: number;
  min?: number | string;
  max?: number | string;
  mean?: number;
  std?: number;
  histogram?: { bins: string[]; counts: number[] };
}

export interface CatalogColumn {
  column_name: string;
  inferred_type: string;
  is_pii: boolean;
  pii_reason: string | null;
  description: string;
  stats: ColumnStats;
}

// --- データカタログ拡張: サンプルテーブル・ユースケース・グラフ ---

export type ColumnDataType = "string" | "integer" | "number" | "date" | "datetime" | "boolean";

export interface SampleColumnDef {
  name: string;
  type: ColumnDataType;
  displayName: string;
  description?: string;
  nullable?: boolean;
  format?: string;
}

export interface SampleForeignKey {
  columns: string[];
  referenceTable: string;
  referenceColumns: string[];
}

export interface SampleTable {
  tableName: string;
  description: string;
  columns: SampleColumnDef[];
  rows: Record<string, unknown>[];
  primaryKey: string[];
  foreignKeys: SampleForeignKey[];
}

export interface DatasetUseCase {
  title: string;
  description: string;
  relatedGraphId?: string | null;
}

export interface DatasetGraph {
  id: string;
  title: string;
  type: "bar" | "line" | "pie" | "doughnut" | "radar" | "scatter";
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    tension?: number;
  }[];
}

export interface Dataset {
  dataset_id: string;
  name: string;
  owner_user_id: string;
  is_published: boolean;
  description: string;
  tags: string[];
  created_at: string;
  files: DatasetFile[];
  synthetic_artifacts: SyntheticArtifact[];
  quality_report: QualityReport | null;
  catalog: CatalogColumn[];
  // データカタログ拡張フィールド
  sampleTables?: SampleTable[];
  useCases?: DatasetUseCase[];
  graphs?: DatasetGraph[];
}

export interface Submission {
  submission_id: string;
  dataset_id: string;
  user_id: string;
  title: string;
  description: string;
  status: SubmissionStatus;
  created_at: string;
}

export interface Execution {
  execution_id: string;
  submission_id: string;
  executor_user_id: string;
  mode: ExecutionMode;
  status: "queued" | "running" | "succeeded" | "failed" | "timeout";
  stdout: string;
  result_json: Record<string, unknown> | null;
  result_scope: "private" | "submitter" | "public";
  created_at: string;
}

export interface ReviewComment {
  id: number;
  reviewer_user_id: string;
  action: ReviewAction;
  comment: string;
  created_at: string;
}

export interface Proposal {
  proposal_id: string;
  dataset_id: string;
  user_id: string;
  title: string;
  summary: string;
  background: string;
  expected_impact: string;
  approach: string;
  business_results: string;
  next_steps: string;
  technical_detail: string;
  code: string;
  status: ProposalStatus;
  reviews: ReviewComment[];
  created_at: string;
}

export interface DataRequest {
  request_id: string;
  user_id: string;
  title: string;
  description: string;
  desired_columns: string | null;
  showcase_proposal_id: string | null;
  status: DataRequestStatus;
  vote_count: number;
  created_at: string;
}
