import { useState } from "react";
import { Link } from "react-router-dom";
import { PROPOSALS } from "../../data/proposals";
import { loadState } from "../../store/session";
import { StatusBadge } from "../../components/common/StatusBadge";
import { DataTable } from "../../components/common/DataTable";
import { ActionButton } from "../../components/common/ActionButton";
import { formatDate } from "../../utils/format";
import { getDatasetName, getUserDisplayName, getEffectiveProposalStatus } from "../../utils/data";

type Filter = "all" | "mine";
type StatusFilter = "all" | "submitted" | "approved" | "rejected";

const STATUS_FILTER_OPTIONS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "全ステータス" },
  { key: "submitted", label: "レビュー待ち" },
  { key: "approved", label: "承認" },
  { key: "rejected", label: "却下" },
];

export function ProposerProposalsPage() {
  const state = loadState();
  const userId = state.currentUserId;
  const [filter, setFilter] = useState<Filter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const proposals = PROPOSALS.filter((p) => {
    if (filter === "mine" && p.user_id !== userId) return false;
    if (statusFilter !== "all" && getEffectiveProposalStatus(state, p) !== statusFilter) return false;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">提案一覧</h1>
        <Link to="/proposals/new">
          <ActionButton>新規提案を作成</ActionButton>
        </Link>
      </div>

      {/* フィルタボタン */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          すべて
        </button>
        <button
          onClick={() => setFilter("mine")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            filter === "mine"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          マイ提案
        </button>
        <span className="border-l border-gray-300 mx-1" />
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
            { header: "提案ID", accessor: (p) => p.proposal_id },
            { header: "タイトル", accessor: (p) => (
              <span className="flex items-center gap-2">
                {p.title}
                {p.charts && p.charts.length > 0 && (
                  <span className="inline-flex items-center bg-indigo-100 text-indigo-700 text-xs px-1.5 py-0.5 rounded font-medium whitespace-nowrap">図表あり</span>
                )}
              </span>
            ) },
            { header: "提案者", accessor: (p) => getUserDisplayName(p.user_id) },
            { header: "データセット", accessor: (p) => getDatasetName(p.dataset_id) },
            { header: "ステータス", accessor: (p) => <StatusBadge status={getEffectiveProposalStatus(state, p)} /> },
            { header: "提出日", accessor: (p) => formatDate(p.created_at) },
            {
              header: "",
              accessor: (p) => (
                <Link to={`/proposals/${p.proposal_id}`} className="text-blue-600 hover:underline text-sm">
                  詳細
                </Link>
              ),
            },
          ]}
          data={proposals}
          emptyMessage="提案はまだありません"
        />
      </div>
    </div>
  );
}
