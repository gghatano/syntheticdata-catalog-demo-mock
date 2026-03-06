import { USERS } from "../data/users";
import { DATASETS } from "../data/datasets";
import { DemoState } from "../store/session";
import { Dataset, Submission, Proposal, SubmissionStatus, ProposalStatus, FileType } from "../types/models";

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
  employee_master: "従業員マスタ",
  project_allocation: "プロジェクト配置",
  working_hours: "稼働時間",
};

export const RESULT_SCOPE_LABELS: Record<string, string> = {
  private: "非公開",
  submitter: "提出者のみ",
  public: "全体公開",
};
