# モックデータ仕様

## 概要

すべてのデータは TypeScript ファイル内に定数として定義する。JSON ファイルではなく TypeScript を使うことで、型安全性を保証し、IDE の補完を活用できる。

## 型定義

```typescript
// types/models.ts

// ユーザーロール
type UserRole = "hr" | "proposer" | "admin";

// ファイル種別
type FileType = "employee_master" | "project_allocation" | "working_hours";

// 提出物ステータス
type SubmissionStatus =
  | "draft" | "submitted" | "validation_failed" | "under_review"
  | "approved" | "rejected"
  | "executed_synthetic" | "executed_real" | "execution_failed";

// 提案ステータス
type ProposalStatus =
  | "draft" | "submitted" | "under_review"
  | "approved" | "rejected"
  | "executed_synthetic" | "executed_real" | "execution_failed";

// レビューアクション
type ReviewAction = "approve" | "reject" | "comment";

// 実行モード
type ExecutionMode = "synthetic" | "real";

// データリクエストステータス
type DataRequestStatus = "open" | "in_progress" | "completed" | "closed";

// --- エンティティ ---

interface User {
  user_id: string;
  display_name: string;
  role: UserRole;
  department: string;
}

interface Dataset {
  dataset_id: string;
  name: string;
  owner_user_id: string;
  is_published: boolean;
  description: string;
  tags: string[];
  created_at: string;       // ISO 8601
  files: DatasetFile[];
  synthetic_artifacts: SyntheticArtifact[];
  quality_report: QualityReport | null;
  catalog: CatalogColumn[];
}

interface DatasetFile {
  file_type: FileType;
  file_path: string;
  created_at: string;
}

interface SyntheticArtifact {
  file_type: FileType;
  file_path: string;
  seed: number;
  created_at: string;
}

interface QualityReport {
  overall_score: number;           // 0.0 - 1.0
  file_reports: FileQualityReport[];
}

interface FileQualityReport {
  file_type: FileType;
  row_count_original: number;
  row_count_synthetic: number;
  column_correlation: number;      // 0.0 - 1.0
  distribution_similarity: number; // 0.0 - 1.0
  statistical_parity: number;      // 0.0 - 1.0
}

interface CatalogColumn {
  column_name: string;
  inferred_type: string;           // "integer" | "string" | "float" | "date" | "boolean"
  is_pii: boolean;
  pii_reason: string | null;
  description: string;
  stats: ColumnStats;
}

interface ColumnStats {
  count: number;
  null_count: number;
  unique_count: number;
  min?: number | string;
  max?: number | string;
  mean?: number;
  std?: number;
  histogram?: { bins: string[]; counts: number[] };
}

interface Submission {
  submission_id: string;
  dataset_id: string;
  user_id: string;
  title: string;
  description: string;
  status: SubmissionStatus;
  created_at: string;
}

interface Execution {
  execution_id: string;
  submission_id: string;
  executor_user_id: string;
  mode: ExecutionMode;
  status: "queued" | "running" | "succeeded" | "failed" | "timeout";
  stdout: string;
  result_json: Record<string, unknown> | null;
  result_scope: "private" | "submitter" | "public";
  created_at: string;
}

interface Proposal {
  proposal_id: string;
  dataset_id: string;
  user_id: string;
  title: string;
  summary: string;
  code: string;              // analysis.py の内容（文字列）
  report: string;            // report.md の内容（Markdown 文字列）
  status: ProposalStatus;
  reviews: ReviewComment[];
  created_at: string;
}

interface ReviewComment {
  id: number;
  reviewer_user_id: string;
  action: ReviewAction;
  comment: string;
  created_at: string;
}

interface DataRequest {
  request_id: string;
  user_id: string;
  title: string;
  description: string;
  desired_columns: string | null;
  showcase_proposal_id: string | null;
  status: DataRequestStatus;
  vote_count: number;
  created_at: string;
}
```

## モックデータの内容

### ユーザー（3名）

```typescript
// data/users.ts
export const USERS: User[] = [
  {
    user_id: "hr_demo",
    display_name: "HR太郎",
    role: "hr",
    department: "人事部",
  },
  {
    user_id: "user_demo_01",
    display_name: "分析一郎",
    role: "proposer",
    department: "データサイエンス部",
  },
  {
    user_id: "user_demo_02",
    display_name: "分析二郎",
    role: "proposer",
    department: "経営企画部",
  },
];
```

### データセット（3件）

| ID | 名前 | オーナー | 公開 | 説明 |
|----|------|---------|------|------|
| DS0001 | 従業員スキル分析データ | hr_demo | 公開済み | 従業員のスキル・プロジェクト配置・稼働時間の分析用データセット |
| DS0002 | 部門別パフォーマンスデータ | hr_demo | 公開済み | 部門ごとの業績・稼働・離職率の分析用データセット |
| DS0003 | 新卒採用分析データ | hr_demo | 非公開 | 新卒採用プロセスの分析用データセット（準備中） |

