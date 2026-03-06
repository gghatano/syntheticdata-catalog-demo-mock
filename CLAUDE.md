# CLAUDE.md - 合成データカタログ デモサイト

## プロジェクト概要

GitHub Pages で公開する静的デモサイト（React + Vite + TypeScript + Tailwind CSS v3）。
本番アプリ（FastAPI + SQLite）の全18画面をクライアントサイドのみで再現する。

## 技術スタック

- React 18 + TypeScript 5 + Vite 5
- Tailwind CSS 3（PostCSS 経由）
- React Router 6（HashRouter - GitHub Pages 対応）
- Chart.js + react-chartjs-2（ヒストグラム）
- react-markdown（レポート表示）
- Node.js 18+

## 開発コマンド

```bash
npm run dev      # 開発サーバー起動 (http://localhost:5173)
npm run build    # 本番ビルド (dist/)
npm run preview  # ビルド結果のプレビュー
npm run lint     # ESLint
```

## ディレクトリ構成

```
src/
├── types/models.ts          # 全データモデル型定義
├── data/                    # モックデータ（TypeScript 定数）
├── store/session.ts         # sessionStorage ベース状態管理
├── utils/
│   ├── format.ts            # 日付・数値フォーマット
│   └── data.ts              # データ取得ヘルパー（getUserDisplayName 等）
├── components/
│   ├── common/              # StatusBadge, DataTable, Toast, ActionButton, ReviewList
│   └── layout/              # Navbar, Layout, RequireAuth
├── pages/
│   ├── LoginPage.tsx, DashboardPage.tsx
│   ├── hr/                  # HR 系 7 画面
│   └── proposer/            # Proposer 系 9 画面
```

## 開発ワークフロー

### Git Worktree を使った Issue 対応

Issue ごとに git worktree を使い、メインの作業ディレクトリを汚さずに開発する。

```bash
# 1. worktree 作成（Issue #3 の例）
git worktree add ../syntheticdata-catalog-demo-mock-issue-3 -b feature/issue-3

# 2. worktree で作業
cd ../syntheticdata-catalog-demo-mock-issue-3
npm install
# ... 実装 ...

# 3. コミット & プッシュ
git add -A && git commit -m "fix: ..."
git push -u origin feature/issue-3

# 4. PR 作成
gh pr create --base main --title "..." --body "..."

# 5. マージ後に worktree を削除
cd /home/hatano/works/syntheticdata-catalog-demo-mock
git worktree remove ../syntheticdata-catalog-demo-mock-issue-3
git branch -d feature/issue-3
```

### Claude Code Agent での Issue 対応

Claude Code で Issue を解決する際は、Agent の `isolation: "worktree"` を活用する。
これにより自動的に git worktree が作成され、メインブランチに影響を与えずに作業できる。

```
/1_issue_plan <issue番号>   # 実装計画を作成
/2_issue_impl <issue番号>   # 計画に基づいて実装
```

## コーディング規約

- 共通のデータ取得は `src/utils/data.ts` のヘルパーを使う（getUserDisplayName, getDatasetName 等）
- 状態変更は `src/store/session.ts` のミューテーション関数を使う（publishDataset, setSubmissionStatus 等）
- テーブル表示は `DataTable` コンポーネントを使う
- レビュー履歴の表示は `ReviewList` コンポーネントを使う
- ステータス表示は `StatusBadge` / `PublishBadge` を使う
- Toast 通知は `useToast()` フックを使う
- ファイル種別の日本語表示は `FILE_TYPE_LABELS` を使う
- ロールガードは `RequireAuth` の `role` プロパティで制御

## デプロイ

- main ブランチへの push で GitHub Actions が自動デプロイ
- 公開URL: https://gghatano.github.io/syntheticdata-catalog-demo-mock/
- Vite の `base` 設定: `/syntheticdata-catalog-demo-mock/`

## 仕様書

詳細な仕様は `docs/` ディレクトリを参照:
- `00-overview.md` - 全体概要
- `01-architecture.md` - アーキテクチャ
- `02-screens.md` - 画面仕様（全18画面）
- `03-mock-data.md` - モックデータ仕様
- `04-interactions.md` - インタラクション仕様
- `05-deployment.md` - デプロイ手順
- `06-testing.md` - テスト方針
