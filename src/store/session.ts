import {
  SubmissionStatus,
  ProposalStatus,
  ReviewComment,
  CatalogColumn,
} from "../types/models";

export interface DemoState {
  currentUserId: string | null;
  mutations: {
    datasetPublished: Record<string, boolean>;
    submissionStatus: Record<string, SubmissionStatus>;
    proposalStatus: Record<string, ProposalStatus>;
    addedReviews: Record<string, ReviewComment[]>;
    votedRequests: string[];
    catalogEdits: Record<string, Partial<CatalogColumn>[]>;
    likedDatasets: string[];
    likedProposals: string[];
  };
}

const STORAGE_KEY = "syntheticdata-demo-state";

function defaultState(): DemoState {
  return {
    currentUserId: null,
    mutations: {
      datasetPublished: {},
      submissionStatus: {},
      proposalStatus: {},
      addedReviews: {},
      votedRequests: [],
      catalogEdits: {},
      likedDatasets: [],
      likedProposals: [],
    },
  };
}

export function loadState(): DemoState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return { ...defaultState(), ...parsed, mutations: { ...defaultState().mutations, ...parsed.mutations } };
  } catch {
    return defaultState();
  }
}

export function saveState(state: DemoState): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetState(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function login(userId: string): void {
  const state = loadState();
  state.currentUserId = userId;
  saveState(state);
}

export function logout(): void {
  const state = loadState();
  state.currentUserId = null;
  saveState(state);
}

export function getCurrentUserId(): string | null {
  return loadState().currentUserId;
}

export function publishDataset(state: DemoState, datasetId: string): DemoState {
  const newState = {
    ...state,
    mutations: {
      ...state.mutations,
      datasetPublished: { ...state.mutations.datasetPublished, [datasetId]: true },
    },
  };
  saveState(newState);
  return newState;
}

export function setSubmissionStatus(state: DemoState, submissionId: string, status: SubmissionStatus): DemoState {
  const newState = {
    ...state,
    mutations: {
      ...state.mutations,
      submissionStatus: { ...state.mutations.submissionStatus, [submissionId]: status },
    },
  };
  saveState(newState);
  return newState;
}

export function setProposalStatus(state: DemoState, proposalId: string, status: ProposalStatus): DemoState {
  const newState = {
    ...state,
    mutations: {
      ...state.mutations,
      proposalStatus: { ...state.mutations.proposalStatus, [proposalId]: status },
    },
  };
  saveState(newState);
  return newState;
}

export function addReview(state: DemoState, proposalId: string, review: ReviewComment): DemoState {
  const existing = state.mutations.addedReviews[proposalId] ?? [];
  const newState = {
    ...state,
    mutations: {
      ...state.mutations,
      addedReviews: { ...state.mutations.addedReviews, [proposalId]: [...existing, review] },
    },
  };
  saveState(newState);
  return newState;
}

export function addVote(state: DemoState, requestId: string): DemoState {
  if (state.mutations.votedRequests.includes(requestId)) return state;
  const newState = {
    ...state,
    mutations: {
      ...state.mutations,
      votedRequests: [...state.mutations.votedRequests, requestId],
    },
  };
  saveState(newState);
  return newState;
}

export function toggleDatasetLike(state: DemoState, datasetId: string): DemoState {
  const liked = state.mutations.likedDatasets.includes(datasetId);
  const newLiked = liked
    ? state.mutations.likedDatasets.filter((id) => id !== datasetId)
    : [...state.mutations.likedDatasets, datasetId];
  const newState = {
    ...state,
    mutations: { ...state.mutations, likedDatasets: newLiked },
  };
  saveState(newState);
  return newState;
}

export function toggleProposalLike(state: DemoState, proposalId: string): DemoState {
  const liked = state.mutations.likedProposals.includes(proposalId);
  const newLiked = liked
    ? state.mutations.likedProposals.filter((id) => id !== proposalId)
    : [...state.mutations.likedProposals, proposalId];
  const newState = {
    ...state,
    mutations: { ...state.mutations, likedProposals: newLiked },
  };
  saveState(newState);
  return newState;
}
