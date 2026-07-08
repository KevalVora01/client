import React from 'react';

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
  expandedRowKey?: string | number | null;
  renderExpandedRow?: (row: T) => React.ReactNode;
  emptyTitle?: string;
  emptySubtitle?: string;
  emptyIcon?: string;
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
  expandedRowKey,
  renderExpandedRow,
  emptyTitle = "No data found",
  emptySubtitle = "Try adjusting your filters.",
  emptyIcon = "bi-inbox",
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
        <div
          className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
          style={{ width: '64px', height: '64px', backgroundColor: '#f3f4f6' }}
        >
          <i className={`${emptyIcon}`} style={{ fontSize: '1.6rem', color: '#9ca3af' }} />
        </div>
        <p className="fw-semibold mb-1" style={{ fontSize: '0.95rem', color: '#4b5563' }}>{emptyTitle}</p>
        <p className="text-secondary small" style={{ fontSize: '0.8rem', maxWidth: '320px', margin: '0 auto' }}>{emptySubtitle}</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table align-middle mb-0">
        {thead}
        <tbody>
          {data.map((row) => {
            const key = rowKey(row);
            return (
              <React.Fragment key={key}>
                <tr>
                  {columns.map((col) => (
                    <td key={col.key} className="py-3 px-3">
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
                {expandedRowKey === key && renderExpandedRow && (
                  <tr className="expand-row">
                    <td colSpan={columns.length} className="p-0" style={{ background: '#f8f9fb' }}>
                      {renderExpandedRow(row)}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AppTable;