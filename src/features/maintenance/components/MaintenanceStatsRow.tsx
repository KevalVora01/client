import type { AdminDashboardMetrics } from '../types/maintenance.types';

const MaintenanceStatsRow = ({ metrics }: { metrics: AdminDashboardMetrics }) => {
  return (
    <div className="row g-2 mb-4">
      <div className="col-6 col-md-4">
        <div className="p-3 rounded-3" style={{ backgroundColor: '#d1fae5' }}>
          <p className="mb-1" style={{ fontSize: '0.8rem', color: '#065f46' }}>Total collected</p>
          <p className="mb-0 fw-medium" style={{ fontSize: '1.4rem', color: '#065f46' }}>
            ₹{metrics.totalCollected.toFixed(2)}
          </p>
        </div>
      </div>
      <div className="col-6 col-md-4">
        <div className="p-3 rounded-3" style={{ backgroundColor: '#fef3c7' }}>
          <p className="mb-1" style={{ fontSize: '0.8rem', color: '#92400e' }}>Total pending</p>
          <p className="mb-0 fw-medium" style={{ fontSize: '1.4rem', color: '#92400e' }}>
            ₹{metrics.totalPending.toFixed(2)}
          </p>
        </div>
      </div>
      <div className="col-6 col-md-4">
        <div className="p-3 rounded-3" style={{ backgroundColor: '#fee2e2' }}>
          <p className="mb-1" style={{ fontSize: '0.8rem', color: '#991b1b' }}>Overdue invoices</p>
          <p className="mb-0 fw-medium" style={{ fontSize: '1.4rem', color: '#991b1b' }}>
            {metrics.overdueCount}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceStatsRow;