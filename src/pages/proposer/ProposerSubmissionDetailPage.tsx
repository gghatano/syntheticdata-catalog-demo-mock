import { useState } from "react";
import { useParams } from "react-router-dom";
import { SUBMISSIONS } from "../../data/submissions";
import { DATASETS } from "../../data/datasets";
import { EXECUTIONS } from "../../data/executions";
import { loadState, setSubmissionStatus, addReview } from "../../store/session";
import { StatusBadge } from "../../components/common/StatusBadge";
import { DataTable } from "../../components/common/DataTable";
import { ActionButton } from "../../components/common/ActionButton";
import { ReviewList, REVIEW_LABELS } from "../../components/common/ReviewList";
import { useToast } from "../../components/common/Toast";
import { formatDate, formatDateTime } from "../../utils/format";
import { getDatasetName, getUserDisplayName, getEffectiveSubmissionStatus } from "../../utils/data";
import { ReviewAction, ReviewComment, SubmissionStatus } from "../../types/models";

export function ProposerSubmissionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const submission = SUBMISSIONS.find((s) => s.submission_id === id);
  const [state, setState] = useState(loadState);
  const { showToast } = useToast();
  const [comment, setComment] = useState("");

  if (!submission) return <p className="text-red-500">分析実行リクエストが見つかりません</p>;

  const currentUserId = state.currentUserId;
  const dataset = DATASETS.find((d) => d.dataset_id === submission.dataset_id);
  const isOwner = dataset && currentUserId && dataset.owner_user_id === currentUserId;

  const handleExecuteSynthetic = async () => {
    showToast("合成データで実行中...", "info");
    await new Promise((r) => setTimeout(r, 2000));
    setState(setSubmissionStatus(state, submission.submission_id, "executed_synthetic"));
    showToast("合成データでの実行が完了しました", "success");
  };

  const status = getEffectiveSubmissionStatus(state, submission);
  const executions = EXECUTIONS.filter((e) => e.submission_id === submission.submission_id);
  const addedReviews = state.mutations.addedReviews[submission.submission_id] ?? [];
  const allReviews = [...addedReviews];

  const submitReview = (action: ReviewAction) => {
    if (!comment.trim() && action !== "comment") {
      showToast("コメントを入力してください", "warning");
      return;
    }

    const newReview: ReviewComment = {
      id: allReviews.length + 1,
      reviewer_user_id: currentUserId ?? "unknown",
      action,
      comment: comment.trim() || `${REVIEW_LABELS[action]}しました`,
      created_at: new Date().toISOString(),
    };

    const statusMap: Record<ReviewAction, SubmissionStatus> = {
      approve: "approved",
      reject: "rejected",
      comment: status,
    };

    let newState = setSubmissionStatus(state, submission.submission_id, statusMap[action]);
    newState = addReview(newState, submission.submission_id, newReview);
    setState(newState);
    setComment("");
    showToast(`${REVIEW_LABELS[action]}しました`, "success");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{submission.title}</h1>

      <section className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">分析実行リクエスト情報</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-500">提出ID:</span> {submission.submission_id}</div>
          <div><span className="text-gray-500">提出者:</span> {getUserDisplayName(submission.user_id)}</div>
          <div><span className="text-gray-500">データセット:</span> {getDatasetName(submission.dataset_id)}</div>
          <div><span className="text-gray-500">ステータス:</span> <StatusBadge status={status} /></div>
          <div><span className="text-gray-500">提出日:</span> {formatDate(submission.created_at)}</div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">説明</h2>
        <p className="text-sm text-gray-700">{submission.description}</p>
      </section>

      {status === "submitted" && submission.user_id === currentUserId && (
        <section className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3">実行</h2>
          <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4 text-sm text-blue-800">
            合成データの分析は承認不要でいつでも実行できます。実データの利用にはHR担当者による承認が必要です。
          </div>
          <ActionButton onClick={handleExecuteSynthetic}>
            合成データで実行
          </ActionButton>
        </section>
      )}

      {executions.length > 0 && (
        <section className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3">実行履歴</h2>
          <DataTable
            columns={[
              { header: "モード", accessor: (e) => e.mode === "synthetic" ? "合成データ" : "実データ" },
              { header: "ステータス", accessor: (e) => <StatusBadge status={e.status} /> },
              { header: "実行日", accessor: (e) => formatDateTime(e.created_at) },
            ]}
            data={executions}
          />
        </section>
      )}

      {executions.some((e) => e.result_json && e.result_scope !== "private") && (
        <section className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3">実行結果</h2>
          <pre className="bg-gray-50 p-4 rounded text-xs overflow-x-auto">
            {JSON.stringify(executions.find((e) => e.result_json)?.result_json, null, 2)}
          </pre>
        </section>
      )}

      {/* レビュー履歴 */}
      <section className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">レビュー履歴</h2>
        <ReviewList reviews={allReviews} />
      </section>

      {/* データオーナー向けレビューフォーム */}
      {isOwner && (status === "submitted" || status === "under_review") && (
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-3">レビューフォーム（データオーナー）</h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4 text-sm text-yellow-800">
            あなたはこのデータセットのオーナーです。実データ利用の承認・差戻しを行えます。
          </div>
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
      )}
    </div>
  );
}
