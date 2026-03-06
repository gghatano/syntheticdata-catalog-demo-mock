import { ReviewComment, ReviewAction } from "../../types/models";
import { getUserDisplayName } from "../../utils/data";
import { formatDate } from "../../utils/format";

const REVIEW_COLORS: Record<ReviewAction, string> = {
  approve: "border-l-green-500 bg-green-50",
  reject: "border-l-red-500 bg-red-50",
  comment: "border-l-blue-500 bg-blue-50",
};

export const REVIEW_LABELS: Record<ReviewAction, string> = {
  approve: "承認",
  reject: "差戻し",
  comment: "コメント",
};

export function ReviewList({ reviews }: { reviews: ReviewComment[] }) {
  if (reviews.length === 0) {
    return <p className="text-gray-500 text-sm">レビューはまだありません</p>;
  }

  return (
    <div className="space-y-3">
      {reviews.map((r) => (
        <div key={r.id} className={`border-l-4 p-3 rounded ${REVIEW_COLORS[r.action]}`}>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <span className="font-medium">{getUserDisplayName(r.reviewer_user_id)}</span>
            <span>({REVIEW_LABELS[r.action]})</span>
            <span>{formatDate(r.created_at)}</span>
          </div>
          <p className="text-sm whitespace-pre-wrap">{r.comment}</p>
        </div>
      ))}
    </div>
  );
}
