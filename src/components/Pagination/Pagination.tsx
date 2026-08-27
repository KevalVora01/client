import type { PaginatedResult } from '../../types/pagination.types';
import Select from '../Select/Select';

interface PaginationProps {
  pagination: Omit<PaginatedResult<unknown>, 'items'>;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

const Pagination = ({
  pagination,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
}: PaginationProps) => {
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

  const baseBtn =
    "d-inline-flex align-items-center justify-content-center rounded-2 fw-medium";
  const btnStyle: React.CSSProperties = {
    minWidth: "36px",
    height: "36px",
    padding: "0 8px",
    fontSize: "0.875rem",
    border: "1px solid #dee2e6",
    transition: "all .15s ease-in-out",
  };
  const navBtnStyle: React.CSSProperties = {
    ...btnStyle,
    fontSize: "1.1rem",
    fontWeight: 700,
  };

  const navBtn = (disabled: boolean) =>
    `${baseBtn} ${disabled ? "text-secondary bg-light" : "text-dark bg-white"}`;
  const pageBtn = (active: boolean) =>
    `${baseBtn} ${active ? "text-white bg-dark" : "text-dark bg-white"}`;
  const disabledStyle: React.CSSProperties = { cursor: "not-allowed", opacity: 0.55 };

  return (
    <div
      className="d-flex align-items-center justify-content-between flex-wrap w-100"
      style={{ gap: "12px" }}
    >
      <span className="text-muted" style={{ fontSize: "0.875rem" }}>
        Showing <strong className="text-dark">{from}</strong>–
        <strong className="text-dark">{to}</strong> of{" "}
        <strong className="text-dark">{safeTotalCount}</strong>
      </span>

      {onPageSizeChange && (
        <label className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: "0.875rem" }}>
          Rows per page
          <Select
            name="pageSize"
            value={String(safePageSize)}
            options={pageSizeOptions.map(String)}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          />
        </label>
      )}

      <div className="d-flex align-items-center gap-1">
        <button
          className={navBtn(!hasPreviousPage)}
          style={{ ...navBtnStyle, ...(!hasPreviousPage ? disabledStyle : {}) }}
          onClick={() => onPageChange(1)}
          disabled={!hasPreviousPage}
          aria-label="First page"
          title="First page"
        >
          «
        </button>

        <button
          className={navBtn(!hasPreviousPage)}
          style={{ ...navBtnStyle, ...(!hasPreviousPage ? disabledStyle : {}) }}
          onClick={() => onPageChange(safePageNumber - 1)}
          disabled={!hasPreviousPage}
          aria-label="Previous page"
          title="Previous page"
        >
          ‹
        </button>

        {getPageNumbers().map((page, index) =>
          page === '...' ? (
            <span
              key={`ellipsis-${index}`}
              className="text-secondary px-1 d-inline-flex align-items-center"
              style={{ height: "36px", fontSize: "0.875rem" }}
            >
              …
            </span>
          ) : (
            <button
              key={page}
              className={pageBtn(page === safePageNumber)}
              style={btnStyle}
              onClick={() => onPageChange(page as number)}
            >
              {page}
            </button>
          )
        )}

        <button
          className={navBtn(!hasNextPage)}
          style={{ ...navBtnStyle, ...(!hasNextPage ? disabledStyle : {}) }}
          onClick={() => onPageChange(safePageNumber + 1)}
          disabled={!hasNextPage}
          aria-label="Next page"
          title="Next page"
        >
          ›
        </button>

        <button
          className={navBtn(!hasNextPage)}
          style={{ ...navBtnStyle, ...(!hasNextPage ? disabledStyle : {}) }}
          onClick={() => onPageChange(safeTotalPages)}
          disabled={!hasNextPage}
          aria-label="Last page"
          title="Last page"
        >
          »
        </button>
      </div>
    </div>
  );
};

export default Pagination;
