import { Link } from "react-router-dom";
import { DATASETS } from "../../data/datasets";
import { loadState } from "../../store/session";
import { PublishBadge } from "../../components/common/StatusBadge";
import { DataTable } from "../../components/common/DataTable";
import { ActionButton } from "../../components/common/ActionButton";
import { useToast } from "../../components/common/Toast";
import { formatDate } from "../../utils/format";
import { isEffectivelyPublished } from "../../utils/data";

export function HrDatasetsPage() {
  const state = loadState();
  const { showToast } = useToast();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">データセット管理</h1>
        <ActionButton onClick={() => showToast("デモのため、実際の作成は行われません", "info")}>
          新規作成
        </ActionButton>
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable
          columns={[
            { header: "データセットID", accessor: (d) => d.dataset_id },
            { header: "名前", accessor: (d) => d.name },
            { header: "公開状態", accessor: (d) => <PublishBadge isPublished={isEffectivelyPublished(state, d)} /> },
            { header: "作成日", accessor: (d) => formatDate(d.created_at) },
            {
              header: "",
              accessor: (d) => (
                <Link to={`/hr/datasets/${d.dataset_id}`} className="text-blue-600 hover:underline text-sm">
                  詳細
                </Link>
              ),
            },
          ]}
          data={DATASETS}
        />
      </div>
    </div>
  );
}
