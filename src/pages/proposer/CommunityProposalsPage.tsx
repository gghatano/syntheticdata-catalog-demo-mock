import { useState } from "react";
import { Link } from "react-router-dom";
import { PROPOSALS } from "../../data/proposals";
import { USERS } from "../../data/users";
import { loadState, saveState, toggleProposalLike } from "../../store/session";
import { getUserDisplayName, getDatasetName, getProposalLikeCount, getEffectiveProposalStatus } from "../../utils/data";
import { StatusBadge } from "../../components/common/StatusBadge";
import { formatDate } from "../../utils/format";

const STATUS_BORDER_COLORS: Record<string, string> = {
  approved: "border-green-500",
  submitted: "border-blue-500",
  rejected: "border-red-500",
  draft: "border-gray-400",
};

export function CommunityProposalsPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "popular">("newest");
  const [, setRefresh] = useState(0);

  const state = loadState();

  const handleLike = (e: React.MouseEvent, proposalId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const currentState = loadState();
    const newState = toggleProposalLike(currentState, proposalId);
    saveState(newState);
    setRefresh(r => r + 1);
  };

  const filtered = PROPOSALS.filter((p) => {
    const q = search.toLowerCase();
    return !q || p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q);
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "popular") {
      return getProposalLikeCount(state, b.proposal_id) - getProposalLikeCount(state, a.proposal_id);
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">コミュニティ提案</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="タイトル・概要で検索..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "newest" | "popular")}
          className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="newest">新着順</option>
          <option value="popular">人気順</option>
        </select>
      </div>

      {sorted.length === 0 ? (
        <p className="text-gray-500 text-center py-12">該当する提案がありません</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sorted.map((proposal) => {
            const status = getEffectiveProposalStatus(state, proposal);
            const likeCount = getProposalLikeCount(state, proposal.proposal_id);
            const isLiked = state.mutations.likedProposals.includes(proposal.proposal_id);
            const borderColor = STATUS_BORDER_COLORS[status] ?? "border-gray-400";
            const user = USERS.find((u) => u.user_id === proposal.user_id);

            return (
              <Link
                key={proposal.proposal_id}
                to={`/proposer/proposals/${proposal.proposal_id}`}
                className={`block bg-white rounded-lg shadow hover:-translate-y-1 transition-transform border-l-4 ${borderColor} p-4`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h2 className="font-semibold text-gray-900 text-sm leading-snug flex-1">
                    {proposal.title}
                  </h2>
                  <StatusBadge status={status} />
                  {proposal.user_id === state.currentUserId && (
                    <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full font-medium">自分</span>
                  )}
                </div>

                <p className="text-gray-600 text-xs mb-3 line-clamp-2">{proposal.summary}</p>

                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded">
                    {getDatasetName(proposal.dataset_id)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div>
                    <span className="font-medium text-gray-700">{getUserDisplayName(proposal.user_id)}</span>
                    {user?.department && (
                      <span className="ml-1 text-gray-400">/ {user.department}</span>
                    )}
                  </div>
                  <span>{formatDate(proposal.created_at)}</span>
                </div>

                <div className="flex items-center justify-end mt-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={(e) => handleLike(e, proposal.proposal_id)}
                    className="flex items-center gap-1 text-sm hover:scale-110 transition-transform"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill={isLiked ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth={isLiked ? 0 : 2}
                      className={`w-5 h-5 ${isLiked ? "text-red-500" : "text-gray-400"}`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                      />
                    </svg>
                    <span className={`font-medium ${isLiked ? "text-red-500" : "text-gray-500"}`}>
                      {likeCount}
                    </span>
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
