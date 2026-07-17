import useAuth from '../../../hooks/useAuth';
import useTenantHistory from '../hooks/useTenantHistory';
import FamilyMembersSection from './FamilyMembersSection';
import VehiclesSection from './VehiclesSection';
import TenantRequestSection from '../../tenantRequests/pages/TenantRequestSection';
import TenantHistorySection from './TenantHistorySection';
import type { TenantHistoryItem } from '../../residents/types/resident.types';

const MyApartmentPage = () => {
  const { user } = useAuth();
  const { tenants } = useTenantHistory();

  const residentId = user?.residentId ?? 0;

  // Find current occupant (tenant with isActive=true and no moveOutDate)
  const currentTenant = tenants.find((t: TenantHistoryItem) => t.isActive && !t.moveOutDate);
  const currentTenantResidentId = currentTenant?.id ?? null;

  if (!user || !user.residentId) {
    return (
      <div className="container-fluid p-3 p-md-4">
        <div className="error-state">
          <i className="bi bi-exclamation-circle error-state__icon" />
          <p className="error-state__title">Resident profile not found</p>
          <p className="error-state__sub">Your account is not linked to a resident profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-3 p-md-4">

      {/* ── Header ── */}
      <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap mb-4">
        <div>
          <h4 className="fw-bold mb-2" style={{ fontSize: '1.4rem', color: '#1a1f36' }}>
            My Apartment
          </h4>
          <p className="text-muted mb-0 small">
            Manage your family members and vehicles.
          </p>
        </div>
      </div>

      {/* ── Tenant Management (owner only; self-gates) ── */}
      <TenantRequestSection />

      {/* ── Tenant History (owner only; self-gates) ── */}
      <TenantHistorySection />

      {/* ── Family Members ── */}
      <FamilyMembersSection residentId={residentId} tenantResidentId={currentTenantResidentId} />

      {/* ── Vehicles ── */}
      <VehiclesSection residentId={residentId} tenantResidentId={currentTenantResidentId} />

    </div>
  );
};

export default MyApartmentPage;