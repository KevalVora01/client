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

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS: SelectOption[] = [
  { value: '', label: 'All years' },
  ...Array.from({ length: 5 }, (_, i) => {
    const yr = currentYear - i;
    return { value: String(yr), label: String(yr) };
  }),
];

interface InvoiceFiltersProps {
  filters: InvoiceListParams;
  onFilterChange: (updated: Partial<InvoiceListParams>) => void;
  isAdmin?: boolean;
  apartmentView?: boolean;
  placeholder?: string;
}

const InvoiceFilters = ({ filters, onFilterChange, isAdmin = true, apartmentView = false, placeholder }: InvoiceFiltersProps) => {
  const [search, setSearch] = useState(filters.search ?? '');

  const computedPlaceholder = placeholder ?? (
    isAdmin
      ? 'Search by unit or resident name...'
      : apartmentView
        ? 'Search by tenant name...'
        : 'Search invoices...'
  );

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
    onFilterChange({ search: undefined, status: undefined, month: undefined, year: undefined, pageNumber: 1 });
  };

  const hasActiveFilters = !!filters.search || !!filters.status || !!filters.month || !!filters.year;
  const showSearchInput = isAdmin || apartmentView;

  return (
    <div className="d-flex flex-md-row flex-column align-items-stretch align-items-md-center gap-2 w-100">

      {/* Search Input Box (Admin & Owner Tenant view only) */}
      {showSearchInput && (
        <div className="flex-grow-1" style={{ maxWidth: '400px' }}>
          <div
            className="d-flex align-items-center bg-white border rounded-2 px-3 text-secondary search-wrapper"
            style={{ height: '46px', transition: 'border-color 0.15s, box-shadow 0.15s' }}
          >
            <i className="bi bi-search me-2 fs-6 text-muted" style={{ flexShrink: 0 }} />
            <input
              type="text"
              className="w-100 border-0 p-0 shadow-none bg-transparent text-dark"
              placeholder={computedPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ fontSize: '0.875rem', outline: 'none' }}
            />
            {search && (
              <button
                type="button"
                className="btn btn-link p-0 text-secondary border-0 ms-2"
                onClick={() => {
                  setSearch('');
                  onFilterChange({ search: undefined, pageNumber: 1 });
                }}
                style={{ textDecoration: 'none' }}
              >
                <i className="bi bi-x-circle-fill text-muted" style={{ fontSize: '0.9rem' }} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Month Filter */}
      <div style={{ minWidth: '140px' }}>
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
          className="fw-medium text-secondary"
          style={{ height: '46px' }}
        />
      </div>

      {/* Year Filter */}
      <div style={{ minWidth: '130px' }}>
        <Select
          name="year"
          options={YEAR_OPTIONS}
          placeholder="All years"
          value={filters.year ? String(filters.year) : ''}
          onChange={(e) =>
            onFilterChange({
              year: e.target.value ? Number(e.target.value) : undefined,
              pageNumber: 1,
            })
          }
          className="fw-medium text-secondary"
          style={{ height: '46px' }}
        />
      </div>

      {/* Status Filter */}
      <div style={{ minWidth: '140px' }}>
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
          className="fw-medium text-secondary"
          style={{ height: '46px' }}
        />
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="col-auto">
          <button
            className="btn btn-outline-secondary border-light-subtle d-flex align-items-center justify-content-center px-3 w-100"
            onClick={handleReset}
            style={{ height: '46px', fontSize: '0.875rem', borderRadius: '8px' }}
          >
            <i className="bi bi-x-circle me-2" />
            Clear
          </button>
        </div>
      )}

    </div>
  );
};

export default InvoiceFilters;