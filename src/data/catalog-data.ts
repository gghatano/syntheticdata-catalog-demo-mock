import { SampleTable, DatasetUseCase, DatasetGraph } from "../types/models";

// ============================================================
// SYNTH-DS001: 行員スキル分析データ（合成） - サンプルテーブル
// ============================================================

export const DS0001_SAMPLE_TABLES: SampleTable[] = [
  {
    tableName: "employee_master",
    description: "行員の基本属性情報を管理するマスタテーブル",
    columns: [
      { name: "emp_id", type: "string", displayName: "行員ID", description: "行員を一意に識別するID" },
      { name: "name", type: "string", displayName: "氏名", description: "行員の氏名" },
      { name: "department", type: "string", displayName: "所属部署", description: "所属部門名" },
      { name: "join_date", type: "date", displayName: "入行日", description: "入行年月日" },
      { name: "grade", type: "string", displayName: "等級", description: "職能等級（G1〜G6）" },
      { name: "skill_score", type: "integer", displayName: "スキルスコア", description: "総合スキルスコア（0-100）" },
    ],
    rows: [
      { emp_id: "SYNTH-E001", name: "●●●●", department: "【サンプル】システム開発部", join_date: "2018-04-01", grade: "G4", skill_score: 82 },
      { emp_id: "SYNTH-E002", name: "●●●●", department: "【サンプル】デジタル推進部", join_date: "2020-04-01", grade: "G3", skill_score: 75 },
      { emp_id: "SYNTH-E003", name: "●●●●", department: "【サンプル】システム開発部", join_date: "2016-04-01", grade: "G5", skill_score: 91 },
      { emp_id: "SYNTH-E004", name: "●●●●", department: "【サンプル】経営企画部", join_date: "2021-10-01", grade: "G2", skill_score: 58 },
      { emp_id: "SYNTH-E005", name: "●●●●", department: "【サンプル】システム開発部", join_date: "2019-04-01", grade: "G4", skill_score: 79 },
    ],
    primaryKey: ["emp_id"],
    foreignKeys: [],
  },
  {
    tableName: "project_allocation",
    description: "行員の店舗・プロジェクトへの配置情報を管理するテーブル",
    columns: [
      { name: "emp_id", type: "string", displayName: "行員ID", description: "配置された行員のID" },
      { name: "project_id", type: "string", displayName: "プロジェクトID", description: "プロジェクトを一意に識別するID" },
      { name: "role", type: "string", displayName: "役割", description: "プロジェクト内での役割" },
      { name: "allocation_pct", type: "integer", displayName: "アサイン比率(%)", description: "プロジェクトへのアサイン割合", format: "percentage" },
      { name: "start_date", type: "date", displayName: "開始日", description: "アサイン開始日" },
    ],
    rows: [
      { emp_id: "SYNTH-E001", project_id: "PJ001", role: "リーダー", allocation_pct: 80, start_date: "2024-01-01" },
      { emp_id: "SYNTH-E002", project_id: "PJ001", role: "メンバー", allocation_pct: 60, start_date: "2024-01-15" },
      { emp_id: "SYNTH-E003", project_id: "PJ002", role: "リーダー", allocation_pct: 100, start_date: "2023-10-01" },
      { emp_id: "SYNTH-E004", project_id: "PJ001", role: "メンバー", allocation_pct: 40, start_date: "2024-02-01" },
      { emp_id: "SYNTH-E005", project_id: "PJ003", role: "メンバー", allocation_pct: 50, start_date: "2024-03-01" },
    ],
    primaryKey: ["emp_id", "project_id"],
    foreignKeys: [
      { columns: ["emp_id"], referenceTable: "employee_master", referenceColumns: ["emp_id"] },
    ],
  },
  {
    tableName: "working_hours",
    description: "行員の月次労働時間を記録するテーブル",
    columns: [
      { name: "emp_id", type: "string", displayName: "行員ID", description: "労働時間の対象行員ID" },
      { name: "year_month", type: "string", displayName: "年月", description: "対象年月（YYYY-MM形式）" },
      { name: "regular_hours", type: "integer", displayName: "所定労働時間", description: "月間の所定労働時間（h）" },
      { name: "overtime_hours", type: "number", displayName: "残業時間", description: "月間の残業時間（h）" },
    ],
    rows: [
      { emp_id: "SYNTH-E001", year_month: "2024-01", regular_hours: 168, overtime_hours: 25.5 },
      { emp_id: "SYNTH-E001", year_month: "2024-02", regular_hours: 160, overtime_hours: 18.0 },
      { emp_id: "SYNTH-E002", year_month: "2024-01", regular_hours: 168, overtime_hours: 12.0 },
      { emp_id: "SYNTH-E003", year_month: "2024-01", regular_hours: 168, overtime_hours: 35.5 },
      { emp_id: "SYNTH-E004", year_month: "2024-01", regular_hours: 160, overtime_hours: 5.0 },
    ],
    primaryKey: ["emp_id", "year_month"],
    foreignKeys: [
      { columns: ["emp_id"], referenceTable: "employee_master", referenceColumns: ["emp_id"] },
    ],
  },
];

export const DS0001_USE_CASES: DatasetUseCase[] = [
  {
    title: "行員スキルマッチング最適化",
    description: "行員のスキルスコアと業務要件を照合し、最適な人材配置を提案する。業務遂行品質の向上と行員の成長機会の最大化に活用。",
    relatedGraphId: "graph-1",
  },
  {
    title: "残業時間の傾向分析と予測",
    description: "部署・等級・店舗配置率と残業時間の相関を分析し、過重労働リスクの早期検知と適切な業務負荷分散に活用する。",
    relatedGraphId: "graph-2",
  },
  {
    title: "人材育成ロードマップの策定",
    description: "スキルスコアの変化傾向と等級昇格パターンを分析し、効果的な研修プログラムの設計と個人別育成計画の立案に活用する。",
    relatedGraphId: "graph-1",
  },
  {
    title: "店舗人員配置の最適化",
    description: "店舗のアサイン比率と稼働時間実績を分析し、リソースの過不足を可視化。効率的な店舗運営に活用する。",
    relatedGraphId: null,
  },
];

