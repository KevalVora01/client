import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollLock } from '../../../hooks/useScrollLock';
import { useMyBookings } from '../hooks/useBookings';
import { useAmenities } from '../hooks/useAmenities';
import { useBookingMutations } from '../hooks/useBookingMutations';
import BookingTable from '../components/BookingTable';
import ReasonModal from '../components/ReasonModal';
import SettleModal from '../components/SettleModal';
import type { Booking } from '../types/amenity.types';

const MyBookingsPage = () => {
  const [scope, setScope] = useState<'upcoming' | 'past'>('upcoming');
  const { bookings, loading, refetch } = useMyBookings(scope);
  const { amenities } = useAmenities();
  const bookingMutations = useBookingMutations(refetch);
  const navigate = useNavigate();

  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [settleTarget, setSettleTarget] = useState<Booking | null>(null);

  useScrollLock(!!cancelTarget || !!settleTarget);

  const amenityMap = Object.fromEntries(amenities.map((a) => [a.id, a.name]));

  const handleCancel = async (reason: string): Promise<boolean> => {
    if (!cancelTarget) return false;
    const ok = await bookingMutations.cancel(cancelTarget.id, reason);
    if (ok) setCancelTarget(null);
    return ok;
  };

  const handleSettle = async (ref: string): Promise<boolean> => {
    if (!settleTarget) return false;
    const ok = await bookingMutations.settle(settleTarget.id, ref);
    if (ok) setSettleTarget(null);
    return ok;
  };

  return (
    <div className="container-fluid p-3 p-md-4">
      <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap mb-4">
        <div>
          <h4 className="fw-bold mb-2 fs-4" style={{ color: '#1a1f36' }}>My Bookings</h4>
          <p className="text-muted mb-0 small">View and manage your amenity bookings.</p>
        </div>
      </div>

      <div className="d-flex flex-wrap gap-2 mb-3">
        {(['upcoming', 'past'] as const).map((key) => {
          const active = scope === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setScope(key)}
              className="btn btn-sm fw-semibold px-3 py-2"
              style={{
                borderRadius: '8px',
                fontSize: '0.85rem',
                backgroundColor: active ? '#1a1f36' : '#fff',
                color: active ? '#fff' : '#4b5563',
                border: `1px solid ${active ? '#1a1f36' : '#e5e7eb'}`,
              }}
            >
              {key === 'upcoming' ? 'Upcoming' : 'Past'}
            </button>
          );
        })}
      </div>

      <div className="card bg-white border border-light-subtle rounded-3 shadow-sm mt-3">
        <BookingTable
          bookings={bookings}
          loading={loading}
          amenityMap={amenityMap}
          isAdmin={false}
          onView={(bk) => navigate(`/bookings/${bk.id}`)}
          onCancel={setCancelTarget}
          onSettle={setSettleTarget}
        />
      </div>

      {cancelTarget && (
        <ReasonModal
          title="Cancel Booking"
          submitLabel="Cancel Booking"
          icon="bi-slash-circle"
          loading={bookingMutations.loading}
          onSubmit={handleCancel}
          onCancel={() => setCancelTarget(null)}
        />
      )}

      {settleTarget && (
        <SettleModal loading={bookingMutations.loading} onSubmit={handleSettle} onCancel={() => setSettleTarget(null)} />
      )}
    </div>
  );
};

export default MyBookingsPage;
