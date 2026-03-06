import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PROPOSALS } from "../../data/proposals";
import { USERS } from "../../data/users";
import { loadState, toggleProposalLike } from "../../store/session";
import { StatusBadge } from "../../components/common/StatusBadge";
import { ReviewList } from "../../components/common/ReviewList";
import { formatDate } from "../../utils/format";
import { getDatasetName, getUserDisplayName, getProposalLikeCount, getEffectiveProposalStatus } from "../../utils/data";

export function ProposerProposalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const proposal = PROPOSALS.find((p) => p.proposal_id === id);
  const state = loadState();
  const [, setRefresh] = useState(0);

  if (!proposal) return <p className="text-red-500">提案が見つかりません</p>;

  const status = getEffectiveProposalStatus(state, proposal);
  const addedReviews = state.mutations.addedReviews[proposal.proposal_id] ?? [];
  const allReviews = [...proposal.reviews, ...addedReviews];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{proposal.title}</h1>
          <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
            <span>{getUserDisplayName(proposal.user_id)}</span>
            {(() => { const u = USERS.find(u => u.user_id === proposal.user_id); return u ? <span className="text-gray-400">/ {u.department}</span> : null; })()}
            <span className="text-gray-300">|</span>
            <span>{formatDate(proposal.created_at)}</span>
          </div>
        </div>
        <button
          onClick={() => { toggleProposalLike(loadState(), proposal.proposal_id); setRefresh(r => r + 1); }}
          className="flex items-center gap-2 px-4 py-2 rounded-full border hover:bg-red-50 transition-colors"
        >
          {state.mutations.likedProposals.includes(proposal.proposal_id) ? (
            <svg className="w-5 h-5 text-red-500 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          ) : (
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          )}
          <span className="font-medium text-gray-700">{getProposalLikeCount(state, proposal.proposal_id)}</span>
        </button>
      </div>

      <section className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">提案情報</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-500">提案ID:</span> {proposal.proposal_id}</div>
          <div><span className="text-gray-500">データセット:</span> <Link to={`/proposer/datasets/${proposal.dataset_id}`} className="text-blue-600 hover:underline">{getDatasetName(proposal.dataset_id)}</Link></div>
          <div><span className="text-gray-500">ステータス:</span> <StatusBadge status={status} /></div>
          <div><span className="text-gray-500">提出日:</span> {formatDate(proposal.created_at)}</div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">概要</h2>
        <p className="text-sm text-gray-700">{proposal.summary}</p>
      </section>

      <section className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">レポート</h2>
        <div className="prose prose-sm max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-strong:text-gray-800 prose-table:text-sm prose-th:bg-gray-50 prose-th:border prose-th:border-gray-200 prose-th:px-3 prose-th:py-1.5 prose-td:border prose-td:border-gray-200 prose-td:px-3 prose-td:py-1.5 prose-pre:bg-gray-900 prose-code:text-green-600">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{proposal.report}</ReactMarkdown>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">コード</h2>
        <pre className="bg-gray-900 text-green-400 p-4 rounded text-xs overflow-x-auto">
          <code>{proposal.code}</code>
        </pre>
      </section>

      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-3">レビューコメント</h2>
        <ReviewList reviews={allReviews} />
      </section>
    </div>
  );
}
