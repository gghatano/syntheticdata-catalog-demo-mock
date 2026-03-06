import { useState } from "react";
import { Link } from "react-router-dom";
import { loadState } from "../../store/session";
import { formatDate } from "../../utils/format";
import { getPublishedDatasets } from "../../utils/data";

export function ProposerDatasetsPage() {
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const state = loadState();

  const published = getPublishedDatasets(state);
  const allTags = [...new Set(published.flatMap((d) => d.tags))];

  const filtered = published.filter((d) => {
    const matchSearch = !search || d.name.includes(search) || d.description.includes(search);
    const matchTag = !tagFilter || d.tags.includes(tagFilter);
    return matchSearch && matchTag;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">公開データセット</h1>

      <div className="mb-4 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="データセットを検索..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm w-64"
        />
        <div className="flex gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
              className={`px-3 py-1 rounded-full text-xs font-medium ${tagFilter === tag ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.map((d) => (
          <div key={d.dataset_id} className="bg-white rounded-lg shadow p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">{d.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{d.description}</p>
                <div className="flex gap-2 mt-2">
                  {d.tags.map((t) => (
                    <span key={t} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">{t}</span>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">作成日: {formatDate(d.created_at)}</p>
              </div>
              <Link to={`/proposer/datasets/${d.dataset_id}`} className="text-blue-600 hover:underline text-sm shrink-0">
                詳細
              </Link>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-gray-500 text-center py-8">該当するデータセットがありません</p>}
      </div>
    </div>
  );
}
