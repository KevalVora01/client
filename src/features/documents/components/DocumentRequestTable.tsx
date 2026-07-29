import AppTable from '../../../components/AppTable/AppTable';
import type { TableColumn } from '../../../components/AppTable/AppTable';
import type { DocumentRequestItem } from '../types/documentRequest.types';
import DocumentRowActions from './DocumentRowActions';

const STATUS_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  PENDING: { label: 'Pending', bg: '#fef3c7', color: '#92400e' },
  APPROVED: { label: 'Approved', bg: '#dcfce7', color: '#166534' },
  UPLOADED: { label: 'Uploaded', bg: '#dbeafe', color: '#1e40af' },
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
  const colCount = isAdmin ? 6 : isSent ? 4 : 5;
  const equalWidth = `${(100 / colCount).toFixed(2)}%`;

  const columns: TableColumn<DocumentRequestItem>[] = [
    {
      key: 'document',
      label: 'Document Type',
      width: equalWidth,
      headerPaddingLeft: '1.5rem',
      render: (r) => (
        <div className="py-1 min-w-0">
          <p className="fw-semibold m-0 text-dark text-truncate" style={{ fontSize: '0.875rem', letterSpacing: '-0.01em' }}>
            {r.documentType}
          </p>
          {r.customDocumentName && (
            <p className="m-0 text-muted text-truncate" style={{ fontSize: '0.78rem' }}>
              {r.customDocumentName}
            </p>
          )}
          {r.status === 'REJECTED' && r.rejectionReason ? (
            <p className="m-0 text-danger text-truncate" style={{ fontSize: '0.78rem' }} title={`Decline Reason: ${r.rejectionReason}`}>
              Reason: {r.rejectionReason}
            </p>
          ) : r.note ? (
            <p className="m-0 text-muted text-truncate" style={{ fontSize: '0.78rem', maxWidth: '220px' }}>
              {r.note}
            </p>
          ) : null}
        </div>
      ),
    },
    ...(!isSent
      ? [
          {
            key: 'party',
            label: 'Requested By',
            width: equalWidth,
            align: 'center' as const,
            render: (r: DocumentRequestItem) => {
              const party = r.requester;
              const partyName = party?.user?.name ?? (r.requesterRole || `User #${r.requesterId}`);
              const partyEmail = party?.user?.email;

              return (
                <div className="text-center">
                  <span className="fw-semibold text-dark d-block" style={{ fontSize: '0.875rem' }}>
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
        ]
      : []),
    ...(isAdmin
      ? [
          {
            key: 'apartment',
            label: 'Apartment',
            width: equalWidth,
            align: 'center' as const,
            render: (r: DocumentRequestItem) => (
              <span className="fw-semibold text-dark" style={{ fontSize: '0.875rem' }}>
                {r.apartment
                  ? `${r.apartment.block}-${r.apartment.floorNumber}${r.apartment.unitNumber}`
                  : `Apt #${r.apartmentId}`}
              </span>
            ),
          },
        ]
      : []),
    {
      key: 'createdAt',
      label: 'Requested On',
      width: equalWidth,
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
      width: equalWidth,
      align: 'center',
      render: (r) => {
        const s = STATUS_BADGE[r.status] ?? STATUS_BADGE.PENDING;
        return (
          <span
            className="d-inline-block fw-bold rounded-pill border text-center text-nowrap"
            style={{
              backgroundColor: s.bg,
              color: s.color,
              borderColor: `${s.color}40`,
              fontSize: '0.72rem',
              letterSpacing: '0.5px',
              padding: '4px 14px',
              minWidth: '100px',
            }}
          >
            {s.label}
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      width: equalWidth,
      align: 'center',
      render: (r) => (
        <div className="d-flex justify-content-center">
          <DocumentRowActions
            item={r}
            isSent={isSent}
            isAdmin={isAdmin}
            onUpload={onUpload}
            onReject={onReject}
            onCancel={onCancel}
            onViewDetail={onViewDetail}
          />
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
