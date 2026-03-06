import { Proposal } from "../types/models";

export const PROPOSALS: Proposal[] = [
  {
    proposal_id: "PROP0001",
    dataset_id: "DS0001",
    user_id: "user_demo_01",
    title: "スキルマッチング最適化",
    summary: "従業員のスキルスコアとプロジェクト配置の最適化を図る分析提案。部門別のスキル分布を分析し、適材適所の人材配置を推奨する。",
    code: `"""スキルマッチング最適化 - 分析スクリプト"""
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
        "recommendations": [
            "開発部のスキル標準偏差が大きい",
            "企画部は平均スコアが高い"
        ]
    }

    with open(args.output, "w") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main()`,
    report: `# スキルマッチング最適化分析

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
2. 企画部の高スキル人材をメンターとして活用`,
    status: "approved",
    reviews: [
      {
        id: 1,
        reviewer_user_id: "hr_demo",
        action: "comment",
        comment: "分析手法について、もう少し詳しい説明をお願いします。特にスキルスコアの算出根拠について。",
        created_at: "2024-07-05T15:00:00Z",
      },
      {
        id: 2,
        reviewer_user_id: "hr_demo",
        action: "approve",
        comment: "修正内容を確認しました。分析手法が適切であり、結果も有用です。承認します。",
        created_at: "2024-07-08T10:00:00Z",
      },
    ],
    created_at: "2024-07-01T09:00:00Z",
  },
  {
    proposal_id: "PROP0002",
    dataset_id: "DS0001",
    user_id: "user_demo_02",
    title: "残業時間予測モデル",
    summary: "過去の稼働データから残業時間を予測するモデルを構築。部門・等級・プロジェクト数を説明変数として、月次の残業時間を予測する。",
    code: `"""残業時間予測モデル - 分析スクリプト"""
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
import json
import argparse

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--employee-master", required=True)
    parser.add_argument("--working-hours", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    employees = pd.read_csv(args.employee_master)
    hours = pd.read_csv(args.working_hours)

    merged = hours.merge(employees, on="emp_id")
    features = pd.get_dummies(merged[["department", "grade"]])
    target = merged["overtime_hours"]

    model = LinearRegression()
    model.fit(features, target)

    result = {
        "r2_score": round(model.score(features, target), 3),
        "top_features": ["department_開発部", "grade_G5"],
        "prediction_summary": {
            "mean_predicted": round(target.mean(), 1),
            "std_predicted": round(target.std(), 1),
        }
    }

    with open(args.output, "w") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main()`,
    report: `# 残業時間予測モデル

## 目的
過去の稼働データから将来の残業時間を予測し、労務管理に活用する。

## 手法
- 従業員マスタと稼働時間データを結合
- 部門・等級をダミー変数化
- 線形回帰モデルで残業時間を予測

## 結果
- R2スコア: 0.72（中程度の予測精度）
- 主要な説明変数: 部門（開発部が最大）、等級（G5が高い）
- 平均予測残業時間: 18.7時間/月

## 今後の課題
1. 非線形モデル（ランダムフォレスト等）の検討
2. 季節性の考慮（年末年始、決算期）`,
    status: "submitted",
    reviews: [],
    created_at: "2024-07-20T14:00:00Z",
  },
  {
    proposal_id: "PROP0003",
    dataset_id: "DS0002",
    user_id: "user_demo_01",
    title: "離職リスク分析",
    summary: "従業員の離職リスクを予測するモデルを構築。業績評価・勤続年数・稼働時間を元に、離職確率を算出する。",
    code: `"""離職リスク分析 - 分析スクリプト"""
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import json
import argparse

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--employee-master", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    df = pd.read_csv(args.employee_master)
    features = df[["performance_score", "tenure_years"]]
    target = df["is_resigned"]

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(features, target)

    result = {
        "accuracy": round(model.score(features, target), 3),
        "feature_importance": {
            "performance_score": 0.45,
            "tenure_years": 0.55,
        }
    }

    with open(args.output, "w") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main()`,
    report: `# 離職リスク分析

## 目的
従業員の離職リスクを予測し、早期の対策を可能にする。

## 手法
- パフォーマンスデータから特徴量を抽出
- ランダムフォレストで離職予測モデルを構築

## 結果
- 精度: 0.85
- 重要な特徴量: 勤続年数（0.55）、業績評価（0.45）

## 課題
- サンプルサイズが小さく、過学習の懸念あり
- 外部要因（景気動向等）が考慮されていない`,
    status: "rejected",
    reviews: [
      {
        id: 1,
        reviewer_user_id: "hr_demo",
        action: "reject",
        comment: "分析の方向性は良いですが、以下の点で改善が必要です：\n1. サンプルサイズ300件に対してランダムフォレストは過学習のリスクが高い\n2. 交差検証による評価が必要\n3. 離職の定義（自己都合/会社都合）を明確にしてください",
        created_at: "2024-08-05T11:00:00Z",
      },
    ],
    created_at: "2024-08-01T09:00:00Z",
  },
];
