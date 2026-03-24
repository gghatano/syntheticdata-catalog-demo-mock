import { useState } from "react";
import { Link } from "react-router-dom";
import { SUBMISSIONS } from "../../data/submissions";
import { loadState, setSubmissionStatus } from "../../store/session";
import { StatusBadge } from "../../components/common/StatusBadge";
import { DataTable } from "../../components/common/DataTable";
import { ActionButton } from "../../components/common/ActionButton";
import { useToast } from "../../components/common/Toast";
import { formatDate } from "../../utils/format";
import { getDatasetName, getUserDisplayName, getEffectiveSubmissionStatus } from "../../utils/data";

type TabKey = "all" | "mine";
type StatusFilter = "all" | "submitted" | "approved" | "executed_synthetic";

const STATUS_FILTER_OPTIONS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "全ステータス" },
  { key: "submitted", label: "レビュー待ち" },
  { key: "approved", label: "承認" },
  { key: "executed_synthetic", label: "実行済み" },
];

export function ProposerSubmissionsPage() {
  const [state, setState] = useState(loadState);
  const { showToast } = useToast();
  const userId = state.currentUserId;
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const displayedSubmissions = SUBMISSIONS.filter((s) => {
    if (activeTab === "mine" && s.user_id !== userId) return false;
    if (statusFilter !== "all" && getEffectiveSubmissionStatus(state, s) !== statusFilter) return false;
    return true;
  });

  const handleExecuteSynthetic = async (submissionId: string) => {
    showToast("合成データで実行中...", "info");
    await new Promise((r) => setTimeout(r, 2000));
    setState(setSubmissionStatus(state, submissionId, "executed_synthetic"));
    showToast("合成データでの実行が完了しました", "success");
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: "all", label: "すべて" },
    { key: "mine", label: "自分の分析実行" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">分析実行一覧</h1>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-800">
        合成データの分析は承認不要でいつでも実行できます。実データの利用はデータオーナーとの連携（HR承認）が必要です。
      </div>

      {/* タブ切り替え */}
      <div className="flex gap-1 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg border border-b-0 transition-colors ${
              activeTab === tab.key
                ? "bg-white text-blue-600 border-gray-300"
                : "bg-gray-100 text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ステータスフィルタ */}
      <div className="flex gap-2 mb-4">
        {STATUS_FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setStatusFilter(opt.key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
              statusFilter === opt.key
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {opt.label}
          </button>
        ))}
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
              header: "操作",
              accessor: (s) => {
                const status = getEffectiveSubmissionStatus(state, s);
                return (
                  <div className="flex items-center gap-2">
                    <Link to={`/submissions/${s.submission_id}`} className="text-blue-600 hover:underline text-sm">
                      詳細
                    </Link>
                    {status === "submitted" && s.user_id === userId && (
                      <ActionButton onClick={() => handleExecuteSynthetic(s.submission_id)}>
                        合成データで実行
                      </ActionButton>
                    )}
                  </div>
                );
              },
            },
          ]}
          data={displayedSubmissions}
          emptyMessage="分析実行リクエストはまだありません"
        />
      </div>
    </div>
  );
}
