import { useState, useEffect } from 'react';
import Select from '../../../components/Select/Select';
import type { SelectOption } from '../../../components/Select/Select';
import type { NoticeCategory, NoticeListParams } from '../types/notice.types';

const CATEGORY_OPTIONS: SelectOption[] = [
  { value: '', label: 'All categories' },
  { value: 'General', label: 'General' },
  { value: 'Maintenance', label: 'Maintenance' },
  { value: 'Emergency', label: 'Emergency' },
  { value: 'Event', label: 'Event' },
];

const PINNED_OPTIONS: SelectOption[] = [
  { value: '', label: 'All notices' },
  { value: 'true', label: 'Pinned only' },
  { value: 'false', label: 'Unpinned only' },
];

interface NoticeFiltersProps {
  filters: NoticeListParams;
  onFilterChange: (updated: Partial<NoticeListParams>) => void;
}

const NoticeFilters = ({ filters, onFilterChange }: NoticeFiltersProps) => {
  const [search, setSearch] = useState(filters.search ?? '');

  useEffect(() => {
    if (search === (filters.search ?? '')) return;
    const timer = setTimeout(() => {
      onFilterChange({ search: search || undefined, pageNumber: 1 });
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleReset = () => {
    setSearch('');
    onFilterChange({ search: undefined, category: undefined, isPinned: undefined });
  };

  const hasActiveFilters = !!filters.search || !!filters.category || filters.isPinned !== undefined;

  return (
    <div className="d-flex align-items-center gap-2 flex-wrap">

      {/* Search */}
      <input
        type="text"
        className="form-control shadow-none border-light-subtle"
        placeholder="Search notices..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ minWidth: '160px', maxWidth: '200px', borderRadius: '8px', fontSize: '0.875rem', height: '38px' }}
      />

      {/* Category */}
      <div style={{ width: '130px' }}>
        <Select
          name="category"
          options={CATEGORY_OPTIONS}
          placeholder="All categories"
          value={filters.category ?? ''}
          onChange={(e) =>
            onFilterChange({
              category: (e.target.value as NoticeCategory) || undefined,
              pageNumber: 1,
            })
          }
          className="shadow-none"
          style={{ height: '38px' }}
        />
      </div>

      {/* Pinned */}
      <div style={{ width: '130px' }}>
        <Select
          name="isPinned"
          options={PINNED_OPTIONS}
          placeholder="All notices"
          value={filters.isPinned === undefined ? '' : String(filters.isPinned)}
          onChange={(e) =>
            onFilterChange({
              isPinned: e.target.value === '' ? undefined : e.target.value === 'true',
              pageNumber: 1,
            })
          }
          className="shadow-none"
          style={{ height: '38px' }}
        />
      </div>

      {/* Clear filters */}
      {hasActiveFilters && (
        <button
          className="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-1 px-3 fw-medium"
          onClick={handleReset}
          style={{ height: '38px', fontSize: '0.85rem', borderRadius: '8px' }}
        >
          <i className="bi bi-x-circle" />
          Clear
        </button>
      )}

    </div>
  );
};

export default NoticeFilters;