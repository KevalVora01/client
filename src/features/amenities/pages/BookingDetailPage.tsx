import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import { useScrollLock } from '../../../hooks/useScrollLock';
import { useBookingDetail } from '../hooks/useBookingDetail';
import { useBookingMutations } from '../hooks/useBookingMutations';
import { useAmenities } from '../hooks/useAmenities';
import BookingStatusBadge from '../components/BookingStatusBadge';
import ReasonModal from '../components/ReasonModal';
import SettleModal from '../components/SettleModal';

const BookingDetailPage = () => {
  const { id } = useParams();
  const bookingId = Number(id);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const { booking, loading, refetch } = useBookingDetail(bookingId);
  const bookingMutations = useBookingMutations(refetch);
  const { amenities } = useAmenities();
  const navigate = useNavigate();

  const [rejectOpen, setRejectOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [settleOpen, setSettleOpen] = useState(false);

  useScrollLock(rejectOpen || cancelOpen || settleOpen);

  if (loading) {
    return <div className="container-fluid p-4 text-center"><div className="spinner-border text-primary" /></div>;
  }
  if (!booking) {
    return <div className="container-fluid p-4 text-center text-muted">Booking not found.</div>;
  }

  const amenityName = amenities.find((a) => a.id === booking.amenityId)?.name ?? `Amenity #${booking.amenityId}`;
  const canApprove = isAdmin && booking.status === 'Pending';
  const canReject = isAdmin && booking.status === 'Pending';
  const canCancel = !isAdmin && booking.status !== 'Cancelled' && booking.status !== 'Rejected';
  const canSettle = !isAdmin && booking.status === 'Confirmed' && !booking.paidAt;

  const handleReject = async (reason: string): Promise<boolean> => {
    const ok = await bookingMutations.reject(booking.id, reason);
    if (ok) setRejectOpen(false);
    return ok;
  };
  const handleCancel = async (reason: string): Promise<boolean> => {
    const ok = await bookingMutations.cancel(booking.id, reason);
    if (ok) setCancelOpen(false);
    return ok;
  };
  const handleSettle = async (ref: string): Promise<boolean> => {
    const ok = await bookingMutations.settle(booking.id, ref);
    if (ok) setSettleOpen(false);
    return ok;
  };

  const rows: { label: string; value: string }[] = [
    { label: 'Amenity', value: amenityName },
    { label: 'Booking Date', value: booking.bookingDate },
    { label: 'Time', value: `${booking.startTime} – ${booking.endTime}` },
    { label: 'Purpose', value: booking.purpose ?? '—' },
    { label: 'Payment', value: booking.paidAt ? `Paid (${booking.paymentRef})` : 'Unpaid' },
  ];
  if (booking.rejectionReason) rows.push({ label: 'Rejection Reason', value: booking.rejectionReason });
  if (booking.cancellationReason) rows.push({ label: 'Cancellation Reason', value: booking.cancellationReason });

  return (
    <div className="container-fluid p-3 p-md-4">
      <button className="btn btn-link text-decoration-none ps-0 mb-2 text-secondary" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left me-1" /> Back
      </button>

      <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap mb-4">
        <div>
          <h4 className="fw-bold mb-1 fs-4" style={{ color: '#1a1f36' }}>Booking #{booking.id}</h4>
          <div className="mt-1"><BookingStatusBadge status={booking.status} /></div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
            <div className="card-body">
              <h6 className="fw-bold mb-3" style={{ color: '#1a1f36' }}>Details</h6>
              <table className="table table-sm mb-0">
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.label}>
                      <th className="text-secondary fw-medium small" style={{ width: '40%' }}>{r.label}</th>
                      <td className="small" style={{ color: '#1a1f36' }}>{r.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
            <div className="card-body">
              <h6 className="fw-bold mb-3" style={{ color: '#1a1f36' }}>Actions</h6>
              <div className="d-grid gap-2">
                {canApprove && (
                  <button className="btn btn-success" style={{ borderRadius: '8px' }} onClick={() => bookingMutations.approve(booking.id)}>
                    <i className="bi bi-check-circle me-1" /> Approve Booking
                  </button>
                )}
                {canReject && (
                  <button className="btn btn-outline-danger" style={{ borderRadius: '8px' }} onClick={() => setRejectOpen(true)}>
                    <i className="bi bi-x-circle me-1" /> Reject Booking
                  </button>
                )}
                {canSettle && (
                  <button className="btn btn-dark" style={{ borderRadius: '8px' }} onClick={() => setSettleOpen(true)}>
                    <i className="bi bi-cash me-1" /> Record Payment
                  </button>
                )}
                {canCancel && (
                  <button className="btn btn-outline-danger" style={{ borderRadius: '8px' }} onClick={() => setCancelOpen(true)}>
                    <i className="bi bi-slash-circle me-1" /> Cancel Booking
                  </button>
                )}
                {!canApprove && !canReject && !canSettle && !canCancel && (
                  <p className="text-muted small mb-0">No actions available for this booking.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {rejectOpen && (
        <ReasonModal title="Reject Booking" submitLabel="Reject Booking" icon="bi-x-circle" loading={bookingMutations.loading} onSubmit={handleReject} onCancel={() => setRejectOpen(false)} />
      )}
      {cancelOpen && (
        <ReasonModal title="Cancel Booking" submitLabel="Cancel Booking" icon="bi-slash-circle" loading={bookingMutations.loading} onSubmit={handleCancel} onCancel={() => setCancelOpen(false)} />
      )}
      {settleOpen && (
        <SettleModal loading={bookingMutations.loading} onSubmit={handleSettle} onCancel={() => setSettleOpen(false)} />
      )}
    </div>
  );
};

export default BookingDetailPage;
