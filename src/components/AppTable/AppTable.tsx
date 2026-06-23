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
      <div className="app-table__wrapper">
        <table className="app-table">
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
      <div className="app-table__empty">
        <i className="bi bi-inbox app-table__empty-icon" aria-hidden="true" />
        <p className="app-table__empty-title">{emptyTitle}</p>
        <p className="app-table__empty-sub">{emptySubtitle}</p>
      </div>
    );
  }

  return (
    <div className="app-table__wrapper">
      <table className="app-table">
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