import './Pagination.css';
import type { PaginatedResult } from '../../types/pagination.types';

interface PaginationProps {
  pagination: Omit<PaginatedResult<unknown>, 'items'>;
  onPageChange: (page: number) => void;
}

const Pagination = ({ pagination, onPageChange }: PaginationProps) => {
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

  return (
    <div className="pagination-bar">
      <span className="pagination-bar__info">
        Showing {from} to {to} of {totalCount} entries
      </span>

      <div className="pagination-bar__controls">
        <button
          className="pagination-bar__btn"
          onClick={() => onPageChange(pageNumber - 1)}
          disabled={!hasPreviousPage}
          aria-label="Previous page"
        >
          ‹
        </button>

        {getPageNumbers().map((page, index) =>
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="pagination-bar__ellipsis">
              ...
            </span>
          ) : (
            <button
              key={page}
              className={`pagination-bar__btn ${page === pageNumber ? 'pagination-bar__btn--active' : ''}`}
              onClick={() => onPageChange(page as number)}
            >
              {page}
            </button>
          )
        )}

        <button
          className="pagination-bar__btn"
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