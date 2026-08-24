import Select from '../../../components/Select/Select';
import DatePicker from '../../../components/DatePicker/DatePicker';
import type { Amenity, BookingListFilters, BookingStatus } from '../types/amenity.types';

interface BookingFiltersProps {
  amenities: Amenity[];
  filters: BookingListFilters;
  onChange: (filters: BookingListFilters) => void;
}

const STATUSES: BookingStatus[] = ['Pending', 'Confirmed', 'Rejected', 'Cancelled'];

const BookingFilters = ({ amenities, filters, onChange }: BookingFiltersProps) => {
  const update = (patch: Partial<BookingListFilters>) => onChange({ ...filters, ...patch });

  const hasActiveFilters = !!filters.amenityId || !!filters.date || !!filters.status;

  const handleReset = () => {
    onChange({
      amenityId: undefined,
      date: undefined,
      status: undefined,
    });
  };

  const amenityOptions = [
    { value: '', label: 'All Amenities' },
    ...amenities.map((a) => ({ value: String(a.id), label: a.name })),
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    ...STATUSES.map((s) => ({ value: s, label: s })),
  ];

  return (
    <div className="row g-2 align-items-center">
      <div className={hasActiveFilters ? "col-12 col-md-4" : "col-12 col-md-4"}>
        <Select
          options={amenityOptions}
          placeholder="All Amenities"
          value={filters.amenityId ? String(filters.amenityId) : ''}
          onChange={(e) => update({ amenityId: e.target.value ? Number(e.target.value) : undefined })}
          className="fw-medium text-secondary"
          style={{ height: '40px' }}
        />
      </div>

      <div className={hasActiveFilters ? "col-12 col-md-3" : "col-12 col-md-4"}>
        <DatePicker
          placeholder="Filter by date"
          value={filters.date ?? ''}
          onChange={(e) => {
            const val = typeof e === 'string' ? e : e?.target?.value;
            update({ date: val || undefined });
          }}
          style={{ height: '40px' }}
        />
      </div>

      <div className={hasActiveFilters ? "col-12 col-md-3" : "col-12 col-md-4"}>
        <Select
          options={statusOptions}
          placeholder="All Statuses"
          value={filters.status ?? ''}
          onChange={(e) => update({ status: (e.target.value || undefined) as BookingStatus | undefined })}
          className="fw-medium text-secondary"
          style={{ height: '40px' }}
        />
      </div>

      {hasActiveFilters && (
        <div className="col-12 col-md-2">
          <button
            type="button"
            className="btn btn-outline-secondary border-light-subtle d-flex align-items-center justify-content-center w-100"
            onClick={handleReset}
            style={{ height: '40px', fontSize: '0.875rem', borderRadius: '8px' }}
          >
            <i className="bi bi-x-circle me-1" /> Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingFilters;
