import type { PaginatedResult } from '../../types/pagination.types';

interface PaginationProps {
  pagination: Omit<PaginatedResult<unknown>, 'items'>;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

const Pagination = ({ pagination, onPageChange }: PaginationProps) => {
  const { hasNextPage, hasPreviousPage } = pagination || {};

  const safePageNumber = Number(pagination?.pageNumber) || 1;
  const safePageSize = Number(pagination?.pageSize) || 10;
  const safeTotalCount = Number(pagination?.totalCount) || 0;
  const safeTotalPages = Number(pagination?.totalPages) || 0;

  if (safeTotalPages === 0 || safeTotalCount === 0) return null;

  const from = safeTotalCount > 0 ? (safePageNumber - 1) * safePageSize + 1 : 0;
  const to = Math.min(safePageNumber * safePageSize, safeTotalCount);

  const getPageNumbers = (): (number | '...')[] => {
    const pages: (number | '...')[] = [];
    if (safeTotalPages <= 5) {
      for (let i = 1; i <= safeTotalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePageNumber > 3) pages.push('...');
      for (let i = Math.max(2, safePageNumber - 1); i <= Math.min(safeTotalPages - 1, safePageNumber + 1); i++) {
        pages.push(i);
      }
      if (safePageNumber < safeTotalPages - 2) pages.push('...');
      pages.push(safeTotalPages);
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
          Showing {from} to {to} of {safeTotalCount} entries
        </span>

      </div>

      <div className="d-flex align-items-center gap-1">
        <button
          className={btnClass}
          style={btnStyle}
          onClick={() => onPageChange(safePageNumber - 1)}
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
              className={page === safePageNumber ? "btn btn-dark btn-sm d-inline-flex align-items-center justify-content-center rounded-2 fw-semibold" : btnClass}
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
          onClick={() => onPageChange(safePageNumber + 1)}
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