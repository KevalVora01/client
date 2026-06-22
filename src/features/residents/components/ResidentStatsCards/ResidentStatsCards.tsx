import { Users, Building2, FileText, TrendingUp } from 'lucide-react';
import type { ResidentDetail } from '../../types/resident.types';

interface ResidentStatsCardsProps {
  residents: ResidentDetail[];
  totalCount: number;
}

const ResidentStatsCards = ({ residents = [], totalCount }: ResidentStatsCardsProps) => {
  const activeCount = residents.filter((r) => r.isActive).length;
  const ownerCount = residents.filter((r) => r.isOwner).length;
  const inactiveCount = residents.filter((r) => !r.isActive).length;

  const stats = [
    {
      label: 'TOTAL RESIDENTS',
      value: totalCount,
      icon: Users,
      sub: `${activeCount} active on this page`,
      accent: 'stat-card--blue',
    },
    {
      label: 'ACTIVE',
      value: activeCount,
      icon: Building2,
      sub: 'On current page',
      accent: 'stat-card--green',
    },
    {
      label: 'OWNERS',
      value: ownerCount,
      icon: FileText,
      sub: `${inactiveCount} deactivated`,
      accent: 'stat-card--purple',
    },
    {
      label: 'TENANTS',
      value: residents.filter((r) => !r.isOwner).length,
      icon: TrendingUp,
      sub: `${ownerCount} owners`,
      accent: 'stat-card--amber',
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

export default ResidentStatsCards;