import { useState, useEffect } from 'react';
import { usePendingVisitors } from '../hooks/usePendingVisitors';
import { useVisitors } from '../hooks/useVisitors';
import { useVisitorMutations } from '../hooks/useVisitorMutations';
import WalkInVisitorForm from '../components/WalkInVisitorForm';
import VisitorLookupSearch from '../components/VisitorLookupSearch';
import CheckInPhotoModal from '../components/CheckInPhotoModal';
import { useScrollLock } from '../../../hooks/useScrollLock';
import useSocket from '../../../hooks/useSocket';
import useAuth from '../../../hooks/useAuth';
import type { LogWalkInPayload, Visitor } from '../types/visitor.types';
import {
  Plus, UserPlus, Clock, UserCheck, Check, X, XCircle,
  ShieldCheck, BadgeCheck, Car, Phone, MapPin, User, Camera
} from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'checkin' | 'queue' | 'denied'>('checkin');
  const [confirmAction, setConfirmAction] = useState<{ visitorId: number; decision: 'Approve' | 'Reject' } | null>(null);
  const [selectedApprovedVisitor, setSelectedApprovedVisitor] = useState<Visitor | null>(null);

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

  useScrollLock(walkInModalOpen || confirmAction !== null || selectedApprovedVisitor !== null);

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

  const handleCheckIn = async (visitor: Visitor, photo?: File) => {
    await checkIn(visitor.id, photo);
  };

  const handleSecurityRespond = async (visitorId: number, decision: 'Approve' | 'Reject') => {
    setConfirmAction({ visitorId, decision });
  };

  const confirmSecurityDecision = async () => {
    if (!confirmAction) return;
    const { visitorId, decision } = confirmAction;

    setOptimisticDecisions((prev) => ({ ...prev, [visitorId]: decision }));
    setConfirmAction(null);

    try {
      await visitorApi.respond(visitorId, decision);
      toast.success(decision === 'Approve' ? 'Visitor entry approved at gate!' : 'Visitor entry rejected.');
      refetchPending();
      refetchApproved();
      refetchRejected();
    } catch (err: unknown) {
      setOptimisticDecisions((prev) => {
        const next = { ...prev };
        delete next[visitorId];
        return next;
      });
      toast.error(getErrorMessage(err, `Failed to ${decision.toLowerCase()} visitor`));
    }
  };

  const pendingCount = pendingVisitors?.items.length ?? 0;
  const approvedItems = (Array.isArray(approvedVisitors) ? approvedVisitors : []).filter(v => !v.isPreRegistered);
  const rejectedItems = Array.isArray(rejectedVisitors) ? rejectedVisitors : [];

  const tabs = [
    { key: 'checkin', label: 'Gate Check-In', icon: ShieldCheck, count: approvedItems.length, color: 'success' },
    { key: 'queue', label: 'Approval Queue', icon: Clock, count: pendingCount, color: 'warning' },
    { key: 'denied', label: 'Denied Log', icon: XCircle, count: rejectedItems.length, color: 'danger' },
  ] as const;

  return (
    <div className="container-fluid p-3 p-md-4">

      {/* ── Page Header ── */}
      <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap mb-4">
        <div>
          <h4 className="fw-bold mb-2 fs-4 fs-sm-3" style={{ color: '#1a1f36' }}>
            Visitor Check-In
          </h4>
          <p className="text-muted mb-0 small">
            Verify identity, approve entry, and manage gate access
          </p>
        </div>

        <button
          type="button"
          className="btn btn-dark fw-semibold d-inline-flex align-items-center gap-2 px-3 py-2 shadow-sm"
          onClick={() => setWalkInModalOpen(true)}
          style={{ fontSize: '0.875rem', borderRadius: '8px' }}
        >
          <Plus size={18} strokeWidth={2.5} />
          Log Walk-In
        </button>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="card border-0 rounded-4 shadow-sm mb-4">
        <div className="card-header bg-white border-bottom border-light-subtle px-3 px-md-4 py-2">
          <ul className="nav nav-tabs card-header-tabs border-0 gap-1 mb-0">
            {tabs.map((tab) => (
              <li className="nav-item" key={tab.key}>
                <button
                  className={`nav-link border-0 fw-semibold px-3 py-2 rounded-3 d-flex align-items-center gap-2 ${
                    activeTab === tab.key ? 'bg-dark text-white shadow-sm' : 'text-secondary hover-bg-light'
                  }`}
                  style={{ fontSize: '0.875rem', transition: 'all 0.2s ease' }}
                  onClick={() => setActiveTab(tab.key)}
                >
                  <tab.icon size={16} />
                  {tab.label}
                  {tab.count > 0 && (
                    <span
                      className={`badge rounded-pill px-2 py-0.5 ${
                        activeTab === tab.key ? 'bg-white text-dark' : `bg-${tab.color}-subtle text-${tab.color === 'success' ? 'success' : tab.color === 'warning' ? 'warning' : 'danger'}`
                      }`}
                      style={{ fontSize: '0.7rem' }}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="card-body p-3 p-md-4">

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* TAB 1: ACTIVE GATE CHECK-IN */}
          {/* ════════════════════════════════════════════════════════════════ */}
          {activeTab === 'checkin' && (
            <div className="row g-4">

              {/* 1. Search Pre-Registered Visitors */}
              <div className="col-lg-7">
                <VisitorLookupSearch onCheckIn={handleCheckIn} checkInLoading={mutationLoading} />
              </div>

              {/* 2. Walk-In Approved Visitors Ready for Gate Check-In */}
              <div className="col-lg-5">
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                  <div className="card-header bg-white border-bottom border-light-subtle px-4 py-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="d-flex align-items-center justify-content-center rounded-3"
                          style={{ width: '40px', height: '40px', backgroundColor: '#16a34a' }}
                        >
                          <BadgeCheck size={20} className="text-white" />
                        </div>
                        <div>
                          <h6 className="fw-bold mb-0" style={{ fontSize: '0.95rem', color: '#1a1f36' }}>
                            Walk-In Approved
                          </h6>
                          <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>
                            Residents approved, waiting at gate
                          </p>
                        </div>
                      </div>
                      {approvedItems.length > 0 && (
                        <span className="badge bg-success text-white rounded-pill px-2.5 py-1" style={{ fontSize: '0.7rem' }}>
                          {approvedItems.length} Ready
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="card-body p-4">
                    {approvedItems.length === 0 ? (
                      <div className="text-center py-5 rounded-3" style={{ backgroundColor: '#f9fafb' }}>
                        <div
                          className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                          style={{ width: '56px', height: '56px', backgroundColor: '#e5e7eb' }}
                        >
                          <UserCheck size={24} className="text-muted" />
                        </div>
                        <p className="fw-semibold text-dark mb-1" style={{ fontSize: '0.875rem' }}>No walk-in visitors waiting</p>
                        <p className="text-muted mb-0" style={{ fontSize: '0.78rem' }}>Approved walk-ins will appear here</p>
                      </div>
                    ) : (
                      <div className="d-flex flex-column gap-2">
                        {approvedItems.map((visitor) => (
                          <div
                            key={visitor.id}
                            className="card border rounded-3 p-0 shadow-xs overflow-hidden"
                            style={{ borderColor: '#dcfce7', backgroundColor: '#f0fdf4' }}
                          >
                            <div className="d-flex align-items-center gap-3 p-3">
                              {visitor.photoUrl ? (
                                <img
                                  src={visitor.photoUrl}
                                  alt={visitor.name}
                                  className="rounded-2 flex-shrink-0 object-fit-cover border"
                                  style={{ width: '44px', height: '44px', borderColor: '#bbf7d0' }}
                                />
                              ) : (
                                <div
                                  className="rounded-2 flex-shrink-0 d-flex align-items-center justify-content-center"
                                  style={{ width: '44px', height: '44px', backgroundColor: '#dcfce7' }}
                                >
                                  <User size={18} className="text-success" />
                                </div>
                              )}

                              <div className="flex-grow-1 min-w-0">
                                <div className="d-flex align-items-center gap-2 mb-0.5">
                                  <h6 className="fw-bold mb-0 text-truncate" style={{ fontSize: '0.85rem', color: '#1a1f36' }}>
                                    {visitor.name}
                                  </h6>
                                  {visitor.apartment && (
                                    <span className="badge bg-white text-dark font-monospace flex-shrink-0" style={{ fontSize: '0.65rem', border: '1px solid #bbf7d0' }}>
                                      {visitor.apartment.block}-{visitor.apartment.floorNumber}{visitor.apartment.unitNumber}
                                    </span>
                                  )}
                                </div>
                                <div className="d-flex align-items-center gap-2 flex-wrap" style={{ fontSize: '0.75rem' }}>
                                  <span className="text-muted d-inline-flex align-items-center gap-1">
                                    <Phone size={11} /> {visitor.phone}
                                  </span>
                                  <span className="text-muted">&middot;</span>
                                  <span className="text-muted d-inline-flex align-items-center gap-1">
                                    <MapPin size={11} /> {visitor.purpose}
                                  </span>
                                  {visitor.vehicleNumber && (
                                    <>
                                      <span className="text-muted">&middot;</span>
                                      <span className="text-muted d-inline-flex align-items-center gap-1 font-monospace">
                                        <Car size={11} /> {visitor.vehicleNumber}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>

                              <button
                                type="button"
                                disabled={mutationLoading && actionId === visitor.id}
                                className="btn btn-sm fw-semibold px-3 py-2 d-inline-flex align-items-center gap-2 flex-shrink-0 rounded-2"
                                onClick={() => setSelectedApprovedVisitor(visitor)}
                                style={{ backgroundColor: '#16a34a', color: '#fff', fontSize: '0.8rem', minWidth: '95px' }}
                              >
                                {mutationLoading && actionId === visitor.id ? (
                                  <span className="spinner-border spinner-border-sm" role="status" />
                                ) : (
                                  <>
                                    <Camera size={15} className="me-1.5" />
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
              </div>

            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* TAB 2: APPROVAL QUEUE */}
          {/* ════════════════════════════════════════════════════════════════ */}
          {activeTab === 'queue' && (
            <div className="d-flex flex-column gap-4">
              <div>
                <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2 border-light-subtle">
                  <h6 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2" style={{ fontSize: '0.95rem' }}>
                    <Clock size={20} className="text-warning" />
                    Awaiting Resident Approval
                  </h6>
                  {pendingCount > 0 && (
                    <span className="badge bg-warning text-dark" style={{ fontSize: '0.75rem' }}>
                      10m Expiry Limit
                    </span>
                  )}
                </div>

                {pendingLoading ? (
                  <div className="d-flex flex-column gap-2">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <div key={i} className="skeleton" style={{ width: '100%', height: '72px', borderRadius: '8px' }} />
                    ))}
                  </div>
                ) : pendingCount === 0 ? (
                  <div className="text-center py-5 bg-light rounded-3 border border-light-subtle">
                    <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '64px', height: '64px', backgroundColor: '#e2e8f0' }}>
                      <Clock size={28} className="text-muted" />
                    </div>
                    <p className="fw-semibold text-dark mb-1" style={{ fontSize: '0.9rem' }}>No visitors awaiting approval</p>
                    <p className="text-muted small mb-0">Walk-in visitor requests will appear here in real-time</p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {pendingVisitors!.items.map((visitor) => {
                      const reqTime = visitor.approvalRequestedAt || visitor.createdAt;
                      const elapsedMs = reqTime ? now - new Date(reqTime).getTime() : 0;
                      const isExpired = elapsedMs > 10 * 60 * 1000;
                      const optimisticChoice = optimisticDecisions[visitor.id];
                      const progressPct = Math.min((elapsedMs / (10 * 60 * 1000)) * 100, 100);

                      return (
                        <div
                          key={visitor.id}
                          className="card border border-light-subtle rounded-3 p-3 shadow-sm"
                        >
                          <div className="d-flex flex-row align-items-center justify-content-between flex-wrap gap-2">
                            <div className="d-flex align-items-center gap-3 min-w-0 flex-grow-1">
                              {visitor.photoUrl ? (
                                <img
                                  src={visitor.photoUrl}
                                  alt={visitor.name}
                                  className="rounded-2 flex-shrink-0 object-fit-cover border"
                                  style={{ width: '44px', height: '44px' }}
                                />
                              ) : (
                                <div
                                  className="rounded-2 flex-shrink-0 d-flex align-items-center justify-content-center"
                                  style={{ width: '44px', height: '44px', backgroundColor: '#fef3c7' }}
                                >
                                  <UserPlus size={18} className="text-warning" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="fw-semibold mb-0 text-truncate" style={{ fontSize: '0.875rem', color: '#1a1f36' }}>
                                  {visitor.name}
                                </p>
                                <p className="mb-0 text-secondary text-truncate" style={{ fontSize: '0.78rem' }}>
                                  {visitor.apartment ? `${visitor.apartment.block}-${visitor.apartment.floorNumber}${visitor.apartment.unitNumber}` : `Unit #${visitor.apartmentId}`}
                                  &middot; {visitor.purpose}
                                  {reqTime && (
                                    <>
                                      {' '}&middot; <Clock size={11} style={{ marginBottom: '1px' }} /> {timeAgo(reqTime, now)}
                                    </>
                                  )}
                                </p>
                                {!isExpired && reqTime && (
                                  <div className="mt-1" style={{ width: '120px', height: '3px', backgroundColor: '#e5e7eb', borderRadius: '2px' }}>
                                    <div
                                      style={{
                                        width: `${progressPct}%`,
                                        height: '100%',
                                        backgroundColor: progressPct > 70 ? '#ef4444' : progressPct > 40 ? '#f59e0b' : '#22c55e',
                                        borderRadius: '2px',
                                        transition: 'width 1s linear'
                                      }}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="d-flex align-items-center gap-2 ms-auto flex-shrink-0">
                              {optimisticChoice === 'Approve' ? (
                                <span className="badge bg-success text-white px-2.5 py-1" style={{ fontSize: '0.72rem' }}>
                                  <Check size={12} className="me-1" /> Approved
                                </span>
                              ) : optimisticChoice === 'Reject' ? (
                                <span className="badge bg-danger text-white px-2.5 py-1" style={{ fontSize: '0.72rem' }}>
                                  <X size={12} className="me-1" /> Rejected
                                </span>
                              ) : isExpired ? (
                                <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2.5 py-1" style={{ fontSize: '0.72rem' }}>
                                  Expired
                                </span>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-success fw-semibold px-2.5 py-1 d-inline-flex align-items-center gap-1 shadow-sm"
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
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* TAB 3: DENIED LOG */}
          {/* ════════════════════════════════════════════════════════════════ */}
          {activeTab === 'denied' && (
            <div className="d-flex flex-column gap-4">
              <div>
                <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2 border-light-subtle">
                  <h6 className="fw-bold mb-0 text-danger d-flex align-items-center gap-2" style={{ fontSize: '0.95rem' }}>
                    <XCircle size={20} />
                    Denied Entry Log
                  </h6>
                  <span className="badge bg-danger-subtle text-danger border border-danger-subtle" style={{ fontSize: '0.75rem' }}>
                    {rejectedItems.length} Denied
                  </span>
                </div>

                {rejectedItems.length === 0 ? (
                  <div className="text-center py-5 bg-light rounded-3 border border-light-subtle">
                    <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '64px', height: '64px', backgroundColor: '#e2e8f0' }}>
                      <XCircle size={28} className="text-muted" />
                    </div>
                    <p className="fw-semibold text-dark mb-1" style={{ fontSize: '0.9rem' }}>No rejected visitors</p>
                    <p className="text-muted small mb-0">Visitors denied entry will be recorded here</p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {rejectedItems.map((visitor) => (
                      <div
                        key={visitor.id}
                        className="card border border-danger-subtle rounded-3 p-3 shadow-sm"
                        style={{ backgroundColor: '#fef2f2' }}
                      >
                        <div className="d-flex flex-row align-items-center justify-content-between gap-3">
                          <div className="d-flex align-items-center gap-3 min-w-0 flex-grow-1">
                            {visitor.photoUrl ? (
                              <img
                                src={visitor.photoUrl}
                                alt={visitor.name}
                                className="rounded-2 flex-shrink-0 object-fit-cover border border-danger-subtle"
                                style={{ width: '44px', height: '44px' }}
                              />
                            ) : (
                              <div
                                className="rounded-2 flex-shrink-0 d-flex align-items-center justify-content-center"
                                style={{ width: '44px', height: '44px', backgroundColor: '#fee2e2' }}
                              >
                                <User size={18} className="text-danger" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="d-flex align-items-center gap-2 mb-1">
                                <h6 className="fw-bold text-dark mb-0 text-truncate" style={{ fontSize: '0.875rem' }}>
                                  {visitor.name}
                                </h6>
                                <span className="badge bg-danger text-white rounded-pill" style={{ fontSize: '0.65rem' }}>
                                  Denied
                                </span>
                              </div>
                              <p className="text-secondary mb-0" style={{ fontSize: '0.78rem' }}>
                                <span className="d-inline-flex align-items-center gap-1">
                                  <Phone size={12} /> {visitor.phone}
                                </span>
                                <span className="mx-1">&middot;</span>
                                <span>{visitor.purpose}</span>
                                {visitor.apartment && (
                                  <>
                                    <span className="mx-1">&middot;</span>
                                    <span className="font-monospace">{visitor.apartment.block}-{visitor.apartment.floorNumber}{visitor.apartment.unitNumber}</span>
                                  </>
                                )}
                              </p>
                            </div>
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

      {/* ── Confirmation Dialog for Approve/Reject ── */}
      {confirmAction && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              <div className="modal-body p-4 text-center">
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{
                    width: '56px', height: '56px',
                    backgroundColor: confirmAction.decision === 'Approve' ? '#dcfce7' : '#fee2e2'
                  }}
                >
                  {confirmAction.decision === 'Approve' ? (
                    <BadgeCheck size={28} className="text-success" />
                  ) : (
                    <ShieldCheck size={28} className="text-danger" />
                  )}
                </div>
                <h6 className="fw-bold text-dark mb-2">
                  {confirmAction.decision === 'Approve' ? 'Approve Entry?' : 'Reject Entry?'}
                </h6>
                <p className="text-muted mb-3" style={{ fontSize: '0.85rem' }}>
                  {confirmAction.decision === 'Approve'
                    ? 'This will grant the visitor access to the premises.'
                    : 'This will deny the visitor access. They will be logged as rejected.'}
                </p>
              </div>
              <div className="modal-footer border-0 px-4 pb-4 pt-0 d-flex justify-content-center gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary px-3"
                  onClick={() => setConfirmAction(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`btn fw-semibold px-4 d-inline-flex align-items-center gap-2 ${
                    confirmAction.decision === 'Approve' ? 'btn-success' : 'btn-danger'
                  }`}
                  onClick={confirmSecurityDecision}
                >
                  {confirmAction.decision === 'Approve' ? (
                    <>
                      <Check size={16} /> Approve
                    </>
                  ) : (
                    <>
                      <X size={16} /> Reject
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Log Walk-In Visitor Modal ── */}
      {walkInModalOpen && (
        <div className="modal d-block bg-dark bg-opacity-50" style={{ backdropFilter: 'blur(4px)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-3 shadow-lg bg-white">
              <div className="modal-header d-flex align-items-start justify-content-between border-bottom border-light-subtle px-4 py-4 position-relative">
                <div>
                  <h5 className="modal-title fw-bold m-0 text-dark" style={{ fontSize: '1rem', color: '#1a1f36' }}>
                    Log Walk-In Visitor
                  </h5>
                  <p className="text-muted m-0 small" style={{ fontSize: '0.8rem' }}>
                    Log an unregistered visitor and request apartment resident entry approval.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn position-absolute d-flex align-items-center justify-content-center p-0 text-secondary"
                  style={{ top: 22, right: 22, width: 28, height: 28, border: '1px solid #e9ecef', background: '#fff', fontSize: '1.1rem', borderRadius: '6px' }}
                  onClick={() => setWalkInModalOpen(false)}
                  aria-label="Close"
                >
                  <i className="bi bi-x" />
                </button>
              </div>
              <div className="modal-body px-4 py-3">
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

      {/* ── Check-In Photo Capture Modal for Approved Visitors ── */}
      <CheckInPhotoModal
        show={selectedApprovedVisitor !== null}
        visitor={selectedApprovedVisitor}
        loading={mutationLoading && actionId === selectedApprovedVisitor?.id}
        onClose={() => setSelectedApprovedVisitor(null)}
        onConfirm={async (_visitorId, photo) => {
          if (selectedApprovedVisitor) {
            await handleCheckIn(selectedApprovedVisitor, photo);
            setSelectedApprovedVisitor(null);
          }
        }}
      />

    </div>
  );
};

export default CheckInPage;
