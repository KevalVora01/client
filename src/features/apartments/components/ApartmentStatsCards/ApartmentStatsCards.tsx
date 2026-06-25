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
      accent: 'stat-card--blue',
    },
    {
      label: 'OCCUPIED',
      value: occupiedCount,
      icon: CheckCircle,
      sub: 'Currently occupied',
      accent: 'stat-card--green',
    },
    {
      label: 'VACANT',
      value: vacantCount,
      icon: XCircle,
      sub: 'Available units',
      accent: 'stat-card--amber',
    },
    {
      label: 'OCCUPANCY RATE',
      value: `${occupancyRate}%`,
      icon: LayoutGrid,
      sub: 'Based on current page',
      accent: 'stat-card--purple',
    },
  ];

  return (
    <div className="residents-stats">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className={`stat-card ${stat.accent}`}>
            <div className="stat-card__top">
              <span className="stat-card__label">{stat.label}</span>
              <div className="stat-card__icon-box">
                <Icon size={18} strokeWidth={1.75} />
              </div>
            </div>
            <div className="stat-card__value">{stat.value}</div>
            <div className="stat-card__sub">{stat.sub}</div>
          </div>
        );
      })}
    </div>
  );
};

export default ApartmentStatsCards;