export const DS0001_GRAPHS: DatasetGraph[] = [
  {
    id: "graph-1",
    title: "部署別 平均スキルスコア",
    type: "bar",
    labels: ["【サンプル】システム開発部", "【サンプル】デジタル推進部", "【サンプル】経営企画部", "【サンプル】法人営業部", "【サンプル】人事部"],
    datasets: [
      {
        label: "平均スキルスコア",
        data: [78.5, 82.3, 65.1, 58.7, 62.0],
        backgroundColor: "rgba(59, 130, 246, 0.5)",
      },
    ],
  },
  {
    id: "graph-2",
    title: "月別 平均残業時間推移",
    type: "line",
    labels: ["2024/01", "2024/02", "2024/03", "2024/04", "2024/05", "2024/06"],
    datasets: [
      {
        label: "全行平均残業時間(h)",
        data: [22.4, 19.8, 24.1, 18.5, 20.3, 17.9],
        borderColor: "rgba(16, 185, 129, 1)",
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        tension: 0.3,
      },
      {
        label: "【サンプル】システム開発部平均残業時間(h)",
        data: [28.5, 25.2, 32.1, 22.8, 26.4, 23.1],
        borderColor: "rgba(239, 68, 68, 1)",
        backgroundColor: "rgba(239, 68, 68, 0.2)",
        tension: 0.3,
      },
    ],
  },
];

// ============================================================
// SYNTH-DS002: 部門別業績評価データ（合成） - サンプルテーブル
// ============================================================

export const DS0002_SAMPLE_TABLES: SampleTable[] = [
  {
    tableName: "employee_master",
    description: "行員の基本情報と業績評価を管理するマスタテーブル",
    columns: [
      { name: "emp_id", type: "string", displayName: "行員ID", description: "行員を一意に識別するID" },
      { name: "name", type: "string", displayName: "氏名", description: "行員の氏名" },
      { name: "department", type: "string", displayName: "所属部署", description: "所属部門名" },
      { name: "performance_score", type: "number", displayName: "業績評価", description: "業績評価スコア（1.0-5.0）" },
      { name: "tenure_years", type: "integer", displayName: "勤続年数", description: "入行からの年数" },
      { name: "is_resigned", type: "boolean", displayName: "退職フラグ", description: "退職済みかどうか" },
    ],
    rows: [
      { emp_id: "SYNTH-E101", name: "●●●●", department: "【サンプル】法人営業部", performance_score: 4.2, tenure_years: 8, is_resigned: false },
      { emp_id: "SYNTH-E102", name: "●●●●", department: "【サンプル】システム開発部", performance_score: 3.8, tenure_years: 5, is_resigned: false },
      { emp_id: "SYNTH-E103", name: "●●●●", department: "【サンプル】リテール企画部", performance_score: 2.5, tenure_years: 3, is_resigned: true },
      { emp_id: "SYNTH-E104", name: "●●●●", department: "【サンプル】経営企画部", performance_score: 4.5, tenure_years: 12, is_resigned: false },
      { emp_id: "SYNTH-E105", name: "●●●●", department: "【サンプル】システム開発部", performance_score: 3.1, tenure_years: 2, is_resigned: true },
    ],
    primaryKey: ["emp_id"],
    foreignKeys: [],
  },
  {
    tableName: "project_allocation",
    description: "行員のプロジェクト配置履歴テーブル",
    columns: [
      { name: "emp_id", type: "string", displayName: "行員ID", description: "配置された行員のID" },
      { name: "project_id", type: "string", displayName: "プロジェクトID", description: "プロジェクトを識別するID" },
      { name: "role", type: "string", displayName: "役割", description: "プロジェクト内の役割" },
      { name: "allocation_pct", type: "integer", displayName: "アサイン比率(%)", description: "アサイン割合" },
    ],
    rows: [
      { emp_id: "SYNTH-E101", project_id: "PJ010", role: "リーダー", allocation_pct: 100 },
      { emp_id: "SYNTH-E102", project_id: "PJ011", role: "メンバー", allocation_pct: 80 },
      { emp_id: "SYNTH-E103", project_id: "PJ010", role: "メンバー", allocation_pct: 60 },
      { emp_id: "SYNTH-E104", project_id: "PJ012", role: "リーダー", allocation_pct: 70 },
      { emp_id: "SYNTH-E105", project_id: "PJ011", role: "メンバー", allocation_pct: 50 },
    ],
    primaryKey: ["emp_id", "project_id"],
    foreignKeys: [
      { columns: ["emp_id"], referenceTable: "employee_master", referenceColumns: ["emp_id"] },
    ],
  },
];

export const DS0002_USE_CASES: DatasetUseCase[] = [
  {
    title: "離職リスク予測モデルの構築",
    description: "業績評価・勤続年数・部署などの特徴量から離職確率を予測する機械学習モデルを構築し、ハイリスク行員の早期発見と定着施策の立案に活用する。",
    relatedGraphId: "graph-1",
  },
  {
    title: "部門別パフォーマンスベンチマーク",
    description: "部門ごとの業績評価分布を可視化・比較し、高パフォーマンス部門のベストプラクティス抽出や改善ポイント特定に活用する。",
    relatedGraphId: "graph-2",
  },
  {
    title: "勤続年数と業績の相関分析",
    description: "勤続年数と業績スコアの関係を統計的に分析し、キャリアステージに応じた適切な目標設定と評価基準の策定に活用する。",
    relatedGraphId: null,
  },
];

