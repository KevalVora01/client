import useTenantRequests from '../hooks/useTenantRequests';
import type { TenantRequestStatus } from '../types/tenantRequest.types';
import TenantRequestTable from '../components/TenantRequestTable';
import Pagination from '../../../components/Pagination/Pagination';

const STATUS_TABS: (TenantRequestStatus | 'All')[] = ['All', 'Pending', 'Approved', 'Rejected'];

const TenantRequestsPage = () => {
  const { requests, pagination, filters, loading, updateFilters, changePage } = useTenantRequests();

  return (
    <div className="container-fluid p-3 p-md-4">

      {/* ── Header ── */}
      <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap mb-4">
        <div>
          <h4 className="fw-bold mb-2 fs-4 fs-sm-3" style={{ color: '#1a1f36' }}>
            Tenant Requests
          </h4>
          <p className="text-muted mb-0 small">
            Review owner-submitted tenant requests, record committee votes, and finalize decisions.
          </p>
        </div>
      </div>

      {/* ── Status filter tabs ── */}
      <div className="d-flex gap-2 flex-wrap mb-3">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => updateFilters({ status: tab })}
            className="btn btn-sm fw-semibold px-3 py-2"
            style={{
              borderRadius: '8px',
              fontSize: '0.85rem',
              backgroundColor: filters.status === tab ? '#1a1f36' : '#fff',
              color: filters.status === tab ? '#fff' : '#4b5563',
              border: `1px solid ${filters.status === tab ? '#1a1f36' : '#e5e7eb'}`,
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Table card ── */}
      <div className="card bg-white border border-light-subtle rounded-3 shadow-sm">
        <div className="table-responsive">
          <TenantRequestTable
            requests={requests}
            loading={loading}
          />
        </div>

        {(!loading && requests.length > 0) && (
          <div className="card-footer bg-white border-top border-light-subtle p-3 d-flex justify-content-end">
            <Pagination
              pagination={pagination}
              onPageChange={changePage}
              onPageSizeChange={(size) => updateFilters({ pageSize: size })}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantRequestsPage;
