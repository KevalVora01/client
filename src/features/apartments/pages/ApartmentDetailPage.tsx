import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Layers, Maximize2, Home, Mail, Phone, Crown } from 'lucide-react';
import { useApartment } from '../hooks/useApartment';
import { useApartmentMutations } from '../hooks/useApartmentMutations';
import { formatArea, formatFloor, apartmentTypeLabels } from '../components/apartmentTableHelpers';
import { getAvatarColor, getInitials, formatDate } from '../../residents/components/residentTableHelpers';
import { residentApi } from '../../residents/api/residentApi';
import type { ResidentDetail } from '../../residents/types/resident.types';
import type { UpdateApartmentPayload } from '../types/apartment.types';
import { showSuccess } from '../../../utils/toast';
import { showError } from '../../../utils/toast';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import ApartmentFormModal from '../components/ApartmentFormModal';

const ApartmentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { apartment, loading, refetch } = useApartment(Number(id));
  const [showEdit, setShowEdit] = useState(false);
  const [residents, setResidents] = useState<ResidentDetail[]>([]);
  const [residentsLoading, setResidentsLoading] = useState(false);
  const { updateApartment, updateLoading } = useApartmentMutations(() => refetch());

  const handleUpdate = async (payload: UpdateApartmentPayload, aptId?: number): Promise<boolean> => {
    const success = await updateApartment(aptId!, payload);
    if (success) { showSuccess("Apartment updated successfully"); setShowEdit(false); }
    return success;
  };

  useEffect(() => {
    if (!apartment?.id) return;
    let cancelled = false;
    const fetchResidents = async () => {
      setResidentsLoading(true);
      try {
        const response = await residentApi.getResidents({
          apartmentId: apartment.id,
          pageNumber: 1,
          pageSize: 100,
        });
        if (!cancelled) setResidents(response.items);
      } catch (err: unknown) {
        if (!cancelled) showError(getErrorMessage(err, "Failed to fetch apartment residents"));
      } finally {
        if (!cancelled) setResidentsLoading(false);
      }
    };
    fetchResidents();
    return () => { cancelled = true; };
  }, [apartment?.id]);

  const owner = residents.find((r) => r.isOwner) ?? null;
  const tenantHistory = residents
    .filter((r) => !r.isOwner)
    .sort((a, b) => new Date(b.moveInDate).getTime() - new Date(a.moveInDate).getTime());

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

      {/* ── Owner ── */}
      <div className="section-card">
        <div className="section-card__header">
          <h6 className="section-card__title d-flex align-items-center gap-2">
            <Crown size={16} style={{ color: '#d97706' }} /> Owner
          </h6>
        </div>

        {owner ? (
          <div
            className="d-flex align-items-center justify-content-between px-4 py-3 gap-3"
            onClick={() => navigate(`/residents/${owner.id}`)}
            style={{ cursor: 'pointer', transition: 'background 0.12s' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle fw-bold d-flex align-items-center justify-content-center flex-shrink-0"
                style={{
                  width: 44, height: 44, fontSize: '0.875rem',
                  background: getAvatarColor(owner.user?.name ?? '').bg,
                  color: getAvatarColor(owner.user?.name ?? '').color,
                }}
              >
                {getInitials(owner.user?.name ?? '?')}
              </div>
              <div>
                <p className="fw-semibold mb-0" style={{ fontSize: '0.9rem', color: '#111827' }}>
                  {owner.user?.name}
                </p>
                <div className="d-flex align-items-center gap-3 mt-1">
                  <div className="detail-header__meta">
                    <span><Mail size={13} strokeWidth={1.75} /> {owner.user.email}</span>
                    <span><Phone size={13} strokeWidth={1.75} /> {owner.user.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-4 flex-shrink-0">
              <div className="text-end">
                <p className="mb-0" style={{ fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#9ca3af' }}>
                  Move-in Date
                </p>
                <p className="mb-0 fw-semibold" style={{ fontSize: '0.875rem', color: '#111827' }}>
                  {formatDate(owner.moveInDate)}
                </p>
              </div>

              <span className="badge-pill badge-pill--owner">Owner</span>

              <i className="bi bi-chevron-right" style={{ color: '#9ca3af', fontSize: '0.875rem' }} />
            </div>
          </div>
        ) : (
          <div className="section-card__body--empty">
            <i className="bi bi-person placeholder-icon" />
            <p className="placeholder-text">No owner linked to this apartment</p>
          </div>
        )}
      </div>

      {/* ── Tenant History ── */}
      <div className="section-card">
        <div className="section-card__header">
          <h6 className="section-card__title">Tenant History</h6>
        </div>

        {residentsLoading ? (
          <div className="section-card__body--empty">
            <p className="placeholder-text">Loading tenants…</p>
          </div>
        ) : tenantHistory.length > 0 ? (
          <div className="d-flex flex-column">
            {tenantHistory.map((t) => (
              <div
                key={t.id}
                className="d-flex align-items-center justify-content-between px-4 py-3 gap-3"
                onClick={() => navigate(`/residents/${t.id}`)}
                style={{ cursor: 'pointer', transition: 'background 0.12s', borderTop: '1px solid #f3f4f6' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-circle fw-bold d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: 44, height: 44, fontSize: '0.875rem',
                      background: getAvatarColor(t.user?.name ?? '').bg,
                      color: getAvatarColor(t.user?.name ?? '').color,
                    }}
                  >
                    {getInitials(t.user?.name ?? '?')}
                  </div>
                  <div>
                    <p className="fw-semibold mb-0" style={{ fontSize: '0.9rem', color: '#111827' }}>
                      {t.user?.name}
                    </p>
                    <div className="d-flex align-items-center gap-3 mt-1">
                      <div className="detail-header__meta">
                        <span><Mail size={13} strokeWidth={1.75} /> {t.user.email}</span>
                        <span><Phone size={13} strokeWidth={1.75} /> {t.user.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-4 flex-shrink-0">
                  <div className="text-end">
                    <p className="mb-0" style={{ fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#9ca3af' }}>
                      Move-in Date
                    </p>
                    <p className="mb-0 fw-semibold" style={{ fontSize: '0.875rem', color: '#111827' }}>
                      {formatDate(t.moveInDate)}
                    </p>
                  </div>

                  <div className="text-end">
                    <p className="mb-0" style={{ fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#9ca3af' }}>
                      Move-out Date
                    </p>
                    <p className="mb-0 fw-semibold" style={{ fontSize: '0.875rem', color: '#111827' }}>
                      {formatDate(t.moveOutDate)}
                    </p>
                  </div>

                  <span className={`badge-pill ${t.isOccupant ? 'badge-pill--active' : 'badge-pill--inactive'}`}>
                    {t.isOccupant ? 'Occupant' : 'Past Tenant'}
                  </span>
                  {!t.isActive && (
                    <span className="badge-pill badge-pill--inactive">Inactive</span>
                  )}

                  <i className="bi bi-chevron-right" style={{ color: '#9ca3af', fontSize: '0.875rem' }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="section-card__body--empty">
            <i className="bi bi-people placeholder-icon" />
            <p className="placeholder-text">No tenant history for this apartment</p>
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