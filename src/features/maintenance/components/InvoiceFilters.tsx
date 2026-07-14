import { useState, useEffect } from 'react';
import Select from '../../../components/Select/Select';
import type { SelectOption } from '../../../components/Select/Select';
import type { InvoiceStatus, InvoiceListParams } from '../types/maintenance.types';

const STATUS_OPTIONS: SelectOption[] = [
  { value: '', label: 'All statuses' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Paid', label: 'Paid' },
  { value: 'Overdue', label: 'Overdue' },
];

const MONTH_OPTIONS: SelectOption[] = [
  { value: '', label: 'All months' },
  ...Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: new Date(2000, i).toLocaleString('en-IN', { month: 'long' }),
  })),
];

interface InvoiceFiltersProps {
  filters: InvoiceListParams;
  onFilterChange: (updated: Partial<InvoiceListParams>) => void;
}

const InvoiceFilters = ({ filters, onFilterChange }: InvoiceFiltersProps) => {
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
    onFilterChange({ search: undefined, status: undefined, month: undefined, year: undefined });
  };

  const hasActiveFilters = !!filters.search || !!filters.status || !!filters.month;

  return (
    <div className="d-flex align-items-center gap-2 flex-wrap w-100">

      <div style={{ minWidth: '220px', maxWidth: '300px' }}>
        <input
          type="text"
          className="form-control form-control-sm shadow-none border-light-subtle"
          placeholder="Search unit or resident..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', borderRadius: '8px', fontSize: '0.875rem', height: '38px' }}
        />
      </div>

      <Select
        name="status"
        options={STATUS_OPTIONS}
        placeholder="All statuses"
        value={filters.status ?? ''}
        onChange={(e) =>
          onFilterChange({
            status: (e.target.value as InvoiceStatus) || undefined,
            pageNumber: 1,
          })
        }
        style={{ maxWidth: '160px', height: '38px' }}
        className="shadow-none"
      />

      <Select
        name="month"
        options={MONTH_OPTIONS}
        placeholder="All months"
        value={filters.month ? String(filters.month) : ''}
        onChange={(e) =>
          onFilterChange({
            month: e.target.value ? Number(e.target.value) : undefined,
            pageNumber: 1,
          })
        }
        style={{ maxWidth: '160px', height: '38px' }}
        className="shadow-none"
      />

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

export default InvoiceFilters;