export const DS0002_GRAPHS: DatasetGraph[] = [
  {
    id: "graph-1",
    title: "部門別 離職率",
    type: "bar",
    labels: ["【サンプル】リテール企画部", "【サンプル】システム開発部", "【サンプル】経営企画部", "【サンプル】人事部", "【サンプル】財務経理部", "【サンプル】総務部"],
    datasets: [
      {
        label: "離職率(%)",
        data: [18.5, 12.3, 8.7, 5.2, 6.1, 4.8],
        backgroundColor: [
          "rgba(239, 68, 68, 0.6)",
          "rgba(245, 158, 11, 0.6)",
          "rgba(59, 130, 246, 0.6)",
          "rgba(16, 185, 129, 0.6)",
          "rgba(16, 185, 129, 0.6)",
          "rgba(16, 185, 129, 0.6)",
        ],
      },
    ],
  },
  {
    id: "graph-2",
    title: "部門別 業績評価分布",
    type: "bar",
    labels: ["【サンプル】リテール企画部", "【サンプル】システム開発部", "【サンプル】経営企画部", "【サンプル】人事部", "【サンプル】財務経理部"],
    datasets: [
      {
        label: "平均業績スコア",
        data: [3.2, 3.6, 3.8, 3.4, 3.5],
        backgroundColor: "rgba(59, 130, 246, 0.5)",
      },
      {
        label: "最高業績スコア",
        data: [4.8, 4.9, 5.0, 4.5, 4.3],
        backgroundColor: "rgba(16, 185, 129, 0.5)",
      },
    ],
  },
];

// ============================================================
// SYNTH-DS003: 新卒採用分析データ（合成） - サンプルテーブル (未公開データの例)
// ============================================================

export const DS0003_SAMPLE_TABLES: SampleTable[] = [
  {
    tableName: "applicants",
    description: "新卒応募者の基本情報と選考結果を管理するテーブル",
    columns: [
      { name: "applicant_id", type: "string", displayName: "応募者ID", description: "応募者を一意に識別するID" },
      { name: "university", type: "string", displayName: "出身大学", description: "応募者の出身大学名" },
      { name: "gpa", type: "number", displayName: "GPA", description: "学業成績（4.0満点）" },
      { name: "interview_score", type: "integer", displayName: "面接スコア", description: "面接評価スコア（1-10）" },
      { name: "offer_status", type: "string", displayName: "内定状況", description: "内定・辞退・不合格の状態" },
    ],
    rows: [
      { applicant_id: "SYNTH-A001", university: "東京大学", gpa: 3.8, interview_score: 9, offer_status: "内定承諾" },
      { applicant_id: "SYNTH-A002", university: "京都大学", gpa: 3.5, interview_score: 7, offer_status: "内定辞退" },
      { applicant_id: "SYNTH-A003", university: "慶應義塾大学", gpa: 3.2, interview_score: 8, offer_status: "内定承諾" },
      { applicant_id: "SYNTH-A004", university: "早稲田大学", gpa: 2.9, interview_score: 5, offer_status: "不合格" },
      { applicant_id: "SYNTH-A005", university: "東北大学", gpa: 3.6, interview_score: 8, offer_status: "内定承諾" },
    ],
    primaryKey: ["applicant_id"],
    foreignKeys: [],
  },
];

export const DS0003_USE_CASES: DatasetUseCase[] = [
  {
    title: "採用選考プロセスの最適化",
    description: "GPA・面接スコア・出身大学と内定承諾率の関係を分析し、選考基準の見直しや効率的な採用プロセスの設計に活用する。",
    relatedGraphId: null,
  },
  {
    title: "内定辞退率の予測と対策",
    description: "過去の内定辞退パターンを分析し、辞退リスクの高い候補者を早期に特定。フォローアップ施策の最適なタイミングと内容を提案する。",
    relatedGraphId: null,
  },
];

export const DS0003_GRAPHS: DatasetGraph[] = [];

// ============================================================
// SYNTH-DS004: 口座取引行動データ（合成）
// ============================================================

export const DS0004_SAMPLE_TABLES: SampleTable[] = [
  {
    tableName: "account_transaction",
    description: "口座の取引履歴を管理するテーブル",
    columns: [
      { name: "account_id", type: "string", displayName: "口座ID", description: "口座を一意に識別するID" },
      { name: "transaction_date", type: "date", displayName: "取引日", description: "取引が行われた日付" },
      { name: "transaction_type", type: "string", displayName: "取引種別", description: "取引の種類（預金/振込/融資返済/外為）" },
      { name: "transaction_amount", type: "integer", displayName: "取引金額", description: "取引金額（円）" },
      { name: "channel", type: "string", displayName: "チャネル", description: "取引チャネル（ATM/窓口/IB/モバイル）" },
      { name: "age_group", type: "string", displayName: "年代", description: "顧客の年齢層" },
    ],
    rows: [
      { account_id: "SYNTH-C001", transaction_date: "2024-08-15", transaction_type: "振込", transaction_amount: 45000, channel: "IB", age_group: "30代" },
      { account_id: "SYNTH-C002", transaction_date: "2024-08-16", transaction_type: "預金", transaction_amount: 3200, channel: "窓口", age_group: "40代" },
      { account_id: "SYNTH-C001", transaction_date: "2024-09-01", transaction_type: "融資返済", transaction_amount: 18000, channel: "IB", age_group: "30代" },
      { account_id: "SYNTH-C003", transaction_date: "2024-09-05", transaction_type: "外為", transaction_amount: 125000, channel: "窓口", age_group: "20代" },
      { account_id: "SYNTH-C004", transaction_date: "2024-09-10", transaction_type: "振込", transaction_amount: 89000, channel: "ATM", age_group: "50代" },
    ],
    primaryKey: ["account_id", "transaction_date"],
    foreignKeys: [],
  },
];

export const DS0004_USE_CASES: DatasetUseCase[] = [
  {
    title: "口座顧客セグメンテーション",
    description: "RFM分析とクラスタリングにより顧客を価値ベースでセグメント化し、各セグメントに最適な金融商品提案を立案する。",
    relatedGraphId: "graph-1",
  },
  {
    title: "取引予測と商品レコメンド",
    description: "過去の取引パターンから次回取引種別・タイミングを予測し、パーソナライズされた金融商品レコメンドを提供する。",
    relatedGraphId: "graph-2",
  },
  {
    title: "LTV（顧客生涯価値）予測",
    description: "顧客の取引頻度・金額の変化から将来のLTVを予測し、営業リソース投資の最適配分に活用する。",
    relatedGraphId: null,
  },
];

