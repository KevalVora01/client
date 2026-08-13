import React from 'react';

export interface TableColumn<T> {
  key: string;
  label: string;
  width?: string;
  align?: 'start' | 'center' | 'end';
  headerAlign?: 'start' | 'center' | 'end';
  headerPaddingLeft?: string;
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
  minWidth?: string;
  tableStyle?: React.CSSProperties;
}

const skeletonStyle: React.CSSProperties = {
  height: '16px',
  borderRadius: '6px',
  background: 'linear-gradient(90deg, #f3f4f6 25%, #e9ecef 50%, #f3f4f6 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.4s ease infinite',
};

const SkeletonRow = <T,>({ columns }: { columns: TableColumn<T>[] }) => (
  <tr>
    {columns.map((col, i) => {
      const alignmentClass = col.align === 'center' ? 'text-center' : col.align === 'end' ? 'text-end' : 'text-start';
      return (
        <td
          key={col.key}
          className={`py-3 px-3 align-middle ${alignmentClass}`}
          style={col.width ? { width: col.width } : {}}
        >
          <div
            style={{
              ...skeletonStyle,
              width: col.align === 'center' ? '50%' : i === 0 ? '70%' : '40%',
              display: col.align === 'center' ? 'inline-block' : 'block',
            }}
          />
        </td>
      );
    })}
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
  minWidth = "100%",
  tableStyle,
}: AppTableProps<T>) => {

  const thead = (
    <thead className="table-light border-bottom border-light-subtle">
      <tr>
        {columns.map((col) => {
          const alignmentClass = col.align === 'center' ? 'text-center' : col.align === 'end' ? 'text-end' : 'text-start';
          const headerAlignmentClass = col.headerAlign === 'center' ? 'text-center' : col.headerAlign === 'end' ? 'text-end' : col.headerAlign === 'start' ? 'text-start' : alignmentClass;
          return (
            <th
              key={col.key}
              className={`text-uppercase text-secondary fw-semibold ${headerAlignmentClass} text-nowrap`}
              style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem', paddingLeft: col.headerPaddingLeft ?? '1rem', paddingRight: '1rem', ...(col.width ? { width: col.width } : {}) }}
            >
              <span style={{ fontSize: '0.8rem', letterSpacing: '0.04em' }}>
                {col.label}
              </span>
            </th>
          );
        })}
      </tr>
    </thead>
  );

  if (loading) {
    return (
      <>
        <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
        <div className="table-responsive" style={{ overflowX: 'auto' }}>
          <table className="table align-middle mb-0" style={{ minWidth, ...tableStyle }}>
            {thead}
            <tbody>
              {Array.from({ length: skeletonRows }).map((_, i) => (
                <SkeletonRow key={i} columns={columns} />
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-5">
        <div
          className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
          style={{ width: '64px', height: '64px', backgroundColor: '#f3f4f6' }}
        >
          <i className={`bi ${emptyIcon}`} style={{ fontSize: '1.6rem', color: '#9ca3af' }} />
        </div>
        <p className="fw-semibold mb-1" style={{ fontSize: '0.95rem', color: '#4b5563' }}>{emptyTitle}</p>
        <p className="text-secondary small" style={{ fontSize: '0.8rem', maxWidth: '320px', margin: '0 auto' }}>{emptySubtitle}</p>
      </div>
    );
  }

  return (
    <div className="table-responsive" style={{ overflowX: 'auto' }}>
      <table className="table align-middle mb-0" style={{ minWidth, ...tableStyle }}>
        {thead}
        <tbody>
          {data.map((row) => {
            const key = rowKey(row);
            return (
              <React.Fragment key={key}>
                <tr>
                  {columns.map((col) => {
                    const alignmentClass = col.align === 'center' ? 'text-center' : col.align === 'end' ? 'text-end' : 'text-start';
                    return (
                      <td key={col.key} className={`py-3 px-3 ${alignmentClass}`}>
                        {col.render(row)}
                      </td>
                    );
                  })}
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