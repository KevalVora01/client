import { Users, UserCheck, ShieldAlert, UserPlus } from "lucide-react";
import type { ResidentStats } from "../../types/resident.types";

interface ResidentStatsCardsProps {
  stats: ResidentStats;
  totalCount: number;
}

const ResidentStatsCards = ({ stats, totalCount }: ResidentStatsCardsProps) => {
  const { totalActive, totalOwners, totalTenants } = stats;

  const statItems = [
    {
      label: "Total Residents",
      value: totalCount,
      subtext: `${totalActive} active`,
      icon: Users,
      bgClass: "bg-primary-subtle text-primary",
      subtextClass: "text-primary"
    },
    {
      label: "Active",
      value: totalActive,
      subtext: "Across all residents",
      icon: UserCheck,
      bgClass: "bg-success-subtle text-success",
      subtextClass: "text-success"
    },
    {
      label: "Owners",
      value: totalOwners,
      subtext: `${totalTenants} tenants`,
      icon: ShieldAlert,
      bgClass: "bg-indigo-subtle text-indigo",
      subtextClass: "text-muted",
      customBg: "#eef2ff",
      customColor: "#4338ca"
    },
    {
      label: "Tenants",
      value: totalTenants,
      subtext: `${totalOwners} owners`,
      icon: UserPlus,
      bgClass: "bg-warning-subtle text-warning-emphasis",
      subtextClass: "text-muted"
    }
  ];

  return (
    <div className="row g-3">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <div key={index} className="col-12 col-sm-6 col-xl-3">
            <div className="card bg-white border border-light-subtle rounded-3 p-3 h-100 shadow-sm">

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
                <span className={`small ${item.subtextClass}`} style={{ fontSize: "0.8rem" }}>
                  {item.subtext}
                </span>
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ResidentStatsCards;