import React, { useState } from 'react';
import AppTable, { type TableColumn } from '../../../components/AppTable/AppTable';
import type { Visitor } from '../types/visitor.types';
import VisitorStatusBadge from './VisitorStatusBadge';
import { highlightMatch } from '../../../utils/highlight';
import { getInitials, getAvatarColor } from '../../residents/components/residentTableHelpers';

interface VisitorTableProps {
  visitors: Visitor[];
  loading: boolean;
  search?: string;
  isResident?: boolean;
  onApprove?: (visitorId: number) => void;
  onReject?: (visitorId: number) => void;
  onCancel?: (visitorId: number) => void;
}

const formatDateTime = (dateStr: string | null) => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return dateStr;
  }
};

const VisitorTable: React.FC<VisitorTableProps> = ({
  visitors,
  loading,
  search = '',
  isResident = false,
  onApprove,
  onReject,
  onCancel,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const columns: TableColumn<Visitor>[] = [
    {
      key: 'name',
      label: 'Visitor Details',
      width: '24%',
      align: 'start',
      headerAlign: 'start',
      headerPaddingLeft: '1.25rem',
      render: (v) => {
        const { bg, color } = getAvatarColor(v.name);
        return (
          <div className="d-flex align-items-center gap-3 py-1.5 ps-2">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold shadow-xs border border-white"
              style={{
                background: bg,
                color: color,
                width: '40px',
                height: '40px',
                fontSize: '0.85rem',
              }}
            >
              {getInitials(v.name)}
            </div>
            <div className="min-w-0">
              <p className="fw-semibold text-dark m-0 text-truncate" style={{ fontSize: '0.9rem', lineHeight: '1.3' }}>
                {highlightMatch(v.name, search)}
              </p>
              <p className="m-0 text-muted small d-flex align-items-center gap-1 mt-0.5" style={{ fontSize: '0.78rem' }}>
                <i className="bi bi-telephone text-secondary" style={{ fontSize: '0.75rem' }} />
                {highlightMatch(v.phone, search)}
              </p>
              {v.vehicleNumber && (
                <span className="badge bg-light text-secondary border border-light-subtle mt-1 font-monospace" style={{ fontSize: '0.68rem', fontWeight: 500 }}>
                  <i className="bi bi-car-front me-1" />
                  {v.vehicleNumber}
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: 'type',
      label: 'Type',
      width: '12%',
      align: 'center',
      headerAlign: 'center',
      render: (v) => (
        <div className="d-flex justify-content-center py-1">
          {v.isPreRegistered ? (
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill fw-medium px-2.5 py-1" style={{ fontSize: '0.72rem' }}>
              Pre-Registered
            </span>
          ) : (
            <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle rounded-pill fw-medium px-2.5 py-1" style={{ fontSize: '0.72rem' }}>
              Walk-In
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'purpose',
      label: 'Purpose',
      width: '22%',
      align: 'start',
      headerAlign: 'start',
      render: (v) => (
        <p className="m-0 text-secondary small py-1" style={{ fontSize: '0.84rem', lineHeight: '1.45', wordBreak: 'break-word' }} title={v.purpose}>
          {v.purpose || '—'}
        </p>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '12%',
      align: 'center',
      headerAlign: 'center',
      render: (v) => (
        <div className="d-flex justify-content-center py-1">
          <VisitorStatusBadge status={v.status} size="sm" />
        </div>
      ),
    },
    {
      key: 'checkIn',
      label: 'Check-In / Expected',
      width: '13%',
      align: 'center',
      headerAlign: 'center',
      render: (v) => (
        <div className="d-flex justify-content-center py-1">
          <span className="text-secondary small fw-medium" style={{ fontSize: '0.825rem' }}>
            {v.checkedInAt ? (
              <span className="text-dark">{formatDateTime(v.checkedInAt)}</span>
            ) : v.expectedAt ? (
              <span className="text-primary">Exp: {formatDateTime(v.expectedAt)}</span>
            ) : (
              '—'
            )}
          </span>
        </div>
      ),
    },
    {
      key: 'checkOut',
      label: 'Check-Out',
      width: '10%',
      align: 'center',
      headerAlign: 'center',
      render: (v) => (
        <div className="d-flex justify-content-center py-1">
          <span className="text-secondary small fw-medium" style={{ fontSize: '0.825rem' }}>
            {formatDateTime(v.checkedOutAt)}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '7%',
      align: 'center',
      headerAlign: 'center',
      render: (v) => (
        <div className="d-flex align-items-center justify-content-center gap-1.5 flex-wrap py-1">
          {/* Photo Button */}
          {v.photoUrl && (
            <button
              type="button"
              className="btn btn-sm btn-light border border-light-subtle text-secondary fw-medium p-1 px-2.5 d-inline-flex align-items-center gap-1 shadow-xs"
              onClick={() => setSelectedPhoto(v.photoUrl)}
              style={{ fontSize: '0.75rem', borderRadius: '6px' }}
              title="View Photo"
            >
              <i className="bi bi-image text-primary" /> Photo
            </button>
          )}

          {/* Resident Response Actions */}
          {isResident && v.status === 'Pending' && !v.isPreRegistered && onApprove && onReject && (
            <>
              <button
                type="button"
                className="btn btn-sm btn-success px-2.5 py-1 fw-medium d-inline-flex align-items-center gap-1 shadow-xs"
                onClick={() => onApprove(v.id)}
                style={{ fontSize: '0.75rem', borderRadius: '6px' }}
              >
                <i className="bi bi-check-lg" /> Approve
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-danger px-2.5 py-1 fw-medium d-inline-flex align-items-center gap-1 shadow-xs"
                onClick={() => onReject(v.id)}
                style={{ fontSize: '0.75rem', borderRadius: '6px' }}
              >
                <i className="bi bi-x-lg" /> Reject
              </button>
            </>
          )}

          {/* Resident Pre-Registration Cancel */}
          {isResident && v.status === 'Pending' && v.isPreRegistered && onCancel && (
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary px-2.5 py-1 fw-medium d-inline-flex align-items-center gap-1 shadow-xs"
              onClick={() => onCancel(v.id)}
              style={{ fontSize: '0.75rem', borderRadius: '6px' }}
            >
              <i className="bi bi-trash" /> Cancel
            </button>
          )}

          {!v.photoUrl && (!isResident || v.status !== 'Pending') && (
            <span className="text-muted small">—</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <AppTable
        columns={columns}
        data={visitors}
        loading={loading}
        rowKey={(v) => v.id}
        minWidth="960px"
        emptyTitle="No visitors found"
        emptySubtitle={search ? 'No visitor records match your search query.' : 'No visitor activity recorded yet.'}
        emptyIcon="bi-person-badge"
      />

      {/* ── Photo Preview Modal ── */}
      {selectedPhoto && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 10050 }}
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content border-0 rounded-3 shadow-lg overflow-hidden">
              <div className="modal-header border-bottom p-3 bg-light">
                <h6 className="modal-title fw-bold text-dark mb-0">Visitor Photo</h6>
                <button
                  type="button"
                  className="btn-close shadow-none"
                  onClick={() => setSelectedPhoto(null)}
                />
              </div>
              <div className="modal-body p-3 text-center bg-white">
                <img
                  src={selectedPhoto}
                  alt="Visitor"
                  className="img-fluid rounded-2 border shadow-sm"
                  style={{ maxHeight: '400px', objectFit: 'contain' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VisitorTable;
