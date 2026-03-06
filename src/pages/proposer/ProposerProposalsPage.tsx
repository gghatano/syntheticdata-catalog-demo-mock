import { Link } from "react-router-dom";
import { PROPOSALS } from "../../data/proposals";
import { loadState } from "../../store/session";
import { StatusBadge } from "../../components/common/StatusBadge";
import { DataTable } from "../../components/common/DataTable";
import { ActionButton } from "../../components/common/ActionButton";
import { formatDate } from "../../utils/format";
import { getDatasetName, getEffectiveProposalStatus } from "../../utils/data";

export function ProposerProposalsPage() {
  const state = loadState();
  const userId = state.currentUserId;
  const myProposals = PROPOSALS.filter((p) => p.user_id === userId);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">提案一覧</h1>
        <Link to="/proposer/proposals/new">
          <ActionButton>新規提案を作成</ActionButton>
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow">
        <DataTable
          columns={[
            { header: "提案ID", accessor: (p) => p.proposal_id },
            { header: "タイトル", accessor: (p) => p.title },
            { header: "データセット", accessor: (p) => getDatasetName(p.dataset_id) },
            { header: "ステータス", accessor: (p) => <StatusBadge status={getEffectiveProposalStatus(state, p)} /> },
            { header: "提出日", accessor: (p) => formatDate(p.created_at) },
            {
              header: "",
              accessor: (p) => (
                <Link to={`/proposer/proposals/${p.proposal_id}`} className="text-blue-600 hover:underline text-sm">
                  詳細
                </Link>
              ),
            },
          ]}
          data={myProposals}
          emptyMessage="提案はまだありません"
        />
      </div>
    </div>
  );
}
