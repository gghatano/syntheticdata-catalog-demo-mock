import { Submission } from "../types/models";

export const SUBMISSIONS: Submission[] = [
  {
    submission_id: "SUB0001",
    dataset_id: "DS0001",
    user_id: "user_demo_01",
    title: "スキルギャップ分析",
    description: "部門別のスキルギャップを分析し、研修計画の最適化を提案するスクリプト。従業員マスタとプロジェクト配置データを結合して分析します。",
    status: "executed_synthetic",
    created_at: "2024-07-10T14:00:00Z",
  },
  {
    submission_id: "SUB0002",
    dataset_id: "DS0001",
    user_id: "user_demo_02",
    title: "稼働時間最適化モデル",
    description: "残業時間の削減と生産性の向上を両立するための最適化モデル。稼働時間データを基にシミュレーションを行います。",
    status: "approved",
    created_at: "2024-07-15T10:00:00Z",
  },
  {
    submission_id: "SUB0003",
    dataset_id: "DS0002",
    user_id: "user_demo_01",
    title: "部門間異動シミュレーション",
    description: "部門間の人材異動による業績への影響をシミュレーションするスクリプト。パフォーマンスデータと配置データを活用します。",
    status: "submitted",
    created_at: "2024-08-01T11:00:00Z",
  },
];
