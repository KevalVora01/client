interface ComplaintStatsRowProps {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
}

const ComplaintStatsRow = ({ total, open, inProgress, resolved }: ComplaintStatsRowProps) => {
  return (
    <div className="row g-2 mb-4">
      <div className="col-6 col-md-3">
        <div className="p-3 rounded-3" style={{ backgroundColor: '#f3f4f6' }}>
          <p className="mb-1" style={{ fontSize: '0.8rem', color: '#6b7280' }}>Total complaints</p>
          <p className="mb-0 fw-medium" style={{ fontSize: '1.5rem', color: '#1a1f36' }}>{total}</p>
        </div>
      </div>
      <div className="col-6 col-md-3">
        <div className="p-3 rounded-3" style={{ backgroundColor: '#fef3c7' }}>
          <p className="mb-1" style={{ fontSize: '0.8rem', color: '#92400e' }}>Open</p>
          <p className="mb-0 fw-medium" style={{ fontSize: '1.5rem', color: '#92400e' }}>{open}</p>
        </div>
      </div>
      <div className="col-6 col-md-3">
        <div className="p-3 rounded-3" style={{ backgroundColor: '#dbeafe' }}>
          <p className="mb-1" style={{ fontSize: '0.8rem', color: '#1e40af' }}>In progress</p>
          <p className="mb-0 fw-medium" style={{ fontSize: '1.5rem', color: '#1e40af' }}>{inProgress}</p>
        </div>
      </div>
      <div className="col-6 col-md-3">
        <div className="p-3 rounded-3" style={{ backgroundColor: '#d1fae5' }}>
          <p className="mb-1" style={{ fontSize: '0.8rem', color: '#065f46' }}>Resolved</p>
          <p className="mb-0 fw-medium" style={{ fontSize: '1.5rem', color: '#065f46' }}>{resolved}</p>
        </div>
      </div>
    </div>
  );
};

export default ComplaintStatsRow;