import type { AdminDashboardMetrics } from '../types/maintenance.types';
import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface MaintenanceStatsRowProps {
  metrics: AdminDashboardMetrics | null;
  loading?: boolean;
}

const MaintenanceStatsRow = ({ metrics, loading = false }: MaintenanceStatsRowProps) => {
  const statItems = [
    {
      label: 'Total Collected',
      value: `₹${metrics?.totalCollected ? metrics.totalCollected.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}`,
      subtext: 'Total payments received',
      icon: CheckCircle2,
      bgClass: 'bg-success-subtle text-success',
      subtextColor: '#198754',
    },
    {
      label: 'Total Pending',
      value: `₹${metrics?.totalPending ? metrics.totalPending.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}`,
      subtext: 'Outstanding maintenance dues',
      icon: Clock,
      bgClass: 'bg-warning-subtle text-warning-emphasis',
      subtextColor: '#b45309',
    },
    {
      label: 'Overdue Invoices',
      value: metrics?.overdueCount ?? 0,
      subtext: 'Invoices past due date',
      icon: AlertTriangle,
      bgClass: 'bg-danger-subtle text-danger',
      subtextColor: '#dc2626',
    },
  ];

  return (
    <div className="row g-3">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <div key={index} className="col-12 col-sm-6 col-md-4">
            <div className="card bg-white border border-light-subtle rounded-3 p-3 h-100 shadow-sm">
              {loading || !metrics ? (
                <>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="skeleton" style={{ width: '80px', height: '12px', borderRadius: '4px' }} />
                    <div className="skeleton rounded-2" style={{ width: '30px', height: '30px' }} />
                  </div>
                  <div className="skeleton mb-2" style={{ width: '60%', height: '32px', borderRadius: '4px' }} />
                  <div className="skeleton" style={{ width: '45%', height: '12px', borderRadius: '4px' }} />
                </>
              ) : (
                <>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span
                      className="fw-bold text-muted text-uppercase"
                      style={{ fontSize: '0.68rem', letterSpacing: '0.07em' }}
                    >
                      {item.label}
                    </span>
                    <div
                      className={`rounded-2 d-flex align-items-center justify-content-center flex-shrink-0 ${item.bgClass}`}
                      style={{
                        width: '30px',
                        height: '30px',
                      }}
                    >
                      <Icon size={16} />
                    </div>
                  </div>

                  <div>
                    <h2 className="fw-bold m-0 lh-1 mb-1 text-truncate" style={{ color: '#1a1f36', fontSize: '1.75rem' }} title={String(item.value)}>
                      {item.value}
                    </h2>
                    <span className="small" style={{ fontSize: '0.8rem', color: item.subtextColor }}>
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

export default MaintenanceStatsRow;