import { useState } from "react";
import { Link } from "react-router-dom";
import { USERS } from "../../data/users";
import { loadState, toggleDatasetLike } from "../../store/session";
import { formatDate } from "../../utils/format";
import { getPublishedDatasets, getDatasetUseCases, getDatasetSampleTables, getDatasetLikeCount } from "../../utils/data";
import { DataSource } from "../../types/models";

type SourceFilter = DataSource | "all";

export function ProposerDatasetsPage() {
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDepts, setSelectedDepts] = useState<string[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [, setRefresh] = useState(0);
  const state = loadState();

  const published = getPublishedDatasets(state);

  // Source-filtered datasets
  const sourceFiltered = published.filter(d => {
    if (sourceFilter === "all") return true;
    const ds = d.source ?? "internal";
    return ds === sourceFilter;
  });

  const allTags = [...new Set(sourceFiltered.flatMap((d) => d.tags))].sort();
  const allDepts = [...new Set(sourceFiltered.filter(d => (d.source ?? "internal") === "internal").map((d) => {
    const owner = USERS.find(u => u.user_id === d.owner_user_id);
    return owner?.department ?? "不明";
  }))].sort();
  const allProviders = [...new Set(sourceFiltered.filter(d => d.source === "external" && d.provider).map(d => d.provider!))].sort();

  // Stats
  const now = new Date();
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  const recentCount = sourceFiltered.filter(d => new Date(d.created_at) > oneMonthAgo).length;
  const totalTables = sourceFiltered.reduce((s, d) => s + getDatasetSampleTables(d.dataset_id).length, 0);
  const totalUseCases = sourceFiltered.reduce((s, d) => s + getDatasetUseCases(d.dataset_id).length, 0);
  const providerCount = new Set(sourceFiltered.filter(d => d.source === "external" && d.provider).map(d => d.provider)).size;

  const filtered = sourceFiltered.filter((d) => {
    const matchSearch = !search || d.name.includes(search) || d.description.includes(search) || d.tags.some((t) => t.includes(search));
    const matchTag = selectedTags.length === 0 || d.tags.some(t => selectedTags.includes(t));

    // Department filter for internal data
    const isExternal = d.source === "external";
    const ownerDept = USERS.find(u => u.user_id === d.owner_user_id)?.department ?? "不明";
    const matchDept = selectedDepts.length === 0 || isExternal || selectedDepts.includes(ownerDept);

    // Provider filter for external data
    const matchProvider = selectedProviders.length === 0 || !isExternal || (d.provider && selectedProviders.includes(d.provider));

    return matchSearch && matchTag && matchDept && matchProvider;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };
  const toggleDept = (dept: string) => {
    setSelectedDepts(prev => prev.includes(dept) ? prev.filter(d => d !== dept) : [...prev, dept]);
  };
  const toggleProvider = (provider: string) => {
    setSelectedProviders(prev => prev.includes(provider) ? prev.filter(p => p !== provider) : [...prev, provider]);
  };

  const handleLike = (e: React.MouseEvent, datasetId: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleDatasetLike(loadState(), datasetId);
    setRefresh(r => r + 1);
  };

  const handleSourceChange = (source: SourceFilter) => {
    setSourceFilter(source);
    setSelectedDepts([]);
    setSelectedProviders([]);
    setSelectedTags([]);
  };

  const showDeptFilter = sourceFilter === "internal" || sourceFilter === "all";
  const showProviderFilter = sourceFilter === "external" || sourceFilter === "all";

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">公開データセット</h1>

      {/* Source tabs */}
      <div className="flex gap-0 border-b border-gray-200 mb-4">
        {([
          { key: "all" as SourceFilter, label: "すべて" },
          { key: "internal" as SourceFilter, label: "社内データ" },
          { key: "external" as SourceFilter, label: "社外データ" },
        ]).map(tab => (
          <button
            key={tab.key}
            onClick={() => handleSourceChange(tab.key)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              sourceFilter === tab.key
                ? "border-blue-500 text-blue-600 font-bold"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-6 bg-white rounded-lg shadow-sm px-5 py-3 mb-6 text-sm">
        <div><span className="text-gray-500">公開データセット:</span> <span className="font-bold text-blue-600">{sourceFiltered.length}件</span></div>
        <div><span className="text-gray-500">今月の新規:</span> <span className="font-bold text-green-600">+{recentCount}件</span></div>
        <div><span className="text-gray-500">総テーブル数:</span> <span className="font-bold text-gray-700">{totalTables}</span></div>
        <div><span className="text-gray-500">総ユースケース:</span> <span className="font-bold text-gray-700">{totalUseCases}件</span></div>
        {(sourceFilter === "external" || sourceFilter === "all") && providerCount > 0 && (
          <div><span className="text-gray-500">データプロバイダ:</span> <span className="font-bold text-emerald-600">{providerCount}社</span></div>
        )}
      </div>

      {/* Sidebar + Content layout */}
      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="w-60 shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4 space-y-5">
            {/* Search */}
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">キーワード検索</label>
              <input
                type="text"
                placeholder="データセットを検索..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Department filter (for internal) */}
            {showDeptFilter && allDepts.length > 0 && (
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1.5">データオーナー部門</label>
                <div className="space-y-1">
                  {allDepts.map(dept => (
                    <label key={dept} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-blue-600">
                      <input
                        type="checkbox"
                        checked={selectedDepts.includes(dept)}
                        onChange={() => toggleDept(dept)}
                        className="rounded border-gray-300 text-blue-500 focus:ring-blue-400"
                      />
                      {dept}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Provider filter (for external) */}
            {showProviderFilter && allProviders.length > 0 && (
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1.5">データプロバイダ</label>
                <div className="space-y-1">
                  {allProviders.map(provider => (
                    <label key={provider} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-emerald-600">
                      <input
                        type="checkbox"
                        checked={selectedProviders.includes(provider)}
                        onChange={() => toggleProvider(provider)}
                        className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-400"
                      />
                      {provider}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Tag filter */}
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">データ分類</label>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {allTags.map(tag => (
                  <label key={tag} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-blue-600">
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag)}
                      onChange={() => toggleTag(tag)}
                      className="rounded border-gray-300 text-blue-500 focus:ring-blue-400"
                    />
                    {tag}
                  </label>
                ))}
              </div>
            </div>

            {/* Active filter count + clear */}
            {(selectedTags.length > 0 || selectedDepts.length > 0 || selectedProviders.length > 0) && (
              <button
                onClick={() => { setSelectedTags([]); setSelectedDepts([]); setSelectedProviders([]); }}
                className="text-xs text-blue-500 hover:text-blue-700"
              >
                フィルタをクリア ({selectedTags.length + selectedDepts.length + selectedProviders.length}件選択中)
              </button>
            )}
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((d) => {
              const useCases = getDatasetUseCases(d.dataset_id);
              const sampleTables = getDatasetSampleTables(d.dataset_id);
              const likeCount = getDatasetLikeCount(state, d.dataset_id);
              const isLiked = state.mutations.likedDatasets.includes(d.dataset_id);
              const isExternal = d.source === "external";
              const borderColor = isExternal ? "border-emerald-500" : "border-blue-500";
              return (
                <Link
                  key={d.dataset_id}
                  to={`/proposer/datasets/${d.dataset_id}`}
                  className={`bg-white rounded-lg shadow p-5 border-t-[3px] ${borderColor} hover:-translate-y-1 hover:shadow-lg transition-all duration-300 block`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-800 text-sm">{d.name}</h3>
                      {isExternal && (
                        <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded text-[10px] font-medium shrink-0">社外</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 shrink-0 ml-2">{formatDate(d.created_at)}</span>
                  </div>
                  {isExternal && d.provider && (
                    <p className="text-xs text-emerald-600 mb-1">{d.provider}</p>
                  )}
                  <p className="text-xs text-gray-500 line-clamp-2">{d.description}</p>
                  {isExternal && d.price_info && (
                    <p className="text-xs text-orange-600 mt-1 font-medium">{d.price_info}</p>
                  )}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {d.tags.map((t) => (
                      <span key={t} className={`px-2 py-0.5 rounded text-xs ${isExternal ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-600"}`}>{t}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
                    <div className="flex gap-3">
                      <span>テーブル: <span className="font-medium text-gray-700">{sampleTables.length}</span></span>
                      <span>ユースケース: <span className="font-medium text-gray-700">{useCases.length}</span></span>
                    </div>
                    <button
                      onClick={(e) => handleLike(e, d.dataset_id)}
                      className="flex items-center gap-1 hover:scale-110 transition-transform"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill={isLiked ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth={isLiked ? 0 : 2}
                        className={`w-4 h-4 ${isLiked ? "text-red-500" : "text-gray-400"}`}
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                      <span className={`font-medium ${isLiked ? "text-red-500" : "text-gray-500"}`}>{likeCount}</span>
                    </button>
                  </div>
                </Link>
              );
            })}
            {filtered.length === 0 && <p className="text-gray-500 text-center py-8 col-span-full">該当するデータセットがありません</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
