# ビルド・デプロイ手順

## リポジトリのセットアップ

### 1. 新規リポジトリ作成

```bash
# リポジトリ作成（GitHub 上で作成後）
git clone https://github.com/<org>/syntheticdata-catalog-demo-site.git
cd syntheticdata-catalog-demo-site
```

### 2. プロジェクト初期化

```bash
# Vite + React + TypeScript プロジェクト作成
npm create vite@latest . -- --template react-ts

# 依存関係インストール
npm install react-router-dom
npm install react-markdown
npm install chart.js react-chartjs-2
npm install -D tailwindcss @tailwindcss/vite

# 開発用依存関係
npm install
```

### 3. Vite 設定

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/syntheticdata-catalog-demo-site/", // GitHub Pages のベースパス
});
```

### 4. Tailwind CSS 設定

```css
/* src/index.css */
@import "tailwindcss";
```

## ローカル開発

```bash
# 開発サーバー起動
npm run dev
# → http://localhost:5173 で確認

# ビルド
npm run build
# → dist/ に静的ファイル出力

# ビルド結果のプレビュー
npm run preview
```

## GitHub Pages デプロイ

### GitHub Actions による自動デプロイ

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci
      - run: npm run build

      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### GitHub リポジトリ設定

1. リポジトリの Settings → Pages へ
2. Source: 「GitHub Actions」を選択
3. main ブランチに push すると自動デプロイ

### 公開 URL

```
https://<org>.github.io/syntheticdata-catalog-demo-site/
```

## デプロイ後の確認項目

- [ ] ログイン画面が表示される
- [ ] 各ユーザーでログインできる
- [ ] ロールに応じたナビゲーションが表示される
- [ ] 全画面への遷移が正常に動作する
- [ ] HashRouter によるルーティングがリロード後も機能する
- [ ] モックデータが正しく表示される
- [ ] プロファイルのグラフが表示される
- [ ] Markdown レポートが正しくレンダリングされる
- [ ] インタラクション（承認、投票など）が sessionStorage に保存される
- [ ] Toast 通知が表示される
- [ ] デモガイドが正常に動作する
- [ ] モバイルブラウザでの表示が崩れていない

## メンテナンス

### 本番アプリとの同期

本番アプリに新機能が追加された場合:

1. 本仕様書（`doc/static-demo-spec/`）を更新
2. 対応する画面・モックデータをデモサイトに追加
3. main ブランチに push → 自動デプロイ

### モックデータの更新

`src/data/` 配下の TypeScript ファイルを編集するだけで、ビルド時に自動的に反映される。

### スタイルの変更

Tailwind CSS のユーティリティクラスを変更するか、必要に応じて `tailwind.config.ts` でカスタムテーマを定義する。本番アプリのカラースキーム（#2c3e50 ベース）に合わせることを推奨する。
