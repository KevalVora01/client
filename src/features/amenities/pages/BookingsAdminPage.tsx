import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollLock } from '../../../hooks/useScrollLock';
import { useAdminBookings } from '../hooks/useBookings';
import { useAmenities } from '../hooks/useAmenities';
import { useBookingStats } from '../hooks/useBookingStats';
import { useBookingMutations } from '../hooks/useBookingMutations';
import BookingStatsCards from '../components/BookingStatsCards';
import BookingTable from '../components/BookingTable';
import BookingFilters from '../components/BookingFilters';
import ReasonModal from '../components/ReasonModal';
import type { Booking, BookingListFilters } from '../types/amenity.types';

const BookingsAdminPage = () => {
  const { amenities } = useAmenities();
  const [filters, setFilters] = useState<BookingListFilters>({});
  const { stats, loading: statsLoading, refetch: refetchStats } = useBookingStats();

  const handleRefetchAll = useCallback(() => {
    refetch();
    refetchStats();
  }, [refetchStats]);

  const { bookings, loading, refetch } = useAdminBookings(filters);
  const bookingMutations = useBookingMutations(handleRefetchAll);
  const navigate = useNavigate();

  const [rejectTarget, setRejectTarget] = useState<Booking | null>(null);

  useScrollLock(!!rejectTarget);

  const amenityMap = Object.fromEntries(amenities.map((a) => [a.id, a.name]));
  const amenityPriceMap = Object.fromEntries(amenities.map((a) => [a.id, a.bookingType === 'SHARED_CAPACITY' ? 0 : (a.price ?? 0)]));

  const handleReject = async (reason: string): Promise<boolean> => {
    if (!rejectTarget) return false;
    const ok = await bookingMutations.reject(rejectTarget.id, reason);
    if (ok) setRejectTarget(null);
    return ok;
  };

  return (
    <div className="container-fluid p-3 p-md-4">
      {/* ── Header ── */}
      <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap mb-4">
        <div>
          <h4 className="fw-bold mb-2 fs-4" style={{ color: '#1a1f36' }}>
            Bookings Management
          </h4>
          <p className="text-muted mb-0 small">
            Review, vote on, approve, and manage all resident amenity booking requests.
          </p>
        </div>
      </div>

      {/* ── Stats Cards Grid ── */}
      <BookingStatsCards stats={stats} loading={statsLoading} />

      {/* ── Table Container Card ── */}
      <div className="card bg-white border border-light-subtle rounded-3 shadow-sm mt-4">
        {/* Filters Header Block */}
        <div className="card-header bg-white border-bottom border-light-subtle p-3">
          <BookingFilters amenities={amenities} filters={filters} onChange={setFilters} />
        </div>

        {/* Dynamic List Table Area */}
        <div className="table-responsive">
          <BookingTable
            bookings={bookings}
            loading={loading}
            amenityMap={amenityMap}
            amenityPriceMap={amenityPriceMap}
            isAdmin
            onView={(bk) => navigate(`/bookings/${bk.id}`)}
          />
        </div>
      </div>

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
