import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import { DATASETS } from "../../data/datasets";
import { PROPOSALS } from "../../data/proposals";
import { ActionButton } from "../../components/common/ActionButton";
import { StatusBadge } from "../../components/common/StatusBadge";
import { useToast } from "../../components/common/Toast";
import { formatDate } from "../../utils/format";
import { FILE_TYPE_LABELS, getDatasetUseCases, getDatasetSampleTables, getDatasetGraphs, getUserDisplayName, getDatasetLikeCount, getEffectiveProposalStatus, getProposalLikeCount } from "../../utils/data";
import { loadState, toggleDatasetLike } from "../../store/session";
import { CatalogColumn, DatasetGraph } from "../../types/models";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

function ScoreBar({ label, score, color = "blue" }: { label: string; score: number; color?: string }) {
  const pct = Math.round(score * 100);
  const bgColor = color === "green" ? "bg-green-500" : "bg-blue-500";
  const trackColor = color === "green" ? "bg-green-100" : "bg-blue-100";
  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="w-32 text-gray-600 shrink-0">{label}</span>
      <div className={`flex-1 ${trackColor} rounded-full h-2`}>
        <div className={`${bgColor} h-2 rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-12 text-right font-medium text-gray-700">{pct}%</span>
    </div>
  );
}

export function ProposerDatasetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dataset = DATASETS.find((d) => d.dataset_id === id);
  const { showToast } = useToast();
  const [, setRefresh] = useState(0);
  const state = loadState();
  const [expandedCol, setExpandedCol] = useState<string | null>(null);
  const [activeGraphTab, setActiveGraphTab] = useState<string | null>(null);
  const [activeTableTab, setActiveTableTab] = useState<number>(0);

  if (!dataset) return <p className="text-red-500">データセットが見つかりません</p>;

  const isExternal = dataset.source === "external";
  const useCases = getDatasetUseCases(dataset.dataset_id);
  const graphs = getDatasetGraphs(dataset.dataset_id);
  const sampleTables = getDatasetSampleTables(dataset.dataset_id);
  const qr = dataset.quality_report;

  const activeGraph = graphs.find((g) => g.id === activeGraphTab) ?? graphs[0] ?? null;

  // Safety scores for synthetic data
  const safetyIdentifierRemoval = 1.0; // All identifiers removed/replaced in synthetic
  const safetyQuasiGeneralization = qr ? 0.95 + (qr.overall_score * 0.05) : 0;
  const safetyReidentRisk = 0.0; // Synthetic data has zero re-identification risk
  const safetyValueMatch = qr ? 0.03 - (qr.overall_score * 0.02) : 0; // 1-2% value coincidence
  const safetyOverall = qr ? (safetyIdentifierRemoval + safetyQuasiGeneralization + (1 - safetyReidentRisk) + (1 - safetyValueMatch)) / 4 : 0;

  const avgCorrelation = qr && qr.file_reports.length > 0
    ? qr.file_reports.reduce((s, f) => s + f.column_correlation, 0) / qr.file_reports.length : 0;
  const avgSimilarity = qr && qr.file_reports.length > 0
    ? qr.file_reports.reduce((s, f) => s + f.distribution_similarity, 0) / qr.file_reports.length : 0;
  const avgParity = qr && qr.file_reports.length > 0
    ? qr.file_reports.reduce((s, f) => s + f.statistical_parity, 0) / qr.file_reports.length : 0;
  const utilityOverall = qr ? (avgCorrelation + avgSimilarity + avgParity) / 3 : 0;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{dataset.name}</h1>
        {isExternal && (
          <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-medium">社外データ</span>
        )}
      </div>

      {/* Top section: Basic Info + Quality Report side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        {/* Basic Info */}
        <section className="bg-white rounded-lg shadow p-6 lg:col-span-3">
          <h2 className="text-lg font-semibold mb-3">基本情報</h2>
          <div className="text-sm space-y-2">
            <p><span className="text-gray-500">データセットID:</span> {dataset.dataset_id}</p>
            <p><span className="text-gray-500">説明:</span> {dataset.description}</p>
            {isExternal && dataset.provider && (
              <p><span className="text-gray-500">データプロバイダ:</span> <span className="text-emerald-700 font-medium">{dataset.provider}</span></p>
            )}
            {isExternal && dataset.price_info && (
              <p><span className="text-gray-500">価格情報:</span> <span className="text-orange-600 font-medium">{dataset.price_info}</span></p>
            )}
            {!isExternal && (
              <p><span className="text-gray-500">オーナー:</span> {getUserDisplayName(dataset.owner_user_id)}</p>
            )}
            <p><span className="text-gray-500">テーブル数:</span> {sampleTables.length}</p>
            <p><span className="text-gray-500">総レコード数:</span> {qr ? qr.file_reports.reduce((s, f) => s + f.row_count_original, 0).toLocaleString() + "件" : isExternal ? "外部提供データ" : "N/A"}</p>
            <div className="flex gap-2">
              {dataset.tags.map((t) => <span key={t} className="bg-gray-100 px-2 py-0.5 rounded text-xs">{t}</span>)}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => { toggleDatasetLike(loadState(), dataset.dataset_id); setRefresh(r => r + 1); }}
                className="flex items-center gap-1 text-sm hover:scale-110 transition-transform"
              >
                {state.mutations.likedDatasets.includes(dataset.dataset_id) ? (
                  <svg className="w-5 h-5 text-red-500 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-400 hover:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                )}
                <span className="font-medium text-gray-600">{getDatasetLikeCount(state, dataset.dataset_id)}</span>
              </button>
            </div>
            <p><span className="text-gray-500">作成日:</span> {formatDate(dataset.created_at)}</p>
          </div>
        </section>

        {/* Quality Report */}
        {qr && (
          <section className="bg-white rounded-lg shadow p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold mb-3">品質レポート</h2>
            <div className="grid grid-cols-2 gap-4">
              {/* Safety Score Card */}
              <div className="border-l-4 border-green-500 pl-3">
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold text-green-600">{(safetyOverall * 100).toFixed(1)}</span>
                  <span className="text-sm text-gray-400">/ 100</span>
                </div>
                <p className="text-sm font-medium text-gray-700 mb-3">安全性スコア</p>
                <div className="space-y-2">
                  <ScoreBar label="識別子除去率" score={safetyIdentifierRemoval} color="green" />
                  <ScoreBar label="準識別子汎化率" score={safetyQuasiGeneralization} color="green" />
                  <ScoreBar label="再識別リスク" score={safetyReidentRisk} color="green" />
                  <ScoreBar label="値一致率" score={safetyValueMatch} color="green" />
                </div>
                <p className="text-xs text-gray-400 mt-2">※ 合成データのため再識別リスクは0%です</p>
              </div>

              {/* Utility Score Card */}
              <div className="border-l-4 border-blue-500 pl-3">
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold text-blue-600">{(utilityOverall * 100).toFixed(1)}</span>
                  <span className="text-sm text-gray-400">/ 100</span>
                </div>
                <p className="text-sm font-medium text-gray-700 mb-3">有用性スコア</p>
                <div className="space-y-2">
                  <ScoreBar label="統計的類似度" score={avgSimilarity} color="blue" />
                  <ScoreBar label="カラム相関保持率" score={avgCorrelation} color="blue" />
                  <ScoreBar label="統計的同等性" score={avgParity} color="blue" />
                </div>
              </div>
            </div>

            {/* Per-file breakdown */}
            {qr.file_reports.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-600 mb-2">ファイル別評価</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-1.5 text-left font-medium text-gray-500">ファイル種別</th>
                        <th className="px-3 py-1.5 text-left font-medium text-gray-500">行数(元/合成)</th>
                        <th className="px-3 py-1.5 text-left font-medium text-gray-500">相関</th>
                        <th className="px-3 py-1.5 text-left font-medium text-gray-500">類似度</th>
                        <th className="px-3 py-1.5 text-left font-medium text-gray-500">同等性</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {qr.file_reports.map((fr) => (
                        <tr key={fr.file_type}>
                          <td className="px-3 py-1.5">{FILE_TYPE_LABELS[fr.file_type]}</td>
                          <td className="px-3 py-1.5 text-gray-600">{fr.row_count_original} / {fr.row_count_synthetic}</td>
                          <td className="px-3 py-1.5">{(fr.column_correlation * 100).toFixed(1)}%</td>
                          <td className="px-3 py-1.5">{(fr.distribution_similarity * 100).toFixed(1)}%</td>
                          <td className="px-3 py-1.5">{(fr.statistical_parity * 100).toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        )}
      </div>

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

      {/* Use Cases + Sample Report Graphs side by side */}
      {(useCases.length > 0 || graphs.length > 0) && (
        <div className={`grid grid-cols-1 ${useCases.length > 0 && graphs.length > 0 ? "lg:grid-cols-2" : ""} gap-6 mb-6`}>
          {useCases.length > 0 && (
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-3">データの価値・ユースケース</h2>
              <ul className="space-y-4">
                {useCases.map((uc, i) => (
                  <li key={i} className="border-l-4 border-blue-400 pl-4">
                    <h3 className="font-semibold text-gray-800">{uc.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{uc.description}</p>
                    {uc.relatedGraphId && (
                      <button
                        className="inline-block mt-1 text-xs text-blue-500 hover:text-blue-700 hover:underline"
                        onClick={() => {
                          setActiveGraphTab(uc.relatedGraphId!);
                          document.getElementById("sample-report-section")?.scrollIntoView({ behavior: "smooth" });
                        }}
                      >
                        → 関連グラフを表示
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {graphs.length > 0 && (
            <section id="sample-report-section" className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-3">サンプルレポート</h2>
              <div className="flex gap-2 mb-4" role="tablist" aria-label="サンプルレポート">
                {graphs.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setActiveGraphTab(g.id)}
                    role="tab"
                    aria-selected={activeGraph?.id === g.id}
                    aria-controls={`graph-panel-${g.id}`}
                    className={`px-3 py-1 rounded text-sm ${
                      (activeGraph?.id === g.id) ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {g.title}
                  </button>
                ))}
              </div>
              {activeGraph && (
                <div className="h-64" role="tabpanel" id={`graph-panel-${activeGraph.id}`}>
                  <GraphRenderer graph={activeGraph} />
                </div>
              )}
            </section>
          )}
        </div>
      )}

      {/* Related Proposals from Community */}
      {(() => {
        const relatedProposals = PROPOSALS.filter(p => p.dataset_id === dataset.dataset_id);
        if (relatedProposals.length === 0) return null;
        return (
          <section className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-3">関連する活用提案 ({relatedProposals.length}件)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {relatedProposals.map(p => {
                const pStatus = getEffectiveProposalStatus(state, p);
                return (
                  <Link key={p.proposal_id} to={`/proposer/proposals/${p.proposal_id}`}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-800 truncate">{p.title}</h4>
                      <p className="text-xs text-gray-500">{getUserDisplayName(p.user_id)}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-3 shrink-0">
                      <StatusBadge status={pStatus} />
                      <span className="text-xs text-gray-400">{getProposalLikeCount(state, p.proposal_id)} ♥</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })()}

      {/* ER Diagram */}
      {sampleTables.length >= 2 && (
        <section className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3">テーブル構成・リレーション</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
            <div className="flex flex-wrap gap-4 items-start justify-center">
              {sampleTables.map((t, idx) => (
                <div
                  key={t.tableName}
                  onClick={() => setActiveTableTab(idx)}
                  className="bg-white border-2 border-blue-400 rounded px-3 py-2 text-center cursor-pointer hover:border-blue-600 hover:shadow-md transition-all"
                >
                  <div className="font-semibold text-sm text-gray-800">{t.tableName}</div>
                  <div className="text-xs text-gray-500">PK: {t.primaryKey.join(", ")}</div>
                </div>
              ))}
            </div>
            {(() => {
              const allFks = sampleTables.flatMap((t) =>
                t.foreignKeys.map((fk) => ({
                  from: t.tableName,
                  columns: fk.columns,
                  refTable: fk.referenceTable,
                  refColumns: fk.referenceColumns,
                }))
              );
              if (allFks.length === 0) return null;
              return (
                <div className="mt-3 space-y-1 text-xs text-gray-500">
                  {allFks.map((fk, i) => (
                    <p key={i}>
                      🔗 {fk.from}.{fk.columns.join(", ")} → {fk.refTable}.{fk.refColumns.join(", ")}
                    </p>
                  ))}
                </div>
              );
            })()}
          </div>
        </section>
      )}

      {/* Sample Tables */}
      {sampleTables.length > 0 && (
        <section className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3">サンプルテーブル</h2>
          <div className="flex gap-1 mb-4" role="tablist" aria-label="サンプルテーブル">
            {sampleTables.map((t, idx) => (
              <button
                key={t.tableName}
                onClick={() => setActiveTableTab(idx)}
                role="tab"
                aria-selected={activeTableTab === idx}
                aria-controls={`table-panel-${t.tableName}`}
                className={`px-3 py-1.5 rounded-t text-sm ${
                  activeTableTab === idx
                    ? "bg-white text-gray-800 font-semibold border-b-2 border-blue-500"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {t.tableName}
              </button>
            ))}
          </div>
          {(() => {
            const table = sampleTables[activeTableTab];
            if (!table) return null;
            const pkSet = new Set(table.primaryKey);
            const fkColSet = new Set(table.foreignKeys.flatMap((fk) => fk.columns));
            return (
              <div id={`table-panel-${table.tableName}`} role="tabpanel">
                <p className="text-sm text-gray-600 mb-3">{table.description}</p>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        {table.columns.map((col) => {
                          const isPk = pkSet.has(col.name);
                          const isFk = fkColSet.has(col.name);
                          return (
                            <th
                              key={col.name}
                              className={`px-3 py-2 text-left font-medium text-gray-500 ${isPk ? "bg-yellow-50" : isFk ? "bg-blue-50" : ""}`}
                            >
                              {isPk && <span className="mr-1" aria-label="主キー" role="img">🔑</span>}
                              {isFk && <span className="mr-1" aria-label="外部キー" role="img">🔗</span>}
                              {col.displayName}
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {table.rows.map((row, i) => (
                        <tr key={i}>
                          {table.columns.map((col) => (
                            <td key={col.name} className="px-3 py-1.5 text-gray-700">
                              {String(row[col.name] ?? "")}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {table.foreignKeys.length > 0 && (
                  <div className="mt-3 text-xs text-gray-500 space-y-1">
                    {table.foreignKeys.map((fk, i) => (
                      <p key={i}>
                        [FK] {table.tableName}.{fk.columns.join(", ")} → {fk.referenceTable}.{fk.referenceColumns.join(", ")}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
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

function GraphRenderer({ graph }: { graph: DatasetGraph }) {
  const data = { labels: graph.labels, datasets: graph.datasets };
  const opts = { responsive: true, maintainAspectRatio: false } as const;
  switch (graph.type) {
    case "line":
      return <Line data={data} options={opts} />;
    case "pie":
      return <Pie data={data} options={opts} />;
    case "doughnut":
      return <Doughnut data={data} options={opts} />;
    default:
      return <Bar data={data} options={opts} />;
  }
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
