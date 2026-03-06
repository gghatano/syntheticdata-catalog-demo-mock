import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from "chart.js";
import { DATASETS } from "../../data/datasets";
import { PREVIEWS } from "../../data/profiles";
import { ActionButton } from "../../components/common/ActionButton";
import { useToast } from "../../components/common/Toast";
import { formatDate, formatScore } from "../../utils/format";
import { FILE_TYPE_LABELS } from "../../utils/data";
import { FileType, CatalogColumn } from "../../types/models";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

export function ProposerDatasetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dataset = DATASETS.find((d) => d.dataset_id === id);
  const { showToast } = useToast();
  const [previewTab, setPreviewTab] = useState<FileType>("employee_master");
  const [expandedCol, setExpandedCol] = useState<string | null>(null);

  if (!dataset) return <p className="text-red-500">データセットが見つかりません</p>;

  const previews = PREVIEWS[dataset.dataset_id];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{dataset.name}</h1>

      {/* Basic Info */}
      <section className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">基本情報</h2>
        <div className="text-sm space-y-2">
          <p><span className="text-gray-500">データセットID:</span> {dataset.dataset_id}</p>
          <p><span className="text-gray-500">説明:</span> {dataset.description}</p>
          <div className="flex gap-2">
            {dataset.tags.map((t) => <span key={t} className="bg-gray-100 px-2 py-0.5 rounded text-xs">{t}</span>)}
          </div>
          <p><span className="text-gray-500">作成日:</span> {formatDate(dataset.created_at)}</p>
        </div>
      </section>

      {/* Synthetic Data Files */}
      {dataset.synthetic_artifacts.length > 0 && (
        <section className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3">合成データ</h2>
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">ファイル種別</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">パス</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dataset.synthetic_artifacts.map((a) => (
                <tr key={a.file_path}>
                  <td className="px-4 py-2">{FILE_TYPE_LABELS[a.file_type]}</td>
                  <td className="px-4 py-2 text-gray-600">{a.file_path}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => showToast("デモではダウンロードできません", "info")}
                      className="text-blue-600 hover:underline text-xs"
                    >
                      ダウンロード
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Data Preview */}
      {previews && (
        <section className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3">データプレビュー</h2>
          <div className="flex gap-2 mb-4">
            {(Object.keys(previews) as FileType[]).map((ft) => (
              <button
                key={ft}
                onClick={() => setPreviewTab(ft)}
                className={`px-3 py-1 rounded text-sm ${previewTab === ft ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"}`}
              >
                {FILE_TYPE_LABELS[ft] ?? ft}
              </button>
            ))}
          </div>
          {previews[previewTab] && previews[previewTab].length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(previews[previewTab][0]).map((key) => (
                      <th key={key} className="px-3 py-2 text-left font-medium text-gray-500">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {previews[previewTab].map((row, i) => (
                    <tr key={i}>
                      {Object.values(row).map((val, j) => (
                        <td key={j} className="px-3 py-1.5 text-gray-700">{String(val)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">プレビューデータがありません</p>
          )}
        </section>
      )}

      {/* Data Profile */}
      <section className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">データプロファイル</h2>
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">列名</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">型</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">件数</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">NULL数</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">ユニーク数</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {dataset.catalog.map((col) => (
              <ProfileRow key={col.column_name} col={col} expanded={expandedCol === col.column_name} onToggle={() => setExpandedCol(expandedCol === col.column_name ? null : col.column_name)} />
            ))}
          </tbody>
        </table>
      </section>

      {/* Quality Report */}
      {dataset.quality_report && (
        <section className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3">品質レポート</h2>
          <p className="text-sm mb-2">全体スコア: <span className="font-bold">{formatScore(dataset.quality_report.overall_score)}</span></p>
        </section>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Link to="/proposer/datasets">
          <ActionButton variant="secondary">一覧に戻る</ActionButton>
        </Link>
        <ActionButton onClick={() => showToast("デモではダウンロードできません", "info")} variant="secondary">
          テンプレートダウンロード
        </ActionButton>
        <Link to={`/proposer/proposals/new?dataset=${dataset.dataset_id}`}>
          <ActionButton>新規提案を作成</ActionButton>
        </Link>
      </div>
    </div>
  );
}

function ProfileRow({ col, expanded, onToggle }: { col: CatalogColumn; expanded: boolean; onToggle: () => void }) {
  return (
    <>
      <tr className="cursor-pointer hover:bg-gray-50" onClick={onToggle}>
        <td className="px-4 py-2 font-mono">{col.column_name}</td>
        <td className="px-4 py-2">{col.inferred_type}</td>
        <td className="px-4 py-2">{col.stats.count}</td>
        <td className="px-4 py-2">{col.stats.null_count}</td>
        <td className="px-4 py-2">{col.stats.unique_count}</td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={5} className="px-4 py-4 bg-gray-50">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-xs space-y-1">
                {col.stats.min !== undefined && <p><span className="text-gray-500">最小:</span> {String(col.stats.min)}</p>}
                {col.stats.max !== undefined && <p><span className="text-gray-500">最大:</span> {String(col.stats.max)}</p>}
                {col.stats.mean !== undefined && <p><span className="text-gray-500">平均:</span> {col.stats.mean}</p>}
                {col.stats.std !== undefined && <p><span className="text-gray-500">標準偏差:</span> {col.stats.std}</p>}
                {col.is_pii && <p className="text-red-600 font-medium">PII: {col.pii_reason}</p>}
              </div>
              {col.stats.histogram && (
                <div className="h-40">
                  <Bar
                    data={{
                      labels: col.stats.histogram.bins,
                      datasets: [{
                        label: col.column_name,
                        data: col.stats.histogram.counts,
                        backgroundColor: "rgba(59, 130, 246, 0.5)",
                      }],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { title: { display: false } },
                      scales: { y: { beginAtZero: true } },
                    }}
                  />
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
