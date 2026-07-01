import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Layers, Maximize2, Home } from 'lucide-react';
import { useApartment } from '../hooks/useApartment';
import { formatArea, formatFloor, apartmentTypeLabels } from '../components/apartmentTableHelpers';

const ApartmentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { apartment, loading } = useApartment(Number(id));

  if (loading) {
    return (
      <div className="page">
        <div className="ad-loading">
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
      </div>
    );
  }

  if (!apartment) {
    return (
      <div className="page">
        <div className="error-state">
          <i className="bi bi-exclamation-circle error-state__icon" />
          <p className="error-state__title">Failed to load apartment</p>
          <p className="error-state__sub"> Apartment not found</p>
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

      <div className="detail-header">
        <div className="detail-header__left">
          <div className="d-flex align-items-center justify-content-center flex-shrink-0 rounded-3"
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
            style={{ fontSize: '0.875rem' }}
          >
            <i className="bi bi-pencil" /> Edit
          </button>
        </div>
      </div>

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

      <div className="section-card">
        <div className="section-card__header">
          <h6 className="section-card__title">Current Resident</h6>
        </div>
        <div className="section-card__body--empty">
          <i className="bi bi-person placeholder-icon" />
          <p className="placeholder-text">
            {apartment.isOccupied
              ? "Resident details coming once residents module is linked"
              : "This apartment is currently vacant"}
          </p>
        </div>
      </div>

    </div>
  );
};

export default ApartmentDetailPage;