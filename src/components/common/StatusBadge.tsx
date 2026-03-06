const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  published: { label: "公開中", classes: "bg-green-100 text-green-800" },
  approved: { label: "承認済み", classes: "bg-green-100 text-green-800" },
  succeeded: { label: "成功", classes: "bg-green-100 text-green-800" },
  completed: { label: "完了", classes: "bg-green-100 text-green-800" },
  rejected: { label: "差戻し", classes: "bg-red-100 text-red-800" },
  failed: { label: "失敗", classes: "bg-red-100 text-red-800" },
  validation_failed: { label: "検証失敗", classes: "bg-red-100 text-red-800" },
  execution_failed: { label: "実行失敗", classes: "bg-red-100 text-red-800" },
  submitted: { label: "提出済み", classes: "bg-blue-100 text-blue-800" },
  under_review: { label: "審査中", classes: "bg-blue-100 text-blue-800" },
  open: { label: "オープン", classes: "bg-blue-100 text-blue-800" },
  in_progress: { label: "対応中", classes: "bg-yellow-100 text-yellow-800" },
  running: { label: "実行中", classes: "bg-yellow-100 text-yellow-800" },
  queued: { label: "待機中", classes: "bg-yellow-100 text-yellow-800" },
  draft: { label: "下書き", classes: "bg-gray-100 text-gray-800" },
  unpublished: { label: "非公開", classes: "bg-gray-100 text-gray-800" },
  closed: { label: "クローズ", classes: "bg-gray-100 text-gray-800" },
  executed_synthetic: { label: "合成データ実行済", classes: "bg-green-100 text-green-800" },
  executed_real: { label: "実データ実行済", classes: "bg-green-100 text-green-800" },
};

export function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] ?? { label: status, classes: "bg-gray-100 text-gray-800" };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${config.classes}`}>
      {config.label}
    </span>
  );
}

export function PublishBadge({ isPublished }: { isPublished: boolean }) {
  return <StatusBadge status={isPublished ? "published" : "unpublished"} />;
}
