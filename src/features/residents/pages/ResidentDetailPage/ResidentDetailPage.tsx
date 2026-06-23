import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, Building2, Calendar, UserCheck } from 'lucide-react';
import { useResident } from '../../hooks/useResident';
import { getAvatarColor, getInitials, formatDate } from '../../components/ResidentTable/residentTableHelpers';
import './ResidentDetailPage.css';

const ResidentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { resident, loading, error } = useResident(Number(id));

  if (loading) {
    return (
      <div className="rd-page">
        <div className="rd-loading">
          <div className="rd-skeleton rd-skeleton--title" />
          <div className="rd-skeleton rd-skeleton--subtitle" />
          <div className="rd-info-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rd-info-card">
                <div className="rd-skeleton rd-skeleton--label" />
                <div className="rd-skeleton rd-skeleton--value" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !resident) {
    return (
      <div className="rd-page">
        <div className="rd-error">
          <i className="bi bi-exclamation-circle rd-error__icon" />
          <p className="rd-error__title">Failed to load resident</p>
          <p className="rd-error__sub">{error ?? "Resident not found"}</p>
          <button className="rd-back-btn" onClick={() => navigate('/residents')}>
            <ArrowLeft size={16} /> Back to residents
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rd-page">
        <div className="rd-loading">
          {/* skeleton */}
        </div>
      </div>
    );
  }

  if (error || !resident) {
    return (
      <div className="rd-page">
        <div className="rd-error">
          <i className="bi bi-exclamation-circle rd-error__icon" />
          <p className="rd-error__title">Failed to load resident</p>
          <p className="rd-error__sub">{error ?? "Resident not found"}</p>
          <button className="rd-back-btn" onClick={() => navigate('/residents')}>
            <ArrowLeft size={16} /> Back to residents
          </button>
        </div>
      </div>
    );
  }

  // safe to access resident.user from here
  const { bg, color } = getAvatarColor(resident.user.name);

  const infoCards = [
    {
      icon: Phone,
      label: 'Phone',
      value: resident.user.phone,
      accent: 'rd-info-card--blue',
    },
    {
      icon: Building2,
      label: 'Apartment',
      value: resident.apartment
        ? `Unit ${resident.apartment.flateNumber}, Block ${resident.apartment.block}`
        : '—',
      accent: 'rd-info-card--green',
    },
    {
      icon: Calendar,
      label: 'Move-in Date',
      value: formatDate(resident.moveInDate),
      accent: 'rd-info-card--purple',
    },
    {
      icon: UserCheck,
      label: 'Resident Type',
      value: resident.isOwner ? 'Owner' : 'Tenant',
      accent: 'rd-info-card--amber',
    },
  ];

  return (
    <div className="rd-page">

      {/* ── Back button ── */}
      <button className="rd-back-btn" onClick={() => navigate('/residents')}>
        <ArrowLeft size={16} strokeWidth={2} />
        Back to residents
      </button>

      {/* ── Profile header ── */}
      <div className="rd-header">
        <div className="rd-header__left">
          <div className="rd-avatar" style={{ background: bg, color }}>
            {getInitials(resident.user.name)}
          </div>
          <div>
            <div className="rd-header__name-row">
              <h4 className="rd-header__name">{resident.user.name}</h4>
              <span className={`rd-badge rd-badge--${resident.isActive ? 'active' : 'inactive'}`}>
                {resident.isActive ? 'Active' : 'Inactive'}
              </span>
              <span className={`rd-badge rd-badge--${resident.isOwner ? 'owner' : 'tenant'}`}>
                {resident.isOwner ? 'Owner' : 'Tenant'}
              </span>
            </div>
            <div className="rd-header__meta">
              <span><Mail size={13} strokeWidth={1.75} /> {resident.user.email}</span>
              <span><Phone size={13} strokeWidth={1.75} /> {resident.user.phone}</span>
            </div>
          </div>
        </div>

        <div className="rd-header__actions">
          <button
            className="rd-btn rd-btn--secondary"
            onClick={() => navigate('/residents')}
          >
            <i className="bi bi-pencil me-1" /> Edit
          </button>
          <button
            className="rd-btn rd-btn--danger"
            disabled={!resident.isActive}
          >
            <i className="bi bi-person-x me-1" /> Deactivate
          </button>
        </div>
      </div>

      {/* ── Info cards ── */}
      <div className="rd-info-grid">
        {infoCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className={`rd-info-card ${card.accent}`}>
              <div className="rd-info-card__icon-box">
                <Icon size={18} strokeWidth={1.75} />
              </div>
              <div>
                <p className="rd-info-card__label">{card.label}</p>
                <p className="rd-info-card__value">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Family members ── */}
      <div className="rd-section">
        <div className="rd-section__header">
          <h6 className="rd-section__title">Family Members</h6>
        </div>
        <div className="rd-section__body rd-section__body--empty">
          <i className="bi bi-people rd-placeholder__icon" />
          <p className="rd-placeholder__text">Family members module coming soon</p>
        </div>
      </div>

      {/* ── Vehicles ── */}
      <div className="rd-section">
        <div className="rd-section__header">
          <h6 className="rd-section__title">Vehicles</h6>
        </div>
        <div className="rd-section__body rd-section__body--empty">
          <i className="bi bi-car-front rd-placeholder__icon" />
          <p className="rd-placeholder__text">Vehicles module coming soon</p>
        </div>
      </div>

    </div>
  );
};

export default ResidentDetailPage;