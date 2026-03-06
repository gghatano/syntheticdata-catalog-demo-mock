import { Execution } from "../types/models";

export const EXECUTIONS: Execution[] = [
  {
    execution_id: "EXEC0001",
    submission_id: "SUB0001",
    executor_user_id: "hr_demo",
    mode: "synthetic",
    status: "succeeded",
    stdout: `[2024-07-12 10:00:01] Starting analysis: スキルギャップ分析
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
        "開発部": { mean: 72.3, std: 15.2, count: 120 },
        "企画部": { mean: 81.5, std: 8.7, count: 80 },
        "営業部": { mean: 68.9, std: 12.1, count: 95 },
        "人事部": { mean: 75.1, std: 10.3, count: 45 },
        "経理部": { mean: 70.8, std: 11.5, count: 60 },
      },
      recommendations: [
        "開発部のスキル標準偏差が大きい - 底上げ研修を推奨",
        "企画部は平均スコアが高い - メンター制度の活用を検討",
        "営業部は平均スコアが最も低い - 集中研修の実施を推奨",
      ],
    },
    result_scope: "submitter",
    created_at: "2024-07-12T10:00:00Z",
  },
];
