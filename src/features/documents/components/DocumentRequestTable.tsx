import AppTable from '../../../components/AppTable/AppTable';
import type { TableColumn } from '../../../components/AppTable/AppTable';
import type { DocumentRequestItem } from '../types/documentRequest.types';

const STATUS_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  PENDING: { label: 'Pending Review', bg: '#fef3c7', color: '#92400e' },
  APPROVED: { label: 'Approved', bg: '#dcfce7', color: '#166534' },
  UPLOADED: { label: 'Uploaded & Ready', bg: '#dbeafe', color: '#1e40af' },
  REJECTED: { label: 'Declined', bg: '#fee2e2', color: '#991b1b' },
};

interface DocumentRequestTableProps {
  requests: DocumentRequestItem[];
  loading: boolean;
  isSent: boolean;
  isAdmin: boolean;
  onUpload: (item: DocumentRequestItem) => void;
  onReject: (item: DocumentRequestItem) => void;
  onCancel: (id: number) => void;
  onViewDetail: (item: DocumentRequestItem) => void;
}

const DocumentRequestTable = ({
  requests,
  loading,
  isSent,
  isAdmin,
  onUpload,
  onReject,
  onCancel,
  onViewDetail,
}: DocumentRequestTableProps) => {
  const columns: TableColumn<DocumentRequestItem>[] = [
    {
      key: 'document',
      label: 'Document Type',
      width: '24%',
      headerPaddingLeft: '1.5rem',
      render: (r) => (
        <div className="py-1 min-w-0">
          <p className="fw-bold m-0 text-dark text-truncate" style={{ fontSize: '0.925rem', letterSpacing: '-0.01em' }}>
            {r.documentType}
          </p>
          {r.customDocumentName ? (
            <p className="m-0 text-muted text-truncate" style={{ fontSize: '0.8rem' }}>
              {r.customDocumentName}
            </p>
          ) : r.note ? (
            <p className="m-0 text-muted text-truncate" style={{ fontSize: '0.8rem', maxWidth: '240px' }}>
              {r.note}
            </p>
          ) : null}
        </div>
      ),
    },
    {
      key: 'party',
      label: isSent ? 'Requested To' : 'Requested By',
      width: '18%',
      align: 'center',
      render: (r) => {
        const party = isSent ? r.target : r.requester;
        const partyName = party?.user?.name ?? (isSent ? (r.targetRole || 'Admin/Owner') : (r.requesterRole || `User #${r.requesterId}`));
        const partyEmail = party?.user?.email;

        return (
          <div className="text-center">
            <span className="fw-semibold text-dark d-block" style={{ fontSize: '0.9rem' }}>
              {partyName}
            </span>
            {partyEmail && (
              <span className="text-muted d-block" style={{ fontSize: '0.78rem' }}>
                {partyEmail}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: 'apartment',
      label: 'Apartment',
      width: '15%',
      align: 'center',
      render: (r) => (
        <span className="fw-semibold text-dark" style={{ fontSize: '0.9rem' }}>
          {r.apartment
            ? `${r.apartment.block}-${r.apartment.floorNumber}${r.apartment.unitNumber}`
            : `Apt #${r.apartmentId}`}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Requested On',
      width: '15%',
      align: 'center',
      render: (r) => (
        <span className="text-dark" style={{ fontSize: '0.875rem' }}>
          {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '14%',
      align: 'center',
      render: (r) => {
        const s = STATUS_BADGE[r.status] ?? STATUS_BADGE.PENDING;
        return (
          <span
            className="fw-semibold px-3 py-2 rounded-pill d-inline-block"
            style={{ backgroundColor: s.bg, color: s.color, fontSize: '0.78rem' }}
          >
            {s.label}
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '14%',
      align: 'center',
      render: (r) => (
        <div className="d-flex align-items-center justify-content-center gap-1.5">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetail(r);
            }}
            style={{ borderRadius: '6px', fontSize: '0.78rem' }}
            title="View Details"
          >
            <i className="bi bi-eye" />
          </button>

          {r.status === 'UPLOADED' && r.documentUrl && (
            <a
              href={r.documentUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-sm btn-success d-inline-flex align-items-center gap-1"
              onClick={(e) => e.stopPropagation()}
              style={{ borderRadius: '6px', fontSize: '0.78rem' }}
              title="Download Document"
            >
              <i className="bi bi-download" />
            </a>
          )}

          {isAdmin && r.status === 'APPROVED' && (
            <>
              <button
                type="button"
                className="btn btn-sm btn-dark d-inline-flex align-items-center gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpload(r);
                }}
                style={{ borderRadius: '6px', fontSize: '0.78rem', backgroundColor: '#1a1f36' }}
                title="Upload Document"
              >
                <i className="bi bi-upload" />
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onReject(r);
                }}
                style={{ borderRadius: '6px', fontSize: '0.78rem' }}
                title="Decline Request"
              >
                <i className="bi bi-x-circle" />
              </button>
            </>
          )}

          {!isAdmin && !isSent && r.status === 'PENDING' && (
            <>
              <button
                type="button"
                className="btn btn-sm btn-dark d-inline-flex align-items-center gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpload(r);
                }}
                style={{ borderRadius: '6px', fontSize: '0.78rem', backgroundColor: '#1a1f36' }}
                title="Upload Document"
              >
                <i className="bi bi-upload" />
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onReject(r);
                }}
                style={{ borderRadius: '6px', fontSize: '0.78rem' }}
                title="Decline Request"
              >
                <i className="bi bi-x-circle" />
              </button>
            </>
          )}

          {isSent && r.status === 'PENDING' && (
            <button
              type="button"
              className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1"
              onClick={(e) => {
                e.stopPropagation();
                onCancel(r.id);
              }}
              style={{ borderRadius: '6px', fontSize: '0.78rem' }}
              title="Cancel Request"
            >
              <i className="bi bi-trash" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <AppTable
      columns={columns}
      data={requests}
      loading={loading}
      rowKey={(r) => r.id}
      emptyTitle="No document requests"
      emptySubtitle="Document requests will appear here once created."
      emptyIcon="bi-file-earmark-text"
      skeletonRows={5}
    />
  );
};

export default DocumentRequestTable;
