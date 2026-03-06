import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { PROPOSALS } from "../../data/proposals";
import { loadState } from "../../store/session";
import { StatusBadge } from "../../components/common/StatusBadge";
import { ReviewList } from "../../components/common/ReviewList";
import { formatDate } from "../../utils/format";
import { getDatasetName, getEffectiveProposalStatus } from "../../utils/data";

export function ProposerProposalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const proposal = PROPOSALS.find((p) => p.proposal_id === id);
  const state = loadState();

  if (!proposal) return <p className="text-red-500">提案が見つかりません</p>;

  const status = getEffectiveProposalStatus(state, proposal);
  const addedReviews = state.mutations.addedReviews[proposal.proposal_id] ?? [];
  const allReviews = [...proposal.reviews, ...addedReviews];

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
          <ReactMarkdown>{proposal.report}</ReactMarkdown>
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
