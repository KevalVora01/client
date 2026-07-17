import { useState } from 'react';
import { Home, UserPlus, UserCheck, Mail, Phone, Calendar, Clock } from 'lucide-react';
import useOwnerTenantRequest from '../hooks/useOwnerTenantRequest';
import type { SubmitTenantRequestPayload } from '../types/tenantRequest.types';

const TODAY = new Date().toISOString().split('T')[0];

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { label: string; bg: string; color: string }> = {
    Pending: { label: 'Pending', bg: '#fef3c7', color: '#92400e' },
    Approved: { label: 'Approved', bg: '#dcfce7', color: '#166534' },
    Rejected: { label: 'Rejected', bg: '#fee2e2', color: '#991b1b' },
  };
  const s = map[status] ?? map.Pending;
  return (
    <span
      className="fw-semibold px-2 py-1 rounded-2"
      style={{ backgroundColor: s.bg, color: s.color, fontSize: '0.8rem' }}
    >
      {s.label}
    </span>
  );
};

const RequestForm = ({
  loading,
  onSubmit,
}: {
  loading: boolean;
  onSubmit: (payload: SubmitTenantRequestPayload) => Promise<void>;
}) => {
  const [tenantName, setTenantName] = useState('');
  const [tenantEmail, setTenantEmail] = useState('');
  const [tenantPhone, setTenantPhone] = useState('');
  const [moveInDate, setMoveInDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!tenantName.trim()) return setError('Tenant name is required');
    if (!EMAIL_RE.test(tenantEmail)) return setError('A valid tenant email is required');
    if (!tenantPhone.trim()) return setError('Tenant phone number is required');
    if (!moveInDate) return setError('Expected move-in date is required');

    try {
      await onSubmit({ tenantName: tenantName.trim(), tenantEmail: tenantEmail.trim(), tenantPhone: tenantPhone.trim(), moveInDate });
    } catch {
      /* error surfaced via toast */
    }
  };

  const fieldStyle = {
    height: '46px',
    backgroundColor: '#f9fafb',
    borderColor: '#e5e7eb',
    fontSize: '0.95rem',
    borderRadius: '8px',
  } as const;

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Tenant Full Name</label>
          <input className="form-control shadow-none" style={fieldStyle} value={tenantName} onChange={(e) => setTenantName(e.target.value)} placeholder="Jane Doe" />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Tenant Email</label>
          <input type="email" className="form-control shadow-none" style={fieldStyle} value={tenantEmail} onChange={(e) => setTenantEmail(e.target.value)} placeholder="jane@example.com" />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Tenant Phone</label>
          <input className="form-control shadow-none" style={fieldStyle} value={tenantPhone} onChange={(e) => setTenantPhone(e.target.value)} placeholder="+91..." />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Expected Move-in Date</label>
          <input type="date" min={TODAY} className="form-control shadow-none" style={fieldStyle} value={moveInDate} onChange={(e) => setMoveInDate(e.target.value)} />
        </div>
      </div>

      {error && <div className="text-danger mt-2" style={{ fontSize: '0.85rem' }}>{error}</div>}

      <button
        type="submit"
        disabled={loading}
        className="btn w-100 fw-bold mt-3 d-flex align-items-center justify-content-center gap-2"
        style={{ backgroundColor: '#111827', color: '#fff', height: '48px', borderRadius: '8px' }}
      >
        {loading ? <span className="spinner-border spinner-border-sm" /> : <UserPlus size={18} />}
        Submit Tenant Request
      </button>
    </form>
  );
};

const TenantRequestSection = () => {
  const { status, loading, actionLoading, notOwner, submitRequest } = useOwnerTenantRequest();

  if (notOwner) return null;
  if (loading || !status) {
    return (
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body text-center py-4">
          <div className="spinner-border text-secondary" role="status" />
        </div>
      </div>
    );
  }

  const cardHeader = (
    <div className="d-flex align-items-center gap-2 mb-3">
      <div className="d-flex align-items-center justify-content-center rounded-2" style={{ width: '36px', height: '36px', backgroundColor: '#eef2ff' }}>
        <Home size={18} color="#4f46e5" />
      </div>
      <div>
        <h5 className="fw-bold mb-0" style={{ color: '#1a1f36' }}>Tenant Management</h5>
        <small className="text-muted">Request a tenant or manage the current occupant</small>
      </div>
    </div>
  );

  // ── Pending request ──────────────────────────────────────────────
  if (status.pendingRequest) {
    const r = status.pendingRequest;
    return (
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          {cardHeader}
          <div className="alert d-flex align-items-center gap-2 mb-3" style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', color: '#92400e', fontSize: '0.9rem' }}>
            <Clock size={18} /> Your tenant request is awaiting committee review.
          </div>
          <div className="mb-2"><StatusBadge status={r.status} /></div>
          <div className="mt-3">
            <div className="mb-2"><UserCheck size={16} className="me-2 text-muted" />{r.tenantName}</div>
            <div className="mb-2"><Mail size={16} className="me-2 text-muted" />{r.tenantEmail}</div>
            <div className="mb-2"><Phone size={16} className="me-2 text-muted" />{r.tenantPhone}</div>
            <div className="mb-2"><Calendar size={16} className="me-2 text-muted" />Move-in: {new Date(r.moveInDate).toLocaleDateString()}</div>
          </div>
        </div>
      </div>
    );
  }

  // ── Active tenant ────────────────────────────────────────────────
  // The current tenant (and the revoke action) is now shown in the
  // "Tenant History" section on this page, so we don't render a separate
  // card here. Returning null also keeps the request form hidden.
  if (status.activeTenant) return null;

  // ── No tenant → request form ─────────────────────────────────────
  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body">
        {cardHeader}
        <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
          This apartment has no active tenant. Submit a request for committee approval.
        </p>
        <RequestForm loading={actionLoading} onSubmit={submitRequest} />
      </div>
    </div>
  );
};

export default TenantRequestSection;
