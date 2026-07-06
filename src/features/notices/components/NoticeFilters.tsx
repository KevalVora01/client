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
  return (
    <div className="d-flex align-items-center gap-2 flex-wrap">

      {/* Search */}
      <input
        type="text"
        className="form-control form-control-sm shadow-none border-light-subtle"
        placeholder="Search notices..."
        defaultValue={filters.search ?? ''}
        onChange={(e) => onFilterChange({ search: e.target.value || undefined, pageNumber: 1 })}
        style={{ maxWidth: '220px', borderRadius: '8px', fontSize: '0.875rem' }}
      />

      {/* Category */}
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
        style={{ maxWidth: '160px' }}
        className="shadow-none"
      />

      {/* Pinned */}
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
        style={{ maxWidth: '150px' }}
        className="shadow-none"
      />

    </div>
  );
};

export default NoticeFilters;