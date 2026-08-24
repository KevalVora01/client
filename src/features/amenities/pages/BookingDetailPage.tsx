import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, X, Gavel } from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import { useScrollLock } from '../../../hooks/useScrollLock';
import { useBookingDetail } from '../hooks/useBookingDetail';
import { useBookingMutations } from '../hooks/useBookingMutations';
import { useAmenities } from '../hooks/useAmenities';
import BookingStatusBadge from '../components/BookingStatusBadge';
import ReasonModal from '../components/ReasonModal';
import SettleModal from '../components/SettleModal';
import ConfirmDialog from '../../../components/ConfirmDialog/ConfirmDialog';
import type { VoteChoice, CommitteeMember, BookingVote } from '../types/amenity.types';

const VoterRow = ({
  name,
  email,
  tag,
  draft,
  pending,
  actionLoading,
  onVote,
}: {
  name: string;
  email: string;
  tag?: string | null;
  draft: string | null | undefined;
  pending: boolean;
  actionLoading: boolean;
  onVote: (choice: VoteChoice) => void;
}) => (
  <div className="d-flex align-items-center justify-content-between p-3 rounded-3 border border-light-subtle flex-wrap gap-2">
    <div className="min-w-0" style={{ flex: '1 1 auto' }}>
      <div className="d-flex align-items-center gap-2">
        <span className="fw-semibold text-dark" style={{ fontSize: '0.9rem' }}>{name}</span>
        {tag && (
          <span className="badge" style={{ backgroundColor: '#e8eaf6', color: '#3949ab', fontSize: '0.68rem', fontWeight: 600 }}>
            {tag}
          </span>
        )}
      </div>
      <div className="text-muted mt-0" style={{ fontSize: '0.78rem' }}>{email}</div>
    </div>
    {pending ? (
      <div className="d-flex rounded-3 overflow-hidden flex-shrink-0" style={{ border: '1px solid #e5e7eb' }}>
        <button
          type="button"
          disabled={actionLoading}
          onClick={() => onVote('Approve')}
          className="d-flex align-items-center gap-1 px-3 fw-semibold border-0"
          style={{
            fontSize: '0.82rem',
            paddingTop: '6px',
            paddingBottom: '6px',
            backgroundColor: draft === 'Approve' ? '#166534' : '#fff',
            color: draft === 'Approve' ? '#fff' : '#6b7280',
            transition: 'all 0.15s ease',
          }}
        >
          <Check size={14} /> Approve
        </button>
        <div style={{ width: '1px', background: '#e5e7eb' }} />
        <button
          type="button"
          disabled={actionLoading}
          onClick={() => onVote('Reject')}
          className="d-flex align-items-center gap-1 px-3 fw-semibold border-0"
          style={{
            fontSize: '0.82rem',
            paddingTop: '6px',
            paddingBottom: '6px',
            backgroundColor: draft === 'Reject' ? '#991b1b' : '#fff',
            color: draft === 'Reject' ? '#fff' : '#6b7280',
            transition: 'all 0.15s ease',
          }}
        >
          <X size={14} /> Reject
        </button>
      </div>
    ) : draft ? (
      <span
        className="d-inline-flex align-items-center gap-1 px-3 py-1 rounded-pill fw-semibold flex-shrink-0"
        style={{
          fontSize: '0.78rem',
          backgroundColor: draft === 'Approve' ? '#dcfce7' : '#fee2e2',
          color: draft === 'Approve' ? '#166534' : '#991b1b',
        }}
      >
        {draft === 'Approve' ? <Check size={13} /> : <X size={13} />}
        {draft}
      </span>
    ) : (
      <span
        className="d-inline-flex align-items-center gap-1 px-3 py-1 rounded-pill fw-semibold flex-shrink-0"
        style={{
          fontSize: '0.78rem',
          backgroundColor: '#f3f4f6',
          color: '#6b7280',
        }}
      >
        Not Voted
      </span>
    )}
  </div>
);

