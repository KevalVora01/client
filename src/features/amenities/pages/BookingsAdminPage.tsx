import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollLock } from '../../../hooks/useScrollLock';
import { useAdminBookings } from '../hooks/useBookings';
import { useAmenities } from '../hooks/useAmenities';
import { useBookingMutations } from '../hooks/useBookingMutations';
import BookingRow from '../components/BookingRow';
import BookingFilters from '../components/BookingFilters';
import ReasonModal from '../components/ReasonModal';
import type { Booking, BookingListFilters } from '../types/amenity.types';

const BookingsAdminPage = () => {
  const { amenities } = useAmenities();
  const [filters, setFilters] = useState<BookingListFilters>({});
  const { bookings, loading, refetch } = useAdminBookings(filters);
  const bookingMutations = useBookingMutations(refetch);
  const navigate = useNavigate();

  const [rejectTarget, setRejectTarget] = useState<Booking | null>(null);

  useScrollLock(!!rejectTarget);

  const amenityMap = Object.fromEntries(amenities.map((a) => [a.id, a.name]));

  const handleReject = async (reason: string): Promise<boolean> => {
    if (!rejectTarget) return false;
    const ok = await bookingMutations.reject(rejectTarget.id, reason);
    if (ok) setRejectTarget(null);
    return ok;
  };

  const handleApprove = async (booking: Booking) => {
    await bookingMutations.approve(booking.id);
  };

  return (
    <div className="container-fluid p-3 p-md-4">
      <div className="mb-4">
        <h4 className="fw-bold mb-2 fs-4" style={{ color: '#1a1f36' }}>Bookings</h4>
        <p className="text-muted mb-0 small">Review, approve and reject amenity bookings.</p>
      </div>

      <div className="card border-0 shadow-sm mb-3 p-3" style={{ borderRadius: '12px' }}>
        <BookingFilters amenities={amenities} filters={filters} onChange={setFilters} />
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : bookings.length === 0 ? (
        <div className="text-center text-muted py-5">No bookings found.</div>
      ) : (
        <div className="card border-0 shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="small text-secondary fw-semibold">Booking</th>
                  <th className="small text-secondary fw-semibold">Amenity</th>
                  <th className="small text-secondary fw-semibold">Date</th>
                  <th className="small text-secondary fw-semibold">Time</th>
                  <th className="small text-secondary fw-semibold">Status</th>
                  <th className="small text-secondary fw-semibold">Payment</th>
                  <th className="small text-secondary fw-semibold text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <BookingRow
                    key={b.id}
                    booking={b}
                    amenityName={amenityMap[b.amenityId]}
                    isAdmin
                    onView={(bk) => navigate(`/bookings/${bk.id}`)}
                    onApprove={handleApprove}
                    onReject={setRejectTarget}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {rejectTarget && (
        <ReasonModal
          title="Reject Booking"
          submitLabel="Reject Booking"
          icon="bi-x-circle"
          loading={bookingMutations.loading}
          onSubmit={handleReject}
          onCancel={() => setRejectTarget(null)}
        />
      )}
    </div>
  );
};

export default BookingsAdminPage;
