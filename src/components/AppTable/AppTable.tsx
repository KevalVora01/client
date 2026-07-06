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
      <td key={i} className="py-3 px-3 align-middle">
        <div className="skeleton" style={{ height: '16px', width: i === 0 ? '60%' : '40%' }} />
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
    <thead className="table-light border-bottom border-light-subtle">
      <tr>
        {columns.map((col) => (
          <th
            key={col.key}
            className="text-uppercase text-secondary fw-semibold text-start py-2.5 px-3 text-nowrap"
            style={col.width ? { width: col.width } : {}}
          >
            <span style={{ fontSize: '0.8rem', letterSpacing: '0.04em' }}>
              {col.label}
            </span>
          </th>
        ))}
      </tr>
    </thead>
  );

  if (loading) {
    return (
      <div className="table-responsive">
        <table className="table align-middle mb-0">
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
        <i className="bi bi-inbox d-block mb-2 text-body-tertiary fs-2" aria-hidden="true" />
        <p className="fw-semibold text-secondary mb-1 small">{emptyTitle}</p>
        <p className="text-muted mb-0 extra-small">{emptySubtitle}</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table align-middle mb-0">
        {thead}
        <tbody>
          {data.map((row) => (
            <tr key={rowKey(row)}>
              {columns.map((col) => (
                <td key={col.key} className="py-3 px-3">
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppTable;