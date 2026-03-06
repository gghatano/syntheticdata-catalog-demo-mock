# 静的デモサイト仕様書 - 全体概要

## 目的

本番の syntheticdata-catalog-demo（FastAPI + SQLite）とは別に、**GitHub Pages で公開可能な静的デモサイト**を構築する。サーバーサイド処理なしで、Webブラウザだけでシステムの機能・ワークフローを体験できるモックアップデモを提供する。

## 想定利用シーン

- ステークホルダーへのコンセプト説明
- 社内プレゼンテーション・デモ
- GitHub リポジトリからの直接アクセス（GitHub Pages URL を共有）

## 基本方針

| 項目 | 方針 |
|------|------|
| ホスティング | GitHub Pages（静的ファイルのみ） |
| バックエンド | なし（すべてクライアントサイドで完結） |
| データ | JSON ファイルに埋め込んだモックデータ |
| 状態管理 | sessionStorage によるセッション内の一時状態 |
| ビルドツール | Vite（軽量・高速、静的出力対応） |
| フレームワーク | React + TypeScript |
| UIライブラリ | CSS Modules または Tailwind CSS |
| ルーティング | React Router（HashRouter で GitHub Pages 対応） |

## 技術選定の理由

### なぜ React + Vite か

- **コンポーネント指向**: 画面数が多く（15画面以上）、再利用可能なコンポーネント（テーブル、バッジ、フォーム）が多い
- **状態管理が容易**: ロール切替・画面遷移の状態を自然に扱える
- **Vite の静的ビルド**: `vite build` で `dist/` に完全な静的ファイルを出力、GitHub Pages にそのままデプロイ可能
- **TypeScript**: モックデータの型安全性を保証
- **エコシステム**: Chart.js（React Chart.js 2）や Markdown レンダリング（react-markdown）のライブラリが豊富

### なぜ HashRouter か

GitHub Pages はSPAのルーティングをネイティブにサポートしないため、`HashRouter`（`/#/login`, `/#/dashboard`）を使用する。これにより 404 問題を回避できる。

## スコープ

### 含めるもの

- 本番アプリの全画面の再現（見た目・レイアウト）
- ロール切替によるナビゲーション変化
- モックデータによるデータ表示
- フォーム入力のシミュレーション（実際の送信はしないが、UI上の操作は可能）
- 画面遷移フロー
- データプロファイルのグラフ表示

### 含めないもの

- 実際のデータ処理（合成データ生成、スクリプト実行など）
- ファイルアップロード・ダウンロードの実処理
- データの永続化（ブラウザリロードでリセット）
- 認証・認可の実処理

## ドキュメント構成

| ファイル | 内容 |
|---------|------|
| [00-overview.md](./00-overview.md) | 本ドキュメント（全体概要） |
| [01-architecture.md](./01-architecture.md) | 技術アーキテクチャ・ディレクトリ構成 |
| [02-screens.md](./02-screens.md) | 画面一覧・画面仕様 |
| [03-mock-data.md](./03-mock-data.md) | モックデータ仕様 |
| [04-interactions.md](./04-interactions.md) | インタラクション・状態遷移仕様 |
| [05-deployment.md](./05-deployment.md) | ビルド・デプロイ手順 |
| [06-testing.md](./06-testing.md) | テスト方針 |

## Claude Code Agent Teams 構成

本プロジェクトは Claude Code Agent Teams で開発することを想定する。以下のスキル分担でチームを組むことを推奨する。

### 推奨エージェント構成

| エージェント名 | 役割 | 担当範囲 | 参照する仕様書 |
|--------------|------|---------|--------------|
| **architect** | 基盤構築 | プロジェクト初期化、Vite/React/Router/Tailwind のセットアップ、ディレクトリ構成の確立、共通型定義 | 01-architecture, 03-mock-data（型定義部分） |
| **data-author** | モックデータ整備 | `src/data/` 配下の全モックデータ作成、データ整合性テスト | 03-mock-data, 06-testing（Level 1） |
| **ui-components** | 共通コンポーネント | StatusBadge, DataTable, Navbar, Layout, Toast, FormGroup 等の共通部品とそのテスト | 02-screens（共通UIコンポーネント節）, 06-testing（Level 2） |
| **page-hr** | HR 画面実装 | HR 系の全ページ（データセット管理、提出物管理、提案レビュー）とページテスト | 02-screens（画面3-9）, 04-interactions（HR操作） |
| **page-proposer** | Proposer 画面実装 | Proposer 系の全ページ（データセット閲覧、提出、提案、データリクエスト）とページテスト | 02-screens（画面10-18）, 04-interactions（Proposer操作） |
| **session-store** | 状態管理 | sessionStorage ベースの状態管理層、mutations マージロジック、ユニットテスト | 01-architecture（状態管理節）, 04-interactions, 06-testing（Level 1） |
| **e2e-qa** | E2E テスト・品質保証 | Playwright E2E テスト、全シナリオの自動テスト、CI 設定 | 04-interactions（デモシナリオ）, 05-deployment（CI）, 06-testing（Level 4） |

### 依存関係と実行順序

```
Phase 1（並行可能）:
  architect ──── プロジェクト初期化・型定義
  data-author ── モックデータ作成

Phase 2（Phase 1 完了後、並行可能）:
  session-store ── 状態管理層
  ui-components ── 共通コンポーネント

Phase 3（Phase 2 完了後、並行可能）:
  page-hr ─────── HR 全画面
  page-proposer ── Proposer 全画面

Phase 4（Phase 3 完了後）:
  e2e-qa ──────── E2E テスト・最終品質確認
```

### 各エージェントへの指示のポイント

**architect**:
- `vite.config.ts` の `base` を GitHub Pages 用に設定すること
- HashRouter を採用すること（GitHub Pages 制約）
- Tailwind CSS のカラーテーマを本番アプリ（#2c3e50 ベース）に揃えること

**data-author**:
- 型定義は architect が作成した `types/models.ts` に従うこと
- データ間の参照整合性（ユーザーID、データセットID）を必ず保つこと
- 整合性テストを書いて自己検証すること

**ui-components**:
- 本番アプリのバッジ色（緑/赤/青/黄/灰）を Tailwind クラスで再現すること
- Navbar はロール（hr/proposer）に応じてリンクを切り替えること
- 各コンポーネントに最低1つのテストを書くこと

**page-hr / page-proposer**:
- 画面間のリンク・遷移が正しく動作することを確認すること
- インタラクション（承認、投票など）は session-store の API を使うこと
- フォーム送信のシミュレーションでは Toast で「デモです」通知を出すこと

**session-store**:
- `loadState` → `mutations をマージ` → `表示` のフローを守ること
- sessionStorage が空・破損の場合のフォールバック処理を入れること

**e2e-qa**:
- 04-interactions.md のデモシナリオ 4 本をそのまま自動テスト化すること
- ロール横断テスト（HR で承認 → Proposer で結果確認）を含めること
- CI（GitHub Actions）でのヘッドレス実行を前提に設定すること

## 本番アプリとの対応

```
本番（FastAPI + SQLite）           静的デモ（React + Vite）
─────────────────────             ─────────────────────
FastAPI ルーター            →     React Router (HashRouter)
Jinja2 テンプレート          →     React コンポーネント
SQLAlchemy + SQLite        →     JSON モックデータ
HTMX 動的更新              →     React state 更新
セッション認証              →     sessionStorage 擬似認証
ファイルアップロード         →     フォーム UI のみ（処理なし）
```
