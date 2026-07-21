import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import useTenantHistory from '../hooks/useTenantHistory';
import TenantOverview from '../../tenantRequests/components/TenantOverview';

const TenantDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const tenantId = Number(id);
  const navigate = useNavigate();
  const { tenants, loading } = useTenantHistory();

  const tenant = tenants.find((t) => t.id === tenantId) ?? null;

  if (loading) {
    return (
      <div className="container-fluid p-3 p-md-4">
        <div className="skeleton mx-auto" style={{ height: '60vh', borderRadius: 12 }} />
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="container-fluid p-3 p-md-4">
        <button
          type="button"
          onClick={() => navigate('/tenant')}
          className="btn btn-sm btn-link text-decoration-none d-inline-flex align-items-center gap-1 px-0 mb-3 fw-semibold"
          style={{ color: '#4b5563' }}
        >
          <ArrowLeft size={16} /> Back to tenants
        </button>
        <div className="text-center py-5">
          <i className="bi bi-person-x d-block mb-2" style={{ fontSize: '2rem', color: '#d1d5db' }} />
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Tenant not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-3 p-md-4">
      <TenantOverview tenant={tenant} onBack={() => navigate('/tenant')} />
    </div>
  );
};

export default TenantDetailPage;
