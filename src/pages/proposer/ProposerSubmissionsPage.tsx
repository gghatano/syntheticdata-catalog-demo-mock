import { useState } from "react";
import { Link } from "react-router-dom";
import { SUBMISSIONS } from "../../data/submissions";
import { loadState, setSubmissionStatus } from "../../store/session";
import { StatusBadge } from "../../components/common/StatusBadge";
import { DataTable } from "../../components/common/DataTable";
import { ActionButton } from "../../components/common/ActionButton";
import { useToast } from "../../components/common/Toast";
import { formatDate } from "../../utils/format";
import { getDatasetName, getEffectiveSubmissionStatus } from "../../utils/data";

export function ProposerSubmissionsPage() {
  const [state, setState] = useState(loadState);
  const { showToast } = useToast();
  const userId = state.currentUserId;
  const mySubmissions = SUBMISSIONS.filter((s) => s.user_id === userId);

  const handleExecuteSynthetic = async (submissionId: string) => {
    showToast("合成データで実行中...", "info");
    await new Promise((r) => setTimeout(r, 2000));
    setState(setSubmissionStatus(state, submissionId, "executed_synthetic"));
    showToast("合成データでの実行が完了しました", "success");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">マイ分析実行一覧</h1>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-800">
        合成データの分析は承認不要でいつでも実行できます。実データの利用はデータオーナーとの連携（HR承認）が必要です。
      </div>
      <div className="bg-white rounded-lg shadow">
        <DataTable
          columns={[
            { header: "提出ID", accessor: (s) => s.submission_id },
            { header: "タイトル", accessor: (s) => s.title },
            { header: "データセット", accessor: (s) => getDatasetName(s.dataset_id) },
            { header: "ステータス", accessor: (s) => <StatusBadge status={getEffectiveSubmissionStatus(state, s)} /> },
            { header: "提出日", accessor: (s) => formatDate(s.created_at) },
            {
              header: "操作",
              accessor: (s) => {
                const status = getEffectiveSubmissionStatus(state, s);
                return (
                  <div className="flex items-center gap-2">
                    <Link to={`/proposer/submissions/${s.submission_id}`} className="text-blue-600 hover:underline text-sm">
                      詳細
                    </Link>
                    {status === "submitted" && (
                      <ActionButton onClick={() => handleExecuteSynthetic(s.submission_id)}>
                        合成データで実行
                      </ActionButton>
                    )}
                  </div>
                );
              },
            },
          ]}
          data={mySubmissions}
          emptyMessage="分析実行リクエストはまだありません"
        />
      </div>
    </div>
  );
}
