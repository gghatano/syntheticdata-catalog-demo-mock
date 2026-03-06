import { SampleTable, DatasetUseCase, DatasetGraph } from "../types/models";

// ============================================================
// DS0001: 従業員スキル分析データ - サンプルテーブル
// ============================================================

export const DS0001_SAMPLE_TABLES: SampleTable[] = [
  {
    tableName: "employee_master",
    description: "従業員の基本属性情報を管理するマスタテーブル",
    columns: [
      { name: "emp_id", type: "string", displayName: "従業員ID", description: "従業員を一意に識別するID" },
      { name: "name", type: "string", displayName: "氏名", description: "従業員の氏名" },
      { name: "department", type: "string", displayName: "所属部署", description: "所属部門名" },
      { name: "join_date", type: "date", displayName: "入社日", description: "入社年月日" },
      { name: "grade", type: "string", displayName: "等級", description: "職能等級（G1〜G6）" },
      { name: "skill_score", type: "integer", displayName: "スキルスコア", description: "総合スキルスコア（0-100）" },
    ],
    rows: [
      { emp_id: "E001", name: "田中太郎", department: "開発部", join_date: "2018-04-01", grade: "G4", skill_score: 82 },
      { emp_id: "E002", name: "佐藤花子", department: "データサイエンス部", join_date: "2020-04-01", grade: "G3", skill_score: 75 },
      { emp_id: "E003", name: "鈴木一郎", department: "開発部", join_date: "2016-04-01", grade: "G5", skill_score: 91 },
      { emp_id: "E004", name: "高橋美咲", department: "企画部", join_date: "2021-10-01", grade: "G2", skill_score: 58 },
      { emp_id: "E005", name: "山田優子", department: "開発部", join_date: "2019-04-01", grade: "G4", skill_score: 79 },
    ],
    primaryKey: ["emp_id"],
    foreignKeys: [],
  },
  {
    tableName: "project_allocation",
    description: "従業員のプロジェクトへの配置情報を管理するテーブル",
    columns: [
      { name: "emp_id", type: "string", displayName: "従業員ID", description: "配置された従業員のID" },
      { name: "project_id", type: "string", displayName: "プロジェクトID", description: "プロジェクトを一意に識別するID" },
      { name: "role", type: "string", displayName: "役割", description: "プロジェクト内での役割" },
      { name: "allocation_pct", type: "integer", displayName: "アサイン比率(%)", description: "プロジェクトへのアサイン割合", format: "percentage" },
      { name: "start_date", type: "date", displayName: "開始日", description: "アサイン開始日" },
    ],
    rows: [
      { emp_id: "E001", project_id: "PJ001", role: "リーダー", allocation_pct: 80, start_date: "2024-01-01" },
      { emp_id: "E002", project_id: "PJ001", role: "メンバー", allocation_pct: 60, start_date: "2024-01-15" },
      { emp_id: "E003", project_id: "PJ002", role: "リーダー", allocation_pct: 100, start_date: "2023-10-01" },
      { emp_id: "E004", project_id: "PJ001", role: "メンバー", allocation_pct: 40, start_date: "2024-02-01" },
      { emp_id: "E005", project_id: "PJ003", role: "メンバー", allocation_pct: 50, start_date: "2024-03-01" },
    ],
    primaryKey: ["emp_id", "project_id"],
    foreignKeys: [
      { columns: ["emp_id"], referenceTable: "employee_master", referenceColumns: ["emp_id"] },
    ],
  },
  {
    tableName: "working_hours",
    description: "従業員の月次労働時間を記録するテーブル",
    columns: [
      { name: "emp_id", type: "string", displayName: "従業員ID", description: "労働時間の対象従業員ID" },
      { name: "year_month", type: "string", displayName: "年月", description: "対象年月（YYYY-MM形式）" },
      { name: "regular_hours", type: "integer", displayName: "所定労働時間", description: "月間の所定労働時間（h）" },
      { name: "overtime_hours", type: "number", displayName: "残業時間", description: "月間の残業時間（h）" },
    ],
    rows: [
      { emp_id: "E001", year_month: "2024-01", regular_hours: 168, overtime_hours: 25.5 },
      { emp_id: "E001", year_month: "2024-02", regular_hours: 160, overtime_hours: 18.0 },
      { emp_id: "E002", year_month: "2024-01", regular_hours: 168, overtime_hours: 12.0 },
      { emp_id: "E003", year_month: "2024-01", regular_hours: 168, overtime_hours: 35.5 },
      { emp_id: "E004", year_month: "2024-01", regular_hours: 160, overtime_hours: 5.0 },
    ],
    primaryKey: ["emp_id", "year_month"],
    foreignKeys: [
      { columns: ["emp_id"], referenceTable: "employee_master", referenceColumns: ["emp_id"] },
    ],
  },
];

