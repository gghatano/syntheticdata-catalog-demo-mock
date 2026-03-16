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

const proseClasses = "prose prose-sm max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-strong:text-gray-800 prose-table:text-sm prose-th:bg-gray-50 prose-th:border prose-th:border-gray-200 prose-th:px-3 prose-th:py-1.5 prose-td:border prose-td:border-gray-200 prose-td:px-3 prose-td:py-1.5";

function CollapsibleSection({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <section className="bg-white rounded-lg shadow mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
      >
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && <div className="px-6 pb-6 border-t border-gray-100 pt-4">{children}</div>}
    </section>
  );
}

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

      {/* 提案情報 */}
      <section className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">提案情報</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-500">提案ID:</span> {proposal.proposal_id}</div>
          <div><span className="text-gray-500">データセット:</span> <Link to={`/proposer/datasets/${proposal.dataset_id}`} className="text-blue-600 hover:underline">{getDatasetName(proposal.dataset_id)}</Link></div>
          <div><span className="text-gray-500">ステータス:</span> <StatusBadge status={status} /></div>
          <div><span className="text-gray-500">提出日:</span> {formatDate(proposal.created_at)}</div>
        </div>
      </section>

      {/* 概要 */}
      <section className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">概要</h2>
        <p className="text-sm text-gray-700">{proposal.summary}</p>
      </section>

      {/* 背景と課題 */}
      <section className="bg-white rounded-lg shadow p-6 mb-6">
        <div className={proseClasses}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{proposal.background}</ReactMarkdown>
        </div>
      </section>

      {/* 期待される効果 */}
      <section className="bg-white rounded-lg shadow p-6 mb-6">
        <div className={proseClasses}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{proposal.expected_impact}</ReactMarkdown>
        </div>
      </section>

      {/* 分析アプローチ */}
      <section className="bg-white rounded-lg shadow p-6 mb-6">
        <div className={proseClasses}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{proposal.approach}</ReactMarkdown>
        </div>
      </section>

      {/* 結果と提言 */}
      <section className="bg-white rounded-lg shadow p-6 mb-6">
        <div className={proseClasses}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{proposal.business_results}</ReactMarkdown>
        </div>
      </section>

      {/* ネクストステップ */}
      <section className="bg-white rounded-lg shadow p-6 mb-6">
        <div className={proseClasses}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{proposal.next_steps}</ReactMarkdown>
        </div>
      </section>

      {/* 技術詳細（折りたたみ） */}
      <CollapsibleSection title="技術詳細">
        <div className={proseClasses}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{proposal.technical_detail}</ReactMarkdown>
        </div>
      </CollapsibleSection>

      {/* コード（折りたたみ） */}
      <CollapsibleSection title="コード">
        <pre className="bg-gray-900 text-green-400 p-4 rounded text-xs overflow-x-auto">
          <code>{proposal.code}</code>
        </pre>
      </CollapsibleSection>

      {/* レビューコメント */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-3">レビューコメント</h2>
        <ReviewList reviews={allReviews} />
      </section>
    </div>
  );
}
