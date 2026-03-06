import { ReactNode } from "react";

interface Column<T> {
  header: string;
  accessor: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({ columns, data, emptyMessage = "データがありません", onRowClick }: DataTableProps<T>) {
  if (data.length === 0) {
    return <p className="text-gray-500 text-center py-8">{emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${col.className ?? ""}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, i) => (
            <tr
              key={i}
              className={onRowClick ? "hover:bg-gray-50 cursor-pointer" : ""}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col, j) => (
                <td key={j} className={`px-4 py-3 text-sm text-gray-900 ${col.className ?? ""}`}>
                  {col.accessor(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
