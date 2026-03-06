import { useParams } from "react-router-dom";
import { SUBMISSIONS } from "../../data/submissions";
import { EXECUTIONS } from "../../data/executions";
import { loadState } from "../../store/session";
import { StatusBadge } from "../../components/common/StatusBadge";
import { DataTable } from "../../components/common/DataTable";
import { formatDate, formatDateTime } from "../../utils/format";
import { getDatasetName, getEffectiveSubmissionStatus } from "../../utils/data";

export function ProposerSubmissionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const submission = SUBMISSIONS.find((s) => s.submission_id === id);
  const state = loadState();

  if (!submission) return <p className="text-red-500">提出物が見つかりません</p>;

  const status = getEffectiveSubmissionStatus(state, submission);
  const executions = EXECUTIONS.filter((e) => e.submission_id === submission.submission_id);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{submission.title}</h1>

      <section className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">提出物情報</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-500">提出ID:</span> {submission.submission_id}</div>
          <div><span className="text-gray-500">データセット:</span> {getDatasetName(submission.dataset_id)}</div>
          <div><span className="text-gray-500">ステータス:</span> <StatusBadge status={status} /></div>
          <div><span className="text-gray-500">提出日:</span> {formatDate(submission.created_at)}</div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">説明</h2>
        <p className="text-sm text-gray-700">{submission.description}</p>
      </section>

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
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-3">実行結果</h2>
          <pre className="bg-gray-50 p-4 rounded text-xs overflow-x-auto">
            {JSON.stringify(executions.find((e) => e.result_json)?.result_json, null, 2)}
          </pre>
        </section>
      )}
    </div>
  );
}
