import { Link } from "react-router-dom";

function StepCard({
  step,
  title,
  description,
  icon,
  color,
  children,
  id,
}: {
  step: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  children?: React.ReactNode;
  id?: string;
}) {
  const colorMap: Record<string, string> = {
    blue: "border-blue-500 bg-blue-50",
    green: "border-green-500 bg-green-50",
    orange: "border-orange-500 bg-orange-50",
    purple: "border-purple-500 bg-purple-50",
  };
  const badgeMap: Record<string, string> = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    orange: "bg-orange-500",
    purple: "bg-purple-500",
  };

  return (
    <div id={id} className={`rounded-xl border-l-4 p-6 ${colorMap[color]}`}>
      <div className="flex items-start gap-4">
        <div className={`${badgeMap[color]} text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold shrink-0`}>
          {step}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{icon}</span>
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          </div>
          <p className="text-gray-600 mb-4">{description}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

function OperationItem({ label, detail, link }: { label: string; detail: string; link?: string }) {
  return (
    <div className="bg-white rounded-lg p-3 flex items-start gap-3 shadow-sm">
      <span className="text-green-500 mt-0.5 shrink-0">✓</span>
      <div>
        <div className="font-medium text-gray-800 text-sm">
          {link ? (
            <Link to={link} className="text-blue-600 hover:underline">
              {label}
            </Link>
          ) : (
            label
          )}
        </div>
        <div className="text-xs text-gray-500 mt-0.5">{detail}</div>
      </div>
    </div>
  );
}

function FlowDiagram() {
  const steps = [
    { label: "データセット\n登録・管理", icon: "🗄️", color: "bg-blue-100 border-blue-300" },
    { label: "カタログ情報\n編集", icon: "✏️", color: "bg-indigo-100 border-indigo-300" },
    { label: "データセット\n公開", icon: "🌐", color: "bg-green-100 border-green-300" },
    { label: "利用提案の\nレビュー", icon: "📋", color: "bg-orange-100 border-orange-300" },
    { label: "実行管理・\n結果確認", icon: "⚙️", color: "bg-purple-100 border-purple-300" },
  ];

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <h3 className="font-semibold text-gray-700 mb-4 text-center">データオーナーの基本的な流れ</h3>
      <div className="flex items-center justify-center flex-wrap gap-1">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center">
            <div className={`${s.color} border-2 rounded-xl px-3 py-2 text-center min-w-[90px]`}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-xs font-medium text-gray-700 whitespace-pre-line">{s.label}</div>
            </div>
            {i < steps.length - 1 && (
              <div className="text-gray-400 text-xl mx-1">→</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function HrManualPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">🏢</span>
          <h1 className="text-3xl font-bold text-gray-800">データオーナー向けマニュアル</h1>
        </div>
        <p className="text-gray-600 text-lg mb-4">
          人事・データ管理部門の方（データオーナー）向けの操作マニュアルです。
          データセットの公開・管理から、利用提案のレビューまでを解説します。
        </p>
        <div className="flex flex-wrap gap-2">
          <Link to="/manual" className="text-sm text-blue-600 hover:underline">← マニュアルトップへ</Link>
          <span className="text-gray-300">|</span>
          <Link to="/manual/glossary" className="text-sm text-blue-600 hover:underline">用語集</Link>
          <span className="text-gray-300">|</span>
          <Link to="/manual/proposer" className="text-sm text-blue-600 hover:underline">データ利用者向けマニュアル</Link>
        </div>
      </div>

      {/* Flow Diagram */}
      <FlowDiagram />

      {/* このマニュアルで学べること */}
      <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
        <h2 className="font-semibold text-blue-800 mb-3">📌 このマニュアルで学べること</h2>
        <ul className="space-y-1 text-sm text-blue-900">
          <li>✅ データセットを管理・公開する方法</li>
          <li>✅ カタログ情報（説明・タグ・利用規約など）を編集する方法</li>
          <li>✅ データ利用者からの提案をレビュー・承認する方法</li>
          <li>✅ 合成データの実行状況を確認する方法</li>
        </ul>
      </div>

      {/* Step 1 */}
      <StepCard
        id="step1"
        step={1}
        title="データセット管理"
        description="あなたの組織が持つデータセットを管理します。一覧から各データセットの状態を確認できます。"
        icon="🗄️"
        color="blue"
      >
        <div className="space-y-2">
          <OperationItem
            label="データセット一覧を見る"
            detail="「データセット」メニューから全データセットの一覧を確認できます。公開状態も一目でわかります。"
            link="/hr/datasets"
          />
          <OperationItem
            label="データセットの詳細を確認する"
            detail="データセット名をクリックすると、詳細情報（テーブル構成・ユースケース・提出履歴など）を確認できます。"
          />
          <OperationItem
            label="公開・非公開を切り替える"
            detail="詳細ページの「公開する」ボタンでデータを公開できます。公開するとデータ利用者がアクセスできるようになります。"
          />
        </div>
        <div className="mt-4 bg-white rounded-lg p-3 border border-blue-200 text-sm">
          <p className="font-medium text-blue-800 mb-1">💡 ポイント</p>
          <p className="text-gray-600">
            データセットを公開する前に、必ずカタログ情報（Step 2）を整備しましょう。
            説明・タグ・利用規約が揃っていると、データ利用者が活用しやすくなります。
          </p>
        </div>
      </StepCard>

      {/* Step 2 */}
      <StepCard
        id="step2"
        step={2}
        title="カタログ情報の編集"
        description="データセットの説明・タグ・利用規約などのカタログ情報を編集します。わかりやすい情報を提供することで、適切な活用を促進できます。"
        icon="✏️"
        color="blue"
      >
        <div className="space-y-2">
          <OperationItem
            label="カタログ情報を編集する"
            detail="データセット詳細ページの「カタログ編集」ボタンから、説明・タグ・利用規約・サンプルデータなどを設定できます。"
          />
        </div>
        <div className="mt-4 bg-white rounded-lg p-3 border border-blue-200">
          <p className="font-medium text-blue-800 mb-2 text-sm">📝 設定できる情報</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div className="flex items-center gap-1"><span>🏷️</span> データセット名・説明</div>
            <div className="flex items-center gap-1"><span>🔖</span> タグ（検索用キーワード）</div>
            <div className="flex items-center gap-1"><span>📄</span> 利用規約・注意事項</div>
            <div className="flex items-center gap-1"><span>📊</span> サンプルデータ・テーブル情報</div>
            <div className="flex items-center gap-1"><span>💡</span> ユースケース例</div>
            <div className="flex items-center gap-1"><span>📅</span> データ更新日・有効期限</div>
          </div>
        </div>
      </StepCard>

      {/* Step 3 */}
      <StepCard
        id="step3"
        step={3}
        title="提案のレビュー"
        description="データ利用者からの活用提案をレビュー・承認します。提案内容を確認して、適切かどうかを判断してください。"
        icon="📋"
        color="orange"
      >
        <div className="space-y-2">
          <OperationItem
            label="提案一覧を確認する"
            detail="「提案レビュー」メニューから、提出された全提案を確認できます。ステータスで「レビュー待ち」を絞り込めます。"
            link="/hr/proposals"
          />
          <OperationItem
            label="提案の詳細を確認する"
            detail="提案をクリックすると、目的・使用するデータ・期待する成果などの詳細情報を確認できます。"
          />
          <OperationItem
            label="承認・却下する"
            detail="提案内容を確認後、「承認」または「却下」ボタンで対応します。コメントを添えて理由を伝えることができます。"
          />
        </div>
        <div className="mt-4 bg-white rounded-lg p-3 border border-orange-200">
          <p className="font-medium text-orange-800 mb-2 text-sm">⚠️ レビューの判断ポイント</p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• 提案の目的は明確ですか？</li>
            <li>• 利用規約に沿った使い方ですか？</li>
            <li>• 個人情報・機密情報の取り扱いは適切ですか？</li>
            <li>• 実現可能な内容ですか？</li>
          </ul>
        </div>
      </StepCard>

      {/* Step 4 */}
      <StepCard
        id="step4"
        step={4}
        title="実行管理"
        description="合成データの生成・実行の状況を管理します。提出された実行リクエストをレビューし、結果を確認できます。"
        icon="⚙️"
        color="purple"
      >
        <div className="space-y-2">
          <OperationItem
            label="実行一覧を確認する"
            detail="「実行管理」メニューから、すべての実行リクエストの状況を確認できます。"
            link="/hr/submissions"
          />
          <OperationItem
            label="実行の詳細を確認する"
            detail="実行をクリックすると、使用したパラメータ・実行結果・ダウンロードリンクなどを確認できます。"
          />
          <OperationItem
            label="実行リクエストを承認・却下する"
            detail="実行前にレビューが必要な場合、承認または却下の対応を行います。"
          />
        </div>
      </StepCard>

      {/* FAQ */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">❓ よくある質問</h2>
        <div className="space-y-4">
          {[
            {
              q: "データセットを公開したあと、非公開に戻せますか？",
              a: "はい、データセット詳細ページから「非公開にする」ボタンで非公開に戻せます。非公開にすると、データ利用者はアクセスできなくなります。",
            },
            {
              q: "提案を承認したら、次に何をすればいいですか？",
              a: "承認後、データ利用者が実行リクエストを提出します。実行管理ページで状況を確認し、必要に応じてレビューを行ってください。",
            },
            {
              q: "複数の担当者でレビューできますか？",
              a: "現在のシステムでは、データオーナーロールを持つすべてのユーザーが提案・実行のレビューを行えます。",
            },
          ].map((faq, i) => (
            <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
              <p className="font-medium text-gray-800 mb-1">Q. {faq.q}</p>
              <p className="text-sm text-gray-600">A. {faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <Link to="/manual" className="text-blue-600 hover:underline text-sm">← マニュアルトップへ</Link>
        <Link to="/manual/proposer" className="text-blue-600 hover:underline text-sm">データ利用者向けマニュアル →</Link>
      </div>
    </div>
  );
}