export const DS0004_GRAPHS: DatasetGraph[] = [
  {
    id: "graph-1",
    title: "取引種別 構成比",
    type: "doughnut",
    labels: ["預金", "振込", "融資返済", "外為", "投信購入", "その他"],
    datasets: [
      {
        label: "取引構成比",
        data: [35, 20, 18, 8, 12, 7],
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(245, 158, 11, 0.7)",
          "rgba(139, 92, 246, 0.7)",
          "rgba(236, 72, 153, 0.7)",
          "rgba(156, 163, 175, 0.7)",
        ],
      },
    ],
  },
  {
    id: "graph-2",
    title: "月別 取引件数推移",
    type: "line",
    labels: ["2024/04", "2024/05", "2024/06", "2024/07", "2024/08", "2024/09"],
    datasets: [
      {
        label: "IB・モバイル",
        data: [1200, 1350, 1100, 1500, 1800, 1650],
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.3,
      },
      {
        label: "ATM・窓口",
        data: [800, 750, 900, 850, 920, 880],
        borderColor: "rgba(245, 158, 11, 1)",
        backgroundColor: "rgba(245, 158, 11, 0.2)",
        tension: 0.3,
      },
    ],
  },
];

// ============================================================
// SYNTH-DS005: 法人営業パイプラインデータ（合成）
// ============================================================

export const DS0005_SAMPLE_TABLES: SampleTable[] = [
  {
    tableName: "loan_pipeline",
    description: "法人融資案件の進捗状況を管理するテーブル",
    columns: [
      { name: "case_id", type: "string", displayName: "案件ID", description: "融資案件を一意に識別するID" },
      { name: "sales_rep", type: "string", displayName: "営業担当", description: "営業担当者名" },
      { name: "stage", type: "string", displayName: "審査ステージ", description: "融資案件の進捗ステージ" },
      { name: "loan_amount", type: "integer", displayName: "融資額(万円)", description: "融資の見込み金額" },
      { name: "probability", type: "number", displayName: "成約確度(%)", description: "成約の確率" },
      { name: "created_date", type: "date", displayName: "作成日", description: "案件が作成された日付" },
    ],
    rows: [
      { case_id: "SYNTH-D001", sales_rep: "●●●●", stage: "初回面談", loan_amount: 5000, probability: 60, created_date: "2024-07-01" },
      { case_id: "SYNTH-D002", sales_rep: "●●●●", stage: "融資審査中", loan_amount: 12000, probability: 75, created_date: "2024-07-15" },
      { case_id: "SYNTH-D003", sales_rep: "●●●●", stage: "初回接触", loan_amount: 3000, probability: 20, created_date: "2024-08-01" },
      { case_id: "SYNTH-D004", sales_rep: "●●●●", stage: "融資実行", loan_amount: 8000, probability: 95, created_date: "2024-06-15" },
      { case_id: "SYNTH-D005", sales_rep: "●●●●", stage: "見送り", loan_amount: 20000, probability: 5, created_date: "2024-05-20" },
    ],
    primaryKey: ["case_id"],
    foreignKeys: [],
  },
];

export const DS0005_USE_CASES: DatasetUseCase[] = [
  {
    title: "法人融資実行額予測の精度向上",
    description: "融資案件の審査ステージ遷移確率と融資額を組み合わせ、月次・四半期の融資実行額を高精度に予測する。営業戦略の立案と経営計画に活用。",
    relatedGraphId: "graph-1",
  },
  {
    title: "営業パフォーマンス分析",
    description: "担当者別の成約率・平均案件期間・融資額を分析し、トップパフォーマーのベストプラクティスを組織全体に展開する。",
    relatedGraphId: "graph-2",
  },
];

export const DS0005_GRAPHS: DatasetGraph[] = [
  {
    id: "graph-1",
    title: "審査ステージ別 件数",
    type: "bar",
    labels: ["初回接触", "初回面談", "稟議提出", "融資審査中", "条件交渉", "融資実行", "見送り"],
    datasets: [
      {
        label: "案件件数",
        data: [450, 380, 320, 250, 180, 120, 300],
        backgroundColor: "rgba(59, 130, 246, 0.6)",
      },
    ],
  },
  {
    id: "graph-2",
    title: "担当者別 成約率",
    type: "bar",
    labels: ["●●●●", "●●●●", "●●●●", "●●●●", "●●●●"],
    datasets: [
      {
        label: "成約率(%)",
        data: [32, 45, 28, 38, 41],
        backgroundColor: [
          "rgba(59, 130, 246, 0.6)",
          "rgba(16, 185, 129, 0.6)",
          "rgba(245, 158, 11, 0.6)",
          "rgba(139, 92, 246, 0.6)",
          "rgba(236, 72, 153, 0.6)",
        ],
      },
    ],
  },
];

// ============================================================
// SYNTH-DS006: インターネットバンキングログデータ（合成）
// ============================================================

export const DS0006_SAMPLE_TABLES: SampleTable[] = [
  {
    tableName: "ib_access_log",
    description: "インターネットバンキングのアクセスログを記録するテーブル",
    columns: [
      { name: "session_id", type: "string", displayName: "セッションID", description: "セッションを識別するID" },
      { name: "page_path", type: "string", displayName: "ページパス", description: "アクセスされたページのパス" },
      { name: "referrer", type: "string", displayName: "リファラー", description: "流入元URL" },
      { name: "duration_sec", type: "integer", displayName: "滞在時間(秒)", description: "ページ滞在時間" },
      { name: "device_type", type: "string", displayName: "デバイス", description: "アクセスデバイスの種類" },
      { name: "is_conversion", type: "boolean", displayName: "申込完了", description: "申込完了有無" },
    ],
    rows: [
      { session_id: "S001", page_path: "/transfer/confirm", referrer: "google.com", duration_sec: 120, device_type: "PC", is_conversion: true },
      { session_id: "S002", page_path: "/top", referrer: "direct", duration_sec: 15, device_type: "mobile", is_conversion: false },
      { session_id: "S003", page_path: "/loan/detail", referrer: "google.com", duration_sec: 85, device_type: "PC", is_conversion: false },
      { session_id: "S004", page_path: "/deposit/apply", referrer: null, duration_sec: 200, device_type: "mobile", is_conversion: true },
      { session_id: "S005", page_path: "/top", referrer: "bank-portal.jp", duration_sec: 8, device_type: "mobile", is_conversion: false },
    ],
    primaryKey: ["session_id"],
    foreignKeys: [],
  },
];

