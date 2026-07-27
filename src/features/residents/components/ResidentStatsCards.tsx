import { Users, UserCheck, ShieldAlert, UserPlus } from "lucide-react";
import type { ResidentStats } from "../types/resident.types";

interface ResidentStatsCardsProps {
  stats: ResidentStats;
  loading?: boolean;
}

const ResidentStatsCards = ({ stats, loading = false }: ResidentStatsCardsProps) => {
  const { totalCount, totalActive, totalOwners, totalTenants } = stats;

  const statItems = [
    {
      label: "Total Residents",
      value: totalCount,
      subtext: "Total registered residents",
      icon: Users,
      bgClass: "bg-primary-subtle text-primary",
      subtextColor: "#0d6efd"
    },
    {
      label: "Active",
      value: totalActive,
      subtext: "Across all residents",
      icon: UserCheck,
      bgClass: "bg-success-subtle text-success",
      subtextColor: "#198754"
    },
    {
      label: "Owners",
      value: totalOwners,
      subtext: `out of ${totalActive} active`,
      icon: ShieldAlert,
      bgClass: "bg-indigo-subtle text-indigo",
      customBg: "#eef2ff",
      customColor: "#4338ca",
      subtextColor: "#4338ca"
    },
    {
      label: "Tenants",
      value: totalTenants,
      subtext: `out of ${totalActive} active`,
      icon: UserPlus,
      bgClass: "bg-warning-subtle text-warning-emphasis",
      subtextColor: "#b45309"
    }
  ];
  return (
    <div className="row g-3">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <div key={index} className="col-12 col-sm-6 col-xl-3">
            <div className="card bg-white border border-light-subtle rounded-3 p-3 h-100 shadow-sm">

              {loading ? (
                <>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="skeleton" style={{ width: '80px', height: '12px' }} />
                    <div className="skeleton" style={{ width: '30px', height: '30px', borderRadius: '6px' }} />
                  </div>
                  <div className="skeleton mb-2" style={{ width: '60%', height: '32px' }} />
                  <div className="skeleton" style={{ width: '45%', height: '12px' }} />
                </>
              ) : (
                <>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span
                      className="fw-bold text-muted text-uppercase"
                      style={{ fontSize: "0.68rem", letterSpacing: "0.07em" }}
                    >
                      {item.label}
                    </span>
                    <div
                      className={`rounded-2 d-flex align-items-center justify-content-center flex-shrink-0 ${item.bgClass}`}
                      style={{
                        width: "30px",
                        height: "30px",
                        backgroundColor: item.customBg,
                        color: item.customColor
                      }}
                    >
                      <Icon size={16} />
                    </div>
                  </div>

                  <div>
                    <h2 className="fw-bold m-0 lh-1 mb-1" style={{ color: "#1a1f36", fontSize: "2rem" }}>
                      {item.value}
                    </h2>
                    <span className="small" style={{ fontSize: "0.8rem", color: item.subtextColor }}>
                      {item.subtext}
                    </span>
                  </div>
                </>
              )}

            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ResidentStatsCards;