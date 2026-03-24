import { Link } from "react-router-dom";

interface GlossaryTerm {
  term: string;
  reading?: string;
  description: string;
  category: "data" | "workflow" | "role" | "system";
  relatedLinks?: { label: string; to: string }[];
}

const GLOSSARY: GlossaryTerm[] = [
  {
    term: "合成データ",
    reading: "ごうせいデータ",
    description:
      "実際の個人情報や機密情報を含まないよう、統計的な性質を保ちながら人工的に生成されたデータ。実データの代わりに分析・研究に使用でき、プライバシーリスクを大幅に低減できます。",
    category: "data",
    relatedLinks: [{ label: "データセット一覧（利用者）", to: "/datasets" }],
  },
  {
    term: "データセット",
    reading: "データセット",
    description:
      "本システムで管理される、合成データの集まり。複数のテーブル（表）から構成されることもあります。データオーナーが管理し、公開されると利用者が閲覧・活用提案できるようになります。",
    category: "data",
    relatedLinks: [
      { label: "データセット管理（オーナー）", to: "/datasets" },
      { label: "データセット一覧（利用者）", to: "/datasets" },
    ],
  },
  {
    term: "カタログ情報",
    reading: "カタログじょうほう",
    description:
      "データセットの説明・タグ・利用規約・テーブル構成・ユースケース例など、データセットの内容を説明するメタ情報。データオーナーが設定・編集します。",
    category: "data",
    relatedLinks: [{ label: "カタログ編集（オーナー）", to: "/datasets" }],
  },
  {
    term: "データオーナー",
    reading: "データオーナー",
    description:
      "データセットを管理・公開する責任者。どの部門のスタッフでもデータオーナーになることができます。利用提案のレビューや分析実行管理も担当します。",
    category: "role",
    relatedLinks: [{ label: "データオーナー向けマニュアル", to: "/manual/hr" }],
  },
  {
    term: "データ利用者",
    reading: "データりようしゃ",
    description:
      "公開されたデータセットを活用する利用者。どの部門のスタッフでもデータ利用者になることができます。活用提案を作成してデータオーナーのレビューを受け、承認されると分析実行リクエストを提出できます。",
    category: "role",
    relatedLinks: [{ label: "データ利用者向けマニュアル", to: "/manual/proposer" }],
  },
  {
    term: "活用提案",
    reading: "かつようていあん",
    description:
      "データ利用者がデータセットをどのように使いたいかを記述した申請書。目的・使用するデータ・期待する成果・利用期間などを記載してデータオーナーに提出します。承認されると分析実行リクエストが可能になります。",
    category: "workflow",
    relatedLinks: [
      { label: "マイ提案（利用者）", to: "/proposals" },
      { label: "提案レビュー（オーナー）", to: "/proposals" },
    ],
  },
  {
    term: "分析実行リクエスト",
    reading: "ぶんせきじっこうリクエスト",
    description:
      "合成データの生成を依頼する申請。活用提案が承認された後、データ利用者が生成するデータの行数・形式・パラメータなどを指定して提出します。",
    category: "workflow",
    relatedLinks: [
      { label: "マイ分析実行（利用者）", to: "/submissions" },
      { label: "分析実行管理（オーナー）", to: "/submissions" },
    ],
  },
  {
    term: "データ公開リクエスト",
    reading: "データこうかいリクエスト",
    description:
      "まだ存在しないデータセットや、追加してほしいデータの要望をデータオーナーに伝える機能。利用者が必要なデータを明示することで、データオーナーが対応を検討します。",
    category: "workflow",
    relatedLinks: [{ label: "データ公開リクエスト", to: "/data-requests" }],
  },
  {
    term: "レビュー",
    reading: "レビュー",
    description:
      "データオーナーが活用提案や分析実行リクエストの内容を確認し、承認または却下する作業。提案の目的・利用規約への適合性・安全性などを確認します。",
    category: "workflow",
    relatedLinks: [
      { label: "提案レビュー（オーナー）", to: "/proposals" },
      { label: "分析実行管理（オーナー）", to: "/submissions" },
    ],
  },
  {
    term: "ステータス",
    reading: "ステータス",
    description:
      "提案・分析実行リクエストの現在の状態。「レビュー待ち」「承認済み」「却下」「実行中」「完了」などがあります。ダッシュボードや各一覧ページで確認できます。",
    category: "system",
    relatedLinks: [{ label: "ダッシュボード", to: "/dashboard" }],
  },
  {
    term: "全体の提案",
    reading: "ぜんたいのていあん",
    description:
      "他のユーザーが公開した活用提案を閲覧・参照できる場所。いいねをつけることができ、注目度の高い提案はダッシュボードの「注目のユースケース」に表示されます。",
    category: "system",
    relatedLinks: [
      { label: "全体の提案（利用者）", to: "/community" },
      { label: "ダッシュボード", to: "/dashboard" },
    ],
  },
  {
    term: "ダッシュボード",
    reading: "ダッシュボード",
    description:
      "ログイン後のトップページ。最近のデータセット・注目の提案・レビュー待ちのワークフローなどを一覧できます。",
    category: "system",
    relatedLinks: [{ label: "ダッシュボード", to: "/dashboard" }],
  },
  {
    term: "タグ",
    reading: "タグ",
    description:
      "データセットや提案に付けるキーワード。「売上」「顧客」「在庫」などのタグを使うことで、関連するデータを検索・分類しやすくなります。",
    category: "data",
  },
  {
    term: "利用規約",
    reading: "りようきやく",
    description:
      "データセットの利用条件・禁止事項・注意点などを定めたルール。データオーナーが設定し、利用者は必ず内容を確認した上でデータを活用する必要があります。",
    category: "data",
    relatedLinks: [{ label: "データセット一覧（利用者）", to: "/datasets" }],
  },
  {
    term: "ユースケース",
    reading: "ユースケース",
    description:
      "データセットの活用事例・使い方の例。データオーナーがカタログ情報に設定する場合と、全体の提案の活用提案がユースケースとして機能する場合があります。",
    category: "data",
    relatedLinks: [{ label: "全体の提案（利用者）", to: "/community" }],
  },
];

