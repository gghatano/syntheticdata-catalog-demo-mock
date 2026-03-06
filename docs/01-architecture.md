# 技術アーキテクチャ

## 技術スタック

| カテゴリ | 技術 | バージョン | 用途 |
|---------|------|----------|------|
| ランタイム | Node.js | 20+ | ビルド環境 |
| ビルドツール | Vite | 6.x | バンドル・開発サーバー |
| フレームワーク | React | 19.x | UI コンポーネント |
| 言語 | TypeScript | 5.x | 型安全性 |
| ルーティング | React Router | 7.x | SPA ルーティング |
| スタイリング | Tailwind CSS | 4.x | ユーティリティファースト CSS |
| グラフ | Chart.js + react-chartjs-2 | 4.x / 5.x | データプロファイルの可視化 |
| Markdown | react-markdown | 9.x | レポート表示 |
| パッケージ管理 | npm | - | 依存関係管理 |

## ディレクトリ構成

```
syntheticdata-catalog-demo-site/    # 別リポジトリ
├── index.html                       # エントリポイント
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── public/
│   └── favicon.ico
├── src/
│   ├── main.tsx                     # React エントリポイント
│   ├── App.tsx                      # ルーティング定義
│   ├── types/
│   │   └── models.ts                # データモデル型定義
│   ├── data/
│   │   ├── users.ts                 # ユーザーモックデータ
│   │   ├── datasets.ts              # データセットモックデータ
│   │   ├── submissions.ts           # 提出物モックデータ
│   │   ├── proposals.ts             # 提案モックデータ
│   │   ├── executions.ts            # 実行結果モックデータ
│   │   ├── catalog.ts               # カタログモックデータ
│   │   ├── profiles.ts              # プロファイルモックデータ
│   │   └── data-requests.ts         # データリクエストモックデータ
│   ├── store/
│   │   └── session.ts               # sessionStorage ベースの状態管理
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx           # ナビゲーションバー
│   │   │   ├── Layout.tsx           # 共通レイアウト
│   │   │   └── RequireAuth.tsx      # 認証ガード
│   │   ├── common/
│   │   │   ├── StatusBadge.tsx      # ステータスバッジ
│   │   │   ├── DataTable.tsx        # 汎用テーブル
│   │   │   ├── FormGroup.tsx        # フォームグループ
│   │   │   ├── ActionButton.tsx     # アクションボタン
│   │   │   └── Toast.tsx            # 操作フィードバック通知
│   │   ├── hr/
│   │   │   ├── DatasetForm.tsx      # データセット作成フォーム
│   │   │   ├── CatalogEditor.tsx    # カタログ編集
│   │   │   ├── SyntheticSection.tsx  # 合成データセクション
│   │   │   ├── SubmissionActions.tsx  # 提出物承認/却下
│   │   │   └── ReviewForm.tsx       # 提案レビューフォーム
│   │   └── proposer/
│   │       ├── DatasetSearch.tsx     # データセット検索
│   │       ├── ProfileViewer.tsx     # データプロファイル表示
│   │       ├── QualityReport.tsx     # 品質レポート表示
│   │       ├── SubmissionForm.tsx    # 提出フォーム
│   │       ├── ProposalForm.tsx      # 提案フォーム
│   │       └── DataRequestForm.tsx   # データリクエストフォーム
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── hr/
│   │   │   ├── HrDatasetsPage.tsx
│   │   │   ├── HrDatasetDetailPage.tsx
│   │   │   ├── HrCatalogEditPage.tsx
│   │   │   ├── HrSubmissionsPage.tsx
│   │   │   ├── HrExecutionDetailPage.tsx
│   │   │   ├── HrProposalsPage.tsx
│   │   │   └── HrProposalDetailPage.tsx
│   │   └── proposer/
│   │       ├── ProposerDatasetsPage.tsx
│   │       ├── ProposerDatasetDetailPage.tsx
│   │       ├── ProposerSubmissionsPage.tsx
│   │       ├── ProposerSubmissionFormPage.tsx
│   │       ├── ProposerSubmissionDetailPage.tsx
│   │       ├── ProposerProposalsPage.tsx
│   │       ├── ProposerProposalFormPage.tsx
│   │       ├── ProposerProposalDetailPage.tsx
│   │       └── DataRequestsPage.tsx
│   └── utils/
│       ├── format.ts                # 日付・数値フォーマット
│       └── demo-scenario.ts        # デモシナリオ制御
└── .github/
    └── workflows/
        └── deploy.yml               # GitHub Pages デプロイ
```

## ルーティング定義

HashRouter を使用し、本番アプリの URL 構造に対応する。

```typescript
// App.tsx
<HashRouter>
  <Routes>
    {/* 認証 */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/" element={<Navigate to="/login" />} />

    {/* 認証必須エリア */}
    <Route element={<RequireAuth />}>
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* HR 画面 */}
        <Route path="/hr/datasets" element={<HrDatasetsPage />} />
        <Route path="/hr/datasets/:id" element={<HrDatasetDetailPage />} />
        <Route path="/hr/datasets/:id/catalog" element={<HrCatalogEditPage />} />
        <Route path="/hr/submissions" element={<HrSubmissionsPage />} />
        <Route path="/hr/executions/:id" element={<HrExecutionDetailPage />} />
        <Route path="/hr/proposals" element={<HrProposalsPage />} />
        <Route path="/hr/proposals/:id" element={<HrProposalDetailPage />} />

        {/* Proposer 画面 */}
        <Route path="/proposer/datasets" element={<ProposerDatasetsPage />} />
        <Route path="/proposer/datasets/:id" element={<ProposerDatasetDetailPage />} />
        <Route path="/proposer/submissions" element={<ProposerSubmissionsPage />} />
        <Route path="/proposer/submissions/new" element={<ProposerSubmissionFormPage />} />
        <Route path="/proposer/submissions/:id" element={<ProposerSubmissionDetailPage />} />
        <Route path="/proposer/proposals" element={<ProposerProposalsPage />} />
        <Route path="/proposer/proposals/new" element={<ProposerProposalFormPage />} />
        <Route path="/proposer/proposals/:id" element={<ProposerProposalDetailPage />} />
        <Route path="/proposer/data-requests" element={<DataRequestsPage />} />
      </Route>
    </Route>
  </Routes>
</HashRouter>
```

## 状態管理

グローバルな状態管理ライブラリは使用せず、以下のシンプルな構成で管理する。

### sessionStorage（セッション状態）

```typescript
// store/session.ts
interface SessionState {
  currentUser: User | null;         // ログイン中のユーザー
  mutatedData: MutatedData;         // デモ中に変更されたデータ
}

interface MutatedData {
  publishedDatasets: string[];      // 公開操作されたデータセット ID
  approvedSubmissions: string[];    // 承認された提出物 ID
  reviewedProposals: Record<string, ReviewAction>;  // レビュー済み提案
  votes: Record<string, boolean>;   // 投票済みデータリクエスト
}
```

### データフロー

```
JSON モックデータ（静的・不変）
        ↓
    読み込み
        ↓
sessionStorage の変更差分を適用
        ↓
    React State
        ↓
    画面描画
```

ユーザーの操作（承認、レビューなど）は sessionStorage に差分として保存される。画面表示時にモックデータと差分をマージして表示する。ブラウザリロードでもセッション内であれば状態が保持される。