const BookingDetailPage = () => {
  const { id } = useParams();
  const bookingId = Number(id);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const {
    booking,
    loading,
    actionLoading,
    draftVotes,
    draftAdminVote,
    setMemberVote,
    setAdminVote,
    finalize,
    recordVotes,
    refetch,
  } = useBookingDetail(bookingId);
  const bookingMutations = useBookingMutations(refetch);
  const { amenities } = useAmenities();
  const navigate = useNavigate();

  const [cancelOpen, setCancelOpen] = useState(false);
  const [settleOpen, setSettleOpen] = useState(false);
  const [showFinalizeConfirm, setShowFinalizeConfirm] = useState(false);

  useScrollLock(cancelOpen || settleOpen || showFinalizeConfirm);

  if (loading) {
    return <div className="container-fluid p-4 text-center"><div className="spinner-border text-primary" /></div>;
  }
  if (!booking) {
    return <div className="container-fluid p-4 text-center text-muted">Booking not found.</div>;
  }

  const amenityName =
    booking.amenity?.name ??
    amenities.find((a) => a.id === booking.amenityId)?.name ??
    `Amenity #${booking.amenityId}`;

  const isPending = booking.status === 'Pending';
  const canCancel = !isAdmin && booking.status !== 'Cancelled' && booking.status !== 'Rejected';
  const canSettle = !isAdmin && booking.status === 'Confirmed' && !booking.paidAt;

  const votes = booking.votes || [];
  const committeeMembers = booking.committeeMembers || [];

  const voteForMember = (memberId: number) =>
    votes.find((v: BookingVote) => v.committeeMemberId === memberId);
  const adminVoteFromDb = votes.find((v: BookingVote) => !v.committeeMemberId);

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

  const confirmFinalize = async () => {
    setShowFinalizeConfirm(false);
    await finalize();
  };

  const approvedCount =
    Object.values(draftVotes).filter((v) => v === 'Approve').length +
    (draftAdminVote === 'Approve' ? 1 : 0);
  const rejectedCount =
    Object.values(draftVotes).filter((v) => v === 'Reject').length +
    (draftAdminVote === 'Reject' ? 1 : 0);
  const totalPossibleVoters = committeeMembers.length + (isAdmin ? 1 : 0);
  const votedCount = Object.keys(draftVotes).length + (draftAdminVote ? 1 : 0);

  const residentUser = booking.resident?.user;
  const residentApt = booking.resident?.apartment;

  const rows: { label: string; value: string }[] = [
    { label: 'Amenity', value: amenityName },
    {
      label: 'Resident',
      value: residentUser?.name ? `${residentUser.name} (${residentUser.phone || residentUser.email})` : `Resident #${booking.residentId}`,
    },
    {
      label: 'Apartment',
      value: residentApt ? `${residentApt.block}-${residentApt.floorNumber}${residentApt.unitNumber}` : `Apt #${booking.apartmentId}`,
    },
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

      {/* ── Result banner (after decision) ── */}
      {!isPending && (
        <div
          className="d-flex align-items-center gap-2 px-3 px-sm-4 py-3 rounded-3 mb-4"
          style={{
            backgroundColor:
              booking.status === 'Confirmed'
                ? '#ecfdf5'
                : booking.status === 'Cancelled'
                  ? '#f3f4f6'
                  : '#fef2f2',
            border: `1px solid ${booking.status === 'Confirmed'
                ? '#a7f3d0'
                : booking.status === 'Cancelled'
                  ? '#e5e7eb'
                  : '#fecaca'
              }`,
            color:
              booking.status === 'Confirmed'
                ? '#065f46'
                : booking.status === 'Cancelled'
                  ? '#4b5563'
                  : '#991b1b',
            fontSize: '0.9rem',
          }}
        >
          {booking.status === 'Confirmed' ? (
            <Check size={18} />
          ) : (
            <X size={18} />
          )}
          <div>
            <span className="fw-semibold">
              This booking request was {booking.status.toLowerCase()}.
            </span>
            {booking.status === 'Rejected' && booking.rejectionReason && (
              <div className="mt-1" style={{ fontSize: '0.85rem' }}>
                Reason: {booking.rejectionReason}
              </div>
            )}
            {booking.status === 'Cancelled' && booking.cancellationReason && (
              <div className="mt-1" style={{ fontSize: '0.85rem' }}>
                Cancellation Reason: {booking.cancellationReason}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap mb-4">
        <div>
          <h4 className="fw-bold mb-1 fs-4" style={{ color: '#1a1f36' }}>Booking #{booking.id}</h4>
          <div className="mt-1"><BookingStatusBadge status={booking.status} /></div>
        </div>
      </div>

      <div className="row g-3">
        {/* ── Details Card ── */}
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <div className="card-body">
              <h6 className="fw-bold mb-3" style={{ color: '#1a1f36' }}>Booking Details</h6>
              <table className="table table-sm mb-0">
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.label}>
                      <th className="text-secondary fw-medium small py-2" style={{ width: '38%' }}>{r.label}</th>
                      <td className="small py-2" style={{ color: '#1a1f36' }}>{r.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Resident Actions */}
              {(canSettle || canCancel) && (
                <div className="mt-4 pt-3 border-top d-flex gap-2">
                  {canSettle && (
                    <button className="btn btn-dark btn-sm flex-fill" style={{ borderRadius: '8px' }} onClick={() => setSettleOpen(true)}>
                      <i className="bi bi-cash me-1" /> Record Payment
                    </button>
                  )}
                  {canCancel && (
                    <button className="btn btn-outline-danger btn-sm flex-fill" style={{ borderRadius: '8px' }} onClick={() => setCancelOpen(true)}>
                      <i className="bi bi-slash-circle me-1" /> Cancel Booking
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Committee Voting Card ── */}
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center gap-2">
                  <Gavel size={18} className="text-dark" />
                  <h6 className="fw-bold mb-0" style={{ color: '#1a1f36' }}>Committee Voting</h6>
                </div>
                <span className="badge bg-light text-secondary border">
                  {votedCount} of {totalPossibleVoters} voted
                </span>
              </div>

              {/* ── Vote progress bar ── */}
              {isPending && (
                <div className="mb-3 pb-3 border-bottom border-light-subtle">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex align-items-center gap-3">
                      <span className="d-flex align-items-center gap-1" style={{ fontSize: '0.82rem', color: '#166534' }}>
                        <Check size={14} /> <span className="fw-semibold">{approvedCount}</span> Approved
                      </span>
                      <span className="d-flex align-items-center gap-1" style={{ fontSize: '0.82rem', color: '#991b1b' }}>
                        <X size={14} /> <span className="fw-semibold">{rejectedCount}</span> Rejected
                      </span>
                      <span className="text-muted d-flex align-items-center gap-1" style={{ fontSize: '0.82rem' }}>
                        <span className="fw-semibold">{totalPossibleVoters - votedCount}</span> Pending
                      </span>
                    </div>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: '#f3f4f6', borderRadius: '99px', overflow: 'hidden' }}>
                    {(() => {
                      const approvedW = totalPossibleVoters ? (approvedCount / totalPossibleVoters) * 100 : 0;
                      const rejectedW = totalPossibleVoters ? (rejectedCount / totalPossibleVoters) * 100 : 0;
                      return (
                        <>
                          <div style={{ width: `${approvedW}%`, height: '100%', background: '#22c55e', float: 'left' }} />
                          <div style={{ width: `${rejectedW}%`, height: '100%', background: '#ef4444', float: 'left' }} />
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* ── Committee member rows ── */}
              {committeeMembers.length === 0 && !(isAdmin && isPending) ? (
                <p className="text-muted small mb-0">No committee members configured to vote.</p>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {committeeMembers.map((m: CommitteeMember) => {
                    const existing = voteForMember(m.id);
                    const draft = draftVotes[m.id] ?? existing?.vote;
                    return (
                      <VoterRow
                        key={m.id}
                        name={m.fullName || `Member #${m.id}`}
                        email={m.email}
                        draft={draft}
                        pending={isPending && isAdmin}
                        actionLoading={actionLoading}
                        onVote={(choice) => setMemberVote(m.id, choice)}
                      />
                    );
                  })}

                  {/* ── Admin vote ── */}
                  {((isAdmin && isPending) || draftAdminVote || adminVoteFromDb?.vote) && (
                    <VoterRow
                      name={user?.name ?? 'Admin'}
                      email={user?.email ?? ''}
                      tag="Admin (Tiebreaker)"
                      draft={draftAdminVote ?? adminVoteFromDb?.vote}
                      pending={isPending && isAdmin}
                      actionLoading={actionLoading}
                      onVote={(choice) => setAdminVote(choice)}
                    />
                  )}
                </div>
              )}

              {/* ── Admin Vote Actions ── */}
              {isAdmin && isPending && (
                <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    style={{ borderRadius: '8px' }}
                    disabled={actionLoading || votedCount === 0}
                    onClick={recordVotes}
                  >
                    {actionLoading ? 'Saving...' : 'Save Draft Votes'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-dark btn-sm fw-semibold d-inline-flex align-items-center gap-1 px-3"
                    style={{ borderRadius: '8px' }}
                    disabled={actionLoading || votedCount === 0}
                    onClick={() => setShowFinalizeConfirm(true)}
                  >
                    <Gavel size={15} /> Finalize Decision
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {cancelOpen && (
        <ReasonModal
          title="Cancel Booking"
          submitLabel="Cancel Booking"
          icon="bi-slash-circle"
          loading={bookingMutations.loading}
          onSubmit={handleCancel}
          onCancel={() => setCancelOpen(false)}
        />
      )}
      {settleOpen && (
        <SettleModal
          loading={bookingMutations.loading}
          onSubmit={handleSettle}
          onCancel={() => setSettleOpen(false)}
        />
      )}

      <ConfirmDialog
        show={showFinalizeConfirm}
        title="Finalize Booking Decision"
        message="All recorded votes will be evaluated and the booking request will be approved or rejected based on the majority vote outcome. This action cannot be undone."
        confirmLabel="Finalize Decision"
        variant="dark"
        loading={actionLoading}
        onConfirm={confirmFinalize}
        onCancel={() => setShowFinalizeConfirm(false)}
      />
    </div>
  );
};

export default BookingDetailPage;