export const DS0006_USE_CASES: DatasetUseCase[] = [
  {
    title: "申込ファネル最適化",
    description: "各ページの離脱率と申込完了率を分析し、ファネルのボトルネックを特定。UX改善による申込完了率向上施策を立案する。",
    relatedGraphId: "graph-1",
  },
  {
    title: "流入チャネル分析",
    description: "リファラー別のセッション品質（滞在時間・申込率）を分析し、デジタルマーケティング予算の最適配分に活用する。",
    relatedGraphId: "graph-2",
  },
  {
    title: "異常アクセス検知",
    description: "アクセスパターンの時系列分析により、不正ログイン試行やbotアクセスを自動検出する。",
    relatedGraphId: null,
  },
];

export const DS0006_GRAPHS: DatasetGraph[] = [
  {
    id: "graph-1",
    title: "デバイス別 申込完了率",
    type: "bar",
    labels: ["PC", "mobile", "tablet"],
    datasets: [
      {
        label: "申込完了率(%)",
        data: [5.1, 1.8, 3.2],
        backgroundColor: ["rgba(59, 130, 246, 0.6)", "rgba(245, 158, 11, 0.6)", "rgba(16, 185, 129, 0.6)"],
      },
    ],
  },
  {
    id: "graph-2",
    title: "流入元別 セッション数",
    type: "pie",
    labels: ["検索エンジン", "ダイレクト", "銀行ポータル", "メール", "その他"],
    datasets: [
      {
        label: "セッション数",
        data: [18000, 12000, 8000, 5000, 7000],
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(245, 158, 11, 0.7)",
          "rgba(139, 92, 246, 0.7)",
          "rgba(156, 163, 175, 0.7)",
        ],
      },
    ],
  },
];

// ============================================================
// SYNTH-DS007: ATM稼働・障害データ（合成）
// ============================================================

export const DS0007_SAMPLE_TABLES: SampleTable[] = [
  {
    tableName: "atm_operation_log",
    description: "ATMの稼働ログと障害記録を管理するテーブル",
    columns: [
      { name: "atm_log_id", type: "string", displayName: "ATMログID", description: "ログを一意に識別するID" },
      { name: "atm_location", type: "string", displayName: "ATM設置場所", description: "ATMの設置場所" },
      { name: "operation_hours", type: "number", displayName: "稼働時間(h)", description: "日次稼働時間" },
      { name: "error_type", type: "string", displayName: "障害種別", description: "検出された障害の種類" },
      { name: "has_error", type: "boolean", displayName: "障害有無", description: "障害があったかどうか" },
    ],
    rows: [
      { atm_log_id: "SYNTH-ATM001", atm_location: "【サンプル】本店1F", operation_hours: 23.5, error_type: "なし", has_error: false },
      { atm_log_id: "SYNTH-ATM002", atm_location: "【サンプル】駅前支店", operation_hours: 18.2, error_type: "紙幣詰まり", has_error: true },
      { atm_log_id: "SYNTH-ATM003", atm_location: "【サンプル】本店1F", operation_hours: 24.0, error_type: "なし", has_error: false },
      { atm_log_id: "SYNTH-ATM004", atm_location: "【サンプル】ショッピングモール出張所", operation_hours: 12.8, error_type: "画面エラー", has_error: true },
      { atm_log_id: "SYNTH-ATM005", atm_location: "【サンプル】駅前支店", operation_hours: 22.1, error_type: "なし", has_error: false },
    ],
    primaryKey: ["atm_log_id"],
    foreignKeys: [],
  },
];

export const DS0007_USE_CASES: DatasetUseCase[] = [
  {
    title: "ATM障害予測",
    description: "稼働ログのパターンからATM障害発生を事前に予測し、予防保全の即時対応判断に活用する。",
    relatedGraphId: "graph-1",
  },
  {
    title: "ATM稼働率最適化",
    description: "設置場所別の稼働時間・障害頻度を分析し、障害率を最小化する最適な保守条件を導出する。",
    relatedGraphId: "graph-2",
  },
];

export const DS0007_GRAPHS: DatasetGraph[] = [
  {
    id: "graph-1",
    title: "設置場所別 障害率",
    type: "bar",
    labels: ["【サンプル】本店1F", "【サンプル】駅前支店", "【サンプル】ショッピングモール出張所", "【サンプル】大学前出張所", "【サンプル】住宅街支店"],
    datasets: [
      {
        label: "障害率(%)",
        data: [2.1, 4.5, 6.8, 1.9, 3.2],
        backgroundColor: [
          "rgba(16, 185, 129, 0.6)",
          "rgba(245, 158, 11, 0.6)",
          "rgba(239, 68, 68, 0.6)",
          "rgba(16, 185, 129, 0.6)",
          "rgba(59, 130, 246, 0.6)",
        ],
      },
    ],
  },
  {
    id: "graph-2",
    title: "稼働時間帯別 障害発生数",
    type: "line",
    labels: ["0-4h", "4-8h", "8-12h", "12-16h", "16-20h", "20-24h"],
    datasets: [
      {
        label: "障害件数",
        data: [50, 80, 120, 200, 350, 500],
        borderColor: "rgba(239, 68, 68, 1)",
        backgroundColor: "rgba(239, 68, 68, 0.2)",
        tension: 0.3,
      },
    ],
  },
];

// ============================================================
// SYNTH-DS008: 顧客問い合わせデータ（合成）
// ============================================================

