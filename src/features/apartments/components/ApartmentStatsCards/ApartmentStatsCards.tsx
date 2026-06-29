import { Building2, CheckCircle, XCircle, LayoutGrid } from 'lucide-react';
import type { Apartment } from '../../types/apartment.types';

interface ApartmentStatsCardsProps {
  apartments: Apartment[];
  totalCount: number;
}

const ApartmentStatsCards = ({ apartments = [], totalCount }: ApartmentStatsCardsProps) => {
  const occupiedCount = apartments.filter((a) => a.isOccupied).length;
  const vacantCount = apartments.filter((a) => !a.isOccupied).length;
  const occupancyRate = apartments.length > 0
    ? Math.round((occupiedCount / apartments.length) * 100)
    : 0;

  const stats = [
    {
      label: 'TOTAL UNITS',
      value: totalCount,
      icon: Building2,
      sub: 'All apartment units',
      bgClass: 'bg-primary-subtle text-primary',
      subtextClass: 'text-muted'
    },
    {
      label: 'OCCUPIED',
      value: occupiedCount,
      icon: CheckCircle,
      sub: 'Currently occupied',
      bgClass: 'bg-success-subtle text-success',
      subtextClass: 'text-success'
    },
    {
      label: 'VACANT',
      value: vacantCount,
      icon: XCircle,
      sub: 'Available units',
      bgClass: 'bg-warning-subtle text-warning-emphasis',
      subtextClass: 'text-warning-emphasis'
    },
    {
      label: 'OCCUPANCY RATE',
      value: `${occupancyRate}%`,
      icon: LayoutGrid,
      sub: 'Based on current page',
      bgClass: 'bg-purple text-purple',
      subtextClass: 'text-muted',
      customBg: '#f5f3ff', // Custom purple theme color sync
      customColor: '#7c3aed'
    },
  ];

  return (
    /* Bootstrap responsive grid container row */
    <div className="row g-3 mb-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="col-12 col-sm-6 col-xl-3">
            <div className="card bg-white border border-light-subtle rounded-3 p-3 h-100 shadow-sm">
              
              {/* Top Row Layout Section */}
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
                    color: stat.customColor
                  }}
                >
                  <Icon size={16} strokeWidth={1.75} />
                </div>
              </div>

              {/* Bottom Value & Subtext Layout Section */}
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