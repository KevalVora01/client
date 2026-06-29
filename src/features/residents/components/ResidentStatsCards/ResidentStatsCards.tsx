import { Users, UserCheck, ShieldAlert, UserPlus } from "lucide-react";
import type { Resident } from "../../types/resident.types";

interface ResidentStatsCardsProps {
  residents: Resident[];
  totalCount: number;
}

const ResidentStatsCards = ({ residents, totalCount }: ResidentStatsCardsProps) => {
  // Compute metrics (fallback defaults if needed)
  const activeCount = residents.filter(r => r.isActive).length;
  const ownerCount = residents.filter(r => r.isOwner).length;
  const tenantCount = residents.filter(r => !r.isOwner).length;

  const statItems = [
    {
      label: "Total Residents",
      value: totalCount,
      subtext: `${activeCount} active on this page`,
      icon: Users,
      bgClass: "bg-primary-subtle text-primary",
      subtextClass: "text-primary"
    },
    {
      label: "Active",
      value: activeCount,
      subtext: "On current page",
      icon: UserCheck,
      bgClass: "bg-success-subtle text-success",
      subtextClass: "text-success"
    },
    {
      label: "Owners",
      value: ownerCount,
      subtext: `${residents.filter(r => !r.isActive).length} deactivated`,
      icon: ShieldAlert,
      bgClass: "bg-indigo-subtle text-indigo",
      subtextClass: "text-muted",
      customBg: "#eef2ff",
      customColor: "#4338ca"
    },
    {
      label: "Tenants",
      value: tenantCount,
      subtext: `${ownerCount} owners`,
      icon: UserPlus,
      bgClass: "bg-warning-subtle text-warning-emphasis",
      subtextClass: "text-muted"
    }
  ];

  return (
    /* Bootstrap responsive row: 1 col on mobile, 2 on tablets, 4 on desktop */
    <div className="row g-3">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <div key={index} className="col-12 col-sm-6 col-xl-3">
            <div className="card bg-white border border-light-subtle rounded-3 p-3 h-100 shadow-sm">
              
              {/* Top Row: Label and Icon */}
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

              {/* Bottom Row: Large Number Value & Subtext */}
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