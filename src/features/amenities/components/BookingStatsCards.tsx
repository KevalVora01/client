import { CalendarCheck, CheckCircle2, Clock, XCircle } from "lucide-react";
import type { BookingStats } from "../types/amenity.types";

interface BookingStatsCardsProps {
  stats: BookingStats | null;
  loading?: boolean;
}

const BookingStatsCards = ({ stats, loading = false }: BookingStatsCardsProps) => {
  const confirmed = stats?.confirmed ?? stats?.Confirmed ?? 0;
  const pending = stats?.pending ?? stats?.Pending ?? 0;
  const rejected = stats?.rejected ?? stats?.Rejected ?? 0;
  const cancelled = stats?.cancelled ?? stats?.Cancelled ?? 0;
  const totalCount = stats?.total ?? (confirmed + pending + rejected + cancelled);

  const statItems = [
    {
      label: "Total Bookings",
      value: totalCount,
      subtext: "All booking requests",
      icon: CalendarCheck,
      bgClass: "bg-primary-subtle text-primary",
      subtextColor: "#0d6efd",
    },
    {
      label: "Confirmed",
      value: confirmed,
      subtext: totalCount > 0 ? `${Math.round((confirmed / totalCount) * 100)}% of requests` : "Approved & confirmed",
      icon: CheckCircle2,
      bgClass: "bg-success-subtle text-success",
      subtextColor: "#198754",
    },
    {
      label: "Pending",
      value: pending,
      subtext: "Awaiting committee vote",
      icon: Clock,
      bgClass: "bg-warning-subtle text-warning-emphasis",
      customBg: "#fffbeb",
      customColor: "#b45309",
      subtextColor: "#b45309",
    },
    {
      label: "Rejected / Cancelled",
      value: rejected + cancelled,
      subtext: `${rejected} rejected, ${cancelled} cancelled`,
      icon: XCircle,
      bgClass: "bg-danger-subtle text-danger",
      customBg: "#fef2f2",
      customColor: "#dc2626",
      subtextColor: "#dc2626",
    },
  ];

  return (
    <div className="row g-3">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <div key={index} className="col-12 col-sm-6 col-xl-3">
            <div className="card bg-white border border-light-subtle rounded-3 p-3 h-100 shadow-sm">
              {loading && !stats ? (
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
                        color: item.customColor,
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

export default BookingStatsCards;
