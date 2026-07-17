import { useState } from "react";
import { Ban, Calendar } from "lucide-react";
import useTenantHistory from "../hooks/useTenantHistory";
import { tenantRequestApi } from "../../tenantRequests/api/tenantRequestApi";
import { showError, showSuccess } from "../../../utils/toast";
import type { TenantHistoryItem } from "../../residents/types/resident.types";

const formatDate = (d: string | null): string =>
  d ? new Date(d).toLocaleDateString() : "—";

const TenantHistorySection = () => {
  const { tenants, loading, notOwner, load } = useTenantHistory();
  const [revokingId, setRevokingId] = useState<number | null>(null);

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
          <div className="d-flex flex-column gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 64, borderRadius: 12 }} />
            ))}
          </div>
        ) : tenants.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-clock-history d-block mb-2" style={{ fontSize: '2rem', color: '#d1d5db' }} />
            <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>No tenant history</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-2">
            {tenants.map((t) => {
              const isCurrent = t.isActive && !t.moveOutDate;
              return (
                <div
                  key={t.id}
                  className="d-flex align-items-center justify-content-between gap-3 p-3 rounded-3 border border-light-subtle"
                >
                  <div>
                    <div className="fw-semibold text-dark" style={{ fontSize: '0.92rem' }}>
                      {t.user.name}
                      {isCurrent && (
                        <span
                          className="badge rounded-pill ms-2"
                          style={{ backgroundColor: '#dcfce7', color: '#166534', fontSize: '0.7rem' }}
                        >
                          Current
                        </span>
                      )}
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                      {t.user.email} · {t.user.phone}
                    </div>
                    <div className="text-muted mt-1" style={{ fontSize: '0.8rem' }}>
                      <Calendar size={13} className="me-1" />
                      Moved in: {formatDate(t.moveInDate)}
                      <span className="mx-1">→</span>
                      Moved out: {formatDate(t.moveOutDate)}
                    </div>
                  </div>

                  {isCurrent && (
                    <button
                      type="button"
                      disabled={revokingId === t.id}
                      onClick={() => handleRevoke(t)}
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
