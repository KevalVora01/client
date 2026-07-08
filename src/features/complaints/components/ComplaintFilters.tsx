import { useState, useEffect } from 'react';
import Select from '../../../components/Select/Select';
import type { SelectOption } from '../../../components/Select/Select';
import type { ComplaintPriority, ComplaintStatus, ComplaintListParams } from '../types/complaint.types';

const STATUS_OPTIONS: SelectOption[] = [
  { value: '', label: 'All statuses' },
  { value: 'Open', label: 'Open' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Resolved', label: 'Resolved' },
];

const PRIORITY_OPTIONS: SelectOption[] = [
  { value: '', label: 'All priorities' },
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
];

interface ComplaintFiltersProps {
  filters: ComplaintListParams;
  onFilterChange: (updated: Partial<ComplaintListParams>) => void;
}

const ComplaintFilters = ({ filters, onFilterChange }: ComplaintFiltersProps) => {
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
    onFilterChange({ search: undefined, status: undefined, priority: undefined });
  };

  const hasActiveFilters = !!filters.search || !!filters.status || !!filters.priority;

  return (
    <div className="d-flex align-items-center gap-2 flex-nowrap">

      {/* Search */}
      <input
        type="text"
        className="form-control form-control-sm shadow-none border-light-subtle"
        placeholder="Search complaints..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ maxWidth: '220px', borderRadius: '8px', fontSize: '0.875rem' }}
      />

      {/* Status */}
      <Select
        name="status"
        options={STATUS_OPTIONS}
        placeholder="All statuses"
        value={filters.status ?? ''}
        onChange={(e) =>
          onFilterChange({
            status: (e.target.value as ComplaintStatus) || undefined,
            pageNumber: 1,
          })
        }
        style={{ maxWidth: '160px' }}
        className="shadow-none"
      />

      {/* Priority */}
      <Select
        name="priority"
        options={PRIORITY_OPTIONS}
        placeholder="All priorities"
        value={filters.priority ?? ''}
        onChange={(e) =>
          onFilterChange({
            priority: (e.target.value as ComplaintPriority) || undefined,
            pageNumber: 1,
          })
        }
        style={{ maxWidth: '150px' }}
        className="shadow-none"
      />

      {/* Clear filters */}
      {hasActiveFilters && (
        <button
          className="btn d-flex align-items-center justify-content-center gap-1 px-3 fw-medium"
          onClick={handleReset}
          style={{ height: '40px', fontSize: '0.85rem', borderRadius: '8px', border: '1px solid #d1d5db', color: '#6b7280', backgroundColor: '#fff' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f3f4f6'; e.currentTarget.style.borderColor = '#9ca3af'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.borderColor = '#d1d5db'; }}
        >
          <i className="bi bi-x-circle" />
          Clear
        </button>
      )}

    </div>
  );
};

export default ComplaintFilters;