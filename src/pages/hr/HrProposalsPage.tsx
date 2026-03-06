import { Link } from "react-router-dom";
import { PROPOSALS } from "../../data/proposals";
import { loadState } from "../../store/session";
import { StatusBadge } from "../../components/common/StatusBadge";
import { DataTable } from "../../components/common/DataTable";
import { formatDate } from "../../utils/format";
import { getUserDisplayName, getDatasetName, getEffectiveProposalStatus } from "../../utils/data";

export function HrProposalsPage() {
  const state = loadState();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">提案管理</h1>
      <div className="bg-white rounded-lg shadow">
        <DataTable
          columns={[
            { header: "提案ID", accessor: (p) => p.proposal_id },
            { header: "タイトル", accessor: (p) => p.title },
            { header: "提案者", accessor: (p) => getUserDisplayName(p.user_id) },
            { header: "データセット", accessor: (p) => getDatasetName(p.dataset_id) },
            { header: "ステータス", accessor: (p) => <StatusBadge status={getEffectiveProposalStatus(state, p)} /> },
            { header: "提出日", accessor: (p) => formatDate(p.created_at) },
            {
              header: "",
              accessor: (p) => (
                <Link to={`/hr/proposals/${p.proposal_id}`} className="text-blue-600 hover:underline text-sm">
                  レビュー
                </Link>
              ),
            },
          ]}
          data={PROPOSALS}
        />
      </div>
    </div>
  );
}
