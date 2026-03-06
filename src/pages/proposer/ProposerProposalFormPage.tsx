import { useSearchParams } from "react-router-dom";
import { loadState } from "../../store/session";
import { ActionButton } from "../../components/common/ActionButton";
import { useToast } from "../../components/common/Toast";
import { getPublishedDatasets } from "../../utils/data";

export function ProposerProposalFormPage() {
  const [searchParams] = useSearchParams();
  const defaultDataset = searchParams.get("dataset") ?? "";
  const state = loadState();
  const { showToast } = useToast();
  const publishedDatasets = getPublishedDatasets(state);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">新規提案</h1>
      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">対象データセット</label>
            <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm" defaultValue={defaultDataset}>
              <option value="">-- 選択してください --</option>
              {publishedDatasets.map((d) => (
                <option key={d.dataset_id} value={d.dataset_id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
            <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="提案のタイトル" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">概要</label>
            <textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-24" placeholder="分析の概要を説明してください" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">analysis.py</label>
            <input type="file" accept=".py" className="text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">report.md</label>
            <input type="file" accept=".md" className="text-sm" />
          </div>
          <ActionButton onClick={() => showToast("デモのため、実際の提案は行われません", "info")}>
            提出
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