export const DS0001_USE_CASES: DatasetUseCase[] = [
  {
    title: "スキルマッチング最適化",
    description: "従業員のスキルスコアとプロジェクト要件を照合し、最適な人材配置を提案する。プロジェクト成功率の向上と従業員の成長機会の最大化に活用。",
    relatedGraphId: "graph-1",
  },
  {
    title: "残業時間の傾向分析と予測",
    description: "部署・等級・プロジェクト配置率と残業時間の相関を分析し、過重労働リスクの早期検知と適切な業務負荷分散に活用する。",
    relatedGraphId: "graph-2",
  },
  {
    title: "人材育成ロードマップの策定",
    description: "スキルスコアの変化傾向と等級昇格パターンを分析し、効果的な研修プログラムの設計と個人別育成計画の立案に活用する。",
    relatedGraphId: "graph-1",
  },
  {
    title: "プロジェクトリソース配分の最適化",
    description: "プロジェクトのアサイン比率と稼働時間実績を分析し、リソースの過不足を可視化。効率的なプロジェクト運営に活用する。",
    relatedGraphId: null,
  },
];

export const DS0001_GRAPHS: DatasetGraph[] = [
  {
    id: "graph-1",
    title: "部署別 平均スキルスコア",
    type: "bar",
    labels: ["開発部", "データサイエンス部", "企画部", "営業部", "人事部"],
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
        label: "全社平均残業時間(h)",
        data: [22.4, 19.8, 24.1, 18.5, 20.3, 17.9],
        borderColor: "rgba(16, 185, 129, 1)",
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        tension: 0.3,
      },
      {
        label: "開発部平均残業時間(h)",
        data: [28.5, 25.2, 32.1, 22.8, 26.4, 23.1],
        borderColor: "rgba(239, 68, 68, 1)",
        backgroundColor: "rgba(239, 68, 68, 0.2)",
        tension: 0.3,
      },
    ],
  },
];

// ============================================================
// DS0002: 部門別パフォーマンスデータ - サンプルテーブル
// ============================================================

