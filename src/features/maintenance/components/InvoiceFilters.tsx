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
  const handleReset = () => {
    onFilterChange({ status: undefined, month: undefined, year: undefined });
  };

  const hasActiveFilters = !!filters.status || !!filters.month || !!filters.year;

  return (
    <div className="d-flex align-items-center gap-2 flex-wrap">

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
        style={{ maxWidth: '160px' }}
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
        style={{ maxWidth: '160px' }}
        className="shadow-none"
      />

      <input
        type="number"
        className="form-control form-control-sm shadow-none border-light-subtle"
        placeholder="Year"
        value={filters.year ?? ''}
        onChange={(e) =>
          onFilterChange({
            year: e.target.value ? Number(e.target.value) : undefined,
            pageNumber: 1,
          })
        }
        style={{ maxWidth: '110px', borderRadius: '8px', fontSize: '0.875rem' }}
      />

      {hasActiveFilters && (
        <button
          className="btn d-flex align-items-center justify-content-center gap-1 px-3 fw-medium"
          onClick={handleReset}
          style={{ height: '40px', fontSize: '0.85rem', borderRadius: '8px', border: '1px solid #d1d5db', color: '#6b7280', backgroundColor: '#fff' }}
        >
          <i className="bi bi-x-circle" />
          Clear
        </button>
      )}

    </div>
  );
};

export default InvoiceFilters;