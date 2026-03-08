import { useState } from "react";
import { Link } from "react-router-dom";
import { SUBMISSIONS } from "../../data/submissions";
import { EXECUTIONS } from "../../data/executions";
import { loadState, setSubmissionStatus } from "../../store/session";
import { StatusBadge } from "../../components/common/StatusBadge";
import { DataTable } from "../../components/common/DataTable";
import { ActionButton } from "../../components/common/ActionButton";
import { useToast } from "../../components/common/Toast";
import { formatDate } from "../../utils/format";
import { getUserDisplayName, getDatasetName, getEffectiveSubmissionStatus } from "../../utils/data";

export function HrSubmissionsPage() {
  const [state, setState] = useState(loadState);
  const { showToast } = useToast();

  const updateStatus = (submissionId: string, status: Parameters<typeof setSubmissionStatus>[2]) => {
    setState(setSubmissionStatus(state, submissionId, status));
  };

  const handleExecute = async (submissionId: string, mode: "synthetic" | "real") => {
    showToast(`${mode === "synthetic" ? "合成データ" : "実データ"}で実行中...`, "info");
    await new Promise((r) => setTimeout(r, 3000));
    updateStatus(submissionId, mode === "synthetic" ? "executed_synthetic" : "executed_real");
    showToast("実行が完了しました", "success");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">実データ利用管理</h1>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 text-sm text-yellow-800">
        合成データの分析はプロポーザーが承認不要で実行できます。ここでは<strong>実データ利用</strong>の承認・実行を管理します。
      </div>
      <div className="bg-white rounded-lg shadow">
        <DataTable
          columns={[
            { header: "提出ID", accessor: (s) => s.submission_id },
            { header: "タイトル", accessor: (s) => s.title },
            { header: "提出者", accessor: (s) => getUserDisplayName(s.user_id) },
            { header: "データセット", accessor: (s) => getDatasetName(s.dataset_id) },
            { header: "ステータス", accessor: (s) => <StatusBadge status={getEffectiveSubmissionStatus(state, s)} /> },
            { header: "提出日", accessor: (s) => formatDate(s.created_at) },
            {
              header: "操作（実データ利用）",
              accessor: (s) => {
                const status = getEffectiveSubmissionStatus(state, s);
                if (status === "submitted") {
                  return (
                    <div className="flex gap-2">
                      <ActionButton variant="success" onClick={() => updateStatus(s.submission_id, "approved")}>実データ利用を承認</ActionButton>
                      <ActionButton variant="danger" onClick={() => updateStatus(s.submission_id, "rejected")}>却下</ActionButton>
                    </div>
                  );
                }
                if (status === "approved") {
                  return (
                    <ActionButton onClick={() => handleExecute(s.submission_id, "real")}>実データで実行</ActionButton>
                  );
                }
                if (status === "executed_synthetic" || status === "executed_real") {
                  const exec = EXECUTIONS.find((e) => e.submission_id === s.submission_id);
                  return (
                    <Link to={`/hr/executions/${exec?.execution_id ?? "EXEC0001"}`} className="text-blue-600 hover:underline text-sm">
                      結果確認
                    </Link>
                  );
                }
                return null;
              },
            },
          ]}
          data={SUBMISSIONS}
        />
      </div>
    </div>
  );
}