export const DS0002_SAMPLE_TABLES: SampleTable[] = [
  {
    tableName: "employee_master",
    description: "従業員の基本情報と業績評価を管理するマスタテーブル",
    columns: [
      { name: "emp_id", type: "string", displayName: "従業員ID", description: "従業員を一意に識別するID" },
      { name: "name", type: "string", displayName: "氏名", description: "従業員の氏名" },
      { name: "department", type: "string", displayName: "所属部署", description: "所属部門名" },
      { name: "performance_score", type: "number", displayName: "業績評価", description: "業績評価スコア（1.0-5.0）" },
      { name: "tenure_years", type: "integer", displayName: "勤続年数", description: "入社からの年数" },
      { name: "is_resigned", type: "boolean", displayName: "退職フラグ", description: "退職済みかどうか" },
    ],
    rows: [
      { emp_id: "E101", name: "中村健太", department: "営業部", performance_score: 4.2, tenure_years: 8, is_resigned: false },
      { emp_id: "E102", name: "小林理恵", department: "開発部", performance_score: 3.8, tenure_years: 5, is_resigned: false },
      { emp_id: "E103", name: "加藤誠", department: "営業部", performance_score: 2.5, tenure_years: 3, is_resigned: true },
      { emp_id: "E104", name: "松本美穂", department: "企画部", performance_score: 4.5, tenure_years: 12, is_resigned: false },
      { emp_id: "E105", name: "井上拓也", department: "開発部", performance_score: 3.1, tenure_years: 2, is_resigned: true },
    ],
    primaryKey: ["emp_id"],
    foreignKeys: [],
  },
  {
    tableName: "project_allocation",
    description: "従業員のプロジェクト配置履歴テーブル",
    columns: [
      { name: "emp_id", type: "string", displayName: "従業員ID", description: "配置された従業員のID" },
      { name: "project_id", type: "string", displayName: "プロジェクトID", description: "プロジェクトを識別するID" },
      { name: "role", type: "string", displayName: "役割", description: "プロジェクト内の役割" },
      { name: "allocation_pct", type: "integer", displayName: "アサイン比率(%)", description: "アサイン割合" },
    ],
    rows: [
      { emp_id: "E101", project_id: "PJ010", role: "リーダー", allocation_pct: 100 },
      { emp_id: "E102", project_id: "PJ011", role: "メンバー", allocation_pct: 80 },
      { emp_id: "E103", project_id: "PJ010", role: "メンバー", allocation_pct: 60 },
      { emp_id: "E104", project_id: "PJ012", role: "リーダー", allocation_pct: 70 },
      { emp_id: "E105", project_id: "PJ011", role: "メンバー", allocation_pct: 50 },
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
    description: "業績評価・勤続年数・部署などの特徴量から離職確率を予測する機械学習モデルを構築し、ハイリスク従業員の早期発見と定着施策の立案に活用する。",
    relatedGraphId: "graph-1",
  },
  {
    title: "部門別パフォーマンスベンチマーク",
    description: "部門ごとの業績評価分布を可視化・比較し、高パフォーマンス部門のベストプラクティス抽出や低パフォーマンス部門の改善ポイント特定に活用する。",
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
    labels: ["営業部", "開発部", "企画部", "人事部", "経理部", "総務部"],
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
    labels: ["営業部", "開発部", "企画部", "人事部", "経理部"],
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
// DS0003: 新卒採用分析データ - サンプルテーブル (未公開データの例)
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
      { applicant_id: "A001", university: "東京大学", gpa: 3.8, interview_score: 9, offer_status: "内定承諾" },
      { applicant_id: "A002", university: "京都大学", gpa: 3.5, interview_score: 7, offer_status: "内定辞退" },
      { applicant_id: "A003", university: "慶應義塾大学", gpa: 3.2, interview_score: 8, offer_status: "内定承諾" },
      { applicant_id: "A004", university: "早稲田大学", gpa: 2.9, interview_score: 5, offer_status: "不合格" },
      { applicant_id: "A005", university: "東北大学", gpa: 3.6, interview_score: 8, offer_status: "内定承諾" },
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
// DS0004: 顧客購買行動データ
// ============================================================

export const DS0004_SAMPLE_TABLES: SampleTable[] = [
  {
    tableName: "customer_purchase",
    description: "顧客の購買履歴を管理するテーブル",
    columns: [
      { name: "customer_id", type: "string", displayName: "顧客ID", description: "顧客を一意に識別するID" },
      { name: "purchase_date", type: "date", displayName: "購買日", description: "購買が行われた日付" },
      { name: "product_category", type: "string", displayName: "商品カテゴリ", description: "購入商品のカテゴリ" },
      { name: "amount", type: "integer", displayName: "購買金額", description: "購買金額（円）" },
      { name: "channel", type: "string", displayName: "チャネル", description: "購買チャネル（EC/店舗）" },
      { name: "age_group", type: "string", displayName: "年代", description: "顧客の年齢層" },
    ],
    rows: [
      { customer_id: "C001", purchase_date: "2024-08-15", product_category: "家電", amount: 45000, channel: "EC", age_group: "30代" },
      { customer_id: "C002", purchase_date: "2024-08-16", product_category: "食品", amount: 3200, channel: "店舗", age_group: "40代" },
      { customer_id: "C001", purchase_date: "2024-09-01", product_category: "書籍", amount: 1800, channel: "EC", age_group: "30代" },
      { customer_id: "C003", purchase_date: "2024-09-05", product_category: "衣料", amount: 12500, channel: "店舗", age_group: "20代" },
      { customer_id: "C004", purchase_date: "2024-09-10", product_category: "家電", amount: 89000, channel: "EC", age_group: "50代" },
    ],
    primaryKey: ["customer_id", "purchase_date"],
    foreignKeys: [],
  },
];

export const DS0004_USE_CASES: DatasetUseCase[] = [
  {
    title: "顧客セグメンテーション",
    description: "RFM分析とクラスタリングにより顧客を価値ベースでセグメント化し、各セグメントに最適なマーケティング施策を立案する。",
    relatedGraphId: "graph-1",
  },
  {
    title: "購買予測とレコメンド",
    description: "過去の購買パターンから次回購買商品・タイミングを予測し、パーソナライズされたレコメンドを提供する。",
    relatedGraphId: "graph-2",
  },
  {
    title: "LTV（顧客生涯価値）予測",
    description: "顧客の購買頻度・金額の変化から将来のLTVを予測し、マーケティング投資の最適配分に活用する。",
    relatedGraphId: null,
  },
];

export const DS0004_GRAPHS: DatasetGraph[] = [
  {
    id: "graph-1",
    title: "商品カテゴリ別 売上構成比",
    type: "doughnut",
    labels: ["家電", "食品", "衣料", "書籍", "日用品", "その他"],
    datasets: [
      {
        label: "売上構成比",
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
    title: "月別 購買件数推移",
    type: "line",
    labels: ["2024/04", "2024/05", "2024/06", "2024/07", "2024/08", "2024/09"],
    datasets: [
      {
        label: "EC",
        data: [1200, 1350, 1100, 1500, 1800, 1650],
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.3,
      },
      {
        label: "店舗",
        data: [800, 750, 900, 850, 920, 880],
        borderColor: "rgba(245, 158, 11, 1)",
        backgroundColor: "rgba(245, 158, 11, 0.2)",
        tension: 0.3,
      },
    ],
  },
];

// ============================================================
// DS0005: 営業パイプラインデータ
// ============================================================

export const DS0005_SAMPLE_TABLES: SampleTable[] = [
  {
    tableName: "sales_pipeline",
    description: "営業商談の進捗状況を管理するテーブル",
    columns: [
      { name: "deal_id", type: "string", displayName: "商談ID", description: "商談を一意に識別するID" },
      { name: "sales_rep", type: "string", displayName: "営業担当", description: "営業担当者名" },
      { name: "stage", type: "string", displayName: "ステージ", description: "商談の進捗ステージ" },
      { name: "deal_amount", type: "integer", displayName: "商談金額(万円)", description: "商談の見込み金額" },
      { name: "probability", type: "number", displayName: "受注確度(%)", description: "受注の確率" },
      { name: "created_date", type: "date", displayName: "作成日", description: "商談が作成された日付" },
    ],
    rows: [
      { deal_id: "D001", sales_rep: "山本一郎", stage: "提案中", deal_amount: 500, probability: 60, created_date: "2024-07-01" },
      { deal_id: "D002", sales_rep: "田中花子", stage: "見積提出", deal_amount: 1200, probability: 75, created_date: "2024-07-15" },
      { deal_id: "D003", sales_rep: "山本一郎", stage: "初回接触", deal_amount: 300, probability: 20, created_date: "2024-08-01" },
      { deal_id: "D004", sales_rep: "鈴木太郎", stage: "受注", deal_amount: 800, probability: 95, created_date: "2024-06-15" },
      { deal_id: "D005", sales_rep: "田中花子", stage: "失注", deal_amount: 2000, probability: 5, created_date: "2024-05-20" },
    ],
    primaryKey: ["deal_id"],
    foreignKeys: [],
  },
];

export const DS0005_USE_CASES: DatasetUseCase[] = [
  {
    title: "売上予測の精度向上",
    description: "商談ステージの遷移確率と金額を組み合わせ、月次・四半期の売上を高精度に予測する。営業戦略の立案と経営計画に活用。",
    relatedGraphId: "graph-1",
  },
  {
    title: "営業パフォーマンス分析",
    description: "担当者別の成約率・平均商談期間・商談金額を分析し、トップパフォーマーのベストプラクティスを組織全体に展開する。",
    relatedGraphId: "graph-2",
  },
];

export const DS0005_GRAPHS: DatasetGraph[] = [
  {
    id: "graph-1",
    title: "商談ステージ別 件数",
    type: "bar",
    labels: ["初回接触", "ヒアリング", "提案中", "見積提出", "交渉中", "受注", "失注"],
    datasets: [
      {
        label: "商談件数",
        data: [450, 380, 320, 250, 180, 120, 300],
        backgroundColor: "rgba(59, 130, 246, 0.6)",
      },
    ],
  },
  {
    id: "graph-2",
    title: "担当者別 成約率",
    type: "bar",
    labels: ["山本一郎", "田中花子", "鈴木太郎", "佐藤美咲", "高橋健太"],
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
// DS0006: Webアクセスログデータ
// ============================================================

export const DS0006_SAMPLE_TABLES: SampleTable[] = [
  {
    tableName: "web_access_log",
    description: "Webサイトのアクセスログを記録するテーブル",
    columns: [
      { name: "session_id", type: "string", displayName: "セッションID", description: "セッションを識別するID" },
      { name: "page_path", type: "string", displayName: "ページパス", description: "アクセスされたページのパス" },
      { name: "referrer", type: "string", displayName: "リファラー", description: "流入元URL" },
      { name: "duration_sec", type: "integer", displayName: "滞在時間(秒)", description: "ページ滞在時間" },
      { name: "device_type", type: "string", displayName: "デバイス", description: "アクセスデバイスの種類" },
      { name: "is_conversion", type: "boolean", displayName: "CV", description: "コンバージョン有無" },
    ],
    rows: [
      { session_id: "S001", page_path: "/products/detail", referrer: "google.com", duration_sec: 120, device_type: "PC", is_conversion: true },
      { session_id: "S002", page_path: "/top", referrer: "direct", duration_sec: 15, device_type: "mobile", is_conversion: false },
      { session_id: "S003", page_path: "/products/list", referrer: "google.com", duration_sec: 85, device_type: "PC", is_conversion: false },
      { session_id: "S004", page_path: "/cart", referrer: null, duration_sec: 200, device_type: "mobile", is_conversion: true },
      { session_id: "S005", page_path: "/top", referrer: "twitter.com", duration_sec: 8, device_type: "mobile", is_conversion: false },
    ],
    primaryKey: ["session_id"],
    foreignKeys: [],
  },
];

export const DS0006_USE_CASES: DatasetUseCase[] = [
  {
    title: "コンバージョンファネル最適化",
    description: "各ページの離脱率とCVRを分析し、ファネルのボトルネックを特定。UX改善によるCVR向上施策を立案する。",
    relatedGraphId: "graph-1",
  },
  {
    title: "流入チャネル分析",
    description: "リファラー別のセッション品質（滞在時間・CV率）を分析し、マーケティング予算の最適配分に活用する。",
    relatedGraphId: "graph-2",
  },
  {
    title: "異常アクセス検知",
    description: "アクセスパターンの時系列分析により、botアクセスや不正なクローリングを自動検出する。",
    relatedGraphId: null,
  },
];

export const DS0006_GRAPHS: DatasetGraph[] = [
  {
    id: "graph-1",
    title: "デバイス別 CVR",
    type: "bar",
    labels: ["PC", "mobile", "tablet"],
    datasets: [
      {
        label: "CVR(%)",
        data: [5.1, 1.8, 3.2],
        backgroundColor: ["rgba(59, 130, 246, 0.6)", "rgba(245, 158, 11, 0.6)", "rgba(16, 185, 129, 0.6)"],
      },
    ],
  },
  {
    id: "graph-2",
    title: "流入元別 セッション数",
    type: "pie",
    labels: ["Google", "Direct", "SNS", "メール", "その他"],
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
// DS0007: 製品品質検査データ
// ============================================================

export const DS0007_SAMPLE_TABLES: SampleTable[] = [
  {
    tableName: "quality_inspection",
    description: "製造ラインの品質検査結果を記録するテーブル",
    columns: [
      { name: "inspection_id", type: "string", displayName: "検査ID", description: "検査を一意に識別するID" },
      { name: "product_line", type: "string", displayName: "製品ライン", description: "製造ラインの名称" },
      { name: "temperature", type: "number", displayName: "温度(℃)", description: "製造時の温度" },
      { name: "defect_type", type: "string", displayName: "不良種別", description: "検出された不良の種類" },
      { name: "is_defective", type: "boolean", displayName: "不良品", description: "不良品かどうか" },
    ],
    rows: [
      { inspection_id: "INS001", product_line: "ラインA", temperature: 42.5, defect_type: "なし", is_defective: false },
      { inspection_id: "INS002", product_line: "ラインB", temperature: 68.2, defect_type: "外観不良", is_defective: true },
      { inspection_id: "INS003", product_line: "ラインA", temperature: 45.0, defect_type: "なし", is_defective: false },
      { inspection_id: "INS004", product_line: "ラインC", temperature: 75.8, defect_type: "寸法不良", is_defective: true },
      { inspection_id: "INS005", product_line: "ラインB", temperature: 50.1, defect_type: "なし", is_defective: false },
    ],
    primaryKey: ["inspection_id"],
    foreignKeys: [],
  },
];

export const DS0007_USE_CASES: DatasetUseCase[] = [
  {
    title: "不良品発生予測",
    description: "センサーデータのパターンから不良品発生を事前に予測し、製造ラインの即時停止・調整判断に活用する。",
    relatedGraphId: "graph-1",
  },
  {
    title: "工程パラメータ最適化",
    description: "温度・圧力等の製造パラメータと品質の関係を分析し、不良率を最小化する最適条件を導出する。",
    relatedGraphId: "graph-2",
  },
];

export const DS0007_GRAPHS: DatasetGraph[] = [
  {
    id: "graph-1",
    title: "製品ライン別 不良率",
    type: "bar",
    labels: ["ラインA", "ラインB", "ラインC", "ラインD", "ラインE"],
    datasets: [
      {
        label: "不良率(%)",
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
    title: "温度帯別 不良品発生数",
    type: "line",
    labels: ["20-30℃", "30-40℃", "40-50℃", "50-60℃", "60-70℃", "70-80℃"],
    datasets: [
      {
        label: "不良品数",
        data: [50, 80, 120, 200, 350, 500],
        borderColor: "rgba(239, 68, 68, 1)",
        backgroundColor: "rgba(239, 68, 68, 0.2)",
        tension: 0.3,
      },
    ],
  },
];

// ============================================================
// DS0008: 顧客サポートチケットデータ
// ============================================================

export const DS0008_SAMPLE_TABLES: SampleTable[] = [
  {
    tableName: "support_tickets",
    description: "カスタマーサポートの問い合わせチケットを管理するテーブル",
    columns: [
      { name: "ticket_id", type: "string", displayName: "チケットID", description: "チケットを一意に識別するID" },
      { name: "customer_id", type: "string", displayName: "顧客ID", description: "問い合わせ顧客のID" },
      { name: "category", type: "string", displayName: "カテゴリ", description: "問い合わせのカテゴリ" },
      { name: "priority", type: "string", displayName: "優先度", description: "チケットの優先度" },
      { name: "resolution_hours", type: "number", displayName: "解決時間(h)", description: "解決までの所要時間" },
      { name: "satisfaction_score", type: "integer", displayName: "満足度", description: "顧客満足度スコア(1-5)" },
    ],
    rows: [
      { ticket_id: "TK001", customer_id: "C101", category: "技術サポート", priority: "高", resolution_hours: 2.5, satisfaction_score: 4 },
      { ticket_id: "TK002", customer_id: "C102", category: "請求", priority: "中", resolution_hours: 8.0, satisfaction_score: 3 },
      { ticket_id: "TK003", customer_id: "C103", category: "機能要望", priority: "低", resolution_hours: 48.0, satisfaction_score: 5 },
      { ticket_id: "TK004", customer_id: "C101", category: "障害報告", priority: "緊急", resolution_hours: 1.0, satisfaction_score: 4 },
      { ticket_id: "TK005", customer_id: "C104", category: "使い方", priority: "中", resolution_hours: 4.5, satisfaction_score: 2 },
    ],
    primaryKey: ["ticket_id"],
    foreignKeys: [],
  },
];

export const DS0008_USE_CASES: DatasetUseCase[] = [
  {
    title: "チケット自動分類・ルーティング",
    description: "NLPによるチケット内容の自動分類と、適切な担当者への自動振り分けにより、初回対応時間の短縮を実現する。",
    relatedGraphId: "graph-1",
  },
  {
    title: "顧客満足度予測",
    description: "チケットの属性（カテゴリ・優先度・対応時間）から満足度を予測し、低満足度リスクのチケットを優先対応する。",
    relatedGraphId: "graph-2",
  },
  {
    title: "サポート品質のトレンド分析",
    description: "月次の解決時間・満足度の推移を分析し、サポート品質の改善施策の効果を定量的に評価する。",
    relatedGraphId: null,
  },
];

export const DS0008_GRAPHS: DatasetGraph[] = [
  {
    id: "graph-1",
    title: "カテゴリ別 チケット件数",
    type: "doughnut",
    labels: ["技術サポート", "請求", "機能要望", "障害報告", "使い方", "アカウント", "その他"],
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
// DS0009: 社内コミュニケーション分析データ
// ============================================================

export const DS0009_SAMPLE_TABLES: SampleTable[] = [
  {
    tableName: "communication_meta",
    description: "社内コミュニケーションの匿名化メタデータを記録するテーブル",
    columns: [
      { name: "interaction_id", type: "string", displayName: "インタラクションID", description: "やりとりを識別するID" },
      { name: "from_dept", type: "string", displayName: "発信元部署", description: "メッセージの発信元部署" },
      { name: "to_dept", type: "string", displayName: "送信先部署", description: "メッセージの送信先部署" },
      { name: "channel_type", type: "string", displayName: "チャネル", description: "コミュニケーション手段" },
      { name: "message_count", type: "integer", displayName: "メッセージ数", description: "やりとりのメッセージ数" },
    ],
    rows: [
      { interaction_id: "INT001", from_dept: "開発部", to_dept: "企画部", channel_type: "チャット", message_count: 25 },
      { interaction_id: "INT002", from_dept: "営業部", to_dept: "マーケティング部", channel_type: "メール", message_count: 8 },
      { interaction_id: "INT003", from_dept: "人事部", to_dept: "全社", channel_type: "会議", message_count: 1 },
      { interaction_id: "INT004", from_dept: "開発部", to_dept: "開発部", channel_type: "チャット", message_count: 150 },
      { interaction_id: "INT005", from_dept: "経営企画部", to_dept: "営業部", channel_type: "メール", message_count: 12 },
    ],
    primaryKey: ["interaction_id"],
    foreignKeys: [],
  },
];

export const DS0009_USE_CASES: DatasetUseCase[] = [
  {
    title: "組織ネットワーク可視化",
    description: "部門間のコミュニケーション量をネットワークグラフとして可視化し、組織のサイロ化やボトルネックを発見する。",
    relatedGraphId: "graph-1",
  },
  {
    title: "エンゲージメント分析",
    description: "チャネル別のコミュニケーション量と従業員エンゲージメントの相関を分析し、組織活性化施策に活用する。",
    relatedGraphId: "graph-2",
  },
];

export const DS0009_GRAPHS: DatasetGraph[] = [
  {
    id: "graph-1",
    title: "部署別 コミュニケーション量",
    type: "bar",
    labels: ["開発部", "営業部", "企画部", "人事部", "マーケティング部", "経営企画部"],
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
// DS0010: 経費・予算管理データ
// ============================================================

export const DS0010_SAMPLE_TABLES: SampleTable[] = [
  {
    tableName: "expense_records",
    description: "経費申請明細を管理するテーブル。従業員ごとの経費申請内容・金額・承認状況を記録する",
    columns: [
      { name: "expense_id", type: "string", displayName: "経費ID", description: "経費申請を一意に識別するID" },
      { name: "applicant_id", type: "string", displayName: "従業員ID", description: "申請者の従業員ID" },
      { name: "department", type: "string", displayName: "部署", description: "申請者の所属部署" },
      { name: "expense_category", type: "string", displayName: "費目", description: "経費の大分類" },
      { name: "expense_detail", type: "string", displayName: "費目詳細", description: "経費の詳細内容" },
      { name: "amount", type: "integer", displayName: "金額(円)", description: "申請金額" },
      { name: "application_date", type: "date", displayName: "申請日", description: "経費申請の提出日" },
      { name: "approver_id", type: "string", displayName: "承認者ID", description: "承認権限者の従業員ID" },
      { name: "receipt_attached", type: "boolean", displayName: "領収書添付", description: "領収書が添付されているか" },
      { name: "approval_status", type: "string", displayName: "承認状況", description: "経費申請の承認ステータス" },
      { name: "budget_code", type: "string", displayName: "予算コード", description: "紐づく予算のコード" },
      { name: "note", type: "string", displayName: "備考", description: "申請に関する備考・補足情報" },
    ],
    rows: [
      { expense_id: "EXP001", applicant_id: "E0234", department: "営業部", expense_category: "交通費", expense_detail: "東京-大阪 新幹線往復", amount: 15000, application_date: "2025-01-10", approver_id: "E0050", receipt_attached: true, approval_status: "承認済", budget_code: "BG-SALES-01", note: null },
      { expense_id: "EXP002", applicant_id: "E0112", department: "開発部", expense_category: "備品購入", expense_detail: "外部モニター 27インチ", amount: 45000, application_date: "2025-01-15", approver_id: "E0030", receipt_attached: true, approval_status: "承認済", budget_code: "BG-DEV-01", note: "在宅勤務環境整備" },
      { expense_id: "EXP003", applicant_id: "E0301", department: "営業部", expense_category: "交際費", expense_detail: "顧客接待 会食費", amount: 385000, application_date: "2025-01-22", approver_id: "E0050", receipt_attached: true, approval_status: "審査中", budget_code: "BG-SALES-02", note: "A社幹部との会食" },
      { expense_id: "EXP004", applicant_id: "E0078", department: "人事部", expense_category: "研修費", expense_detail: "外部研修 リーダーシップ講座", amount: 120000, application_date: "2025-01-28", approver_id: "E0015", receipt_attached: true, approval_status: "承認済", budget_code: "BG-HR-01", note: null },
      { expense_id: "EXP005", applicant_id: "E0189", department: "マーケティング部", expense_category: "広告費", expense_detail: "Web広告 年間契約", amount: 1850000, application_date: "2025-02-01", approver_id: "E0040", receipt_attached: false, approval_status: "差戻し", budget_code: "BG-MKT-01", note: "領収書未着のため仮申請" },
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
      { budget_code: "BG-SALES-01", department: "営業部", fiscal_year: "2024", category: "交通費", budget_amount: 5000000, spent_amount: 3900000, remaining: 1100000 },
      { budget_code: "BG-SALES-02", department: "営業部", fiscal_year: "2024", category: "交際費", budget_amount: 3000000, spent_amount: 2730000, remaining: 270000 },
      { budget_code: "BG-DEV-01", department: "開発部", fiscal_year: "2024", category: "備品購入", budget_amount: 8000000, spent_amount: 5200000, remaining: 2800000 },
      { budget_code: "BG-HR-01", department: "人事部", fiscal_year: "2024", category: "研修費", budget_amount: 6000000, spent_amount: 4920000, remaining: 1080000 },
      { budget_code: "BG-MKT-01", department: "マーケティング部", fiscal_year: "2024", category: "広告費", budget_amount: 20000000, spent_amount: 18200000, remaining: 1800000 },
    ],
    primaryKey: ["budget_code"],
    foreignKeys: [],
  },
];

export const DS0010_USE_CASES: DatasetUseCase[] = [
  {
    title: "経費異常検知（Isolation Forest + ルールベース）",
    description: "Isolation Forestによる教師なし学習と、経理部門のドメイン知識に基づくルールベース判定を組み合わせたハイブリッド手法で、高額異常・頻度異常・パターン異常を包括的に検出する。異常スコアの段階的スクリーニングにより、経理部門の確認負荷を最小化しつつ高精度な不正検知を実現する。",
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
    description: "申請から承認までのリードタイム、差戻し率、承認者別の処理件数を分析し、経費申請ワークフローのボトルネックを特定する。承認権限の最適化と申請ルールの簡素化により、従業員・経理双方の業務効率向上を実現する。",
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
    labels: ["営業部", "開発部", "人事部", "マーケティング部", "経営企画部", "製造部"],
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
  DS0001: { sampleTables: DS0001_SAMPLE_TABLES, useCases: DS0001_USE_CASES, graphs: DS0001_GRAPHS },
  DS0002: { sampleTables: DS0002_SAMPLE_TABLES, useCases: DS0002_USE_CASES, graphs: DS0002_GRAPHS },
  DS0003: { sampleTables: DS0003_SAMPLE_TABLES, useCases: DS0003_USE_CASES, graphs: DS0003_GRAPHS },
  DS0004: { sampleTables: DS0004_SAMPLE_TABLES, useCases: DS0004_USE_CASES, graphs: DS0004_GRAPHS },
  DS0005: { sampleTables: DS0005_SAMPLE_TABLES, useCases: DS0005_USE_CASES, graphs: DS0005_GRAPHS },
  DS0006: { sampleTables: DS0006_SAMPLE_TABLES, useCases: DS0006_USE_CASES, graphs: DS0006_GRAPHS },
  DS0007: { sampleTables: DS0007_SAMPLE_TABLES, useCases: DS0007_USE_CASES, graphs: DS0007_GRAPHS },
  DS0008: { sampleTables: DS0008_SAMPLE_TABLES, useCases: DS0008_USE_CASES, graphs: DS0008_GRAPHS },
  DS0009: { sampleTables: DS0009_SAMPLE_TABLES, useCases: DS0009_USE_CASES, graphs: DS0009_GRAPHS },
  DS0010: { sampleTables: DS0010_SAMPLE_TABLES, useCases: DS0010_USE_CASES, graphs: DS0010_GRAPHS },
};
