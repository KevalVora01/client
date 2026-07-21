import { PRIORITY_CONFIG } from '../constants/complaintStyles';
import type { ComplaintPriority } from '../types/complaint.types';

const ComplaintPriorityBadge = ({ priority }: { priority: ComplaintPriority }) => {
  const cfg = PRIORITY_CONFIG[priority];

  return (
    <span
      className="fw-medium"
      style={{
        backgroundColor: cfg.bg,
        color: cfg.color,
        fontSize: '0.75rem',
        padding: '3px 10px',
        borderRadius: '6px',
      }}
    >
      {priority}
    </span>
  );
};

export default ComplaintPriorityBadge;