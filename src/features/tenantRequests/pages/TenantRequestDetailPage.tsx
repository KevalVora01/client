import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, UserCheck, Mail, Phone, Calendar, Check, X, Gavel, Ban, UserPlus } from 'lucide-react';
import useTenantRequestDetail from '../hooks/useTenantRequestDetail';
import useAuth from '../../../hooks/useAuth';
import ConfirmModal from '../components/ConfirmModal';
import type { TenantRequestVote, CommitteeMember, VoteChoice } from '../types/tenantRequest.types';

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { label: string; bg: string; color: string }> = {
    Pending: { label: 'Pending', bg: '#fef3c7', color: '#92400e' },
    Approved: { label: 'Approved', bg: '#dcfce7', color: '#166534' },
    Rejected: { label: 'Rejected', bg: '#fee2e2', color: '#991b1b' },
  };
  const s = map[status] ?? map.Pending;
  return (
    <span className="fw-semibold px-2 py-1 rounded-2" style={{ backgroundColor: s.bg, color: s.color, fontSize: '0.8rem' }}>
      {s.label}
    </span>
  );
};

const InfoRow = ({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) => (
  <div className="d-flex align-items-center gap-2 mb-2">
    <Icon size={16} className="text-muted flex-shrink-0" />
    <span className="text-muted" style={{ fontSize: '0.82rem', minWidth: '70px' }}>{label}</span>
    <span className="fw-medium text-dark" style={{ fontSize: '0.88rem' }}>{value}</span>
  </div>
);

const TenantRequestDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const requestId = Number(id);
  const { data, loading, actionLoading, draftVotes, draftAdminVote, setMemberVote, setAdminVote, finalize, isAdmin } = useTenantRequestDetail(requestId);
  const { user } = useAuth();
  const [showFinalizeConfirm, setShowFinalizeConfirm] = useState(false);

  if (loading || !data) {
    return (
      <div className="container-fluid p-3 p-md-4">
        <div className="skeleton mx-auto" style={{ height: '60vh', borderRadius: 12, maxWidth: 900 }} />
      </div>
    );
  }

  const request = data;
  const { votes, committeeMembers } = data;
  const isPending = request.status === 'Pending';

  const voteForMember = (memberId: number) =>
    votes.find((v: TenantRequestVote) => v.committeeMemberId === memberId);
  const adminVote = votes.find((v: TenantRequestVote) => !v.committeeMemberId);

  const handleFinalize = async () => {
    setShowFinalizeConfirm(true);
  };

  const confirmFinalize = async () => {
    setShowFinalizeConfirm(false);
    try {
      await finalize();
    } catch {
      /* toast handles error */
    }
  };

  return (
    <div className="container-fluid p-3 p-md-4 max-w-100 mx-auto" style={{ maxWidth: 960 }}>

      {/* ── Back ── */}
      <Link to="/tenant-requests" className="btn btn-light border border-light-subtle btn-sm d-inline-flex align-items-center gap-1 mb-3" style={{ fontSize: '0.82rem' }}>
        <ArrowLeft size={16} /> Back to requests
      </Link>

      {/* ── Result banner (after decision) ── */}
      {!isPending && (
        <div
          className="alert d-flex align-items-center gap-2 mb-3"
          style={{
            backgroundColor: request.status === 'Approved' ? '#ecfdf5' : '#fef2f2',
            border: `1px solid ${request.status === 'Approved' ? '#a7f3d0' : '#fecaca'}`,
            color: request.status === 'Approved' ? '#065f46' : '#991b1b',
            fontSize: '0.9rem',
          }}
        >
          {request.status === 'Approved' ? <UserCheck size={18} /> : <Ban size={18} />}
          This request was {request.status.toLowerCase()} on {request.decidedAt ? new Date(request.decidedAt).toLocaleString() : '—'}.
        </div>
      )}

      <div className="row g-3">
        {/* ── Request details ── */}
        <div className="col-lg-5">
          <div className="card bg-white border border-light-subtle rounded-3 shadow-sm">
            <div className="card-header bg-white border-bottom border-light-subtle px-4 py-3 d-flex align-items-center justify-content-between">
              <h6 className="fw-bold mb-0" style={{ color: '#1a1f36' }}>Request Details</h6>
              <StatusBadge status={request.status} />
            </div>
            <div className="card-body px-4 py-3">
              <InfoRow icon={UserPlus} label="Tenant" value={request.tenantName} />
              <InfoRow icon={Mail} label="Email" value={request.tenantEmail} />
              <InfoRow icon={Phone} label="Phone" value={request.tenantPhone} />
              <InfoRow icon={Calendar} label="Move-in" value={new Date(request.moveInDate).toLocaleDateString()} />
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="text-muted" style={{ fontSize: '0.82rem', minWidth: '70px' }}>Apartment</span>
                <span className="fw-medium text-dark" style={{ fontSize: '0.88rem' }}>
                  {request.apartment
                    ? `${request.apartment.block}-${request.apartment.floorNumber}${request.apartment.unitNumber}`
                    : `Apt #${request.apartmentId}`}
                </span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="text-muted" style={{ fontSize: '0.82rem', minWidth: '70px' }}>Submitted</span>
                <span className="fw-medium text-dark" style={{ fontSize: '0.88rem' }}>{new Date(request.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Committee voting ── */}
        <div className="col-lg-7">
          <div className="card bg-white border border-light-subtle rounded-3 shadow-sm">
            <div className="card-header bg-white border-bottom border-light-subtle px-4 py-3">
              <h6 className="fw-bold mb-0 d-flex align-items-center gap-2" style={{ color: '#1a1f36' }}>
                <Gavel size={18} /> Committee Votes
              </h6>
            </div>
            <div className="card-body px-4 py-3">
              {committeeMembers.length === 0 ? (
                <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>No committee members available to vote.</p>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {committeeMembers.map((m: CommitteeMember) => {
                    const existing = voteForMember(m.id);
                    const draft = draftVotes[m.id] ?? existing?.vote;
                    return (
                      <div key={m.id} className="d-flex align-items-center justify-content-between p-3 rounded-3 border border-light-subtle">
                        <div>
                          <div className="fw-semibold text-dark" style={{ fontSize: '0.9rem' }}>{m.user?.name ?? 'Committee Member'}</div>
                          <div className="text-muted" style={{ fontSize: '0.78rem' }}>{m.user?.email ?? '—'}</div>
                          {draft && (
                            <span className="badge mt-1" style={{
                              backgroundColor: draft === 'Approve' ? '#dcfce7' : '#fee2e2',
                              color: draft === 'Approve' ? '#166534' : '#991b1b',
                              fontSize: '0.72rem',
                            }}>
                              Voted: {draft}
                            </span>
                          )}
                        </div>
                        {isPending ? (
                          <div className="d-flex gap-2 flex-shrink-0">
                            <button
                              disabled={actionLoading}
                              onClick={() => setMemberVote(m.id, 'Approve' as VoteChoice)}
                              className="btn btn-sm d-flex align-items-center gap-1 fw-semibold"
                              style={{
                                backgroundColor: draft === 'Approve' ? '#166534' : '#dcfce7',
                                color: draft === 'Approve' ? '#fff' : '#166534',
                                border: '1px solid #a7f3d0',
                              }}
                            >
                              <Check size={15} /> Approve
                            </button>
                            <button
                              disabled={actionLoading}
                              onClick={() => setMemberVote(m.id, 'Reject' as VoteChoice)}
                              className="btn btn-sm d-flex align-items-center gap-1 fw-semibold"
                              style={{
                                backgroundColor: draft === 'Reject' ? '#991b1b' : '#fee2e2',
                                color: draft === 'Reject' ? '#fff' : '#991b1b',
                                border: '1px solid #fecaca',
                              }}
                            >
                              <X size={15} /> Reject
                            </button>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ── Admin vote (same card style as committee members) ── */}
              {isAdmin && isPending && (
                <div className="d-flex align-items-center justify-content-between p-3 rounded-3 border border-light-subtle">
                  <div>
                    <div className="fw-semibold text-dark" style={{ fontSize: '0.9rem' }}>
                      {user?.name ?? 'Admin'} <span className="text-muted" style={{ fontWeight: 400, fontSize: '0.78rem' }}>(Admin)</span>
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.78rem' }}>{user?.email ?? '—'}</div>
                    {(draftAdminVote ?? adminVote?.vote) && (
                      <span
                        className="badge mt-1"
                        style={{
                          backgroundColor: (draftAdminVote ?? adminVote?.vote) === 'Approve' ? '#dcfce7' : '#fee2e2',
                          color: (draftAdminVote ?? adminVote?.vote) === 'Approve' ? '#166534' : '#991b1b',
                          fontSize: '0.72rem',
                        }}
                      >
                        Voted: {draftAdminVote ?? adminVote?.vote}
                      </span>
                    )}
                  </div>
                  <div className="d-flex gap-2 flex-shrink-0">
                    <button
                      disabled={actionLoading}
                      onClick={() => setAdminVote('Approve' as VoteChoice)}
                      className="btn btn-sm d-flex align-items-center gap-1 fw-semibold"
                      style={{
                        backgroundColor: (draftAdminVote ?? adminVote?.vote) === 'Approve' ? '#166534' : '#dcfce7',
                        color: (draftAdminVote ?? adminVote?.vote) === 'Approve' ? '#fff' : '#166534',
                        border: '1px solid #a7f3d0',
                      }}
                    >
                      <Check size={15} /> Approve
                    </button>
                    <button
                      disabled={actionLoading}
                      onClick={() => setAdminVote('Reject' as VoteChoice)}
                      className="btn btn-sm d-flex align-items-center gap-1 fw-semibold"
                      style={{
                        backgroundColor: (draftAdminVote ?? adminVote?.vote) === 'Reject' ? '#991b1b' : '#fee2e2',
                        color: (draftAdminVote ?? adminVote?.vote) === 'Reject' ? '#fff' : '#991b1b',
                        border: '1px solid #fecaca',
                      }}
                    >
                      <X size={15} /> Reject
                    </button>
                  </div>
                </div>
              )}

              {isPending && (
                <button
                  disabled={actionLoading}
                  onClick={handleFinalize}
                  className="btn w-100 fw-bold mt-3 d-flex align-items-center justify-content-center gap-2"
                  style={{ backgroundColor: '#111827', color: '#fff', height: '48px', borderRadius: '8px' }}
                >
                  {actionLoading ? <span className="spinner-border spinner-border-sm" /> : <Gavel size={18} />}
                  {actionLoading ? 'Saving votes…' : 'Save Votes & Finalize'}
                </button>
              )}

              {/* ── Recorded votes summary (after decision) ── */}
              {!isPending && votes.length > 0 && (
                <div className="mt-3">
                  <p className="fw-semibold text-dark mb-2" style={{ fontSize: '0.85rem' }}>Recorded Votes</p>
                  <div className="d-flex flex-column gap-1">
                    {votes.map((v: TenantRequestVote) => (
                      <div key={v.id} className="d-flex align-items-center justify-content-between" style={{ fontSize: '0.85rem' }}>
                        <span className="text-muted">{v.committeeMember?.user?.name ?? (v.committeeMemberId ? `Member #${v.committeeMemberId}` : 'Admin')}</span>
                        <span style={{ color: v.vote === 'Approve' ? '#166534' : '#991b1b', fontWeight: 600 }}>{v.vote}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
             </div>
           </div>
         </div>
       </div>
    <ConfirmModal
      show={showFinalizeConfirm}
      title="Finalize Request"
      message="All recorded votes will be saved and this tenant request will be finalized. This action cannot be undone."
      confirmLabel="Finalize"
      loading={actionLoading}
      onConfirm={confirmFinalize}
      onCancel={() => setShowFinalizeConfirm(false)}
    />
    </div>
  );
};

export default TenantRequestDetailPage;
