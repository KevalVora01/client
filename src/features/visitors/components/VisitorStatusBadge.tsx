import React from 'react';
import { STATUS_CONFIG } from '../constants/visitorStyles';
import type { VisitorStatus } from '../types/visitor.types';

interface VisitorStatusBadgeProps {
  status: VisitorStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const VisitorStatusBadge: React.FC<VisitorStatusBadgeProps> = ({ status, size = 'md' }) => {
  const cfg = STATUS_CONFIG[status];
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  return (
    <span
      className="d-inline-flex align-items-center gap-1.5 fw-semibold shadow-xs"
      style={{
        backgroundColor: cfg.bg,
        color: cfg.color,
        fontSize: isSm ? '0.7rem' : isLg ? '0.85rem' : '0.75rem',
        padding: isSm ? '2px 8px' : isLg ? '5px 14px' : '3px 10px',
        borderRadius: '20px',
        border: `1px solid ${cfg.color}30`,
      }}
    >
      <i className={`bi ${cfg.icon}`} style={{ fontSize: isSm ? '0.65rem' : '0.75rem' }} />
      {status}
    </span>
  );
};

export default VisitorStatusBadge;