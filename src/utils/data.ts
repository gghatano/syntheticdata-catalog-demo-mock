import { USERS } from "../data/users";
import { DATASETS } from "../data/datasets";
import { CATALOG_DATA } from "../data/catalog-data";
import { DEFAULT_DATASET_LIKES, DEFAULT_PROPOSAL_LIKES } from "../data/likes";
import { DemoState } from "../store/session";
import { Dataset, Submission, Proposal, SubmissionStatus, ProposalStatus, FileType, SampleTable, DatasetUseCase, DatasetGraph } from "../types/models";

export function getUserDisplayName(userId: string): string {
  return USERS.find((u) => u.user_id === userId)?.display_name ?? userId;
}

export function getDatasetName(datasetId: string): string {
  return DATASETS.find((d) => d.dataset_id === datasetId)?.name ?? datasetId;
}

export function getPublishedDatasets(state: DemoState): Dataset[] {
  return DATASETS.filter(
    (d) => state.mutations.datasetPublished[d.dataset_id] ?? d.is_published
  );
}

export function isEffectivelyPublished(state: DemoState, dataset: Dataset): boolean {
  return state.mutations.datasetPublished[dataset.dataset_id] ?? dataset.is_published;
}

export function getEffectiveSubmissionStatus(state: DemoState, submission: Submission): SubmissionStatus {
  return state.mutations.submissionStatus[submission.submission_id] ?? submission.status;
}

export function getEffectiveProposalStatus(state: DemoState, proposal: Proposal): ProposalStatus {
  return state.mutations.proposalStatus[proposal.proposal_id] ?? proposal.status;
}

export const FILE_TYPE_LABELS: Record<FileType, string> = {
  employee_master: "行員マスタ",
  project_allocation: "店舗配置",
  working_hours: "勤務時間",
  account_transaction: "口座取引",
  loan_pipeline: "融資パイプライン",
  ib_access_log: "IBアクセスログ",
  atm_operation_log: "ATM稼働ログ",
  inquiry_tickets: "問い合わせチケット",
  communication_meta: "コミュニケーションメタ",
  expense_budget: "経費・予算",
};

export const RESULT_SCOPE_LABELS: Record<string, string> = {
  private: "非公開",
  submitter: "提出者のみ",
  public: "全体公開",
};

// カタログデータ取得ヘルパー
export function getDatasetSampleTables(datasetId: string): SampleTable[] {
  return CATALOG_DATA[datasetId]?.sampleTables ?? [];
}

export function getDatasetUseCases(datasetId: string): DatasetUseCase[] {
  return CATALOG_DATA[datasetId]?.useCases ?? [];
}

export function getDatasetGraphs(datasetId: string): DatasetGraph[] {
  return CATALOG_DATA[datasetId]?.graphs ?? [];
}

export function getDatasetLikeCount(state: DemoState, datasetId: string): number {
  const base = DEFAULT_DATASET_LIKES[datasetId] ?? 0;
  const userLiked = state.mutations.likedDatasets.includes(datasetId);
  return base + (userLiked ? 1 : 0);
}

export function getProposalLikeCount(state: DemoState, proposalId: string): number {
  const base = DEFAULT_PROPOSAL_LIKES[proposalId] ?? 0;
  const userLiked = state.mutations.likedProposals.includes(proposalId);
  return base + (userLiked ? 1 : 0);
}
