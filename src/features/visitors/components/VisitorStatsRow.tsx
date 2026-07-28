import React from 'react';
import type { VisitorDashboardMetrics } from '../types/visitor.types';
import { Users, LogIn, Clock } from 'lucide-react';

interface VisitorStatsRowProps {
  metrics: VisitorDashboardMetrics | null;
  loading?: boolean;
}

export const VisitorStatsRow: React.FC<VisitorStatsRowProps> = ({ metrics, loading }) => {
  return (
    <div className="row g-3 mb-4">
      {/* Visitors Today */}
      <div className="col-12 col-sm-4">
        <div
          className="p-3 rounded-3 bg-white border shadow-sm h-100 d-flex align-items-center justify-content-between"
          style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
        >
          <div>
            <span className="text-muted small fw-semibold text-uppercase" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>
              Visitors Today
            </span>
            <h3 className="fw-bold mb-0 mt-1" style={{ color: '#1a1f36' }}>
              {loading ? '...' : metrics?.visitorsToday ?? 0}
            </h3>
          </div>
          <div
            className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: 44, height: 44, backgroundColor: '#e0e7ff', color: '#4338ca' }}
          >
            <Users size={22} />
          </div>
        </div>
      </div>

      {/* Currently Inside */}
      <div className="col-12 col-sm-4">
        <div
          className="p-3 rounded-3 bg-white border shadow-sm h-100 d-flex align-items-center justify-content-between"
          style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
        >
          <div>
            <span className="text-muted small fw-semibold text-uppercase" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>
              Currently Inside
            </span>
            <h3 className="fw-bold mb-0 mt-1" style={{ color: '#16a34a' }}>
              {loading ? '...' : metrics?.currentlyInside ?? 0}
            </h3>
          </div>
          <div
            className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: 44, height: 44, backgroundColor: '#dcfce7', color: '#15803d' }}
          >
            <LogIn size={22} />
          </div>
        </div>
      </div>

      {/* Avg Visit Duration */}
      <div className="col-12 col-sm-4">
        <div
          className="p-3 rounded-3 bg-white border shadow-sm h-100 d-flex align-items-center justify-content-between"
          style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
        >
          <div>
            <span className="text-muted small fw-semibold text-uppercase" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>
              Avg Visit Duration
            </span>
            <h3 className="fw-bold mb-0 mt-1" style={{ color: '#0284c7' }}>
              {loading ? '...' : `${metrics?.averageVisitDurationMinutes ?? 0} mins`}
            </h3>
          </div>
          <div
            className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: 44, height: 44, backgroundColor: '#e0f2fe', color: '#0369a1' }}
          >
            <Clock size={22} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorStatsRow;
