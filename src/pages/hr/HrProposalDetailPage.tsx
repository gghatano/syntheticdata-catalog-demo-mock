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

      <section className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">提案情報</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-500">提案ID:</span> {proposal.proposal_id}</div>
          <div><span className="text-gray-500">データセット:</span> {getDatasetName(proposal.dataset_id)}</div>
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
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{proposal.report}</ReactMarkdown>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">コード</h2>
        <pre className="bg-gray-900 text-green-400 p-4 rounded text-xs overflow-x-auto">
          <code>{proposal.code}</code>
        </pre>
      </section>

      <section className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">レビュー履歴</h2>
        <ReviewList reviews={allReviews} />
      </section>

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
