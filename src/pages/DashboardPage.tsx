import { Link } from "react-router-dom";
import { USERS } from "../data/users";
import { DATASETS } from "../data/datasets";
import { PROPOSALS } from "../data/proposals";
import { loadState } from "../store/session";
import { StatusBadge, PublishBadge } from "../components/common/StatusBadge";
import { DataTable } from "../components/common/DataTable";
import { formatDate } from "../utils/format";
import { ActionButton } from "../components/common/ActionButton";
import { getUserDisplayName, getPublishedDatasets, getEffectiveProposalStatus, isEffectivelyPublished } from "../utils/data";

export function DashboardPage() {
  const state = loadState();
  const userId = state.currentUserId;
  const user = USERS.find((u) => u.user_id === userId);

  if (!user) return null;

  if (user.role === "hr") {
    const recentDatasets = DATASETS.slice(0, 5);
    const pendingProposals = PROPOSALS.filter(
      (p) => getEffectiveProposalStatus(state, p) === "submitted"
    );

    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">ダッシュボード</h1>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">最近のデータセット</h2>
          <div className="bg-white rounded-lg shadow">
            <DataTable
              columns={[
                { header: "名前", accessor: (d) => d.name },
                { header: "状態", accessor: (d) => <PublishBadge isPublished={isEffectivelyPublished(state, d)} /> },
                { header: "作成日", accessor: (d) => formatDate(d.created_at) },
                {
                  header: "",
                  accessor: (d) => (
                    <Link to={`/hr/datasets/${d.dataset_id}`} className="text-blue-600 hover:underline text-sm">
                      詳細
                    </Link>
                  ),
                },
              ]}
              data={recentDatasets}
            />
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">レビュー待ち提案</h2>
          <div className="bg-white rounded-lg shadow">
            <DataTable
              columns={[
                { header: "提案ID", accessor: (p) => p.proposal_id },
                { header: "タイトル", accessor: (p) => p.title },
                { header: "提案者", accessor: (p) => getUserDisplayName(p.user_id) },
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
              data={pendingProposals}
              emptyMessage="レビュー待ちの提案はありません"
            />
          </div>
        </section>
      </div>
    );
  }

  // Proposer view
  const publishedDatasets = getPublishedDatasets(state).slice(0, 5);
  const myProposals = PROPOSALS.filter((p) => p.user_id === userId);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">ダッシュボード</h1>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">公開データセット</h2>
        <div className="bg-white rounded-lg shadow">
          <DataTable
            columns={[
              { header: "名前", accessor: (d) => d.name },
              { header: "作成日", accessor: (d) => formatDate(d.created_at) },
              {
                header: "",
                accessor: (d) => (
                  <Link to={`/proposer/datasets/${d.dataset_id}`} className="text-blue-600 hover:underline text-sm">
                    詳細
                  </Link>
                ),
              },
            ]}
            data={publishedDatasets}
          />
        </div>
      </section>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-700">自分の提案</h2>
          <Link to="/proposer/proposals/new">
            <ActionButton>新規提案を作成</ActionButton>
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow">
          <DataTable
            columns={[
              { header: "提案ID", accessor: (p) => p.proposal_id },
              { header: "タイトル", accessor: (p) => p.title },
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
      </section>
    </div>
  );
}
