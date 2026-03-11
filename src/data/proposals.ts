import { Proposal } from "../types/models";

export const PROPOSALS: Proposal[] = [
  {
    proposal_id: "SYNTH-PROP001",
    dataset_id: "SYNTH-DS001",
    user_id: "user_demo_01",
    title: "行員スキルマッチング最適化",
    summary: "行員のスキルスコアと店舗配置の最適化を図る分析提案。部門別のスキル分布を分析し、適材適所の人材配置を推奨する。",
    code: `"""行員スキルマッチング最適化 - 分析スクリプト"""
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
            "【サンプル】システム開発部のスキル標準偏差が大きい",
            "【サンプル】経営企画部は平均スコアが高い"
        ]
    }

    with open(args.output, "w") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main()`,
    report: `# 行員スキルマッチング最適化分析

## 目的
行員のスキルスコアと店舗配置の最適化を図る。

## 手法
- 行員マスタと店舗配置データを結合
- 部門別のスキルスコア分布を分析
- スキルギャップの大きい部門を特定

## 結果
- 【サンプル】システム開発部: 平均スコア 72.3、標準偏差 15.2（ばらつき大）
- 【サンプル】経営企画部: 平均スコア 81.5、標準偏差 8.7（安定）
- 【サンプル】法人営業部: 平均スコア 68.9、標準偏差 12.1

## 提言
1. 【サンプル】システム開発部のスキル底上げ研修を推奨
2. 【サンプル】経営企画部の高スキル人材をメンターとして活用`,
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
    proposal_id: "SYNTH-PROP002",
    dataset_id: "SYNTH-DS001",
    user_id: "user_demo_02",
    title: "店舗別残業時間予測モデル",
    summary: "過去の稼働データから残業時間を予測するモデルを構築。部門・等級・店舗配置を説明変数として、月次の残業時間を予測する。",
    code: `"""店舗別残業時間予測モデル - 分析スクリプト"""
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
        "top_features": ["department_システム開発部", "grade_G5"],
        "prediction_summary": {
            "mean_predicted": round(target.mean(), 1),
            "std_predicted": round(target.std(), 1),
        }
    }

    with open(args.output, "w") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main()`,
    report: `# 店舗別残業時間予測モデル

## 目的
過去の稼働データから将来の残業時間を予測し、労務管理に活用する。

## 手法
- 行員マスタと稼働時間データを結合
- 部門・等級をダミー変数化
- 線形回帰モデルで残業時間を予測

## 結果
- R2スコア: 0.72（中程度の予測精度）
- 主要な説明変数: 部門（【サンプル】システム開発部が最大）、等級（G5が高い）
- 平均予測残業時間: 18.7時間/月

## 今後の課題
1. 非線形モデル（ランダムフォレスト等）の検討
2. 季節性の考慮（年末年始、決算期）`,
    status: "submitted",
    reviews: [],
    created_at: "2024-07-20T14:00:00Z",
  },
  {
    proposal_id: "SYNTH-PROP003",
    dataset_id: "SYNTH-DS002",
    user_id: "user_demo_01",
    title: "行員離職リスク分析",
    summary: "行員の離職リスクを予測するモデルを構築。業績評価・勤続年数・稼働時間を元に、離職確率を算出する。",
    code: `"""行員離職リスク分析 - 分析スクリプト"""
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
    report: `# 行員離職リスク分析

## 目的
行員の離職リスクを予測し、早期の対策を可能にする。

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
  {
    proposal_id: "SYNTH-PROP004",
    dataset_id: "SYNTH-DS004",
    user_id: "user_demo_03",
    title: "口座顧客セグメンテーション分析",
    summary: "取引行動データを活用し、RFM分析とK-meansクラスタリングを組み合わせた顧客セグメンテーションを実施。各セグメントに最適な金融商品提案を行う。",
    code: `"""口座顧客セグメンテーション分析"""
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import json, argparse

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    df = pd.read_csv(args.input)
    rfm = df.groupby("account_id").agg(
        recency=("transaction_date", "max"),
        frequency=("account_id", "count"),
        monetary=("transaction_amount", "sum")
    ).reset_index()

    scaler = StandardScaler()
    features = scaler.fit_transform(rfm[["frequency", "monetary"]])
    kmeans = KMeans(n_clusters=4, random_state=42)
    rfm["segment"] = kmeans.fit_predict(features)

    result = {"segments": rfm.groupby("segment").size().to_dict()}
    with open(args.output, "w") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main()`,
    report: `# 口座顧客セグメンテーション分析

## 目的
取引行動データからRFM分析を行い、顧客を価値ベースでセグメント化する。

## 手法
- RFM（Recency, Frequency, Monetary）指標を算出
- K-meansクラスタリングで4セグメントに分類
- 各セグメントの特徴量を可視化

## 結果
- VIP顧客（12%）: 高頻度・高額取引、月平均取引額 450,000円
- アクティブ顧客（28%）: 中頻度・中額取引
- 休眠顧客（35%）: 低頻度、再活性化施策が必要
- 新規顧客（25%）: 口座開設から3ヶ月以内

## 提言
1. VIP顧客向けプレミアムサービスの強化
2. 休眠顧客向け金融商品キャンペーンの実施`,
    status: "approved",
    reviews: [
      {
        id: 1,
        reviewer_user_id: "hr_demo",
        action: "approve",
        comment: "セグメンテーションの手法が適切で、ビジネスへの示唆も明確です。承認します。",
        created_at: "2024-09-25T14:00:00Z",
      },
    ],
    created_at: "2024-09-20T09:00:00Z",
  },
  {
    proposal_id: "SYNTH-PROP005",
    dataset_id: "SYNTH-DS004",
    user_id: "user_demo_06",
    title: "取引パターンからの商品レコメンド最適化",
    summary: "顧客の取引履歴から協調フィルタリングベースのレコメンドモデルを構築。クロスセル・アップセルの機会を自動検出し、預かり資産拡大に寄与する。",
    code: `"""取引パターンからの商品レコメンド最適化"""
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import json, argparse

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    df = pd.read_csv(args.input)
    matrix = df.pivot_table(
        index="account_id", columns="transaction_type",
        values="transaction_amount", aggfunc="sum", fill_value=0
    )
    similarity = cosine_similarity(matrix)

    result = {"avg_similarity": round(similarity.mean(), 4)}
    with open(args.output, "w") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main()`,
    report: `# 取引パターンからの商品レコメンド最適化

## 目的
顧客の取引パターンを分析し、パーソナライズされた金融商品レコメンドを実現する。

## 手法
- 取引マトリクスを作成（顧客 x 取引種別）
- コサイン類似度による協調フィルタリング
- Top-N レコメンドリストの生成

## 結果
- レコメンド精度（Precision@5）: 0.32
- カバレッジ: 全商品カテゴリの85%をカバー
- クロスセル率: 既存手法比 +18%

## 今後の課題
1. ディープラーニングベースのモデルとの比較
2. リアルタイムレコメンドへの対応`,
    status: "executed_synthetic",
    reviews: [
      {
        id: 1,
        reviewer_user_id: "hr_demo",
        action: "approve",
        comment: "レコメンドモデルの設計が妥当です。合成データでの実行を承認します。",
        created_at: "2024-10-08T11:00:00Z",
      },
    ],
    created_at: "2024-10-05T09:00:00Z",
  },
  {
    proposal_id: "SYNTH-PROP006",
    dataset_id: "SYNTH-DS005",
    user_id: "user_demo_04",
    title: "法人融資成約率予測モデル",
    summary: "法人融資案件のステージ遷移パターンを分析し、各案件の成約確率をリアルタイムに予測するモデルを構築。営業リソースの最適配分に活用する。",
    code: `"""法人融資成約率予測モデル"""
import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import cross_val_score
import json, argparse

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    df = pd.read_csv(args.input)
    features = pd.get_dummies(df[["stage", "loan_amount", "probability"]])
    target = (df["stage"] == "融資実行").astype(int)

    model = GradientBoostingClassifier(n_estimators=100, random_state=42)
    scores = cross_val_score(model, features, target, cv=5)

    result = {"cv_accuracy": round(scores.mean(), 3)}
    with open(args.output, "w") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main()`,
    report: `# 法人融資成約率予測モデル

## 目的
法人営業パイプラインの融資案件データから成約確率を予測し、営業活動の優先順位付けに活用する。

## 手法
- 審査ステージ・融資額・確度を特徴量として使用
- Gradient Boostingによる二値分類モデル
- 5分割交差検証で評価

## 結果
- 交差検証精度: 0.847
- 上位20%の案件に集中することで成約率が35%向上する見込み

## 提言
1. 営業チームへの予測スコアのリアルタイム提供
2. 低確度案件の早期撤退基準の策定`,
    status: "approved",
    reviews: [
      {
        id: 1,
        reviewer_user_id: "hr_demo",
        action: "comment",
        comment: "予測精度は良好ですが、特徴量にタイムラグを考慮していますか？",
        created_at: "2024-10-20T10:00:00Z",
      },
      {
        id: 2,
        reviewer_user_id: "hr_demo",
        action: "approve",
        comment: "タイムラグの補足説明を確認しました。実用的なモデルと判断し、承認します。",
        created_at: "2024-10-22T15:00:00Z",
      },
    ],
    created_at: "2024-10-15T09:00:00Z",
  },
  {
    proposal_id: "SYNTH-PROP007",
    dataset_id: "SYNTH-DS006",
    user_id: "user_demo_03",
    title: "IB利用率改善分析",
    summary: "IBアクセスログから申込ファネルのボトルネックを特定し、UX改善のための具体的なアクションプランを提案する。A/Bテスト設計にも活用可能。",
    code: `"""IB利用率改善分析"""
import pandas as pd
import json, argparse

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    df = pd.read_csv(args.input)
    funnel = df.groupby("page_path").agg(
        sessions=("session_id", "nunique"),
        conversions=("is_conversion", "sum"),
        avg_duration=("duration_sec", "mean")
    )
    funnel["cvr"] = funnel["conversions"] / funnel["sessions"]

    result = {"top_pages": funnel.nlargest(5, "cvr").to_dict("index")}
    with open(args.output, "w") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main()`,
    report: `# IB利用率改善分析

## 目的
IBアクセスログから申込ファネルを分析し、離脱ポイントを特定する。

## 手法
- ページパス別のセッション数・申込数・滞在時間を集計
- ファネル分析で各ステップの離脱率を算出

## 結果
- 全体申込完了率: 3.2%
- 最大離脱ポイント: 商品詳細 → 申込入力（離脱率 68%）
- モバイルの申込完了率（1.8%）がPC（5.1%）より大幅に低い

## 提言
1. 申込入力ページのUI改善
2. モバイルUI の最適化`,
    status: "submitted",
    reviews: [],
    created_at: "2024-11-01T09:00:00Z",
  },
  {
    proposal_id: "SYNTH-PROP008",
    dataset_id: "SYNTH-DS006",
    user_id: "user_demo_05",
    title: "IBアクセスパターンの異常検知",
    summary: "IBアクセスログの時系列パターンを分析し、通常と異なるアクセスパターン（不正ログイン兆候、bot攻撃等）を自動検出する異常検知モデルを構築する。",
    code: `"""IBアクセスパターンの異常検知"""
import pandas as pd
from sklearn.ensemble import IsolationForest
import json, argparse

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    df = pd.read_csv(args.input)
    hourly = df.groupby(pd.to_datetime(df["timestamp"]).dt.hour).agg(
        request_count=("session_id", "count"),
        avg_duration=("duration_sec", "mean")
    )

    model = IsolationForest(contamination=0.05, random_state=42)
    hourly["anomaly"] = model.fit_predict(hourly)

    result = {"anomalies": int((hourly["anomaly"] == -1).sum())}
    with open(args.output, "w") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main()`,
    report: `# IBアクセスパターンの異常検知

## 目的
IBアクセスログから異常なアクセスパターンを自動検出し、セキュリティ対策に活用する。

## 手法
- 時間帯別のアクセス量・滞在時間を集計
- Isolation Forestによる異常検知
- 異常スコアの閾値を5%に設定

## 結果
- 検出された異常時間帯: 3件（深夜2-4時の急激なアクセス増）
- 異常アクセスの特徴: 短い滞在時間、特定ページへの集中

## 提言
1. WAFルールの追加検討
2. リアルタイム監視ダッシュボードの構築`,
    status: "approved",
    reviews: [
      {
        id: 1,
        reviewer_user_id: "hr_demo",
        action: "approve",
        comment: "セキュリティ観点で有用な分析です。異常検知の閾値設定も妥当と判断します。",
        created_at: "2024-11-18T14:00:00Z",
      },
    ],
    created_at: "2024-11-10T09:00:00Z",
  },
  {
    proposal_id: "SYNTH-PROP009",
    dataset_id: "SYNTH-DS007",
    user_id: "user_demo_05",
    title: "ATM障害予測モデルの構築",
    summary: "ATMの稼働ログと障害記録を用いて、障害発生を事前に予測するモデルを構築。予防保全とATM運用の高度化を実現する。",
    code: `"""ATM障害予測モデルの構築"""
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import json, argparse

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    df = pd.read_csv(args.input)
    X = df[["operation_hours"]].fillna(df["operation_hours"].mean())
    y = df["has_error"].astype(int)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    result = {"test_accuracy": round(model.score(X_test, y_test), 3)}
    with open(args.output, "w") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main()`,
    report: `# ATM障害予測モデルの構築

## 目的
ATMの稼働データから障害発生を予測し、予防保全を強化する。

## 手法
- 稼働時間・エラーコード等のログデータを特徴量として使用
- Random Forestによる障害予測モデルの構築
- 80/20でデータ分割し評価

## 結果
- テスト精度: 0.923
- 障害の検出率（Recall）: 0.87
- 稼働時間が最も重要な特徴量（重要度: 0.42）

## 提言
1. ATMへのリアルタイム予測システムの導入
2. 予防保全スケジュールの見直し`,
    status: "executed_synthetic",
    reviews: [
      {
        id: 1,
        reviewer_user_id: "hr_demo",
        action: "approve",
        comment: "ATM運用改善への貢献度が高い分析です。合成データでの検証を進めてください。",
        created_at: "2024-12-01T10:00:00Z",
      },
    ],
    created_at: "2024-11-25T09:00:00Z",
  },
  {
    proposal_id: "SYNTH-PROP010",
    dataset_id: "SYNTH-DS008",
    user_id: "user_demo_06",
    title: "問い合わせ自動分類",
    summary: "コールセンターの問い合わせデータを自然言語処理で分析し、カテゴリ・優先度を自動分類するモデルを構築。対応効率の大幅な改善を目指す。",
    code: `"""問い合わせ自動分類"""
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
import json, argparse

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    df = pd.read_csv(args.input)
    vectorizer = TfidfVectorizer(max_features=1000)
    X = vectorizer.fit_transform(df["description"])
    y = df["category"]

    model = MultinomialNB()
    model.fit(X, y)

    result = {"accuracy": round(model.score(X, y), 3)}
    with open(args.output, "w") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main()`,
    report: `# 問い合わせ自動分類

## 目的
顧客問い合わせを自動分類し、適切な担当者への振り分けを効率化する。

## 手法
- TF-IDFによるテキスト特徴量の抽出
- Naive Bayesによるカテゴリ分類
- 8カテゴリへの多値分類

## 結果
- 分類精度: 0.82
- 上位3カテゴリの精度: 0.91
- 処理時間: 1件あたり 0.02秒

## 提言
1. 自動分類結果の信頼度スコアに基づくエスカレーション
2. BERTベースモデルへのアップグレード検討`,
    status: "approved",
    reviews: [
      {
        id: 1,
        reviewer_user_id: "hr_demo",
        action: "approve",
        comment: "NLP手法の選定が適切で、実用的な精度が出ています。承認します。",
        created_at: "2025-01-10T16:00:00Z",
      },
    ],
    created_at: "2025-01-05T09:00:00Z",
  },
  {
    proposal_id: "SYNTH-PROP011",
    dataset_id: "SYNTH-DS009",
    user_id: "user_demo_07",
    title: "店舗間ネットワーク分析",
    summary: "店舗間コミュニケーションデータから組織のネットワーク構造を可視化。部門間・店舗間の連携度やキーパーソンを特定し、組織改善施策に活用する。",
    code: `"""店舗間ネットワーク分析"""
import pandas as pd
import networkx as nx
import json, argparse

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    df = pd.read_csv(args.input)
    G = nx.from_pandas_edgelist(df, "from_dept", "to_dept", edge_attr="message_count")

    centrality = nx.degree_centrality(G)
    result = {"centrality": centrality, "density": round(nx.density(G), 4)}
    with open(args.output, "w") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main()`,
    report: `# 店舗間ネットワーク分析

## 目的
店舗間コミュニケーションの構造を分析し、組織の連携状況を可視化する。

## 手法
- 部門間・店舗間のメッセージ量をネットワークグラフとして構築
- 次数中心性・媒介中心性を算出
- コミュニティ検出アルゴリズムの適用

## 結果
- ネットワーク密度: 0.72（比較的高い連携度）
- ハブ部門: 【サンプル】経営企画部（中心性 0.89）
- サイロ化傾向: 【サンプル】事務センターと【サンプル】IT統括部の連携が薄い

## 提言
1. 【サンプル】事務センター-【サンプル】IT統括部の合同プロジェクト推進
2. 部門横断コミュニケーション施策の強化`,
    status: "submitted",
    reviews: [],
    created_at: "2025-01-20T09:00:00Z",
  },
  {
    proposal_id: "SYNTH-PROP012",
    dataset_id: "SYNTH-DS010",
    user_id: "user_demo_07",
    title: "経費異常検知モデル - Isolation Forest × ルールベースハイブリッド手法",
    summary: "機械学習（Isolation Forest）と財務経理部門のドメイン知識に基づくルールベース判定を組み合わせたハイブリッド手法により、経費申請の異常を高精度に検出するモデルを構築した。高額異常・頻度異常・パターン異常の3種類を包括的にカバーし、従来の目視チェックでは発見困難だった複合的な不正パターンも検出可能とする。",
    code: `"""経費異常検知モデル - ハイブリッド手法（Isolation Forest + ルールベース）"""
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import json
import argparse


def engineer_features(df):
    """特徴量エンジニアリング"""
    # 部門別中央値との乖離率
    dept_median = df.groupby("department")["amount"].transform("median")
    df["amount_dept_ratio"] = df["amount"] / dept_median.replace(0, 1)

    # 費目別中央値との乖離率
    cat_median = df.groupby("expense_category")["amount"].transform("median")
    df["amount_cat_ratio"] = df["amount"] / cat_median.replace(0, 1)

    # 申請者別の月次申請頻度
    df["application_date"] = pd.to_datetime(df["application_date"])
    df["year_month"] = df["application_date"].dt.to_period("M")
    applicant_freq = df.groupby(["applicant_id", "year_month"]).size().reset_index(name="monthly_count")
    df = df.merge(applicant_freq, on=["applicant_id", "year_month"], how="left")

    # 領収書なし高額フラグ
    df["no_receipt_high"] = ((~df["receipt_attached"]) & (df["amount"] > 50000)).astype(int)

    # 金額のZ-score
    df["amount_zscore"] = (df["amount"] - df["amount"].mean()) / df["amount"].std()

    return df


def rule_based_flags(df):
    """ルールベース異常フラグ"""
    flags = pd.DataFrame(index=df.index)
    flags["high_amount"] = (df["amount_zscore"] > 3).astype(int)
    flags["high_dept_ratio"] = (df["amount_dept_ratio"] > 5).astype(int)
    flags["high_frequency"] = (df["monthly_count"] > 15).astype(int)
    flags["no_receipt_high"] = df["no_receipt_high"]
    flags["rule_score"] = flags.sum(axis=1) / 4
    return flags


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    df = pd.read_csv(args.input)
    df = engineer_features(df)

    # Isolation Forest
    feature_cols = ["amount", "amount_dept_ratio", "amount_cat_ratio", "monthly_count", "amount_zscore"]
    X = StandardScaler().fit_transform(df[feature_cols].fillna(0))
    iso_forest = IsolationForest(contamination=0.03, n_estimators=200, random_state=42)
    df["iso_score"] = -iso_forest.decision_function(X)  # 高いほど異常
    df["iso_score_norm"] = (df["iso_score"] - df["iso_score"].min()) / (df["iso_score"].max() - df["iso_score"].min())

    # ルールベース
    rule_flags = rule_based_flags(df)

    # ハイブリッドスコア (重み付き平均)
    df["hybrid_score"] = 0.6 * df["iso_score_norm"] + 0.4 * rule_flags["rule_score"]
    df["is_anomaly"] = (df["hybrid_score"] > 0.5).astype(int)

    anomalies = df[df["is_anomaly"] == 1]

    result = {
        "total_records": len(df),
        "anomaly_count": int(anomalies["is_anomaly"].sum()),
        "anomaly_rate": round(len(anomalies) / len(df) * 100, 2),
        "avg_anomaly_amount": int(anomalies["amount"].mean()),
        "avg_normal_amount": int(df[df["is_anomaly"] == 0]["amount"].mean()),
        "anomaly_patterns": {
            "high_amount": int(rule_flags["high_amount"].sum()),
            "high_frequency": int(rule_flags["high_frequency"].sum()),
            "no_receipt_high_amount": int(rule_flags["no_receipt_high"].sum()),
        },
        "top_anomaly_departments": anomalies.groupby("department").size().nlargest(3).to_dict(),
    }

    with open(args.output, "w") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()`,
    report: `# 経費異常検知モデル - ハイブリッド手法

## 1. 背景と目的
当行の年間経費申請件数は約60,000件、総額約51億円に上る。財務経理部門による目視チェックには限界があり、統計的手法を用いた異常検知の自動化が求められている。本提案では、機械学習（Isolation Forest）とルールベースを組み合わせたハイブリッド手法により、不正・異常経費を高精度に検出するモデルを構築した。

## 2. データ概要
| 項目 | 値 |
|------|-----|
| 対象期間 | 2024年4月〜2025年3月 |
| 総レコード数 | 5,000件 |
| 申請者数 | 487名 |
| 部門数 | 10部門 |
| 費目数 | 15種別 |

## 3. 特徴量エンジニアリング
以下の特徴量を設計し、多角的な異常検知を実現した：

| 特徴量 | 説明 | 異常検知への寄与 |
|--------|------|-----------------|
| amount_dept_ratio | 部門別中央値との乖離率 | 部門内での突出した高額申請を検知 |
| amount_cat_ratio | 費目別中央値との乖離率 | 費目ごとの相場感からの逸脱を検知 |
| monthly_count | 月次申請頻度 | 不自然に多い申請回数を検知 |
| no_receipt_high | 領収書なし高額フラグ | 証憑不備の高額申請を検知 |
| amount_zscore | 金額のZ-score | 全体分布からの統計的外れ値を検知 |

## 4. モデル設計

### 4.1 Isolation Forest（教師なし学習）
- アルゴリズム: Isolation Forest（sklearn）
- 推定汚染率: 3%
- 決定木数: 200
- 特徴: 高次元空間での孤立点を効率的に検出

### 4.2 ルールベース（ドメイン知識）
財務経理部門のヒアリングに基づく4つのルール：
1. 金額Z-score > 3（統計的外れ値）
2. 部門中央値の5倍超（部門内異常）
3. 月次申請15件超（頻度異常）
4. 領収書なし × 5万円超（証憑リスク）

### 4.3 ハイブリッドスコア
hybrid_score = 0.6 × IF正規化スコア + 0.4 × ルールスコア

## 5. 評価結果

| 指標 | 値 |
|------|-----|
| Precision | 0.87 |
| Recall | 0.82 |
| F1-score | 0.84 |
| 異常検出数 | 150件（3.0%）|
| 異常申請平均金額 | 458,000円 |
| 正常申請平均金額 | 72,000円 |

### 異常パターン分類
| パターン | 件数 | 割合 | 代表例 |
|----------|------|------|--------|
| 高額異常 | 68件 | 45% | 【サンプル】法人営業部 交際費 385,000円 |
| 頻度異常 | 42件 | 28% | 同一申請者が月20件以上 |
| パターン異常 | 25件 | 17% | 月末集中申請、領収書なし高額 |
| 複合異常 | 15件 | 10% | 高額 × 頻度 × 領収書なし |

## 6. 財務経理部門への提言

### 6.1 自動スクリーニングフロー
1. 全申請に対してリアルタイムでスコア算出
2. スコア0.7以上 → 自動フラグ＋財務経理部長エスカレーション
3. スコア0.5-0.7 → 担当者による追加確認
4. スコア0.5未満 → 通常承認フロー

### 6.2 四半期レビュー
- モデルの再学習（新しい申請データを反映）
- 閾値の見直し（偽陽性率のモニタリング）
- 新たな異常パターンのルール追加

## 7. 今後の展望
1. テキスト分析による申請理由の自然言語処理
2. 承認者パターンの分析（承認の偏り検知）
3. 外部データ（曜日・祝日・イベント）との突合
4. リアルタイムダッシュボードの構築`,
    status: "approved",
    reviews: [
      {
        id: 1,
        reviewer_user_id: "hr_demo",
        action: "comment",
        comment: "異常スコアの閾値0.5の根拠を教えてください。また、偽陽性（正常な申請を異常と判定）のリスクをどう評価していますか？財務経理部門の業務負荷に影響するため重要なポイントです。",
        created_at: "2025-02-08T14:00:00Z",
      },
      {
        id: 2,
        reviewer_user_id: "hr_demo",
        action: "approve",
        comment: "閾値設定の根拠と段階的なスクリーニングフローの提案が適切です。特に財務経理部門への提言（6.1）の3段階フローは実運用に即しており、承認します。四半期レビューの仕組みも評価します。",
        created_at: "2025-02-12T11:00:00Z",
      },
    ],
    created_at: "2025-02-05T09:00:00Z",
  },
];
