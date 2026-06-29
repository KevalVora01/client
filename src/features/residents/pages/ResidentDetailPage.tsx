import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, Building2, Calendar, UserCheck } from 'lucide-react';
import { useResident } from '../hooks/useResident';
import { useResidentsPage } from '../hooks/useResidentsPage';
import { getAvatarColor, getInitials, formatDate } from '../components/ResidentTable/residentTableHelpers';
import ResidentFormModal from '../components/ResidentFormModal/ResidentFormModal';
import ConfirmDialog from '../../../components/ConfirmDialog/ConfirmDialog';
import type { UpdateResidentPayload } from '../types/resident.types';

const ResidentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { resident, loading, error, refetch } = useResident(Number(id));

  const {
    showEditModal, showDeactivateModal,
    selectedResident, deactivateLoading,
    handleEdit, handleDeactivate,
    handleUpdate, handleDeactivateConfirm,
    handleCloseEdit, handleCloseDeactivate,
  } = useResidentsPage();

  if (loading) {
    return (
      <div className="container-fluid p-4 d-flex flex-column gap-3 style-none">
        <div className="d-flex flex-column gap-3">
          {/* Shimmer Skeltons */}
          <div className="placeholder-glow">
            <div className="placeholder rounded-2 col-4 py-3" />
          </div>
          <div className="placeholder-glow">
            <div className="placeholder rounded-2 col-2 py-2" />
          </div>
          <div className="row g-3 mt-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="col-12 col-sm-6 col-xl-3">
                <div className="card border border-light-subtle rounded-3 p-3 placeholder-glow">
                  <div className="placeholder rounded-1 col-6 mb-2" style={{ height: "12px" }} />
                  <div className="placeholder rounded-1 col-9" style={{ height: "18px" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !resident) {
    return (
      <div className="container-fluid p-4 d-flex justify-content-center align-items-center min-vh-50">
        <div className="text-center py-5 max-w-md">
          <i className="bi bi-exclamation-circle text-danger-emphasis fs-1 d-block mb-3" />
          <h5 className="fw-bold text-dark mb-1">Failed to load resident</h5>
          <p className="text-secondary small mb-4">{error ?? "Resident not found"}</p>
          <button
            type="button"
            className="btn btn-link text-secondary p-0 border-0 fw-medium d-inline-flex align-items-center gap-2 small"
            onClick={() => navigate('/residents')}
          >
            <ArrowLeft size={16} /> Back to residents
          </button>
        </div>
      </div>
    );
  }

  const { bg, color } = getAvatarColor(resident.user.name);

  // Layout color schemes synced exactly from your original style variables
  const infoCards = [
    { icon: Phone, label: 'Phone', value: resident.user.phone, bgClass: "bg-primary-subtle text-primary" },
    { icon: Building2, label: 'Apartment', value: resident.apartment ? `${resident.apartment.flateNumber}` : '—', bgClass: "bg-success-subtle text-success" },
    { icon: Calendar, label: 'Move-in Date', value: formatDate(resident.moveInDate), bgClass: "bg-purple text-purple", customBg: "#f5f3ff", customColor: "#7c3aed" },
    { icon: UserCheck, label: 'Resident Type', value: resident.isOwner ? 'Owner' : 'Tenant', bgClass: "bg-warning-subtle text-warning-emphasis" },
  ];

  return (
    <div className="container-fluid p-4 p-md-5 max-w-100 d-flex flex-column gap-4 mx-auto">

      {/* ── Back button ── */}
      <button
        type="button"
        className="btn p-0 border-0 text-secondary bg-transparent fw-medium d-inline-flex align-items-center gap-2 small w-auto text-start"
        onClick={() => navigate('/residents')}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#111827")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
        style={{ transition: "color 0.15s ease" }}
      >
        <ArrowLeft size={16} strokeWidth={2} />
        Back to residents
      </button>

      {/* ── Profile Header Card ── */}
      <div className="card bg-white border border-light-subtle rounded-3 p-4 d-flex flex-md-row flex-column align-items-md-center justify-content-between gap-3">
        <div className="d-flex align-items-center gap-3">
          <div
            className="rounded-circle fw-bold d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: "56px", height: "56px", fontSize: "1rem", background: bg, color }}
          >
            {getInitials(resident.user.name)}
          </div>
          <div>
            <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
              <h4 className="fw-bold text-dark m-0 fs-5">{resident.user.name}</h4>

              {/* Active/Inactive Status Pill */}
              <span
                className={`badge rounded-pill fw-medium px-2 py-1 border small ${resident.isActive
                    ? 'text-success bg-success-subtle border-success-subtle'
                    : 'text-secondary bg-light border-light-subtle'
                  }`}
                style={{ fontSize: "0.72rem" }}
              >
                {resident.isActive ? 'Active' : 'Inactive'}
              </span>

              {/* Owner/Tenant Status Pill */}
              <span
                className={`badge rounded-pill fw-medium px-2 py-1 border small ${resident.isOwner
                    ? 'text-indigo bg-indigo-subtle border-indigo-subtle'
                    : 'text-info bg-info-subtle border-info-subtle'
                  }`}
                style={{
                  fontSize: "0.72rem",
                  backgroundColor: resident.isOwner ? "#eef2ff" : "",
                  color: resident.isOwner ? "#4338ca" : ""
                }}
              >
                {resident.isOwner ? 'Owner' : 'Tenant'}
              </span>
            </div>
            <div className="d-flex align-items-center flex-wrap gap-3 text-secondary small">
              <span className="d-inline-flex align-items-center gap-1"><Mail size={13} strokeWidth={1.75} /> {resident.user.email}</span>
              <span className="d-inline-flex align-items-center gap-1"><Phone size={13} strokeWidth={1.75} /> {resident.user.phone}</span>
            </div>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="d-flex gap-2 flex-shrink-0 w-100 w-md-auto">
          <button
            type="button"
            className="btn btn-outline-secondary border-light-subtle text-dark fw-medium d-inline-flex align-items-center justify-content-center gap-1 px-3 py-2 small flex-grow-1 flex-md-grow-0"
            onClick={() => handleEdit(resident)}
            disabled={!resident.isActive}
            style={{ fontSize: "0.875rem", borderRadius: "8px" }}
          >
            <i className="bi bi-pencil me-1" /> Edit
          </button>
          <button
            type="button"
            className="btn btn-outline-danger border-danger-subtle fw-medium d-inline-flex align-items-center justify-content-center gap-1 px-3 py-2 small flex-grow-1 flex-md-grow-0"
            onClick={() => handleDeactivate(resident)}
            disabled={!resident.isActive}
            style={{ fontSize: "0.875rem", borderRadius: "8px" }}
          >
            <i className="bi bi-person-x me-1" /> Deactivate
          </button>
        </div>
      </div>

      {/* ── Info Cards Layout Grid ── */}
      <div className="row g-3">
        {infoCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="col-12 col-sm-6 col-xl-3">
              <div className="card bg-white border border-light-subtle rounded-3 p-3 d-flex flex-row align-items-center gap-3">
                <div
                  className={`rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 ${card.bgClass}`}
                  style={{
                    width: "38px",
                    height: "38px",
                    backgroundColor: card.customBg,
                    color: card.customColor
                  }}
                >
                  <Icon size={18} strokeWidth={1.75} />
                </div>
                <div>
                  <p className="fw-semibold text-muted text-uppercase m-0 mb-1" style={{ fontSize: "0.72rem", letterSpacing: "0.06em" }}>
                    {card.label}
                  </p>
                  <p className="fw-semibold text-dark m-0" style={{ fontSize: "0.9rem" }}>
                    {card.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Family Members Section Panel ── */}
      <div className="card bg-white border border-light-subtle rounded-3 overflow-hidden">
        <div className="card-header bg-white border-bottom border-light-subtle px-4 py-3">
          <h6 className="fw-bold text-dark m-0" style={{ fontSize: "0.9rem" }}>Family Members</h6>
        </div>
        <div className="card-body d-flex flex-column align-items-center justify-content-center py-5 gap-2 text-center">
          <i className="bi bi-people text-black-50 fs-2" style={{ color: "#d1d5db" }} />
          <p className="text-secondary m-0 small">Family members module coming soon</p>
        </div>
      </div>

      {/* ── Vehicles Section Panel ── */}
      <div className="card bg-white border border-light-subtle rounded-3 overflow-hidden">
        <div className="card-header bg-white border-bottom border-light-subtle px-4 py-3">
          <h6 className="fw-bold text-dark m-0" style={{ fontSize: "0.9rem" }}>Vehicles</h6>
        </div>
        <div className="card-body d-flex flex-column align-items-center justify-content-center py-5 gap-2 text-center">
          <i className="bi bi-car-front text-black-50 fs-2" style={{ color: "#d1d5db" }} />
          <p className="text-secondary m-0 small">Vehicles module coming soon</p>
        </div>
      </div>

      {/* Modals & dialog logic triggers */}
      <ResidentFormModal
        key={selectedResident?.id ?? "edit"}
        show={showEditModal ? true : false}
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
          if (success) {
            refetch();
            handleCloseDeactivate();
          }
        }}
        onCancel={handleCloseDeactivate}
      />

    </div>
  );
};

export default ResidentDetailPage;