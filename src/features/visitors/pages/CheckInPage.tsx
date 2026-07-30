import { useState, useEffect } from 'react';
import { usePendingVisitors } from '../hooks/usePendingVisitors';
import { useVisitors } from '../hooks/useVisitors';
import { useVisitorMutations } from '../hooks/useVisitorMutations';
import WalkInVisitorForm from '../components/WalkInVisitorForm';
import VisitorLookupSearch from '../components/VisitorLookupSearch';
import { useScrollLock } from '../../../hooks/useScrollLock';
import useSocket from '../../../hooks/useSocket';
import useAuth from '../../../hooks/useAuth';
import type { LogWalkInPayload, Visitor } from '../types/visitor.types';
import { Plus, UserPlus, Clock, CheckCircle2, UserCheck, Check, X, XCircle, ShieldCheck } from 'lucide-react';
import { visitorApi } from '../api/visitorApi';
import { toast } from 'react-toastify';
import { getErrorMessage } from '../../../utils/getErrorMessage';

function timeAgo(dateStr: string | null, nowMs: number): string {
  if (!dateStr) return '';
  const mins = Math.floor((nowMs - new Date(dateStr).getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  return `${hours}h ago`;
}

const CheckInPage = () => {
  const socket = useSocket();
  const { user } = useAuth();
  const role = user?.role === 'resident' ? 'resident' : 'security';

  const [now, setNow] = useState(() => Date.now());
  const [activeTab, setActiveTab] = useState<'checkin' | 'queue'>('checkin');

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const { visitors: pendingVisitors, loading: pendingLoading, refetch: refetchPending } = usePendingVisitors();
  const { visitors: approvedVisitors, refetch: refetchApproved } = useVisitors({ userRole: role, status: 'Approved' });
  const { visitors: rejectedVisitors, refetch: refetchRejected } = useVisitors({ userRole: role, status: 'Rejected' });

  const { logWalkIn, checkIn, loading: mutationLoading, actionId } = useVisitorMutations(() => {
    refetchPending();
    refetchApproved();
    refetchRejected();
  });

  const [walkInModalOpen, setWalkInModalOpen] = useState(false);
  const [optimisticDecisions, setOptimisticDecisions] = useState<Record<number, 'Approve' | 'Reject'>>({});

  useScrollLock(walkInModalOpen);

  // Listen to socket events for instant gate updates
  useEffect(() => {
    if (!socket) return;
    const handleRefetch = () => {
      refetchPending();
      refetchApproved();
      refetchRejected();
    };
    socket.on('notification:new', handleRefetch);
    socket.on('visitor:updated', handleRefetch);
    return () => {
      socket.off('notification:new', handleRefetch);
      socket.off('visitor:updated', handleRefetch);
    };
  }, [socket, refetchPending, refetchApproved, refetchRejected]);

  const handleLogWalkIn = async (payload: LogWalkInPayload, photo?: File): Promise<boolean> => {
    return logWalkIn(payload, photo);
  };

  const handleCheckIn = async (visitor: Visitor) => {
    await checkIn(visitor.id);
    refetchApproved();
    refetchPending();
    refetchRejected();
  };

  const handleSecurityRespond = async (visitorId: number, decision: 'Approve' | 'Reject') => {
    // HIDE BUTTONS IMMEDIATELY (0ms latency response)
    setOptimisticDecisions((prev) => ({ ...prev, [visitorId]: decision }));
    try {
      await visitorApi.respond(visitorId, decision);
      toast.success(decision === 'Approve' ? 'Visitor entry approved at gate!' : 'Visitor entry rejected.');
      refetchPending();
      refetchApproved();
      refetchRejected();
    } catch (err: unknown) {
      // Revert if API failed
      setOptimisticDecisions((prev) => {
        const next = { ...prev };
        delete next[visitorId];
        return next;
      });
      toast.error(getErrorMessage(err, `Failed to ${decision.toLowerCase()} visitor`));
    }
  };

  const pendingCount = pendingVisitors?.items.length ?? 0;
  const approvedItems = Array.isArray(approvedVisitors) ? approvedVisitors : [];
  const rejectedItems = Array.isArray(rejectedVisitors) ? rejectedVisitors : [];

  return (
    <div className="container-fluid p-3 p-md-4 max-w-100 mx-auto">

      {/* ── Page Header & Top Nav ── */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1 fs-4 fs-sm-3" style={{ color: '#1a1f36' }}>
            Gate Visitor Check-In
          </h4>
          <p className="text-muted mb-0 small">
            Verify expected guests, check in resident-approved visitors, or log a new walk-in entry.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-dark fw-semibold d-inline-flex align-items-center gap-2 px-3.5 py-2 shadow-sm"
          onClick={() => setWalkInModalOpen(true)}
          style={{ fontSize: '0.875rem', borderRadius: '8px', backgroundColor: '#1a1f36', borderColor: '#1a1f36' }}
        >
          <Plus size={18} strokeWidth={2.5} />
          Log Walk-In Visitor
        </button>
      </div>

      {/* ── Main 2-Tab Navigation Bar ── */}
      <div className="card bg-white border border-light-subtle rounded-4 shadow-sm mb-4">
        <div className="card-header bg-light border-bottom border-light-subtle px-3 px-md-4 py-2.5">
          <ul className="nav nav-tabs card-header-tabs border-0 gap-2">
            <li className="nav-item">
              <button
                className={`nav-link border-0 fw-semibold px-3 py-2 rounded-3 d-flex align-items-center gap-2 ${activeTab === 'checkin' ? 'bg-white text-primary shadow-xs' : 'text-secondary'}`}
                style={{ fontSize: '0.875rem' }}
                onClick={() => setActiveTab('checkin')}
              >
                <ShieldCheck size={18} />
                Active Gate Check-In
                {approvedItems.length > 0 && (
                  <span className="badge bg-success text-white rounded-pill px-2 py-0.5" style={{ fontSize: '0.72rem' }}>
                    {approvedItems.length}
                  </span>
                )}
              </button>
            </li>

            <li className="nav-item">
              <button
                className={`nav-link border-0 fw-semibold px-3 py-2 rounded-3 d-flex align-items-center gap-2 ${activeTab === 'queue' ? 'bg-white text-primary shadow-xs' : 'text-secondary'}`}
                style={{ fontSize: '0.875rem' }}
                onClick={() => setActiveTab('queue')}
              >
                <Clock size={18} />
                Approval Queue & Denied Log
                {pendingCount > 0 && (
                  <span className="badge bg-warning text-dark rounded-pill px-2 py-0.5" style={{ fontSize: '0.72rem' }}>
                    {pendingCount}
                  </span>
                )}
              </button>
            </li>
          </ul>
        </div>

        <div className="card-body p-3 p-md-4">

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* TAB 1: ACTIVE GATE CHECK-IN (SEARCH + WALK-IN + APPROVED LIST) */}
          {/* ════════════════════════════════════════════════════════════════ */}
          {activeTab === 'checkin' && (
            <div className="d-flex flex-column gap-4">

              {/* 1. Search Expected / Approved Visitors */}
              <div>
                <VisitorLookupSearch onCheckIn={handleCheckIn} checkInLoading={mutationLoading} />
              </div>

              {/* 2. Approved Visitors Ready for Gate Check-In */}
              <div>
                <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2 border-light-subtle">
                  <h6 className="fw-bold mb-0 text-success d-flex align-items-center gap-2" style={{ fontSize: '0.95rem' }}>
                    <UserCheck size={20} />
                    Approved Visitors (Ready for Gate Check-In)
                  </h6>
                  <span className="badge bg-success-subtle text-success border border-success-subtle fw-semibold" style={{ fontSize: '0.78rem' }}>
                    {approvedItems.length} Ready
                  </span>
                </div>

                {approvedItems.length === 0 ? (
                  <div className="text-center py-4 bg-light rounded-3 border border-light-subtle">
                    <UserCheck size={32} className="text-muted mb-2 opacity-50" />
                    <p className="fw-medium text-dark mb-1" style={{ fontSize: '0.875rem' }}>No approved visitors waiting at the gate</p>
                    <p className="text-muted small mb-0">Approved visitors or expected guests ready for entry will appear here.</p>
                  </div>
                ) : (
                  <div className="row row-cols-1 row-cols-md-2 g-3">
                    {approvedItems.map((visitor) => (
                      <div key={visitor.id} className="col">
                        <div className="card bg-white border border-success-subtle rounded-3 p-3 shadow-xs h-100 d-flex flex-row align-items-center justify-content-between gap-3">
                          <div className="min-w-0 flex-grow-1">
                            <div className="d-flex align-items-center gap-2 mb-1">
                              <h6 className="fw-bold text-dark mb-0 text-truncate" style={{ fontSize: '0.9rem' }}>
                                {visitor.name}
                              </h6>
                              <span className="badge bg-success-subtle text-success border border-success-subtle" style={{ fontSize: '0.68rem' }}>
                                Approved
                              </span>
                            </div>
                            <p className="text-secondary mb-1" style={{ fontSize: '0.78rem' }}>
                              Phone: <span className="fw-medium text-dark">{visitor.phone}</span> &middot; Purpose: <span className="fw-medium text-dark">{visitor.purpose}</span>
                            </p>
                            {visitor.apartment && (
                              <span className="badge bg-light text-dark border border-light-subtle font-monospace" style={{ fontSize: '0.72rem' }}>
                                {visitor.apartment.block}-{visitor.apartment.floorNumber}{visitor.apartment.unitNumber}
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            disabled={mutationLoading && actionId === visitor.id}
                            className="btn btn-success fw-semibold px-3 py-2 d-inline-flex align-items-center gap-1.5 flex-shrink-0 shadow-sm"
                            onClick={() => handleCheckIn(visitor)}
                            style={{ fontSize: '0.825rem', borderRadius: '8px' }}
                          >
                            {mutationLoading && actionId === visitor.id ? (
                              <span className="spinner-border spinner-border-sm" role="status" />
                            ) : (
                              <>
                                <CheckCircle2 size={16} />
                                Check In
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* TAB 2: APPROVAL QUEUE & DENIED LOG */}
          {/* ════════════════════════════════════════════════════════════════ */}
          {activeTab === 'queue' && (
            <div className="d-flex flex-column gap-4">

              {/* 1. Awaiting Approval Queue (10-minute limit) */}
              <div>
                <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2 border-light-subtle">
                  <h6 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2" style={{ fontSize: '0.95rem' }}>
                    <Clock size={20} className="text-warning-emphasis" />
                    Awaiting Resident Approval ({pendingCount})
                  </h6>
                  {pendingCount > 0 && (
                    <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle" style={{ fontSize: '0.75rem' }}>
                      10m Expiry Limit Active
                    </span>
                  )}
                </div>

                {pendingLoading ? (
                  <div className="d-flex flex-column gap-2">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <div key={i} className="skeleton" style={{ width: '100%', height: '48px', borderRadius: '8px' }} />
                    ))}
                  </div>
                ) : pendingCount === 0 ? (
                  <div className="text-center py-4 bg-light rounded-3 border border-light-subtle">
                    <Clock size={32} className="text-muted mb-2 opacity-50" />
                    <p className="fw-medium text-dark mb-1" style={{ fontSize: '0.875rem' }}>No visitors currently awaiting approval</p>
                    <p className="text-muted small mb-0">Logged walk-in visitor requests will appear here in real-time.</p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {pendingVisitors!.items.map((visitor) => {
                      const reqTime = visitor.approvalRequestedAt || visitor.createdAt;
                      const elapsedMs = reqTime ? now - new Date(reqTime).getTime() : 0;
                      const isExpired = elapsedMs > 10 * 60 * 1000;
                      const optimisticChoice = optimisticDecisions[visitor.id];

                      return (
                        <div
                          key={visitor.id}
                          className="card bg-white border border-light-subtle rounded-3 p-3 shadow-xs d-flex flex-row align-items-center justify-content-between flex-wrap gap-2"
                        >
                          <div className="d-flex align-items-center gap-3 min-w-0 flex-grow-1">
                            <div
                              className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                              style={{ width: '38px', height: '38px', backgroundColor: '#fef3c7' }}
                            >
                              <UserPlus size={18} className="text-warning-emphasis" />
                            </div>
                            <div className="min-w-0">
                              <p className="fw-semibold mb-0 text-truncate" style={{ fontSize: '0.875rem', color: '#1a1f36' }}>
                                {visitor.name}
                              </p>
                              <p className="mb-0 text-secondary text-truncate" style={{ fontSize: '0.78rem' }}>
                                {visitor.apartment ? `${visitor.apartment.block}-${visitor.apartment.floorNumber}${visitor.apartment.unitNumber}` : `Unit #${visitor.apartmentId}`} &middot; {visitor.purpose}
                                {reqTime && (
                                  <>
                                    {' '}&middot; <Clock size={12} style={{ marginBottom: '2px' }} /> {timeAgo(reqTime, now)}
                                  </>
                                )}
                              </p>
                            </div>
                          </div>

                          {/* Gate Interactive Actions */}
                          <div className="d-flex align-items-center gap-2 ms-auto flex-shrink-0">
                            {optimisticChoice === 'Approve' ? (
                              <span className="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1" style={{ fontSize: '0.72rem' }}>
                                ✓ Approved
                              </span>
                            ) : optimisticChoice === 'Reject' ? (
                              <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2.5 py-1" style={{ fontSize: '0.72rem' }}>
                                ✕ Rejected
                              </span>
                            ) : isExpired ? (
                              <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2.5 py-1" style={{ fontSize: '0.72rem' }}>
                                ⌛ Expired (10m limit passed)
                              </span>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-success fw-semibold px-2.5 py-1 d-inline-flex align-items-center gap-1 shadow-xs"
                                  style={{ fontSize: '0.75rem', borderRadius: '6px' }}
                                  onClick={() => handleSecurityRespond(visitor.id, 'Approve')}
                                >
                                  <Check size={13} strokeWidth={2.5} />
                                  Approve
                                </button>

                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger fw-semibold px-2.5 py-1 d-inline-flex align-items-center gap-1"
                                  style={{ fontSize: '0.75rem', borderRadius: '6px' }}
                                  onClick={() => handleSecurityRespond(visitor.id, 'Reject')}
                                >
                                  <X size={13} strokeWidth={2.5} />
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 2. Rejected Visitors Log */}
              <div>
                <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2 border-danger-subtle">
                  <h6 className="fw-bold mb-0 text-danger d-flex align-items-center gap-2" style={{ fontSize: '0.95rem' }}>
                    <XCircle size={20} />
                    Rejected Visitors Log (Denied Entry)
                  </h6>
                  <span className="badge bg-danger text-white fw-bold" style={{ fontSize: '0.78rem' }}>
                    {rejectedItems.length} Rejected
                  </span>
                </div>

                {rejectedItems.length === 0 ? (
                  <div className="text-center py-4 bg-light rounded-3 border border-light-subtle">
                    <XCircle size={32} className="text-muted mb-2 opacity-50" />
                    <p className="fw-medium text-dark mb-1" style={{ fontSize: '0.875rem' }}>No rejected visitors</p>
                    <p className="text-muted small mb-0">Visitors denied entry by resident or security will be recorded here.</p>
                  </div>
                ) : (
                  <div className="row row-cols-1 row-cols-md-2 g-3">
                    {rejectedItems.map((visitor) => (
                      <div key={visitor.id} className="col">
                        <div className="card bg-white border border-danger-subtle rounded-3 p-3 shadow-xs h-100 d-flex flex-row align-items-center justify-content-between gap-3">
                          <div className="min-w-0 flex-grow-1">
                            <div className="d-flex align-items-center gap-2 mb-1">
                              <h6 className="fw-bold text-dark mb-0 text-truncate" style={{ fontSize: '0.9rem' }}>
                                {visitor.name}
                              </h6>
                              <span className="badge bg-danger-subtle text-danger border border-danger-subtle" style={{ fontSize: '0.68rem' }}>
                                ✕ Rejected by Resident
                              </span>
                            </div>
                            <p className="text-secondary mb-1" style={{ fontSize: '0.78rem' }}>
                              Phone: <span className="fw-medium text-dark">{visitor.phone}</span> &middot; Purpose: <span className="fw-medium text-dark">{visitor.purpose}</span>
                            </p>
                            {visitor.apartment && (
                              <span className="badge bg-light text-dark border border-light-subtle font-monospace" style={{ fontSize: '0.72rem' }}>
                                {visitor.apartment.block}-{visitor.apartment.floorNumber}{visitor.apartment.unitNumber}
                              </span>
                            )}
                          </div>
                          <span className="badge bg-danger-subtle text-danger border border-danger-subtle fw-semibold px-2.5 py-1" style={{ fontSize: '0.75rem' }}>
                            Access Denied
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      </div>

      {/* ── Log Walk-In Visitor Modal ── */}
      {walkInModalOpen && (
        <div className="modal d-block bg-dark bg-opacity-50" style={{ backdropFilter: 'blur(4px)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              <div className="modal-header border-light-subtle px-4 py-3 bg-light">
                <h5 className="modal-title fw-bold text-dark fs-5 d-flex align-items-center gap-2">
                  <UserPlus size={20} className="text-primary" />
                  Log a Walk-In Visitor
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setWalkInModalOpen(false)}
                />
              </div>
              <div className="modal-body p-4">
                <WalkInVisitorForm
                  loading={mutationLoading}
                  onCancel={() => setWalkInModalOpen(false)}
                  onSubmit={async (payload, photo) => {
                    const success = await handleLogWalkIn(payload, photo);
                    if (success) {
                      setWalkInModalOpen(false);
                      refetchPending();
                      refetchApproved();
                      refetchRejected();
                    }
                    return success;
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CheckInPage;