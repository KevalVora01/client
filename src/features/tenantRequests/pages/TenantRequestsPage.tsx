import { useNavigate } from 'react-router-dom';
import { ClipboardList, ChevronRight } from 'lucide-react';
import useTenantRequests from '../hooks/useTenantRequests';
import type { TenantRequestStatus } from '../types/tenantRequest.types';
import Pagination from '../../../components/Pagination/Pagination';

const STATUS_TABS: (TenantRequestStatus | 'All')[] = ['All', 'Pending', 'Approved', 'Rejected'];

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { label: string; bg: string; color: string }> = {
    Pending: { label: 'Pending', bg: '#fef3c7', color: '#92400e' },
    Approved: { label: 'Approved', bg: '#dcfce7', color: '#166534' },
    Rejected: { label: 'Rejected', bg: '#fee2e2', color: '#991b1b' },
  };
  const s = map[status] ?? map.Pending;
  return (
    <span className="fw-semibold px-2 py-1 rounded-2" style={{ backgroundColor: s.bg, color: s.color, fontSize: '0.78rem' }}>
      {s.label}
    </span>
  );
};

const TenantRequestsPage = () => {
  const navigate = useNavigate();
  const { requests, pagination, filters, loading, updateFilters, changePage } = useTenantRequests();

  return (
    <div className="container-fluid p-3 p-md-4 max-w-100 mx-auto">

      {/* ── Header ── */}
      <div className="mb-4">
        <h4 className="fw-bold mb-1" style={{ fontSize: '1.4rem', color: '#1a1f36' }}>
          Tenant Requests
        </h4>
        <p className="text-secondary mt-2 mb-0 small">
          Review owner-submitted tenant requests, record committee votes, and finalize decisions.
        </p>
      </div>

      {/* ── Status filter tabs ── */}
      <div className="d-flex gap-2 flex-wrap mb-3">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => updateFilters({ status: tab })}
            className="btn btn-sm fw-semibold rounded-pill"
            style={{
              backgroundColor: filters.status === tab ? '#111827' : '#fff',
              color: filters.status === tab ? '#fff' : '#374151',
              border: '1px solid #e5e7eb',
              fontSize: '0.82rem',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Table card ── */}
      <div className="card bg-white border border-light-subtle rounded-3 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                <th className="fw-semibold px-4">#</th>
                <th className="fw-semibold">Apartment</th>
                <th className="fw-semibold">Tenant</th>
                <th className="fw-semibold">Move-in</th>
                <th className="fw-semibold">Status</th>
                <th className="fw-semibold text-end px-4"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-4 py-3">
                      <div className="skeleton" style={{ height: 20, borderRadius: 6 }} />
                    </td>
                  </tr>
                ))
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-5">
                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light mb-2" style={{ width: '48px', height: '48px' }}>
                      <ClipboardList size={22} className="text-secondary" />
                    </div>
                    <p className="fw-semibold text-dark mb-0" style={{ fontSize: '0.9rem' }}>No tenant requests</p>
                    <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>Requests from apartment owners will appear here.</p>
                  </td>
                </tr>
              ) : (
                requests.map((r) => (
                  <tr
                    key={r.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/tenant-requests/${r.id}`)}
                  >
                    <td className="px-4 text-muted">{r.id}</td>
                    <td className="fw-medium text-dark">
                      {r.apartment
                        ? `${r.apartment.block}-${r.apartment.floorNumber}${r.apartment.unitNumber}`
                        : `Apt #${r.apartmentId}`}
                    </td>
                    <td>
                      <div className="fw-semibold text-dark" style={{ fontSize: '0.88rem' }}>{r.tenantName}</div>
                      <div className="text-muted" style={{ fontSize: '0.78rem' }}>{r.tenantEmail}</div>
                    </td>
                    <td className="text-muted" style={{ fontSize: '0.85rem' }}>{new Date(r.moveInDate).toLocaleDateString()}</td>
                    <td><StatusBadge status={r.status} /></td>
                    <td className="text-end px-4">
                      <ChevronRight size={18} className="text-secondary" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="card-footer bg-white border-top border-light-subtle p-3 d-flex justify-content-end">
          <Pagination
            pagination={pagination}
            onPageChange={changePage}
            onPageSizeChange={(size) => updateFilters({ pageSize: size })}
          />
        </div>
      </div>
    </div>
  );
};

export default TenantRequestsPage;
