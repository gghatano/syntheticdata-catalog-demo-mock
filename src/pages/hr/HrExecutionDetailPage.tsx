import { useParams } from "react-router-dom";
import { EXECUTIONS } from "../../data/executions";
import { StatusBadge } from "../../components/common/StatusBadge";
import { ActionButton } from "../../components/common/ActionButton";
import { useToast } from "../../components/common/Toast";
import { formatDateTime } from "../../utils/format";
import { RESULT_SCOPE_LABELS } from "../../utils/data";

export function HrExecutionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const execution = EXECUTIONS.find((e) => e.execution_id === id);
  const { showToast } = useToast();

  if (!execution) return <p className="text-red-500">実行結果が見つかりません</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">実行詳細</h1>

      <section className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">実行情報</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-500">実行ID:</span> {execution.execution_id}</div>
          <div><span className="text-gray-500">提出物ID:</span> {execution.submission_id}</div>
          <div><span className="text-gray-500">実行モード:</span> {execution.mode === "synthetic" ? "合成データ" : "実データ"}</div>
          <div><span className="text-gray-500">ステータス:</span> <StatusBadge status={execution.status} /></div>
          <div><span className="text-gray-500">実行日時:</span> {formatDateTime(execution.created_at)}</div>
          <div><span className="text-gray-500">結果公開範囲:</span> {RESULT_SCOPE_LABELS[execution.result_scope]}</div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">標準出力</h2>
        <pre className="bg-gray-900 text-green-400 p-4 rounded text-xs overflow-x-auto whitespace-pre-wrap">
          {execution.stdout}
        </pre>
      </section>

      {execution.result_json && (
        <section className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3">実行結果</h2>
          <pre className="bg-gray-50 p-4 rounded text-xs overflow-x-auto">
            {JSON.stringify(execution.result_json, null, 2)}
          </pre>
        </section>
      )}

      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-3">結果公開設定</h2>
        <div className="flex gap-3 items-center">
          <select className="border border-gray-300 rounded px-3 py-2 text-sm">
            {Object.entries(RESULT_SCOPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <ActionButton onClick={() => showToast("公開設定を更新しました", "success")}>公開</ActionButton>
        </div>
      </section>
    </div>
  );
}
