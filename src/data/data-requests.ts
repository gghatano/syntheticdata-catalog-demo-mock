import { DataRequest } from "../types/models";

export const DATA_REQUESTS: DataRequest[] = [
  {
    request_id: "SYNTH-REQ001",
    user_id: "user_demo_01",
    title: "行員研修受講履歴データの公開希望",
    description: "行員の研修受講履歴データを公開していただきたいです。スキル分析と研修効果の測定に活用したいと考えています。受講した研修名、受講日、研修カテゴリ、修了状況などのカラムがあると理想的です。",
    desired_columns: "研修ID, 行員ID, 研修名, 研修カテゴリ, 受講日, 修了状況, スコア",
    showcase_proposal_id: "SYNTH-PROP001",
    status: "open",
    vote_count: 3,
    created_at: "2024-07-25T09:00:00Z",
  },
  {
    request_id: "SYNTH-REQ002",
    user_id: "user_demo_02",
    title: "顧客満足度調査データの公開希望",
    description: "顧客満足度調査のデータを合成データとして公開していただきたいです。部門別のサービス品質改善に活用したいと考えています。",
    desired_columns: "調査ID, 部門, 満足度スコア, 調査日, コメントカテゴリ",
    showcase_proposal_id: null,
    status: "in_progress",
    vote_count: 5,
    created_at: "2024-08-10T14:00:00Z",
  },
];
