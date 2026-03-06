import { Link } from "react-router-dom";
import { SUBMISSIONS } from "../../data/submissions";
import { loadState } from "../../store/session";
import { StatusBadge } from "../../components/common/StatusBadge";
import { DataTable } from "../../components/common/DataTable";
import { formatDate } from "../../utils/format";
import { getDatasetName, getEffectiveSubmissionStatus } from "../../utils/data";

export function ProposerSubmissionsPage() {
  const state = loadState();
  const userId = state.currentUserId;
  const mySubmissions = SUBMISSIONS.filter((s) => s.user_id === userId);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">提出物一覧</h1>
      <div className="bg-white rounded-lg shadow">
        <DataTable
          columns={[
            { header: "提出ID", accessor: (s) => s.submission_id },
            { header: "タイトル", accessor: (s) => s.title },
            { header: "データセット", accessor: (s) => getDatasetName(s.dataset_id) },
            { header: "ステータス", accessor: (s) => <StatusBadge status={getEffectiveSubmissionStatus(state, s)} /> },
            { header: "提出日", accessor: (s) => formatDate(s.created_at) },
            {
              header: "",
              accessor: (s) => (
                <Link to={`/proposer/submissions/${s.submission_id}`} className="text-blue-600 hover:underline text-sm">
                  詳細
                </Link>
              ),
            },
          ]}
          data={mySubmissions}
          emptyMessage="提出物はまだありません"
        />
      </div>
    </div>
  );
}