export const DS0008_SAMPLE_TABLES: SampleTable[] = [
  {
    tableName: "inquiry_tickets",
    description: "コールセンターの問い合わせを管理するテーブル",
    columns: [
      { name: "ticket_id", type: "string", displayName: "問い合わせID", description: "問い合わせを一意に識別するID" },
      { name: "customer_id", type: "string", displayName: "顧客ID", description: "問い合わせ顧客のID" },
      { name: "category", type: "string", displayName: "カテゴリ", description: "問い合わせのカテゴリ" },
      { name: "priority", type: "string", displayName: "優先度", description: "問い合わせの優先度" },
      { name: "resolution_hours", type: "number", displayName: "解決時間(h)", description: "解決までの所要時間" },
      { name: "satisfaction_score", type: "integer", displayName: "満足度", description: "顧客満足度スコア(1-5)" },
    ],
    rows: [
      { ticket_id: "SYNTH-TK001", customer_id: "SYNTH-C101", category: "口座関連", priority: "高", resolution_hours: 2.5, satisfaction_score: 4 },
      { ticket_id: "SYNTH-TK002", customer_id: "SYNTH-C102", category: "手数料・金利", priority: "中", resolution_hours: 8.0, satisfaction_score: 3 },
      { ticket_id: "SYNTH-TK003", customer_id: "SYNTH-C103", category: "商品問い合わせ", priority: "低", resolution_hours: 48.0, satisfaction_score: 5 },
      { ticket_id: "SYNTH-TK004", customer_id: "SYNTH-C101", category: "IBトラブル", priority: "緊急", resolution_hours: 1.0, satisfaction_score: 4 },
      { ticket_id: "SYNTH-TK005", customer_id: "SYNTH-C104", category: "操作方法", priority: "中", resolution_hours: 4.5, satisfaction_score: 2 },
    ],
    primaryKey: ["ticket_id"],
    foreignKeys: [],
  },
];

export const DS0008_USE_CASES: DatasetUseCase[] = [
  {
    title: "問い合わせ自動分類・ルーティング",
    description: "NLPによる問い合わせ内容の自動分類と、適切な担当者への自動振り分けにより、初回対応時間の短縮を実現する。",
    relatedGraphId: "graph-1",
  },
  {
    title: "顧客満足度予測",
    description: "問い合わせの属性（カテゴリ・優先度・対応時間）から満足度を予測し、低満足度リスクの問い合わせを優先対応する。",
    relatedGraphId: "graph-2",
  },
  {
    title: "対応品質のトレンド分析",
    description: "月次の解決時間・満足度の推移を分析し、対応品質の改善施策の効果を定量的に評価する。",
    relatedGraphId: null,
  },
];

export const DS0008_GRAPHS: DatasetGraph[] = [
  {
    id: "graph-1",
    title: "カテゴリ別 問い合わせ件数",
    type: "doughnut",
    labels: ["口座関連", "手数料・金利", "商品問い合わせ", "IBトラブル", "操作方法", "ローン相談", "その他"],
    datasets: [
      {
        label: "件数",
        data: [2500, 1500, 1000, 800, 1200, 600, 400],
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(245, 158, 11, 0.7)",
          "rgba(239, 68, 68, 0.7)",
          "rgba(139, 92, 246, 0.7)",
          "rgba(236, 72, 153, 0.7)",
          "rgba(156, 163, 175, 0.7)",
        ],
      },
    ],
  },
  {
    id: "graph-2",
    title: "優先度別 平均解決時間",
    type: "bar",
    labels: ["緊急", "高", "中", "低"],
    datasets: [
      {
        label: "平均解決時間(h)",
        data: [1.5, 4.2, 12.8, 36.5],
        backgroundColor: [
          "rgba(239, 68, 68, 0.6)",
          "rgba(245, 158, 11, 0.6)",
          "rgba(59, 130, 246, 0.6)",
          "rgba(156, 163, 175, 0.6)",
        ],
      },
    ],
  },
];

// ============================================================
// SYNTH-DS009: 店舗間コミュニケーション分析データ（合成）
// ============================================================

export const DS0009_SAMPLE_TABLES: SampleTable[] = [
  {
    tableName: "communication_meta",
    description: "店舗間・部門間コミュニケーションの匿名化メタデータを記録するテーブル",
    columns: [
      { name: "interaction_id", type: "string", displayName: "インタラクションID", description: "やりとりを識別するID" },
      { name: "from_dept", type: "string", displayName: "発信元部署・支店", description: "メッセージの発信元" },
      { name: "to_dept", type: "string", displayName: "送信先部署・支店", description: "メッセージの送信先" },
      { name: "channel_type", type: "string", displayName: "チャネル", description: "コミュニケーション手段" },
      { name: "message_count", type: "integer", displayName: "メッセージ数", description: "やりとりのメッセージ数" },
    ],
    rows: [
      { interaction_id: "SYNTH-INT001", from_dept: "【サンプル】システム開発部", to_dept: "【サンプル】経営企画部", channel_type: "チャット", message_count: 25 },
      { interaction_id: "SYNTH-INT002", from_dept: "【サンプル】法人営業部", to_dept: "【サンプル】リテール企画部", channel_type: "メール", message_count: 8 },
      { interaction_id: "SYNTH-INT003", from_dept: "【サンプル】人事部", to_dept: "全行", channel_type: "会議", message_count: 1 },
      { interaction_id: "SYNTH-INT004", from_dept: "【サンプル】システム開発部", to_dept: "【サンプル】システム開発部", channel_type: "チャット", message_count: 150 },
      { interaction_id: "SYNTH-INT005", from_dept: "【サンプル】経営企画部", to_dept: "【サンプル】法人営業部", channel_type: "メール", message_count: 12 },
    ],
    primaryKey: ["interaction_id"],
    foreignKeys: [],
  },
];

export const DS0009_USE_CASES: DatasetUseCase[] = [
  {
    title: "店舗間ネットワーク可視化",
    description: "部門間・店舗間のコミュニケーション量をネットワークグラフとして可視化し、組織のサイロ化やボトルネックを発見する。",
    relatedGraphId: "graph-1",
  },
  {
    title: "エンゲージメント分析",
    description: "チャネル別のコミュニケーション量と行員エンゲージメントの相関を分析し、組織活性化施策に活用する。",
    relatedGraphId: "graph-2",
  },
];

export const DS0009_GRAPHS: DatasetGraph[] = [
  {
    id: "graph-1",
    title: "部署・支店別 コミュニケーション量",
    type: "bar",
    labels: ["【サンプル】システム開発部", "【サンプル】法人営業部", "【サンプル】経営企画部", "【サンプル】人事部", "【サンプル】リテール企画部", "【サンプル】駅前支店"],
    datasets: [
      {
        label: "発信メッセージ数",
        data: [4500, 3200, 2800, 1500, 2100, 1800],
        backgroundColor: "rgba(59, 130, 246, 0.6)",
      },
      {
        label: "受信メッセージ数",
        data: [3800, 3500, 3100, 2200, 1900, 2500],
        backgroundColor: "rgba(16, 185, 129, 0.6)",
      },
    ],
  },
  {
    id: "graph-2",
    title: "チャネル別 利用割合",
    type: "pie",
    labels: ["チャット", "メール", "会議"],
    datasets: [
      {
        label: "メッセージ数",
        data: [65, 25, 10],
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(245, 158, 11, 0.7)",
        ],
      },
    ],
  },
];

