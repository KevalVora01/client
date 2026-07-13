import type { PaginatedResult } from '../../types/pagination.types';

interface PaginationProps {
  pagination: Omit<PaginatedResult<unknown>, 'items'>;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

const Pagination = ({ pagination, onPageChange, onPageSizeChange }: PaginationProps) => {
  const { pageNumber, totalPages, totalCount, pageSize, hasNextPage, hasPreviousPage } = pagination;

  if (totalPages == 0) return null;

  const from = (pageNumber - 1) * pageSize + 1;
  const to = Math.min(pageNumber * pageSize, totalCount);

  const getPageNumbers = (): (number | '...')[] => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (pageNumber > 3) pages.push('...');
      for (let i = Math.max(2, pageNumber - 1); i <= Math.min(totalPages - 1, pageNumber + 1); i++) {
        pages.push(i);
      }
      if (pageNumber < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const btnClass =
    "btn btn-outline-secondary border-light-subtle btn-sm d-inline-flex align-items-center justify-content-center rounded-2 fw-medium";
  const btnStyle: React.CSSProperties = { minWidth: "32px", height: "32px", padding: "0 8px" };

  return (
    <div className="d-flex align-items-center justify-content-between flex-wrap w-100" style={{ gap: "12px" }}>
      <div className="d-flex align-items-center gap-3 flex-wrap">
        <span className="small text-muted">
          Showing {from} to {to} of {totalCount} entries
        </span>
        {onPageSizeChange && (
          <div className="d-flex align-items-center gap-2">
            <span className="small text-muted" style={{ whiteSpace: "nowrap" }}>Show</span>
            <select
              className="form-select form-select-sm shadow-none"
              style={{
                width: "65px",
                height: "30px",
                borderRadius: "6px",
                fontSize: "0.8rem",
                padding: "2px 8px",
                borderColor: "#e5e7eb",
                cursor: "pointer"
              }}
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}
      </div>

      <div className="d-flex align-items-center gap-1">
        <button
          className={btnClass}
          style={btnStyle}
          onClick={() => onPageChange(pageNumber - 1)}
          disabled={!hasPreviousPage}
          aria-label="Previous page"
        >
          ‹
        </button>

        {getPageNumbers().map((page, index) =>
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="small text-secondary px-1">
              ...
            </span>
          ) : (
            <button
              key={page}
              className={page === pageNumber ? "btn btn-dark btn-sm d-inline-flex align-items-center justify-content-center rounded-2 fw-semibold" : btnClass}
              style={btnStyle}
              onClick={() => onPageChange(page as number)}
            >
              {page}
            </button>
          )
        )}

        <button
          className={btnClass}
          style={btnStyle}
          onClick={() => onPageChange(pageNumber + 1)}
          disabled={!hasNextPage}
          aria-label="Next page"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default Pagination;