const CATEGORY_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  data: { label: "データ関連", color: "bg-blue-100 text-blue-700", icon: "🗄️" },
  workflow: { label: "ワークフロー", color: "bg-orange-100 text-orange-700", icon: "⚙️" },
  role: { label: "ロール・役割", color: "bg-green-100 text-green-700", icon: "👤" },
  system: { label: "システム機能", color: "bg-purple-100 text-purple-700", icon: "💻" },
};

export function GlossaryPage() {
  const categories = ["role", "data", "workflow", "system"] as const;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8 border border-purple-100">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">📚</span>
          <h1 className="text-3xl font-bold text-gray-800">用語集</h1>
        </div>
        <p className="text-gray-600 text-lg mb-4">
          合成データカタログで使われる用語をわかりやすく解説しています。
          各用語から関連する操作画面へのリンクもあります。
        </p>
        <div className="flex flex-wrap gap-2">
          <Link to="/manual" className="text-sm text-purple-700 hover:underline">← マニュアルトップへ</Link>
          <span className="text-gray-300">|</span>
          <Link to="/manual/hr" className="text-sm text-purple-700 hover:underline">データオーナー向けマニュアル</Link>
          <span className="text-gray-300">|</span>
          <Link to="/manual/proposer" className="text-sm text-purple-700 hover:underline">データ利用者向けマニュアル</Link>
        </div>
      </div>

      {/* Category Filter Legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(CATEGORY_LABELS).map(([key, val]) => (
          <span key={key} className={`${val.color} text-sm px-3 py-1 rounded-full font-medium`}>
            {val.icon} {val.label}
          </span>
        ))}
      </div>

      {/* Glossary by Category */}
      {categories.map((cat) => {
        const terms = GLOSSARY.filter((t) => t.category === cat);
        const catInfo = CATEGORY_LABELS[cat];
        return (
          <section key={cat}>
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>{catInfo.icon}</span>
              {catInfo.label}
            </h2>
            <div className="space-y-3">
              {terms.map((item) => (
                <div key={item.term} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-800">{item.term}</h3>
                        {item.reading && (
                          <span className="text-xs text-gray-400">（{item.reading}）</span>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded-full ${catInfo.color}`}>
                          {catInfo.label}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                  {item.relatedLinks && item.relatedLinks.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                      <span className="text-xs text-gray-400">関連リンク：</span>
                      {item.relatedLinks.map((link) => (
                        <Link
                          key={link.to}
                          to={link.to}
                          className="text-xs text-blue-600 hover:underline bg-blue-50 px-2 py-0.5 rounded-full"
                        >
                          {link.label} →
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <Link to="/manual" className="text-blue-600 hover:underline text-sm">← マニュアルトップへ</Link>
        <Link to="/dashboard" className="text-blue-600 hover:underline text-sm">ダッシュボードへ →</Link>
      </div>
    </div>
  );
}
