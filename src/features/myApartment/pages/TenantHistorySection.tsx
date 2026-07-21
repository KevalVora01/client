import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Ban, Calendar, Mail, Phone, ArrowRight } from "lucide-react";
import useTenantHistory from "../hooks/useTenantHistory";
import { tenantRequestApi } from "../../tenantRequests/api/tenantRequestApi";
import { showError, showSuccess } from "../../../utils/toast";
import { getAvatarColor, getInitials } from "../../residents/components/residentTableHelpers";
import type { TenantHistoryItem } from "../../residents/types/resident.types";

const formatDate = (d: string | null): string =>
  d ? new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : "—";

const TenantHistorySection = () => {
  const { tenants, loading, notOwner, load } = useTenantHistory();
  const [revokingId, setRevokingId] = useState<number | null>(null);
  const navigate = useNavigate();

  if (notOwner) return null;

  const handleRevoke = async (tenant: TenantHistoryItem) => {
    if (!window.confirm(`Revoke tenancy for ${tenant.user.name}? The apartment will revert to owner occupancy.`)) {
      return;
    }
    setRevokingId(tenant.id);
    try {
      await tenantRequestApi.revokeTenancy();
      showSuccess("Tenancy revoked successfully");
      await load();
    } catch (err) {
      const axiosError = err as { response?: { data?: { error?: string } } };
      showError(axiosError?.response?.data?.error || "Failed to revoke tenancy");
    } finally {
      setRevokingId(null);
    }
  };

  return (
    <div className="card bg-white border border-light-subtle rounded-3 shadow-sm mb-4">
      <div className="card-header bg-white border-bottom border-light-subtle px-4 py-3 d-flex align-items-center gap-2">
        <i className="bi bi-clock-history me-1" />
        <h6 className="fw-bold mb-0" style={{ color: '#1a1f36' }}>Tenant History</h6>
      </div>

      <div className="card-body px-4 py-3">
        {loading ? (
          <div className="d-flex flex-column gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 84, borderRadius: 12 }} />
            ))}
          </div>
        ) : tenants.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-clock-history d-block mb-2" style={{ fontSize: '2rem', color: '#d1d5db' }} />
            <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>No tenant history</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {tenants.map((t) => {
              const isCurrent = t.isActive && !t.moveOutDate;
              const { bg, color } = getAvatarColor(t.user.name);
              return (
                <div
                  key={t.id}
                  onClick={() => navigate(`/tenant/${t.id}`)}
                  role="button"
                  className="d-flex align-items-center justify-content-between gap-3 p-3 rounded-3 border"
                  style={{
                    borderColor: isCurrent ? '#a7f3d0' : '#f3f4f6',
                    backgroundColor: isCurrent ? '#f0fdf4' : '#fff',
                    cursor: 'pointer',
                  }}
                >
                  {/* Left — avatar + details */}
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
                        {isCurrent ? (
                          <span
                            className="badge rounded-pill fw-medium"
                            style={{ backgroundColor: '#dcfce7', color: '#166534', fontSize: '0.7rem' }}
                          >
                            Current
                          </span>
                        ) : (
                          <span
                            className="badge rounded-pill fw-medium"
                            style={{ backgroundColor: '#f3f4f6', color: '#6b7280', fontSize: '0.7rem' }}
                          >
                            Past
                          </span>
                        )}
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

                  {/* Right — revoke action (current tenant only) */}
                  {isCurrent && (
                    <button
                      type="button"
                      disabled={revokingId === t.id}
                      onClick={(e) => { e.stopPropagation(); handleRevoke(t); }}
                      className="btn btn-sm fw-semibold d-inline-flex align-items-center gap-1 flex-shrink-0"
                      style={{ backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '8px', fontSize: '0.8rem' }}
                    >
                      {revokingId === t.id ? (
                        <span className="spinner-border spinner-border-sm" />
                      ) : (
                        <Ban size={15} />
                      )}
                      Revoke
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantHistorySection;
