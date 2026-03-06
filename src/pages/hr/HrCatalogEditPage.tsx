import { useState } from "react";
import { useParams } from "react-router-dom";
import { DATASETS } from "../../data/datasets";
import { loadState, saveState } from "../../store/session";
import { ActionButton } from "../../components/common/ActionButton";
import { useToast } from "../../components/common/Toast";
import { CatalogColumn } from "../../types/models";

export function HrCatalogEditPage() {
  const { id } = useParams<{ id: string }>();
  const dataset = DATASETS.find((d) => d.dataset_id === id);
  const { showToast } = useToast();
  const [catalog, setCatalog] = useState<CatalogColumn[]>(dataset?.catalog ?? []);
  const [loading, setLoading] = useState(false);

  if (!dataset) return <p className="text-red-500">データセットが見つかりません</p>;

  const handleAutoGenerate = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setCatalog(dataset.catalog);
    setLoading(false);
    showToast("カタログを自動生成しました", "success");
  };

  const handleSave = () => {
    const state = loadState();
    state.mutations.catalogEdits[dataset.dataset_id] = catalog;
    saveState(state);
    showToast("カタログを保存しました", "success");
  };

  const updateColumn = (index: number, field: keyof CatalogColumn, value: unknown) => {
    setCatalog((prev) => prev.map((col, i) => (i === index ? { ...col, [field]: value } : col)));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">カタログ編集 - {dataset.name}</h1>

      <div className="flex gap-3 mb-6">
        <ActionButton onClick={handleAutoGenerate} loading={loading} variant="secondary">
          自動生成
        </ActionButton>
        <ActionButton onClick={handleSave} variant="success">
          保存
        </ActionButton>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">列名</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">推定型</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">PII</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">説明</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {catalog.map((col, i) => (
              <tr key={col.column_name}>
                <td className="px-4 py-2 text-sm font-mono">{col.column_name}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{col.inferred_type}</td>
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={col.is_pii}
                    onChange={(e) => updateColumn(i, "is_pii", e.target.checked)}
                    className="rounded"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={col.description}
                    onChange={(e) => updateColumn(i, "description", e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
