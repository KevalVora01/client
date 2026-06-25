import './AppTable.css';

export interface TableColumn<T> {
  key: string;
  label: string;
  width?: string;
  render: (row: T) => React.ReactNode;
}

interface AppTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  rowKey: (row: T) => string | number;
  emptyTitle?: string;
  emptySubtitle?: string;
  skeletonRows?: number;
}

const SkeletonRow = ({ columns }: { columns: number }) => (
  <tr>
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i}>
        <div className="app-table__skeleton" style={{ width: i === 0 ? 200 : 100, height: 13 }} />
      </td>
    ))}
  </tr>
);

const AppTable = <T,>({
  columns,
  data,
  loading = false,
  rowKey,
  emptyTitle = "No data found",
  emptySubtitle = "Try adjusting your filters.",
  skeletonRows = 5,
}: AppTableProps<T>) => {

  const thead = (
    <thead>
      <tr>
        {columns.map((col) => (
          <th key={col.key} style={col.width ? { width: col.width } : {}}>
            {col.label}
          </th>
        ))}
      </tr>
    </thead>
  );

  if (loading) {
    return (
      <div className="table-responsive">
        <table className="table mb-0 app-table">
          {thead}
          <tbody>
            {Array.from({ length: skeletonRows }).map((_, i) => (
              <SkeletonRow key={i} columns={columns.length} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-inbox d-block mb-2 app-table__empty-icon" aria-hidden="true" />
        <p className="fw-semibold text-secondary mb-1" style={{ fontSize: '0.9rem' }}>{emptyTitle}</p>
        <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>{emptySubtitle}</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table mb-0 app-table">
        {thead}
        <tbody>
          {data.map((row) => (
            <tr key={rowKey(row)}>
              {columns.map((col) => (
                <td key={col.key}>{col.render(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppTable;