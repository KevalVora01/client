import ComplaintCard from './ComplaintCard';
import type { Complaint, ComplaintStatus } from '../types/complaint.types';

interface ComplaintListProps {
  complaints: Complaint[];
  loading: boolean;
  onView: (complaint: Complaint) => void;
  onUpdateStatus?: (complaint: Complaint, status: ComplaintStatus) => void;
  isAdmin?: boolean;
}

const ComplaintList = ({ complaints, loading, onView, onUpdateStatus, isAdmin = false }: ComplaintListProps) => {

  if (loading) {
    return (
      <div className="d-flex flex-column gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="d-flex align-items-start justify-content-between p-3 rounded-3 border border-light-subtle bg-white"
            style={{ gap: '12px' }}
          >
            <div className="flex-grow-1 overflow-hidden">
              <div className="skeleton mb-2" style={{ width: '140px', height: '18px', borderRadius: '6px' }} />
              <div className="skeleton mb-2" style={{ width: '70%', height: '16px' }} />
              <div className="skeleton mb-1" style={{ width: '100%', height: '14px' }} />
              <div className="skeleton mb-2" style={{ width: '45%', height: '14px' }} />
              <div className="skeleton" style={{ width: '120px', height: '12px' }} />
            </div>
            {isAdmin && (
              <div className="skeleton" style={{ width: '130px', height: '32px', borderRadius: '8px' }} />
            )}
          </div>
        ))}
      </div>
    );
  }

  if (complaints.length === 0) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5 text-center">
        <div
          className="rounded-circle d-flex align-items-center justify-content-center mb-3"
          style={{ width: '64px', height: '64px', backgroundColor: '#f3f4f6' }}
        >
          <i className="bi bi-clipboard-check" style={{ fontSize: '1.6rem', color: '#9ca3af' }} />
        </div>
        <p className="fw-semibold mb-1" style={{ fontSize: '0.95rem', color: '#4b5563' }}>No complaints found</p>
        <p className="text-secondary small" style={{ fontSize: '0.8rem', maxWidth: '280px' }}>
          There are no complaints matching your criteria. Try adjusting your filters or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-3">
      {complaints.map((complaint) => (
        <ComplaintCard
          key={complaint.id}
          complaint={complaint}
          onView={onView}
          onUpdateStatus={onUpdateStatus}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  );
};

export default ComplaintList;