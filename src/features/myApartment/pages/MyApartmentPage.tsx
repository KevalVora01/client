import useAuth from '../../../hooks/useAuth';
import useMyResident from '../../residents/hooks/useMyResident';
import FamilyMembersSection from './FamilyMembersSection';
import VehiclesSection from './VehiclesSection';

const MyApartmentPage = () => {
  const { user } = useAuth();
  const { resident } = useMyResident(!!user?.residentId);

  const residentId = user?.residentId ?? 0;
  const apt = (resident as { apartment?: { block: string; floorNumber: number; unitNumber: string } } | null)?.apartment;
  const aptLabel = apt ? `${apt.block}-${apt.floorNumber}${apt.unitNumber}` : null;

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
          <h4 className="fw-bold mb-2 fs-4 fs-sm-3" style={{ color: '#1a1f36' }}>
            My Apartment{aptLabel ? <span className="fw-normal text-muted ms-2 fs-6">({aptLabel})</span> : null}
          </h4>
          <p className="text-muted mb-0 small">
            Manage your family members and vehicles.
          </p>
        </div>
      </div>

      {/* ── Family Members ── */}
      <FamilyMembersSection residentId={residentId} />

      {/* ── Vehicles ── */}
      <VehiclesSection residentId={residentId} />

    </div>
  );
};

export default MyApartmentPage;
