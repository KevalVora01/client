import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserCheck, Mail, Phone, Calendar, Check, X, Gavel, Ban, UserPlus, Building2 } from 'lucide-react';
import useTenantRequestDetail from '../hooks/useTenantRequestDetail';
import useAuth from '../../../hooks/useAuth';
import ConfirmDialog from '../../../components/ConfirmDialog/ConfirmDialog';
import type { TenantRequestVote, CommitteeMember, VoteChoice } from '../types/tenantRequest.types';

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { label: string; bg: string; color: string }> = {
    Pending: { label: 'Pending', bg: '#fef3c7', color: '#92400e' },
    Approved: { label: 'Approved', bg: '#dcfce7', color: '#166534' },
    Rejected: { label: 'Rejected', bg: '#fee2e2', color: '#991b1b' },
  };
  const s = map[status] ?? map.Pending;
  return (
    <span className="badge-pill" style={{ backgroundColor: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
};

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
  tag: string | null;
  draft: string | null | undefined;
  pending: boolean;
  actionLoading: boolean;
  onVote: (choice: VoteChoice) => void;
}) => (
  <div className="d-flex align-items-center justify-content-between p-3 rounded-3 border border-light-subtle">
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
          disabled={actionLoading}
          onClick={() => onVote('Approve' as VoteChoice)}
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
          disabled={actionLoading}
          onClick={() => onVote('Reject' as VoteChoice)}
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

const formatDetailedDate = (dateString: string | Date, includeTime = true): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '—';

  const day = date.getDate();
  const year = date.getFullYear();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const month = monthNames[date.getMonth()];

  let suffix = 'th';
  if (day === 1 || day === 21 || day === 31) {
    suffix = 'st';
  } else if (day === 2 || day === 22) {
    suffix = 'nd';
  } else if (day === 3 || day === 23) {
    suffix = 'rd';
  }

  const datePart = `${day}${suffix} ${month}, ${year}`;
  if (!includeTime) {
    return datePart;
  }

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;

  return `${datePart}, ${hours}:${minutesStr} ${ampm}`;
};

const TenantRequestDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const requestId = Number(id);
  const { data, loading, actionLoading, draftVotes, draftAdminVote, setMemberVote, setAdminVote, finalize, isAdmin } = useTenantRequestDetail(requestId);
  const { user } = useAuth();
  const [showFinalizeConfirm, setShowFinalizeConfirm] = useState(false);

  if (loading || !data) {
    return (
      <div className="page">
        <div className="skeleton skeleton--title" />
        <div className="skeleton skeleton--subtitle" />
        <div className="info-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="info-card">
              <div className="skeleton skeleton--label" />
              <div className="skeleton skeleton--value" />
            </div>
          ))}
        </div>
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

  const infoCards = [
    { icon: UserPlus, label: 'Requester', value: request.owner?.user?.name ?? `Owner #${request.requestedBy}`, accent: 'info-card--blue' },
    { icon: Building2, label: 'Apartment', value: request.apartment ? `${request.apartment.block}-${request.apartment.floorNumber}${request.apartment.unitNumber}` : `Apt #${request.apartmentId}`, accent: 'info-card--green' },
    { icon: Calendar, label: 'Move-in', value: formatDetailedDate(request.moveInDate, false), accent: 'info-card--purple' },
    { icon: Calendar, label: 'Submitted', value: formatDetailedDate(request.createdAt), accent: 'info-card--amber' },
  ];

  return (
    <div className="page">

      <button className="back-btn" onClick={() => navigate('/tenant-requests')}>
        <ArrowLeft size={16} strokeWidth={2} />
        Back to requests
      </button>

      {/* ── Result banner (after decision) ── */}
      {!isPending && (
        <div
          className="d-flex align-items-center gap-2 px-4 py-3 rounded-3"
          style={{
            backgroundColor: request.status === 'Approved' ? '#ecfdf5' : '#fef2f2',
            border: `1px solid ${request.status === 'Approved' ? '#a7f3d0' : '#fecaca'}`,
            color: request.status === 'Approved' ? '#065f46' : '#991b1b',
            fontSize: '0.9rem',
          }}
        >
          {request.status === 'Approved' ? <UserCheck size={18} /> : <Ban size={18} />}
          This request was {request.status.toLowerCase()} on {request.decidedAt ? formatDetailedDate(request.decidedAt) : '—'}.
        </div>
      )}

      {/* ── Header ── */}
      <div className="detail-header">
        <div className="detail-header__left">
          <div
            className="rounded-circle fw-bold d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: 56, height: 56, fontSize: '1rem', background: '#eef2ff', color: '#4338ca' }}
          >
            {request.tenantName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="detail-header__name-row">
              <h4 className="detail-header__name">{request.tenantName}</h4>
              <StatusBadge status={request.status} />
            </div>
            <div className="detail-header__meta">
              <span><Mail size={13} strokeWidth={1.75} /> {request.tenantEmail}</span>
              <span><Phone size={13} strokeWidth={1.75} /> {request.tenantPhone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Info cards ── */}
      <div className="info-grid">
        {infoCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className={`info-card ${card.accent}`}>
              <div className="info-card__icon-box">
                <Icon size={18} strokeWidth={1.75} />
              </div>
              <div>
                <p className="info-card__label">{card.label}</p>
                <p className="info-card__value">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Committee Voting ── */}
      <div className="section-card">
        <div className="section-card__header d-flex align-items-center gap-2">
          <Gavel size={18} />
          <h6 className="section-card__title mb-0">Committee Votes</h6>
        </div>
        <div className="p-4">
          {committeeMembers.length === 0 ? (
            <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>No committee members available to vote.</p>
          ) : (
            <>
              {/* ── Vote progress ── */}
              {isPending && (
                <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom border-light-subtle">
                  <div className="d-flex align-items-center gap-3">
                    <span className="d-flex align-items-center gap-1" style={{ fontSize: '0.82rem', color: '#166534' }}>
                      <Check size={14} /> <span className="fw-semibold">{Object.values(draftVotes).filter(v => v === 'Approve').length + (draftAdminVote === 'Approve' ? 1 : 0)}</span> Approved
                    </span>
                    <span className="d-flex align-items-center gap-1" style={{ fontSize: '0.82rem', color: '#991b1b' }}>
                      <X size={14} /> <span className="fw-semibold">{Object.values(draftVotes).filter(v => v === 'Reject').length + (draftAdminVote === 'Reject' ? 1 : 0)}</span> Rejected
                    </span>
                    <span className="text-muted d-flex align-items-center gap-1" style={{ fontSize: '0.82rem' }}>
                      <span className="fw-semibold">{committeeMembers.length + (isAdmin ? 1 : 0) - Object.values(draftVotes).filter(Boolean).length - (draftAdminVote ? 1 : 0)}</span> Not yet voted
                    </span>
                  </div>
                  <div style={{ width: '120px', height: '6px', background: '#f3f4f6', borderRadius: '99px', overflow: 'hidden' }}>
                    {(() => {
                      const approved = Object.values(draftVotes).filter(v => v === 'Approve').length + (draftAdminVote === 'Approve' ? 1 : 0);
                      const rejected = Object.values(draftVotes).filter(v => v === 'Reject').length + (draftAdminVote === 'Reject' ? 1 : 0);
                      const total = committeeMembers.length + (isAdmin ? 1 : 0);
                      const approvedW = total ? (approved / total * 100) : 0;
                      const rejectedW = total ? (rejected / total * 100) : 0;
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
              <div className="d-flex flex-column gap-2">
                {committeeMembers.map((m: CommitteeMember) => {
                  const existing = voteForMember(m.id);
                  const draft = draftVotes[m.id] ?? existing?.vote;
                  return (
                    <VoterRow
                      key={m.id}
                      name={m.user?.name ?? 'Committee Member'}
                      email={m.user?.email ?? '—'}
                      tag={null}
                      draft={draft}
                      pending={isPending}
                      actionLoading={actionLoading}
                      onVote={(choice) => setMemberVote(m.id, choice)}
                    />
                  );
                })}

                {/* ── Admin vote ── */}
                {((isAdmin && isPending) || draftAdminVote || adminVote?.vote) && (
                  <VoterRow
                    name={user?.name ?? 'Admin'}
                    email={user?.email ?? '—'}
                    tag="Admin"
                    draft={draftAdminVote ?? adminVote?.vote}
                    pending={isPending}
                    actionLoading={actionLoading}
                    onVote={(choice) => setAdminVote(choice)}
                  />
                )}
              </div>

              {/* ── Finalize button ── */}
              {isPending && (
                <div className="d-flex justify-content-end mt-3">
                  <button
                    disabled={actionLoading}
                    onClick={handleFinalize}
                    className="btn fw-bold d-flex align-items-center justify-content-center gap-2"
                    style={{ backgroundColor: '#111827', color: '#fff', height: '38px', borderRadius: '8px', paddingInline: '20px', fontSize: '0.85rem' }}
                  >
                    {actionLoading ? <span className="spinner-border spinner-border-sm" /> : <Gavel size={16} />}
                    {actionLoading ? 'Saving…' : 'Save Votes'}
                  </button>
                </div>
              )}


            </>
          )}
        </div>
      </div>

      <ConfirmDialog
        show={showFinalizeConfirm}
        title="Finalize Request"
        message="All recorded votes will be saved and this tenant request will be finalized. This action cannot be undone."
        confirmLabel="Finalize"
        variant="info"
        loading={actionLoading}
        onConfirm={confirmFinalize}
        onCancel={() => setShowFinalizeConfirm(false)}
      />
    </div>
  );
};

export default TenantRequestDetailPage;