// ============================================================
// SYNTH-DS010: 経費・予算管理データ（合成）
// ============================================================

export const DS0010_SAMPLE_TABLES: SampleTable[] = [
  {
    tableName: "expense_records",
    description: "経費申請明細を管理するテーブル。行員ごとの経費申請内容・金額・承認状況を記録する",
    columns: [
      { name: "expense_id", type: "string", displayName: "経費ID", description: "経費申請を一意に識別するID" },
      { name: "applicant_id", type: "string", displayName: "行員ID", description: "申請者の行員ID" },
      { name: "department", type: "string", displayName: "部署", description: "申請者の所属部署" },
      { name: "expense_category", type: "string", displayName: "費目", description: "経費の大分類" },
      { name: "expense_detail", type: "string", displayName: "費目詳細", description: "経費の詳細内容" },
      { name: "amount", type: "integer", displayName: "金額(円)", description: "申請金額" },
      { name: "application_date", type: "date", displayName: "申請日", description: "経費申請の提出日" },
      { name: "approver_id", type: "string", displayName: "承認者ID", description: "承認権限者の行員ID" },
      { name: "receipt_attached", type: "boolean", displayName: "領収書添付", description: "領収書が添付されているか" },
      { name: "approval_status", type: "string", displayName: "承認状況", description: "経費申請の承認ステータス" },
      { name: "budget_code", type: "string", displayName: "予算コード", description: "紐づく予算のコード" },
      { name: "note", type: "string", displayName: "備考", description: "申請に関する備考・補足情報" },
    ],
    rows: [
      { expense_id: "SYNTH-EXP001", applicant_id: "SYNTH-E0234", department: "【サンプル】法人営業部", expense_category: "交通費", expense_detail: "東京-大阪 新幹線往復", amount: 15000, application_date: "2025-01-10", approver_id: "SYNTH-E0050", receipt_attached: true, approval_status: "承認済", budget_code: "BG-CORP-01", note: null },
      { expense_id: "SYNTH-EXP002", applicant_id: "SYNTH-E0112", department: "【サンプル】システム開発部", expense_category: "備品購入", expense_detail: "外部モニター 27インチ", amount: 45000, application_date: "2025-01-15", approver_id: "SYNTH-E0030", receipt_attached: true, approval_status: "承認済", budget_code: "BG-IT-01", note: "在宅勤務環境整備" },
      { expense_id: "SYNTH-EXP003", applicant_id: "SYNTH-E0301", department: "【サンプル】法人営業部", expense_category: "交際費", expense_detail: "取引先接待 会食費", amount: 385000, application_date: "2025-01-22", approver_id: "SYNTH-E0050", receipt_attached: true, approval_status: "審査中", budget_code: "BG-CORP-02", note: "取引先幹部との会食" },
      { expense_id: "SYNTH-EXP004", applicant_id: "SYNTH-E0078", department: "【サンプル】人事部", expense_category: "研修費", expense_detail: "外部研修 リーダーシップ講座", amount: 120000, application_date: "2025-01-28", approver_id: "SYNTH-E0015", receipt_attached: true, approval_status: "承認済", budget_code: "BG-HR-01", note: null },
      { expense_id: "SYNTH-EXP005", applicant_id: "SYNTH-E0189", department: "【サンプル】リテール企画部", expense_category: "広告費", expense_detail: "Web広告 年間契約", amount: 1850000, application_date: "2025-02-01", approver_id: "SYNTH-E0040", receipt_attached: false, approval_status: "差戻し", budget_code: "BG-RTL-01", note: "領収書未着のため仮申請" },
    ],
    primaryKey: ["expense_id"],
    foreignKeys: [],
  },
  {
    tableName: "budget_master",
    description: "部門別・費目別の年度予算と執行状況を管理するマスタテーブル",
    columns: [
      { name: "budget_code", type: "string", displayName: "予算コード", description: "予算を一意に識別するコード" },
      { name: "department", type: "string", displayName: "部署", description: "予算配分先の部署" },
      { name: "fiscal_year", type: "string", displayName: "年度", description: "対象会計年度" },
      { name: "category", type: "string", displayName: "費目区分", description: "予算の費目大分類" },
      { name: "budget_amount", type: "integer", displayName: "予算額(円)", description: "年度予算額" },
      { name: "spent_amount", type: "integer", displayName: "執行額(円)", description: "累計執行済み金額" },
      { name: "remaining", type: "integer", displayName: "残額(円)", description: "予算残額" },
    ],
    rows: [
      { budget_code: "BG-CORP-01", department: "【サンプル】法人営業部", fiscal_year: "2024", category: "交通費", budget_amount: 5000000, spent_amount: 3900000, remaining: 1100000 },
      { budget_code: "BG-CORP-02", department: "【サンプル】法人営業部", fiscal_year: "2024", category: "交際費", budget_amount: 3000000, spent_amount: 2730000, remaining: 270000 },
      { budget_code: "BG-IT-01", department: "【サンプル】システム開発部", fiscal_year: "2024", category: "備品購入", budget_amount: 8000000, spent_amount: 5200000, remaining: 2800000 },
      { budget_code: "BG-HR-01", department: "【サンプル】人事部", fiscal_year: "2024", category: "研修費", budget_amount: 6000000, spent_amount: 4920000, remaining: 1080000 },
      { budget_code: "BG-RTL-01", department: "【サンプル】リテール企画部", fiscal_year: "2024", category: "広告費", budget_amount: 20000000, spent_amount: 18200000, remaining: 1800000 },
    ],
    primaryKey: ["budget_code"],
    foreignKeys: [],
  },
];