各データセットに以下を含める:
- **files**: 3種類の CSV ファイル参照
- **synthetic_artifacts**: 公開済みデータセットには合成データあり
- **quality_report**: 公開済みデータセットには品質レポートあり（スコア 0.85-0.95）
- **catalog**: 各ファイルの列定義（合計 10-15 列）
- **tags**: `["人事", "スキル"]` など

### データプレビュー

各データセットの各ファイル種別に、先頭10行のプレビューデータを用意する。

```typescript
// data/profiles.ts
export const PREVIEWS: Record<string, Record<FileType, Record<string, unknown>[]>> = {
  DS0001: {
    employee_master: [
      { emp_id: "E001", name: "山田太郎", department: "開発部", join_date: "2020-04-01", grade: "G3", skill_score: 78 },
      { emp_id: "E002", name: "佐藤花子", department: "企画部", join_date: "2019-04-01", grade: "G4", skill_score: 85 },
      // ... 10行
    ],
    project_allocation: [
      { emp_id: "E001", project_id: "P101", role: "developer", start_date: "2024-01-01", allocation_pct: 80 },
      // ... 10行
    ],
    working_hours: [
      { emp_id: "E001", year_month: "2024-06", regular_hours: 160, overtime_hours: 20, remote_days: 12 },
      // ... 10行
    ],
  },
  // DS0002, DS0003 も同様
};
```

### 提出物（3件）

| ID | タイトル | ユーザー | データセット | ステータス |
|----|---------|---------|------------|-----------|
| SUB0001 | スキルギャップ分析 | user_demo_01 | DS0001 | executed_synthetic |
| SUB0002 | 稼働時間最適化モデル | user_demo_02 | DS0001 | approved |
| SUB0003 | 部門間異動シミュレーション | user_demo_01 | DS0002 | submitted |

### 実行結果（1件）

SUB0001 に紐づく実行結果:
- mode: synthetic
- status: succeeded
- stdout: 分析実行ログ（モック）
- result_json: スキルギャップのスコア・ランキング（モック）

### 提案（3件）

| ID | タイトル | ユーザー | データセット | ステータス |
|----|---------|---------|------------|-----------|
| PROP0001 | スキルマッチング最適化 | user_demo_01 | DS0001 | approved |
| PROP0002 | 残業時間予測モデル | user_demo_02 | DS0001 | submitted |
| PROP0003 | 離職リスク分析 | user_demo_01 | DS0002 | rejected |

各提案に以下を含める:
- **code**: Python コードサンプル（20-30行）
- **report**: Markdown レポート（分析概要、手法、結果の説明）
- **reviews**: PROP0001 は承認レビュー、PROP0003 は差戻しレビュー（コメント付き）

#### サンプルコード（PROP0001）

```python
"""スキルマッチング最適化 - 分析スクリプト"""
import pandas as pd
import json
import argparse

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--employee-master", required=True)
    parser.add_argument("--project-allocation", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    employees = pd.read_csv(args.employee_master)
    allocations = pd.read_csv(args.project_allocation)

    merged = employees.merge(allocations, on="emp_id")
    skill_gap = merged.groupby("department")["skill_score"].agg(["mean", "std"])

    result = {
        "summary": "部門別スキルギャップ分析",
        "departments": skill_gap.to_dict("index"),
        "recommendations": ["開発部のスキル標準偏差が大きい", "企画部は平均スコアが高い"]
    }

    with open(args.output, "w") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main()
```

#### サンプルレポート（PROP0001）

```markdown
# スキルマッチング最適化分析

## 目的
従業員のスキルスコアとプロジェクト配置の最適化を図る。

## 手法
- 従業員マスタとプロジェクト配置データを結合
- 部門別のスキルスコア分布を分析
- スキルギャップの大きい部門を特定

## 結果
- 開発部: 平均スコア 72.3、標準偏差 15.2（ばらつき大）
- 企画部: 平均スコア 81.5、標準偏差 8.7（安定）
- 営業部: 平均スコア 68.9、標準偏差 12.1

## 提言
1. 開発部のスキル底上げ研修を推奨
2. 企画部の高スキル人材をメンターとして活用
```

### データリクエスト（2件）

| ID | タイトル | ユーザー | ステータス | 投票数 |
|----|---------|---------|-----------|-------|
| REQ0001 | 研修受講履歴データの公開希望 | user_demo_01 | open | 3 |
| REQ0002 | 顧客満足度データの公開希望 | user_demo_02 | in_progress | 5 |

## データの配置と読み込み

各データファイルは `src/data/` 配下に TypeScript ファイルとして配置し、named export する。

```typescript
// 利用例
import { USERS } from "../data/users";
import { DATASETS } from "../data/datasets";
import { SUBMISSIONS } from "../data/submissions";

// ユーザー検索
const user = USERS.find(u => u.user_id === "hr_demo");

// 公開データセットのフィルタリング
const publishedDatasets = DATASETS.filter(d => d.is_published);
```
