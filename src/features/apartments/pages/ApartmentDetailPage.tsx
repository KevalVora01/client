import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Layers, Maximize2, Home, Mail, Phone } from 'lucide-react';
import { useApartment } from '../hooks/useApartment';
import { useApartmentMutations } from '../hooks/useApartmentMutations';
import { formatArea, formatFloor, apartmentTypeLabels } from '../components/apartmentTableHelpers';
import { getAvatarColor, getInitials, formatDate } from '../../residents/components/ResidentTable/residentTableHelpers';
import type { UpdateApartmentPayload } from '../types/apartment.types';
import { showSuccess } from '../../../utils/toast';
import ApartmentFormModal from '../components/ApartmentFormModal';

const ApartmentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { apartment, loading, refetch } = useApartment(Number(id));
  const [showEdit, setShowEdit] = useState(false);
  const { updateApartment, updateLoading } = useApartmentMutations(() => refetch());

  const handleUpdate = async (payload: UpdateApartmentPayload, aptId?: number): Promise<boolean> => {
    const success = await updateApartment(aptId!, payload);
    if (success) { showSuccess("Apartment updated successfully"); setShowEdit(false); }
    return success;
  };

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

  if (!apartment) {
    return (
      <div className="page">
        <div className="error-state">
          <i className="bi bi-exclamation-circle error-state__icon" />
          <p className="error-state__title">Failed to load apartment</p>
          <button className="back-btn" onClick={() => navigate('/apartments')}>
            <ArrowLeft size={16} /> Back to apartments
          </button>
        </div>
      </div>
    );
  }

  const infoCards = [
    { icon: Building2, label: 'Block', value: `Block ${apartment.block}`, accent: 'info-card--blue' },
    { icon: Layers, label: 'Floor', value: formatFloor(apartment.floorNumber), accent: 'info-card--green' },
    { icon: Maximize2, label: 'Area', value: `${formatArea(apartment.areaSqft)} sq ft`, accent: 'info-card--purple' },
    { icon: Home, label: 'Type', value: apartmentTypeLabels[apartment.type] ?? apartment.type, accent: 'info-card--amber' },
  ];

  const resident = apartment.resident ?? null;

  return (
    <div className="page">

      <button className="back-btn" onClick={() => navigate('/apartments')}>
        <ArrowLeft size={16} strokeWidth={2} />
        Back to apartments
      </button>

      {/* ── Header ── */}
      <div className="detail-header">
        <div className="detail-header__left">
          <div
            className="d-flex align-items-center justify-content-center flex-shrink-0 rounded-3"
            style={{ width: 56, height: 56, background: '#eff6ff', color: '#2563eb' }}
          >
            <Building2 size={24} strokeWidth={1.75} />
          </div>
          <div>
            <div className="detail-header__name-row">
              <h4 className="detail-header__name">{apartment.block}-{apartment.floorNumber}{apartment.unitNumber}</h4>
              <span className={`badge-pill badge-pill--${apartment.isOccupied ? 'occupied' : 'vacant'}`}>
                {apartment.isOccupied ? 'Occupied' : 'Vacant'}
              </span>
              <span className="badge-pill badge-pill--type">
                {apartmentTypeLabels[apartment.type] ?? apartment.type}
              </span>
            </div>
            <div className="detail-header__meta">
              <span>Block {apartment.block}</span>
              <span>·</span>
              <span>{formatFloor(apartment.floorNumber)}</span>
              <span>·</span>
              <span>{formatArea(apartment.areaSqft)} sq ft</span>
            </div>
          </div>
        </div>

        <div className="detail-header__actions">
          <button
            className="btn btn-outline-secondary d-inline-flex align-items-center gap-2"
            style={{ fontSize: '0.875rem', borderRadius: '8px' }}
            onClick={() => setShowEdit(true)}
          >
            <i className="bi bi-pencil" /> Edit
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

      {/* ── Current Resident ── */}
      <div className="section-card">
        <div className="section-card__header">
          <h6 className="section-card__title">Current Resident</h6>
        </div>

        {resident ? (
          <div
            className="d-flex align-items-center justify-content-between px-4 py-3 gap-3"
            onClick={() => navigate(`/residents/${resident.id}`)}
            style={{ cursor: 'pointer', transition: 'background 0.12s' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            {/* Left — avatar + name + email + phone */}
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle fw-bold d-flex align-items-center justify-content-center flex-shrink-0"
                style={{
                  width: 44, height: 44, fontSize: '0.875rem',
                  background: getAvatarColor(resident.user?.name ?? '').bg,
                  color: getAvatarColor(resident.user?.name ?? '').color,
                }}
              >
                {getInitials(resident.user?.name ?? '?')}
              </div>
              <div>
                <p className="fw-semibold mb-0" style={{ fontSize: '0.9rem', color: '#111827' }}>
                  {resident.user?.name}
                </p>
                <div className="d-flex align-items-center gap-3 mt-1">
                  <div className="detail-header__meta">
                    <span><Mail size={13} strokeWidth={1.75} /> {resident.user.email}</span>
                    <span><Phone size={13} strokeWidth={1.75} /> {resident.user.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — move-in date + type + chevron */}
            <div className="d-flex align-items-center gap-4 flex-shrink-0">
              <div className="text-end">
                <p className="mb-0" style={{ fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#9ca3af' }}>
                  Move-in Date
                </p>
                <p className="mb-0 fw-semibold" style={{ fontSize: '0.875rem', color: '#111827' }}>
                  {formatDate(resident.moveInDate)}
                </p>
              </div>

              <span className={`badge-pill badge-pill--${resident.isOwner ? 'owner' : 'tenant'}`}>
                {resident.isOwner ? 'Owner' : 'Tenant'}
              </span>

              <i className="bi bi-chevron-right" style={{ color: '#9ca3af', fontSize: '0.875rem' }} />
            </div>
          </div>
        ) : (
          <div className="section-card__body--empty">
            <i className="bi bi-person placeholder-icon" />
            <p className="placeholder-text">This apartment is currently vacant</p>
          </div>
        )}
      </div>

      {/* ── Edit Modal ── */}
      <ApartmentFormModal
        key={apartment.id}
        show={showEdit}
        mode="edit"
        apartment={apartment}
        loading={updateLoading}
        onClose={() => setShowEdit(false)}
        onSubmit={handleUpdate}
      />

    </div>
  );
};

export default ApartmentDetailPage;