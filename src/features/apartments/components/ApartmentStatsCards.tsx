import { Building2, CheckCircle, XCircle, LayoutGrid } from 'lucide-react';
import type { ApartmentStats } from '../types/apartment.types';

interface ApartmentStatsCardsProps {
  stats: ApartmentStats;
}

const ApartmentStatsCards = ({ stats }: ApartmentStatsCardsProps) => {

  const statItems = [
    {
      label: 'TOTAL UNITS',
      value: stats.totalCount,
      icon: Building2,
      sub: 'All apartment units',
      bgClass: 'bg-primary-subtle text-primary',
      subtextClass: 'text-muted',
    },
    {
      label: 'OCCUPIED',
      value: stats.totalOccupied,
      icon: CheckCircle,
      sub: 'Currently occupied',
      bgClass: 'bg-success-subtle text-success',
      subtextClass: 'text-success',
    },
    {
      label: 'VACANT',
      value: stats.totalVacant,
      icon: XCircle,
      sub: 'Available units',
      bgClass: 'bg-warning-subtle text-warning-emphasis',
      subtextClass: 'text-warning-emphasis',
    },
    {
      label: 'OCCUPANCY RATE',
      value: `${stats.occupancyRate}%`,
      icon: LayoutGrid,
      sub: 'Across all units',
      bgClass: 'bg-purple text-purple',
      subtextClass: 'text-muted',
      customBg: '#f5f3ff',
      customColor: '#7c3aed',
    },
  ];

  return (
    <div className="row g-3 mb-4">
      {statItems.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="col-12 col-sm-6 col-xl-3">
            <div className="card bg-white border border-light-subtle rounded-3 p-3 h-100 shadow-sm">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span
                  className="fw-bold text-muted text-uppercase"
                  style={{ fontSize: '0.68rem', letterSpacing: '0.07em' }}
                >
                  {stat.label}
                </span>
                <div
                  className={`rounded-2 d-flex align-items-center justify-content-center flex-shrink-0 ${stat.bgClass}`}
                  style={{
                    width: '30px',
                    height: '30px',
                    backgroundColor: stat.customBg,
                    color: stat.customColor,
                  }}
                >
                  <Icon size={16} strokeWidth={1.75} />
                </div>
              </div>
              <div>
                <h2 className="fw-bold m-0 lh-1 mb-1" style={{ color: '#1a1f36', fontSize: '2rem' }}>
                  {stat.value}
                </h2>
                <span className={`small ${stat.subtextClass}`} style={{ fontSize: '0.8rem' }}>
                  {stat.sub}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ApartmentStatsCards;