export const DS0010_USE_CASES: DatasetUseCase[] = [
  {
    title: "経費異常検知（Isolation Forest + ルールベース）",
    description: "Isolation Forestによる教師なし学習と、財務経理部門のドメイン知識に基づくルールベース判定を組み合わせたハイブリッド手法で、高額異常・頻度異常・パターン異常を包括的に検出する。異常スコアの段階的スクリーニングにより、財務経理部門の確認負荷を最小化しつつ高精度な不正検知を実現する。",
    relatedGraphId: "graph-1",
  },
  {
    title: "予算消化率リアルタイムモニタリング",
    description: "部門別・費目別の予算消化率をリアルタイムで可視化し、消化率90%超の予算項目を自動アラートで通知する。過去の消化ペースとの比較により、年度末の予算超過リスクを早期に検知し、予算再配分の意思決定を支援する。",
    relatedGraphId: "graph-2",
  },
  {
    title: "部門別コスト構造分析と最適化",
    description: "費目別の月次コスト推移を部門横断で分析し、季節変動・トレンド・外れ値を可視化する。類似部門間のベンチマーク比較により、コスト削減可能な領域を特定し、次年度予算策定の根拠データとして活用する。",
    relatedGraphId: "graph-3",
  },
  {
    title: "経費申請プロセスの効率化分析",
    description: "申請から承認までのリードタイム、差戻し率、承認者別の処理件数を分析し、経費申請ワークフローのボトルネックを特定する。承認権限の最適化と申請ルールの簡素化により、行員・財務経理双方の業務効率向上を実現する。",
    relatedGraphId: null,
  },
];

export const DS0010_GRAPHS: DatasetGraph[] = [
  {
    id: "graph-1",
    title: "異常スコア分布",
    type: "bar",
    labels: ["0-0.1", "0.1-0.2", "0.2-0.3", "0.3-0.4", "0.4-0.5", "0.5-0.6", "0.6-0.7", "0.7-0.8", "0.8-0.9", "0.9-1.0"],
    datasets: [
      {
        label: "申請件数",
        data: [2800, 1200, 500, 250, 100, 50, 60, 25, 10, 5],
        backgroundColor: [
          "rgba(16, 185, 129, 0.6)",
          "rgba(16, 185, 129, 0.6)",
          "rgba(59, 130, 246, 0.6)",
          "rgba(59, 130, 246, 0.6)",
          "rgba(245, 158, 11, 0.6)",
          "rgba(245, 158, 11, 0.6)",
          "rgba(239, 68, 68, 0.6)",
          "rgba(239, 68, 68, 0.6)",
          "rgba(220, 38, 38, 0.8)",
          "rgba(220, 38, 38, 0.8)",
        ],
      },
    ],
  },
  {
    id: "graph-2",
    title: "部署別 予算消化率",
    type: "bar",
    labels: ["【サンプル】法人営業部", "【サンプル】システム開発部", "【サンプル】人事部", "【サンプル】リテール企画部", "【サンプル】経営企画部", "【サンプル】事務センター"],
    datasets: [
      {
        label: "消化率(%)",
        data: [78, 65, 82, 91, 55, 72],
        backgroundColor: [
          "rgba(59, 130, 246, 0.6)",
          "rgba(16, 185, 129, 0.6)",
          "rgba(245, 158, 11, 0.6)",
          "rgba(239, 68, 68, 0.6)",
          "rgba(16, 185, 129, 0.6)",
          "rgba(59, 130, 246, 0.6)",
        ],
      },
    ],
  },
  {
    id: "graph-3",
    title: "費目別 月次コスト推移",
    type: "line",
    labels: ["2024/10", "2024/11", "2024/12", "2025/01", "2025/02", "2025/03"],
    datasets: [
      {
        label: "交通費",
        data: [420, 380, 350, 410, 390, 400],
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.3,
      },
      {
        label: "交際費",
        data: [280, 350, 520, 310, 290, 450],
        borderColor: "rgba(239, 68, 68, 1)",
        backgroundColor: "rgba(239, 68, 68, 0.2)",
        tension: 0.3,
      },
      {
        label: "備品購入",
        data: [150, 180, 120, 200, 160, 140],
        borderColor: "rgba(16, 185, 129, 1)",
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        tension: 0.3,
      },
    ],
  },
];

// ============================================================
// データセットIDとカタログデータのマッピング
// ============================================================

export const CATALOG_DATA: Record<string, {
  sampleTables: SampleTable[];
  useCases: DatasetUseCase[];
  graphs: DatasetGraph[];
}> = {
  "SYNTH-DS001": { sampleTables: DS0001_SAMPLE_TABLES, useCases: DS0001_USE_CASES, graphs: DS0001_GRAPHS },
  "SYNTH-DS002": { sampleTables: DS0002_SAMPLE_TABLES, useCases: DS0002_USE_CASES, graphs: DS0002_GRAPHS },
  "SYNTH-DS003": { sampleTables: DS0003_SAMPLE_TABLES, useCases: DS0003_USE_CASES, graphs: DS0003_GRAPHS },
  "SYNTH-DS004": { sampleTables: DS0004_SAMPLE_TABLES, useCases: DS0004_USE_CASES, graphs: DS0004_GRAPHS },
  "SYNTH-DS005": { sampleTables: DS0005_SAMPLE_TABLES, useCases: DS0005_USE_CASES, graphs: DS0005_GRAPHS },
  "SYNTH-DS006": { sampleTables: DS0006_SAMPLE_TABLES, useCases: DS0006_USE_CASES, graphs: DS0006_GRAPHS },
  "SYNTH-DS007": { sampleTables: DS0007_SAMPLE_TABLES, useCases: DS0007_USE_CASES, graphs: DS0007_GRAPHS },
  "SYNTH-DS008": { sampleTables: DS0008_SAMPLE_TABLES, useCases: DS0008_USE_CASES, graphs: DS0008_GRAPHS },
  "SYNTH-DS009": { sampleTables: DS0009_SAMPLE_TABLES, useCases: DS0009_USE_CASES, graphs: DS0009_GRAPHS },
  "SYNTH-DS010": { sampleTables: DS0010_SAMPLE_TABLES, useCases: DS0010_USE_CASES, graphs: DS0010_GRAPHS },
};
