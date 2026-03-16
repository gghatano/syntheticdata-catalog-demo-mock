import { Execution } from "../types/models";

export const EXECUTIONS: Execution[] = [
  {
    execution_id: "SYNTH-EX001",
    submission_id: "SYNTH-SUB001",
    executor_user_id: "hr_demo",
    mode: "synthetic",
    status: "succeeded",
    stdout: `[2024-07-12 10:00:01] Starting analysis: 行員スキルギャップ分析
[2024-07-12 10:00:01] Loading employee_master.csv ... 500 rows loaded
[2024-07-12 10:00:02] Loading project_allocation.csv ... 1200 rows loaded
[2024-07-12 10:00:02] Merging datasets on emp_id ...
[2024-07-12 10:00:03] Computing department-level skill statistics ...
[2024-07-12 10:00:03] Generating skill gap report ...
[2024-07-12 10:00:04] Writing results to output.json
[2024-07-12 10:00:04] Analysis completed successfully`,
    result_json: {
      summary: "部門別スキルギャップ分析",
      departments: {
        "【サンプル】システム開発部": { mean: 72.3, std: 15.2, count: 120 },
        "【サンプル】経営企画部": { mean: 81.5, std: 8.7, count: 80 },
        "【サンプル】法人営業部": { mean: 68.9, std: 12.1, count: 95 },
        "【サンプル】人事部": { mean: 75.1, std: 10.3, count: 45 },
        "【サンプル】財務経理部": { mean: 70.8, std: 11.5, count: 60 },
      },
      recommendations: [
        "【サンプル】システム開発部のスキル標準偏差が大きい - 底上げ研修を推奨",
        "【サンプル】経営企画部は平均スコアが高い - メンター制度の活用を検討",
        "【サンプル】法人営業部は平均スコアが最も低い - 集中研修の実施を推奨",
      ],
    },
    result_scope: "submitter",
    created_at: "2024-07-12T10:00:00Z",
  },
];
