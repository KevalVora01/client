import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, Building2, Calendar, UserCheck } from 'lucide-react';
import { useResident } from '../hooks/useResident';
import { getAvatarColor, getInitials, formatDate } from '../components/residentTableHelpers';
import ResidentFormModal from '../components/ResidentFormModal';
import ConfirmDialog from '../../../components/ConfirmDialog/ConfirmDialog';
import type { UpdateResidentPayload } from '../types/resident.types';
import { useResidentActions } from '../hooks/useResidentActions';
import FamilyMembersSection from '../../myApartment/pages/FamilyMembersSection';
import VehiclesSection from '../../myApartment/pages/VehiclesSection';

const ResidentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { resident, loading, refetch } = useResident(Number(id));

  const {
    showEditModal, showDeactivateModal,
    selectedResident, deactivateLoading,
    handleEdit, handleDeactivate,
    handleUpdate, handleDeactivateConfirm,
    handleCloseEdit, handleCloseDeactivate,
  } = useResidentActions();

  if (loading) {
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

  if (!resident) {
    return (
      <div className="page">
        <div className="error-state">
          <i className="bi bi-exclamation-circle error-state__icon" />
          <p className="error-state__title">Failed to load resident</p>
          <p className="error-state__sub">Resident not found</p>
          <button className="back-btn" onClick={() => navigate('/residents')}>
            <ArrowLeft size={16} /> Back to residents
          </button>
        </div>
      </div>
    );
  }

  const { bg, color } = getAvatarColor(resident.user.name);

  const infoCards = [
    { icon: Phone, label: 'Phone', value: resident.user.phone, accent: 'info-card--blue' },
    { icon: Building2, label: 'Apartment', value: resident.apartment ? `${resident.apartment.block}-${resident.apartment.floorNumber}${resident.apartment.unitNumber}` : '—', accent: 'info-card--green' },
    { icon: Calendar, label: 'Move-in Date', value: formatDate(resident.moveInDate), accent: 'info-card--purple' },
    resident.isActive
      ? { icon: UserCheck, label: 'Resident Type', value: resident.isOwner ? 'Owner' : 'Tenant', accent: 'info-card--amber' }
      : { icon: Calendar, label: 'Move-out Date', value: resident.moveOutDate ? formatDate(resident.moveOutDate) : '—', accent: 'info-card--amber' },
  ];
  return (
    <div className="page">

      <button className="back-btn" onClick={() => navigate('/residents')}>
        <ArrowLeft size={16} strokeWidth={2} />
        Back to residents
      </button>

      {/* ── Header ── */}
      <div className="detail-header">
        <div className="detail-header__left">
          <div
            className="rounded-circle fw-bold d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: 56, height: 56, fontSize: '1rem', background: bg, color }}
          >
            {getInitials(resident.user.name)}
          </div>
          <div>
            <div className="detail-header__name-row">
              <h4 className="detail-header__name">{resident.user.name}</h4>
              <span className={`badge-pill badge-pill--${resident.isActive ? 'active' : 'inactive'}`}>
                {resident.isActive ? 'Active' : 'Inactive'}
              </span>
              <span className={`badge-pill badge-pill--${resident.isOwner ? 'owner' : 'tenant'}`}>
                {resident.isOwner ? 'Owner' : 'Tenant'}
              </span>
            </div>
            <div className="detail-header__meta">
              <span><Mail size={13} strokeWidth={1.75} /> {resident.user.email}</span>
              <span><Phone size={13} strokeWidth={1.75} /> {resident.user.phone}</span>
            </div>
          </div>
        </div>

        <div className="detail-header__actions">
          <button
            className="btn btn-outline-secondary d-inline-flex align-items-center gap-2"
            style={{ fontSize: '0.875rem', borderRadius: '8px' }}
            onClick={() => handleEdit(resident)}
            disabled={!resident.isActive}
          >
            <i className="bi bi-pencil" /> Edit
          </button>
          <button
            className="btn btn-outline-danger d-inline-flex align-items-center gap-2"
            style={{ fontSize: '0.875rem', borderRadius: '8px' }}
            onClick={() => handleDeactivate(resident)}
            disabled={!resident.isActive}
          >
            <i className="bi bi-person-x" /> Deactivate
          </button>
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

      {/* ── Family Members ── */}
      <FamilyMembersSection residentId={resident.id!} readOnly={true} />

      {/* ── Vehicles ── */}
      <VehiclesSection residentId={resident.id!} readOnly={true} />

      {/* ── Modals ── */}
      <ResidentFormModal
        key={selectedResident?.id ?? "edit"}
        show={showEditModal}
        mode="edit"
        resident={selectedResident}
        loading={false}
        onClose={handleCloseEdit}
        onSubmit={async (payload, id) => {
          const success = await handleUpdate(id!, payload as UpdateResidentPayload);
          if (success) refetch();
          return success;
        }}
      />

      <ConfirmDialog
        show={showDeactivateModal}
        title="Deactivate Resident"
        message={
          selectedResident
            ? `Are you sure you want to deactivate ${selectedResident.user.name}? They will lose access to the system.`
            : "Are you sure you want to deactivate this resident?"
        }
        confirmLabel="Yes, Deactivate"
        variant="warning"
        loading={deactivateLoading}
        onConfirm={async () => {
          if (!selectedResident) return;
          const success = await handleDeactivateConfirm(selectedResident.id);
          if (success) { refetch(); handleCloseDeactivate(); }
        }}
        onCancel={handleCloseDeactivate}
      />

    </div>
  );
};

export default ResidentDetailPage;