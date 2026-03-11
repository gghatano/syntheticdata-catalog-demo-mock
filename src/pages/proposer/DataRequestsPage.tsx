import { useState } from "react";
import { DATA_REQUESTS } from "../../data/data-requests";
import { PROPOSALS } from "../../data/proposals";
import { loadState, addVote } from "../../store/session";
import { StatusBadge } from "../../components/common/StatusBadge";
import { DataTable } from "../../components/common/DataTable";
import { ActionButton } from "../../components/common/ActionButton";
import { useToast } from "../../components/common/Toast";
import { getUserDisplayName } from "../../utils/data";

export function DataRequestsPage() {
  const [state, setState] = useState(loadState);
  const { showToast } = useToast();

  const handleVote = (requestId: string) => {
    setState(addVote(state, requestId));
    showToast("投票しました", "success");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">データ公開リクエスト</h1>

      <section className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">新規リクエスト</h2>
        <div className="space-y-3 max-w-2xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
            <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="リクエストのタイトル" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">説明</label>
            <textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-20" placeholder="どのようなデータが必要か説明してください" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">希望カラム（任意）</label>
            <textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-16" placeholder="カンマ区切りでカラム名を記入" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">参考ショーケース（任意）</label>
            <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
              <option value="">-- 選択してください --</option>
              {PROPOSALS.filter((p) => p.status === "approved").map((p) => (
                <option key={p.proposal_id} value={p.proposal_id}>{p.title}</option>
              ))}
            </select>
          </div>
          <ActionButton onClick={() => showToast("デモのため、投稿はシミュレーションです", "info")}>
            投稿
          </ActionButton>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow">
        <DataTable
          columns={[
            { header: "ID", accessor: (req) => req.request_id },
            {
              header: "タイトル・説明",
              accessor: (req) => (
                <div>
                  <p className="text-sm font-medium">{req.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{req.description.slice(0, 80)}...</p>
                </div>
              ),
            },
            { header: "投稿者", accessor: (req) => getUserDisplayName(req.user_id) },
            {
              header: "参考事例",
              accessor: (req) =>
                req.showcase_proposal_id
                  ? PROPOSALS.find((p) => p.proposal_id === req.showcase_proposal_id)?.title ?? "-"
                  : "-",
            },
            { header: "ステータス", accessor: (req) => <StatusBadge status={req.status} /> },
            {
              header: "投票",
              accessor: (req) => {
                const voted = state.mutations.votedRequests.includes(req.request_id);
                return <span className="font-medium">{req.vote_count + (voted ? 1 : 0)}</span>;
              },
            },
            {
              header: "",
              accessor: (req) => {
                const voted = state.mutations.votedRequests.includes(req.request_id);
                return (
                  <ActionButton
                    variant={voted ? "secondary" : "primary"}
                    disabled={voted}
                    onClick={() => handleVote(req.request_id)}
                  >
                    {voted ? "投票済み" : "投票"}
                  </ActionButton>
                );
              },
            },
          ]}
          data={DATA_REQUESTS}
        />
      </section>
    </div>
  );
}
