import type { Amenity, BookingListFilters, BookingStatus } from '../types/amenity.types';

interface BookingFiltersProps {
  amenities: Amenity[];
  filters: BookingListFilters;
  onChange: (filters: BookingListFilters) => void;
}

const STATUSES: BookingStatus[] = ['Pending', 'Confirmed', 'Rejected', 'Cancelled'];

const BookingFilters = ({ amenities, filters, onChange }: BookingFiltersProps) => {
  const update = (patch: Partial<BookingListFilters>) => onChange({ ...filters, ...patch });

  return (
    <div className="row g-2 align-items-end">
      <div className="col-12 col-md-3">
        <label className="form-label fw-medium text-secondary small mb-1">Amenity</label>
        <select
          className="form-select shadow-none border-light-subtle"
          style={{ fontSize: '0.875rem', height: '40px' }}
          value={filters.amenityId ?? ''}
          onChange={(e) => update({ amenityId: e.target.value ? Number(e.target.value) : undefined })}
        >
          <option value="">All</option>
          {amenities.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </div>
      <div className="col-12 col-md-3">
        <label className="form-label fw-medium text-secondary small mb-1">Date</label>
        <input
          type="date"
          className="form-control shadow-none border-light-subtle"
          style={{ fontSize: '0.875rem', height: '40px' }}
          value={filters.date ?? ''}
          onChange={(e) => update({ date: e.target.value || undefined })}
        />
      </div>
      <div className="col-12 col-md-3">
        <label className="form-label fw-medium text-secondary small mb-1">Status</label>
        <select
          className="form-select shadow-none border-light-subtle"
          style={{ fontSize: '0.875rem', height: '40px' }}
          value={filters.status ?? ''}
          onChange={(e) => update({ status: (e.target.value || undefined) as BookingStatus | undefined })}
        >
          <option value="">All</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="col-12 col-md-3">
        <label className="form-label fw-medium text-secondary small mb-1">Resident ID</label>
        <input
          type="number"
          className="form-control shadow-none border-light-subtle"
          style={{ fontSize: '0.875rem', height: '40px' }}
          value={filters.residentId ?? ''}
          onChange={(e) => update({ residentId: e.target.value ? Number(e.target.value) : undefined })}
        />
      </div>
    </div>
  );
};

export default BookingFilters;
