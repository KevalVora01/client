import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Ban, Calendar, Mail, Phone, ArrowRight, UserCheck, Clock } from "lucide-react";
import useTenantHistory from "../hooks/useTenantHistory";
import { tenantRequestApi } from "../api/tenantRequestApi";
import { showError, showSuccess } from "../../../utils/toast";
import { getAvatarColor, getInitials } from "../../residents/components/residentTableHelpers";
import type { TenantHistoryItem } from "../../residents/types/resident.types";

const formatDate = (d: string | null): string =>
  d ? new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : "—";

const TenantHistorySection = () => {
  const { tenants, loading, notOwner, load } = useTenantHistory();
  const [revokingId, setRevokingId] = useState<number | null>(null);
  const [showRevokeModal, setShowRevokeModal] = useState<TenantHistoryItem | null>(null);
  const navigate = useNavigate();

  if (notOwner) return null;

  const currentTenant = tenants.find((t) => t.isActive && !t.moveOutDate);
  const pastTenants = tenants.filter((t) => !(t.isActive && !t.moveOutDate));

  const handleConfirmRevoke = async () => {
    if (!showRevokeModal) return;
    const tenantToRevoke = showRevokeModal;
    setRevokingId(tenantToRevoke.id);
    try {
      await tenantRequestApi.revokeTenancy();
      showSuccess(`Tenancy for ${tenantToRevoke.user.name} revoked successfully.`);
      setShowRevokeModal(null);
      await load();
    } catch (err) {
      const axiosError = err as { response?: { data?: { error?: string } } };
      showError(axiosError?.response?.data?.error || "Failed to revoke tenancy");
    } finally {
      setRevokingId(null);
    }
  };

  return (
    <div className="d-flex flex-column gap-4 mb-4">
      {/* ── Current Active Tenant Section ── */}
      <div className="section-card">
        <div className="section-card__header d-flex align-items-center justify-content-between px-4 py-3 border-bottom">
          <h6 className="section-card__title d-flex align-items-center gap-2 mb-0" style={{ fontSize: '0.95rem', color: '#111827' }}>
            <UserCheck size={18} className="text-success" />
            Current Active Tenant
          </h6>
          {currentTenant && (
            <span className="badge-pill badge-pill--active">
              Active Occupant
            </span>
          )}
        </div>

        <div className="p-4">
          {loading ? (
            <div className="d-flex flex-column gap-3">
              <div className="skeleton" style={{ height: 100, borderRadius: 12 }} />
              <div className="skeleton" style={{ height: 80, borderRadius: 12 }} />
            </div>
          ) : currentTenant ? (
            (() => {
              const { bg, color } = getAvatarColor(currentTenant.user.name);

              const infoCards = [
                { icon: Phone, label: 'PHONE', value: currentTenant.user.phone, accent: 'info-card--blue' },
                { icon: Mail, label: 'EMAIL', value: currentTenant.user.email, accent: 'info-card--green' },
                { icon: Calendar, label: 'MOVE-IN DATE', value: formatDate(currentTenant.moveInDate), accent: 'info-card--purple' },
                { icon: UserCheck, label: 'OCCUPANCY', value: 'Occupant', accent: 'info-card--amber' },
              ];

              return (
                <div className="d-flex flex-column gap-4">
                  {/* ── Header Card copied directly from Resident Detail ── */}
                  <div className="detail-header">
                    <div className="detail-header__left min-w-0">
                      <div
                        className="rounded-circle fw-bold d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ width: 56, height: 56, fontSize: '1rem', background: bg, color }}
                      >
                        {getInitials(currentTenant.user.name)}
                      </div>
                      <div className="min-w-0 flex-grow-1">
                        <div className="detail-header__name-row">
                          <h4 className="detail-header__name text-truncate">{currentTenant.user.name}</h4>
                          <span className="badge-pill badge-pill--active">Active</span>
                          <span className="badge-pill badge-pill--tenant">Tenant</span>
                        </div>
                        <div className="detail-header__meta">
                          <span><Calendar size={13} strokeWidth={1.75} /> Moved in {formatDate(currentTenant.moveInDate)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="detail-header__actions d-flex flex-wrap gap-2 w-100 w-sm-auto">
                      <button
                        className="btn btn-outline-danger d-inline-flex align-items-center justify-content-center gap-2 flex-fill flex-sm-grow-0"
                        style={{ fontSize: '0.875rem', borderRadius: '8px' }}
                        onClick={() => setShowRevokeModal(currentTenant)}
                      >
                        <Ban size={16} /> Revoke
                      </button>
                      <button
                        className="btn btn-outline-secondary d-inline-flex align-items-center justify-content-center gap-2 flex-fill flex-sm-grow-0"
                        style={{ fontSize: '0.875rem', borderRadius: '8px' }}
                        onClick={() => navigate(`/tenant/${currentTenant.id}`)}
                      >
                        <ArrowRight size={16} /> View Details
                      </button>
                    </div>
                  </div>

                  {/* ── Info Cards Grid copied directly from Resident Detail ── */}
                  <div className="info-grid">
                    {infoCards.map((card) => {
                      const Icon = card.icon;
                      return (
                        <div key={card.label} className={`info-card ${card.accent}`}>
                          <div className="info-card__icon-box">
                            <Icon size={18} strokeWidth={1.75} />
                          </div>
                          <div className="min-w-0 flex-grow-1">
                            <p className="info-card__label">{card.label}</p>
                            <p className="info-card__value text-truncate" title={String(card.value)}>{card.value}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="section-card__body--empty text-center py-4">
              <i className="bi bi-clock-history placeholder-icon d-block mb-2" style={{ fontSize: '2rem', color: '#d1d5db' }} />
              <p className="placeholder-text text-muted mb-0">No active tenant registered.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Past Tenants History Section ── */}
      <div className="section-card">
        <div className="section-card__header d-flex align-items-center justify-content-between px-4 py-3 border-bottom">
          <h6 className="section-card__title d-flex align-items-center gap-2 mb-0" style={{ fontSize: '0.95rem', color: '#111827' }}>
            <Clock size={18} className="text-secondary" />
            Past Tenants Log
          </h6>
          <span className="badge-pill badge-pill--inactive">
            {pastTenants.length} {pastTenants.length === 1 ? 'Record' : 'Records'}
          </span>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="d-flex flex-column gap-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 72, borderRadius: 12 }} />
              ))}
            </div>
          ) : pastTenants.length === 0 ? (
            <div className="section-card__body--empty text-center py-4">
              <i className="bi bi-clock-history placeholder-icon d-block mb-2" style={{ fontSize: '2rem', color: '#d1d5db' }} />
              <p className="placeholder-text text-muted mb-0">No past tenant history records.</p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {pastTenants.map((t) => {
                const { bg, color } = getAvatarColor(t.user.name);
                return (
                  <div
                    key={t.id}
                    onClick={() => navigate(`/tenant/${t.id}`)}
                    role="button"
                    className="d-flex align-items-center justify-content-between gap-3 p-3 rounded-3 border bg-white"
                    style={{ borderColor: '#e5e7eb', cursor: 'pointer' }}
                  >
                    {/* Left — Avatar + details */}
                    <div className="d-flex align-items-center gap-3 min-w-0">
                      <div
                        className="rounded-circle fw-bold d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ width: 44, height: 44, fontSize: '0.9rem', background: bg, color }}
                      >
                        {getInitials(t.user.name)}
                      </div>
                      <div className="min-w-0">
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                          <span className="fw-semibold text-dark text-truncate" style={{ fontSize: '0.95rem' }}>
                            {t.user.name}
                          </span>
                          <span className="badge-pill badge-pill--inactive" style={{ fontSize: '0.7rem' }}>
                            Past
                          </span>
                        </div>
                        <div className="d-flex align-items-center gap-3 mt-1 text-muted flex-wrap" style={{ fontSize: '0.8rem' }}>
                          <span className="d-inline-flex align-items-center gap-1">
                            <Mail size={13} /> {t.user.email}
                          </span>
                          <span className="d-inline-flex align-items-center gap-1">
                            <Phone size={13} /> {t.user.phone}
                          </span>
                        </div>
                        <div className="d-flex align-items-center gap-1 mt-1 text-muted" style={{ fontSize: '0.8rem' }}>
                          <Calendar size={13} className="me-1" />
                          <span>{formatDate(t.moveInDate)}</span>
                          <ArrowRight size={13} className="mx-1" />
                          <span>{t.moveOutDate ? formatDate(t.moveOutDate) : 'Present'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right — Arrow button */}
                    <div className="d-flex align-items-center gap-1 text-muted flex-shrink-0">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Revoke Tenancy Confirmation Modal ── */}
      {showRevokeModal && (
        <div
          className="modal d-block bg-dark bg-opacity-50"
          style={{ backdropFilter: 'blur(4px)', zIndex: 1055 }}
          onClick={() => setShowRevokeModal(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ maxWidth: '440px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border-0 rounded-3 shadow-lg bg-white overflow-hidden position-relative">
              <button
                type="button"
                className="btn position-absolute d-flex align-items-center justify-content-center p-0 text-secondary"
                style={{ top: 16, right: 16, width: 28, height: 28, border: '1px solid #e9ecef', background: '#fff', fontSize: '1.1rem', borderRadius: '6px', zIndex: 10 }}
                onClick={() => setShowRevokeModal(null)}
                aria-label="Close"
              >
                <i className="bi bi-x" />
              </button>
              <div className="p-4 text-center border-bottom border-light-subtle">
                <div
                  className="rounded-circle bg-danger-subtle text-danger d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: 56, height: 56 }}
                >
                  <Ban size={28} />
                </div>
                <h5 className="fw-bold text-dark mb-1" style={{ fontSize: '1.15rem' }}>
                  Revoke Tenancy?
                </h5>
                <p className="text-muted mb-0 small" style={{ fontSize: '0.875rem' }}>
                  Are you sure you want to end the active tenancy for{' '}
                  <strong className="text-dark">{showRevokeModal.user.name}</strong>?
                </p>
              </div>

              <div className="p-4 bg-light-subtle">
                <div className="bg-white p-3 rounded-3 border border-light-subtle mb-3" style={{ fontSize: '0.85rem' }}>
                  <div className="d-flex justify-content-between mb-1.5">
                    <span className="text-muted">Tenant:</span>
                    <span className="fw-semibold text-dark">{showRevokeModal.user.name}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1.5">
                    <span className="text-muted">Email:</span>
                    <span className="text-dark">{showRevokeModal.user.email}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Moved in:</span>
                    <span className="text-dark">{formatDate(showRevokeModal.moveInDate)}</span>
                  </div>
                </div>

                <p className="text-secondary small mb-0 d-flex align-items-start gap-1.5" style={{ fontSize: '0.78rem' }}>
                  <i className="bi bi-exclamation-triangle text-warning flex-shrink-0 me-1" />
                  <span>
                    Upon revoking, the tenant will lose resident access and the apartment status will revert to Owner Occupancy.
                  </span>
                </p>
              </div>

              <div className="p-3 bg-white border-top border-light-subtle d-flex flex-column-reverse flex-sm-row justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-3 py-2 fw-medium"
                  style={{ fontSize: '0.875rem' }}
                  onClick={() => setShowRevokeModal(null)}
                  disabled={revokingId === showRevokeModal.id}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger rounded-3 py-2 fw-semibold d-inline-flex align-items-center justify-content-center gap-2 text-nowrap"
                  style={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}
                  onClick={handleConfirmRevoke}
                  disabled={revokingId === showRevokeModal.id}
                >
                  {revokingId === showRevokeModal.id ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                      Revoking...
                    </>
                  ) : (
                    <>
                      <Ban size={15} />
                      Confirm Revoke
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantHistorySection;
