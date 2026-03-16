import { useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PROPOSALS } from "../../data/proposals";
import { loadState, setProposalStatus, addReview } from "../../store/session";
import { StatusBadge } from "../../components/common/StatusBadge";
import { ActionButton } from "../../components/common/ActionButton";
import { ReviewList, REVIEW_LABELS } from "../../components/common/ReviewList";
import { useToast } from "../../components/common/Toast";
import { formatDate } from "../../utils/format";
import { getDatasetName, getEffectiveProposalStatus } from "../../utils/data";
import { ReviewAction, ReviewComment, ProposalStatus } from "../../types/models";

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

export function HrProposalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const proposal = PROPOSALS.find((p) => p.proposal_id === id);
  const { showToast } = useToast();
  const [state, setState] = useState(loadState);
  const [comment, setComment] = useState("");

  if (!proposal) return <p className="text-red-500">提案が見つかりません</p>;

  const status = getEffectiveProposalStatus(state, proposal);
  const addedReviews = state.mutations.addedReviews[proposal.proposal_id] ?? [];
  const allReviews = [...proposal.reviews, ...addedReviews];

  const submitReview = (action: ReviewAction) => {
    if (!comment.trim() && action !== "comment") {
      showToast("コメントを入力してください", "warning");
      return;
    }

    const newReview: ReviewComment = {
      id: allReviews.length + 1,
      reviewer_user_id: "hr_demo",
      action,
      comment: comment.trim() || `${REVIEW_LABELS[action]}しました`,
      created_at: new Date().toISOString(),
    };

    const statusMap: Record<ReviewAction, ProposalStatus> = {
      approve: "approved",
      reject: "rejected",
      comment: status,
    };

    let newState = setProposalStatus(state, proposal.proposal_id, statusMap[action]);
    newState = addReview(newState, proposal.proposal_id, newReview);
    setState(newState);
    setComment("");
    showToast(`${REVIEW_LABELS[action]}しました`, "success");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{proposal.title}</h1>

      {/* 提案情報 */}
      <section className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">提案情報</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-500">提案ID:</span> {proposal.proposal_id}</div>
          <div><span className="text-gray-500">データセット:</span> {getDatasetName(proposal.dataset_id)}</div>
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

      {/* レビュー履歴 */}
      <section className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">レビュー履歴</h2>
        <ReviewList reviews={allReviews} />
      </section>

      {/* レビューフォーム */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-3">レビューフォーム</h2>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="コメントを入力..."
          className="w-full border border-gray-300 rounded p-3 text-sm mb-3 h-24"
        />
        <div className="flex gap-3">
          <ActionButton variant="success" onClick={() => submitReview("approve")}>承認</ActionButton>
          <ActionButton variant="danger" onClick={() => submitReview("reject")}>差戻し</ActionButton>
          <ActionButton variant="secondary" onClick={() => submitReview("comment")}>コメントのみ</ActionButton>
        </div>
      </section>
    </div>
  );
}
