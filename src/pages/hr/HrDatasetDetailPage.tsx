import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { DATASETS } from "../../data/datasets";
import { loadState, publishDataset } from "../../store/session";
import { PublishBadge } from "../../components/common/StatusBadge";
import { DataTable } from "../../components/common/DataTable";
import { ActionButton } from "../../components/common/ActionButton";
import { useToast } from "../../components/common/Toast";
import { formatDate, formatScore } from "../../utils/format";
import { isEffectivelyPublished, FILE_TYPE_LABELS } from "../../utils/data";

export function HrDatasetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dataset = DATASETS.find((d) => d.dataset_id === id);
  const { showToast } = useToast();
  const [state, setState] = useState(loadState);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!dataset) return <p className="text-red-500">データセットが見つかりません</p>;

  const isPublished = isEffectivelyPublished(state, dataset);

  const handlePublish = () => {
    setState(publishDataset(state, dataset.dataset_id));
    showToast("データセットを公開しました", "success");
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setProgress(0);
    const steps = [
      { pct: 20, label: "データ読み込み中..." },
      { pct: 50, label: "合成データ生成中..." },
      { pct: 80, label: "品質評価中..." },
      { pct: 100, label: "完了!" },
    ];
    for (const step of steps) {
      await new Promise((r) => setTimeout(r, 500));
      setProgress(step.pct);
    }
    setGenerating(false);
    showToast("合成データが生成されました", "success");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{dataset.name}</h1>

      <section className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">基本情報</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-500">データセットID:</span> {dataset.dataset_id}</div>
          <div><span className="text-gray-500">公開状態:</span> <PublishBadge isPublished={isPublished} /></div>
          <div><span className="text-gray-500">作成日:</span> {formatDate(dataset.created_at)}</div>
          <div><span className="text-gray-500">タグ:</span> {dataset.tags.map((t) => <span key={t} className="inline-block bg-gray-100 px-2 py-0.5 rounded text-xs mr-1">{t}</span>)}</div>
        </div>
        <p className="text-sm text-gray-600 mt-3">{dataset.description}</p>
      </section>

      <section className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">ファイル一覧</h2>
        <DataTable
          columns={[
            { header: "ファイル種別", accessor: (f) => FILE_TYPE_LABELS[f.file_type] },
            { header: "パス", accessor: (f) => f.file_path },
            { header: "登録日", accessor: (f) => formatDate(f.created_at) },
          ]}
          data={dataset.files}
        />
      </section>

      <section className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">{dataset.catalog.length}列定義済み</h2>
          <Link to={`/hr/datasets/${dataset.dataset_id}/catalog`}>
            <ActionButton variant="secondary">カタログ編集</ActionButton>
          </Link>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">合成データ</h2>
        {dataset.synthetic_artifacts.length > 0 ? (
          <DataTable
            columns={[
              { header: "ファイル種別", accessor: (a) => FILE_TYPE_LABELS[a.file_type] },
              { header: "Seed", accessor: (a) => a.seed },
              { header: "パス", accessor: (a) => a.file_path },
              { header: "作成日", accessor: (a) => formatDate(a.created_at) },
            ]}
            data={dataset.synthetic_artifacts}
          />
        ) : (
          <p className="text-gray-500 text-sm mb-4">合成データはまだ生成されていません</p>
        )}

        {generating && (
          <div className="my-4">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div className="bg-blue-500 h-4 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-sm text-gray-600 mt-1">{progress}%</p>
          </div>
        )}

        <div className="flex gap-3 mt-4">
          <ActionButton onClick={handleGenerate} disabled={generating}>
            合成データ生成
          </ActionButton>
          {!isPublished && (
            <ActionButton variant="success" onClick={handlePublish}>
              公開する
            </ActionButton>
          )}
        </div>
      </section>

      {dataset.quality_report && (
        <section className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3">品質レポート</h2>
          <p className="text-sm mb-4">
            全体スコア: <span className="font-bold text-lg">{formatScore(dataset.quality_report.overall_score)}</span>
          </p>
          <DataTable
            columns={[
              { header: "ファイル種別", accessor: (r) => FILE_TYPE_LABELS[r.file_type] },
              { header: "元データ行数", accessor: (r) => r.row_count_original.toLocaleString() },
              { header: "合成データ行数", accessor: (r) => r.row_count_synthetic.toLocaleString() },
              { header: "列相関", accessor: (r) => formatScore(r.column_correlation) },
              { header: "分布類似度", accessor: (r) => formatScore(r.distribution_similarity) },
              { header: "統計的均一性", accessor: (r) => formatScore(r.statistical_parity) },
            ]}
            data={dataset.quality_report.file_reports}
          />
        </section>
      )}
    </div>
  );
}
