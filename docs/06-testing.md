# テスト方針

## 概要

静的デモサイトはバックエンドを持たないが、画面遷移・状態管理・データ表示のロジックが存在するため、適切なテストで品質を担保する。

## テストツール

| ツール | 用途 | 選定理由 |
|-------|------|---------|
| Vitest | テストランナー・アサーション | Vite ネイティブ対応、高速 |
| React Testing Library | コンポーネントテスト | ユーザー視点のテスト記述 |
| jsdom | DOM 環境 | Vitest の environment として使用 |
| Playwright | E2E テスト | クロスブラウザ対応、GitHub Actions で実行可能 |

### セットアップ

```bash
# ユニットテスト・コンポーネントテスト
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom

# E2E テスト
npm install -D @playwright/test
npx playwright install
```

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
  },
});
```

```typescript
// src/test/setup.ts
import "@testing-library/jest-dom";
```

## テストレベルと対象

### Level 1: ユニットテスト

ロジックを含むユーティリティ・ストア層を対象とする。

| 対象 | テスト内容 | ファイル例 |
|------|----------|----------|
| `store/session.ts` | 状態の保存・読み込み・リセット | `store/session.test.ts` |
| | mutations のマージが正しく動作するか | |
| | sessionStorage が空の場合のデフォルト値 | |
| `utils/format.ts` | 日付フォーマット、数値フォーマット | `utils/format.test.ts` |
| `data/*.ts` | モックデータの整合性（ID の一意性、参照先の存在） | `data/integrity.test.ts` |

#### モックデータ整合性テストの例

```typescript
// data/integrity.test.ts
import { USERS } from "../data/users";
import { DATASETS } from "../data/datasets";
import { SUBMISSIONS } from "../data/submissions";
import { PROPOSALS } from "../data/proposals";

describe("モックデータ整合性", () => {
  test("ユーザー ID が一意", () => {
    const ids = USERS.map(u => u.user_id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("データセットのオーナーが存在するユーザー", () => {
    const userIds = new Set(USERS.map(u => u.user_id));
    DATASETS.forEach(ds => {
      expect(userIds.has(ds.owner_user_id)).toBe(true);
    });
  });

  test("提出物の参照先データセットが存在する", () => {
    const datasetIds = new Set(DATASETS.map(d => d.dataset_id));
    SUBMISSIONS.forEach(sub => {
      expect(datasetIds.has(sub.dataset_id)).toBe(true);
    });
  });

  test("提案の参照先データセットとユーザーが存在する", () => {
    const datasetIds = new Set(DATASETS.map(d => d.dataset_id));
    const userIds = new Set(USERS.map(u => u.user_id));
    PROPOSALS.forEach(prop => {
      expect(datasetIds.has(prop.dataset_id)).toBe(true);
      expect(userIds.has(prop.user_id)).toBe(true);
    });
  });
});
```

#### SessionStore テストの例

```typescript
// store/session.test.ts
import { loadState, saveState, resetState } from "./session";

describe("SessionStore", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  test("初期状態はデフォルト値を返す", () => {
    const state = loadState();
    expect(state.currentUserId).toBeNull();
    expect(state.mutations.submissionStatus).toEqual({});
  });

  test("状態の保存と読み込みが往復する", () => {
    const state = loadState();
    state.currentUserId = "hr_demo";
    state.mutations.submissionStatus["SUB0001"] = "approved";
    saveState(state);

    const loaded = loadState();
    expect(loaded.currentUserId).toBe("hr_demo");
    expect(loaded.mutations.submissionStatus["SUB0001"]).toBe("approved");
  });

  test("リセットで初期状態に戻る", () => {
    const state = loadState();
    state.currentUserId = "hr_demo";
    saveState(state);

    resetState();
    const loaded = loadState();
    expect(loaded.currentUserId).toBeNull();
  });
});
```

### Level 2: コンポーネントテスト

React コンポーネントの表示と操作を対象とする。

| 対象 | テスト内容 |
|------|----------|
| `StatusBadge` | ステータスに応じた正しい色・ラベルが表示されるか |
| `DataTable` | データが正しい行数・列で表示されるか。空配列の場合のメッセージ |
| `Navbar` | HR ロールで HR 用リンクが表示されるか。Proposer ロールで Proposer 用リンクが表示されるか |
| `RequireAuth` | 未ログイン時にログイン画面へリダイレクトされるか |
| `Toast` | 表示後に自動消失するか |
| `ProfileViewer` | プロファイルテーブルの行クリックで詳細が展開されるか |
| `ReviewForm` | 承認/差戻し/コメントボタンでそれぞれ正しいアクションが発火するか |

#### コンポーネントテストの例

```typescript
// components/common/StatusBadge.test.tsx
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "./StatusBadge";

describe("StatusBadge", () => {
  test("approved は緑バッジで「承認済み」と表示", () => {
    render(<StatusBadge status="approved" />);
    const badge = screen.getByText("承認済み");
    expect(badge).toHaveClass("bg-green-100", "text-green-800");
  });

  test("rejected は赤バッジで「差戻し」と表示", () => {
    render(<StatusBadge status="rejected" />);
    const badge = screen.getByText("差戻し");
    expect(badge).toHaveClass("bg-red-100", "text-red-800");
  });
});
```

### Level 3: ページテスト（統合）

ページ単位で、ルーティング・データ表示・インタラクションを結合してテストする。

| 対象ページ | テスト内容 |
|-----------|----------|
| `LoginPage` | ユーザー選択 → ログインボタン → `/dashboard` に遷移するか |
| `DashboardPage` | HR ログイン時に HR 向けコンテンツが表示されるか。Proposer では Proposer 向けか |
| `HrSubmissionsPage` | 承認ボタンクリック → ステータスが `approved` に変わるか |
| `HrProposalDetailPage` | レビューフォーム送信 → レビュー履歴に追加されるか |
| `ProposerDatasetsPage` | 検索バー入力 → データセット一覧がフィルタリングされるか |
| `ProposerDatasetDetailPage` | プロファイルテーブルが表示され、行クリックで詳細展開されるか |
| `DataRequestsPage` | 投票ボタンクリック → 投票数が +1 され、ボタンが無効化されるか |

#### ページテストの例

```typescript
// pages/LoginPage.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { LoginPage } from "./LoginPage";

// ルーティングのモック
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

describe("LoginPage", () => {
  beforeEach(() => {
    sessionStorage.clear();
    mockNavigate.mockClear();
  });

  test("ユーザー選択してログインするとダッシュボードへ遷移", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await user.selectOptions(screen.getByRole("combobox"), "hr_demo");
    await user.click(screen.getByRole("button", { name: "ログイン" }));

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});
```

### Level 4: E2E テスト（Playwright）

デモシナリオ（04-interactions.md で定義）をそのまま自動テストとして実行する。

| シナリオ | テスト内容 |
|---------|----------|
| シナリオ 1: データセット管理 | HR ログイン → DS0003 詳細 → 合成データ生成アニメーション → 公開 → カタログ確認 |
| シナリオ 2: データ分析 | Proposer ログイン → データセット検索 → プロファイル確認 → 提案フォーム表示 |
| シナリオ 3: 提案レビュー | HR ログイン → PROP0002 レビュー → コメント入力 → 承認 → ステータス変化 |
| シナリオ 4: データリクエスト | Proposer ログイン → 投票 → 投票数増加・ボタン無効化 |
| クロスロール | HR でログイン → 操作 → ログアウト → Proposer でログイン → HR の操作結果が反映されているか |

#### E2E テストの例

```typescript
// e2e/scenario-review.spec.ts
import { test, expect } from "@playwright/test";

test("シナリオ3: HR が提案をレビューして承認する", async ({ page }) => {
  // ログイン
  await page.goto("/#/login");
  await page.selectOption("select", "hr_demo");
  await page.click("button:has-text('ログイン')");
  await expect(page).toHaveURL(/#\/dashboard/);

  // 提案一覧へ
  await page.click("a:has-text('提案')");
  await expect(page.locator("table")).toBeVisible();

  // PROP0002 のレビュー画面へ
  await page.click("a:has-text('PROP0002')");

  // レポートとコードが表示されている
  await expect(page.locator("h2:has-text('レポート')")).toBeVisible();
  await expect(page.locator("pre code")).toBeVisible();

  // レビュー送信
  await page.fill("textarea", "分析手法が適切です。承認します。");
  await page.click("button:has-text('承認')");

  // ステータスが変化
  await expect(page.locator(".badge:has-text('承認済み')")).toBeVisible();

  // レビュー履歴に追加されている
  await expect(page.locator("text=分析手法が適切です")).toBeVisible();
});
```

#### Playwright 設定

```typescript
// playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  webServer: {
    command: "npm run preview",
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: "http://localhost:4173",
  },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
  ],
});
```

## CI でのテスト実行

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  unit-and-component:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run test -- --run

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run build
      - run: npx playwright test
```

## テストの優先順位

実装時の推奨順序:

1. **モックデータ整合性テスト** — データの不整合はすべての画面に影響するため最初に書く
2. **SessionStore ユニットテスト** — 状態管理のバグは操作全体に波及する
3. **共通コンポーネントテスト**（StatusBadge, DataTable, Navbar） — 全画面で使われる
4. **主要ページテスト**（LoginPage, DashboardPage） — ユーザーが最初に触れる画面
5. **インタラクションテスト**（承認、レビュー、投票） — デモの目玉機能
6. **E2E テスト** — 全体のシナリオ確認は最後に

## カバレッジ目標

| レベル | 目標 | 備考 |
|-------|------|------|
| ユニットテスト（store, utils, data） | 100% | ロジックが少ないため完全カバレッジが現実的 |
| コンポーネントテスト | 全共通コンポーネント | 各コンポーネントに最低1テスト |
| ページテスト | 主要6画面 | Login, Dashboard, HR提出物, HR提案レビュー, Proposerデータセット, データリクエスト |
| E2E テスト | 4シナリオ | 04-interactions.md のデモシナリオをそのまま自動化 |
