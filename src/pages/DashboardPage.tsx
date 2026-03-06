import { useState } from "react";
import { Link } from "react-router-dom";
import { USERS } from "../data/users";
import { DATASETS } from "../data/datasets";
import { PROPOSALS } from "../data/proposals";
import { SUBMISSIONS } from "../data/submissions";
import { loadState, toggleDatasetLike, toggleProposalLike } from "../store/session";
import { StatusBadge } from "../components/common/StatusBadge";
import {
  getUserDisplayName,
  getPublishedDatasets,
  getEffectiveProposalStatus,
  getEffectiveSubmissionStatus,
  getDatasetName,
  getDatasetLikeCount,
  getProposalLikeCount,
  getDatasetUseCases,
  getDatasetSampleTables,
} from "../utils/data";

function HeartIcon({ liked, className = "w-4 h-4" }: { liked: boolean; className?: string }) {
  if (liked) {
    return (
      <svg className={`${className} text-red-500 fill-current`} viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    );
  }
  return (
    <svg className={`${className} text-gray-400 hover:text-red-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function StatCard({ icon, count, label, gradient }: { icon: React.ReactNode; count: number; label: string; gradient: string }) {
  return (
    <div className={`rounded-xl p-5 ${gradient} shadow-sm`}>
      <div className="flex items-center gap-3">
        <div className="text-white/80">{icon}</div>
        <div>
          <div className="text-2xl font-bold text-white">{count}</div>
          <div className="text-sm text-white/80">{label}</div>
        </div>
      </div>
    </div>
  );
}

const DatabaseIcon = (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
    <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
  </svg>
);

const LightbulbIcon = (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path d="M9 21h6M12 3a6 6 0 014 10.47V17a1 1 0 01-1 1H9a1 1 0 01-1-1v-3.53A6 6 0 0112 3z" />
  </svg>
);

const UserIcon = (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const HeartStatIcon = (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const ClipboardIcon = (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const CheckIcon = (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export function DashboardPage() {
  const [refresh, setRefresh] = useState(0);
  void refresh;
  const state = loadState();
  const userId = state.currentUserId;
  const user = USERS.find((u) => u.user_id === userId);

  if (!user) return null;

  const handleDatasetLike = (e: React.MouseEvent, datasetId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const s = loadState();
    toggleDatasetLike(s, datasetId);
    setRefresh((r) => r + 1);
  };

  const handleProposalLike = (e: React.MouseEvent, proposalId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const s = loadState();
    toggleProposalLike(s, proposalId);
    setRefresh((r) => r + 1);
  };

  const publishedDatasets = getPublishedDatasets(state);
  const isHr = user.role === "hr";
  const basePath = isHr ? "/hr" : "/proposer";

  // Shared: recent published datasets sorted by created_at desc
  const recentDatasets = [...publishedDatasets]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 6);

  // Shared: recent proposals sorted by created_at desc
  const recentProposals = [...PROPOSALS]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 6);

  // Popular proposals sorted by like count desc
  const popularProposals = [...PROPOSALS]
    .sort((a, b) => getProposalLikeCount(state, b.proposal_id) - getProposalLikeCount(state, a.proposal_id))
    .slice(0, 5);

  // Pending items
  const pendingProposals = PROPOSALS.filter(
    (p) => getEffectiveProposalStatus(state, p) === "submitted"
  );
  const pendingSubmissions = SUBMISSIONS.filter(
    (s) => getEffectiveSubmissionStatus(state, s) === "submitted"
  );

  // Proposer-specific
  const myProposals = PROPOSALS.filter((p) => p.user_id === userId);
  const myPendingProposals = myProposals.filter(
    (p) => getEffectiveProposalStatus(state, p) === "submitted"
  );
  const myPendingSubmissions = SUBMISSIONS.filter(
    (s) => s.user_id === userId && getEffectiveSubmissionStatus(state, s) === "submitted"
  );
  const communityLikes = myProposals.reduce(
    (sum, p) => sum + getProposalLikeCount(state, p.proposal_id), 0
  );

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
        <h1 className="text-2xl font-bold text-gray-800">
          おかえりなさい、{user.display_name}さん
        </h1>
        <p className="text-gray-500 mt-1">
          {isHr ? "データセットとレビューの状況を確認しましょう" : "データの活用状況をチェックしましょう"}
        </p>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {isHr ? (
          <>
            <StatCard icon={DatabaseIcon} count={DATASETS.length} label="総データセット数" gradient="bg-gradient-to-br from-blue-500 to-blue-600" />
            <StatCard icon={CheckIcon} count={publishedDatasets.length} label="公開済み" gradient="bg-gradient-to-br from-green-500 to-green-600" />
            <StatCard icon={ClipboardIcon} count={pendingProposals.length} label="レビュー待ち提案" gradient="bg-gradient-to-br from-purple-500 to-purple-600" />
            <StatCard icon={LightbulbIcon} count={pendingSubmissions.length} label="レビュー待ち提出物" gradient="bg-gradient-to-br from-orange-500 to-orange-600" />
          </>
        ) : (
          <>
            <StatCard icon={DatabaseIcon} count={publishedDatasets.length} label="公開データセット" gradient="bg-gradient-to-br from-blue-500 to-blue-600" />
            <StatCard icon={LightbulbIcon} count={PROPOSALS.length} label="活用提案" gradient="bg-gradient-to-br from-green-500 to-green-600" />
            <StatCard icon={UserIcon} count={myProposals.length} label="自分の提案" gradient="bg-gradient-to-br from-purple-500 to-purple-600" />
            <StatCard icon={HeartStatIcon} count={communityLikes} label="コミュニティいいね" gradient="bg-gradient-to-br from-orange-500 to-orange-600" />
          </>
        )}
      </div>

      {/* Workflow / Pending Items */}
      {isHr ? (
        (pendingProposals.length > 0 || pendingSubmissions.length > 0) && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h2 className="text-sm font-semibold text-amber-800 mb-3">レビュー待ちワークフロー</h2>
            <div className="space-y-2">
              {pendingProposals.map((p) => (
                <Link key={p.proposal_id} to={`/hr/proposals/${p.proposal_id}`} className="flex items-center justify-between bg-white rounded-lg px-4 py-2 hover:bg-amber-50 transition">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-sm text-gray-700">{p.title}</span>
                    <span className="text-xs text-gray-400">by {getUserDisplayName(p.user_id)}</span>
                  </div>
                  <span className="text-xs text-amber-600 font-medium">提案レビュー</span>
                </Link>
              ))}
              {pendingSubmissions.map((s) => (
                <Link key={s.submission_id} to={`/hr/submissions/${s.submission_id}`} className="flex items-center justify-between bg-white rounded-lg px-4 py-2 hover:bg-amber-50 transition">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-sm text-gray-700">{s.title}</span>
                    <span className="text-xs text-gray-400">by {getUserDisplayName(s.user_id)}</span>
                  </div>
                  <span className="text-xs text-amber-600 font-medium">提出物レビュー</span>
                </Link>
              ))}
            </div>
          </div>
        )
      ) : (
        (myPendingProposals.length > 0 || myPendingSubmissions.length > 0) && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h2 className="text-sm font-semibold text-amber-800 mb-3">ワークフロー</h2>
            <div className="space-y-2">
              {myPendingProposals.map((p) => (
                <Link key={p.proposal_id} to={`/proposer/proposals/${p.proposal_id}`} className="flex items-center justify-between bg-white rounded-lg px-4 py-2 hover:bg-amber-50 transition">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-sm text-gray-700">{p.title}</span>
                  </div>
                  <span className="text-xs text-amber-600 font-medium">レビュー待ち</span>
                </Link>
              ))}
              {myPendingSubmissions.map((s) => (
                <Link key={s.submission_id} to={`/proposer/submissions/${s.submission_id}`} className="flex items-center justify-between bg-white rounded-lg px-4 py-2 hover:bg-amber-50 transition">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-sm text-gray-700">{s.title}</span>
                  </div>
                  <span className="text-xs text-amber-600 font-medium">提出物レビュー待ち</span>
                </Link>
              ))}
            </div>
          </div>
        )
      )}

      {/* Recent Datasets */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">最近のデータセット</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentDatasets.map((d) => {
            const tables = getDatasetSampleTables(d.dataset_id);
            const useCases = getDatasetUseCases(d.dataset_id);
            const likeCount = getDatasetLikeCount(state, d.dataset_id);
            const isLiked = state.mutations.likedDatasets.includes(d.dataset_id);
            return (
              <Link
                key={d.dataset_id}
                to={`${basePath}/datasets/${d.dataset_id}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition border-t-4 border-blue-400 p-5 flex flex-col"
              >
                <h3 className="font-bold text-gray-800 mb-1">{d.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{d.description}</p>
                {d.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {d.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                )}
                <div className="mt-auto flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-3">
                    <span>{tables.length} テーブル</span>
                    <span>{useCases.length} ユースケース</span>
                  </div>
                  <button
                    onClick={(e) => handleDatasetLike(e, d.dataset_id)}
                    className="flex items-center gap-1 hover:scale-110 transition-transform"
                  >
                    <HeartIcon liked={isLiked} />
                    <span className={isLiked ? "text-red-500" : ""}>{likeCount}</span>
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Popular Proposals (Featured Use Cases) */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">注目のユースケース</h2>
        <div className="space-y-3">
          {popularProposals.map((p) => {
            const likeCount = getProposalLikeCount(state, p.proposal_id);
            const isLiked = state.mutations.likedProposals.includes(p.proposal_id);
            return (
              <Link
                key={p.proposal_id}
                to={`${basePath}/proposals/${p.proposal_id}`}
                className="flex items-center justify-between bg-white rounded-xl shadow-sm hover:shadow-md transition p-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="min-w-0">
                    <h3 className="font-medium text-gray-800 truncate">{p.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full truncate">{getDatasetName(p.dataset_id)}</span>
                      <span className="text-xs text-gray-400">{getUserDisplayName(p.user_id)}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => handleProposalLike(e, p.proposal_id)}
                  className="flex items-center gap-1 ml-4 shrink-0 hover:scale-110 transition-transform"
                >
                  <HeartIcon liked={isLiked} />
                  <span className={`text-sm ${isLiked ? "text-red-500" : "text-gray-400"}`}>{likeCount}</span>
                </button>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent Community Proposals */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {isHr ? "コミュニティ活動" : "最近の活用提案"}
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {recentProposals.map((p) => {
            const likeCount = getProposalLikeCount(state, p.proposal_id);
            const isLiked = state.mutations.likedProposals.includes(p.proposal_id);
            const proposalUser = USERS.find((u) => u.user_id === p.user_id);
            return (
              <Link
                key={p.proposal_id}
                to={`${basePath}/proposals/${p.proposal_id}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-5 flex flex-col"
              >
                <h3 className="font-bold text-gray-800 mb-1">{p.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{p.summary}</p>
                <div className="mt-auto space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{getUserDisplayName(p.user_id)}</span>
                    {proposalUser && <span>({proposalUser.department})</span>}
                    <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{getDatasetName(p.dataset_id)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <StatusBadge status={getEffectiveProposalStatus(state, p)} />
                    <button
                      onClick={(e) => handleProposalLike(e, p.proposal_id)}
                      className="flex items-center gap-1 hover:scale-110 transition-transform"
                    >
                      <HeartIcon liked={isLiked} />
                      <span className={`text-sm ${isLiked ? "text-red-500" : "text-gray-400"}`}>{likeCount}</span>
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
