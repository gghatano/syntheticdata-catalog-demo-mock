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
    teal: "border-teal-500 bg-teal-50",
  };
  const badgeMap: Record<string, string> = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    orange: "bg-orange-500",
    purple: "bg-purple-500",
    teal: "bg-teal-500",
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
    { label: "データセットを\n探す", icon: "🔍", color: "bg-blue-100 border-blue-300" },
    { label: "活用提案を\n作成", icon: "💡", color: "bg-green-100 border-green-300" },
    { label: "レビュー待ち\n（承認待ち）", icon: "⏳", color: "bg-orange-100 border-orange-300" },
    { label: "分析実行リクエスト\nを提出", icon: "🚀", color: "bg-purple-100 border-purple-300" },
    { label: "結果を\n確認・活用", icon: "📊", color: "bg-teal-100 border-teal-300" },
  ];

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <h3 className="font-semibold text-gray-700 mb-4 text-center">データ利用者の基本的な流れ</h3>
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

export function ProposerManualPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-8 border border-green-100">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">🔍</span>
          <h1 className="text-3xl font-bold text-gray-800">データ利用者向けマニュアル</h1>
        </div>
        <p className="text-gray-600 text-lg mb-4">
          データを活用したい研究者・分析者（データ利用者）向けの操作マニュアルです。
          データセットの探し方から、合成データの活用までを解説します。
        </p>
        <div className="flex flex-wrap gap-2">
          <Link to="/manual" className="text-sm text-green-700 hover:underline">← マニュアルトップへ</Link>
          <span className="text-gray-300">|</span>
          <Link to="/manual/glossary" className="text-sm text-green-700 hover:underline">用語集</Link>
          <span className="text-gray-300">|</span>
          <Link to="/manual/hr" className="text-sm text-green-700 hover:underline">データオーナー向けマニュアル</Link>
        </div>
      </div>

      {/* Flow Diagram */}
      <FlowDiagram />

      {/* このマニュアルで学べること */}
      <div className="bg-green-50 rounded-xl p-5 border border-green-100">
        <h2 className="font-semibold text-green-800 mb-3">📌 このマニュアルで学べること</h2>
        <ul className="space-y-1 text-sm text-green-900">
          <li>✅ データセットを探して内容を確認する方法</li>
          <li>✅ データの活用提案を作成・提出する方法</li>
          <li>✅ 合成データの分析実行リクエストを提出する方法</li>
          <li>✅ 全体の提案を参照・いいねする方法</li>
          <li>✅ データ公開リクエストを送る方法</li>
        </ul>
      </div>

      {/* Step 1 */}
      <StepCard
        id="step1"
        step={1}
        title="データセットを探す"
        description="活用したいデータセットを見つけます。一覧から内容を確認し、自分の目的に合ったデータセットを選びましょう。"
        icon="🔍"
        color="blue"
      >
        <div className="space-y-2">
          <OperationItem
            label="データセット一覧を見る"
            detail="「データセット」メニューから公開されているデータセットの一覧を確認できます。"
            link="/proposer/datasets"
          />
          <OperationItem
            label="データセットの詳細を確認する"
            detail="データセット名をクリックすると、テーブル構成・利用規約・ユースケース例・サンプルデータなどの詳細情報を確認できます。"
          />
          <OperationItem
            label="いいねをつける"
            detail="興味のあるデータセットにいいね（♡）をつけると、全体への関心度を示せます。"
          />
        </div>
        <div className="mt-4 bg-white rounded-lg p-3 border border-blue-200 text-sm">
          <p className="font-medium text-blue-800 mb-1">💡 データセット選びのポイント</p>
          <p className="text-gray-600">
            詳細ページの「利用規約」「注意事項」を必ず確認してください。
            利用目的がデータオーナーの意図と合致しているかどうかも重要です。
          </p>
        </div>
      </StepCard>

      {/* Step 2 */}
      <StepCard
        id="step2"
        step={2}
        title="活用提案を作成する"
        description="データセットをどのように活用したいかを提案書にまとめて提出します。データオーナーのレビューを経て承認されます。"
        icon="💡"
        color="green"
      >
        <div className="space-y-2">
          <OperationItem
            label="マイ提案を管理する"
            detail="「マイ提案」メニューから自分の提案一覧を確認・管理できます。"
            link="/proposer/proposals"
          />
          <OperationItem
            label="新しい提案を作成する"
            detail="「新規提案」ボタンから提案書を作成します。タイトル・目的・使用するデータセット・期待する成果などを入力します。"
            link="/proposer/proposals/new"
          />
          <OperationItem
            label="提案の状態を確認する"
            detail="提案を提出すると「レビュー待ち」状態になります。データオーナーがレビューすると「承認」または「却下」に変わります。"
          />
        </div>
        <div className="mt-4 bg-white rounded-lg p-3 border border-green-200">
          <p className="font-medium text-green-800 mb-2 text-sm">📝 良い提案書のポイント</p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• <strong>目的を明確に：</strong>何のためにデータを使うのか具体的に書く</li>
            <li>• <strong>成果を示す：</strong>どんな分析・研究をしたいかを説明する</li>
            <li>• <strong>利用期間を記載：</strong>いつまでデータを使う予定か伝える</li>
            <li>• <strong>セキュリティに配慮：</strong>データの管理方法・共有範囲を明示する</li>
          </ul>
        </div>
      </StepCard>

      {/* Step 3 */}
      <StepCard
        id="step3"
        step={3}
        title="分析実行リクエストを提出する"
        description="提案が承認されたら、合成データの分析実行リクエストを提出します。パラメータを設定して生成を依頼します。"
        icon="🚀"
        color="purple"
      >
        <div className="space-y-2">
          <OperationItem
            label="マイ分析実行を管理する"
            detail="「マイ分析実行」メニューから自分の分析実行リクエスト一覧を確認できます。"
            link="/proposer/submissions"
          />
          <OperationItem
            label="新しい分析実行リクエストを作成する"
            detail="「新規分析実行リクエストを作成」ボタンから分析実行リクエストを作成します。使用するデータセット・行数・ファイル形式などのパラメータを設定します。"
            link="/proposer/submissions/new"
          />
          <OperationItem
            label="実行結果を確認する"
            detail="実行が完了すると「完了」状態になります。結果ファイルのダウンロードリンクが表示されます。"
          />
        </div>
        <div className="mt-4 bg-white rounded-lg p-3 border border-purple-200">
          <p className="font-medium text-purple-800 mb-2 text-sm">⚙️ 実行パラメータについて</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div className="flex items-center gap-1"><span>📊</span> 生成するデータの行数</div>
            <div className="flex items-center gap-1"><span>📁</span> 出力ファイル形式（CSV/JSON等）</div>
            <div className="flex items-center gap-1"><span>🔀</span> ランダムシード値</div>
            <div className="flex items-center gap-1"><span>📅</span> データの期間・範囲</div>
          </div>
        </div>
      </StepCard>

      {/* Step 4 */}
      <StepCard
        id="step4"
        step={4}
        title="全体の提案を活用する"
        description="他のユーザーの提案を参照したり、いいねをつけて全体の活動に参加しましょう。"
        icon="🌐"
        color="teal"
      >
        <div className="space-y-2">
          <OperationItem
            label="全体の提案を見る"
            detail="「全体の提案」メニューから他のユーザーが公開した提案を閲覧できます。活用事例の参考になります。"
            link="/proposer/community"
          />
          <OperationItem
            label="提案にいいねをつける"
            detail="興味のある提案にいいね（♡）をつけることで、全体での注目度が上がります。"
          />
          <OperationItem
            label="注目の提案を確認する"
            detail="ダッシュボードの「注目のユースケース」セクションで、人気の提案をまとめて確認できます。"
            link="/dashboard"
          />
        </div>
      </StepCard>

      {/* Step 5 */}
      <StepCard
        id="step5"
        step={5}
        title="データ公開リクエストを送る"
        description="まだ公開されていないデータが必要な場合や、特定のデータを要望したい場合は、データ公開リクエストを送ることができます。"
        icon="📨"
        color="orange"
      >
        <div className="space-y-2">
          <OperationItem
            label="データ公開リクエスト一覧を見る"
            detail="「データ公開リクエスト」メニューから過去のリクエスト状況を確認できます。"
            link="/proposer/data-requests"
          />
          <OperationItem
            label="新しいリクエストを送る"
            detail="必要なデータの内容・理由・利用目的などを記入して送信します。データオーナーが確認・対応します。"
          />
        </div>
        <div className="mt-4 bg-white rounded-lg p-3 border border-orange-200 text-sm">
          <p className="font-medium text-orange-800 mb-1">💡 リクエストのコツ</p>
          <p className="text-gray-600">
            なぜそのデータが必要なのかを具体的に書くと、データオーナーに伝わりやすくなります。
            既存のデータセットで代替できないかも確認してみましょう。
          </p>
        </div>
      </StepCard>

      {/* FAQ */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">❓ よくある質問</h2>
        <div className="space-y-4">
          {[
            {
              q: "提案が却下されたらどうすればいいですか？",
              a: "却下理由を確認し、内容を修正して再提出することができます。データオーナーからのコメントを参考に、提案内容を改善してください。",
            },
            {
              q: "欲しいデータセットが見当たりません",
              a: "「データ公開リクエスト」機能を使って、データオーナーに新しいデータセットの作成を依頼できます。",
            },
            {
              q: "実行がなかなか完了しません",
              a: "合成データの生成には時間がかかる場合があります。「マイ分析実行」ページで状態を確認してください。「処理中」の場合はしばらくお待ちください。",
            },
            {
              q: "他の人の提案内容を参考にできますか？",
              a: "はい、「全体の提案」ページで承認済みの提案を閲覧できます。同様のユースケースを参考に提案を作成しましょう。",
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
        <Link to="/manual/hr" className="text-blue-600 hover:underline text-sm">← データオーナー向けマニュアル</Link>
        <Link to="/manual/glossary" className="text-blue-600 hover:underline text-sm">用語集 →</Link>
      </div>
    </div>
  );
}
