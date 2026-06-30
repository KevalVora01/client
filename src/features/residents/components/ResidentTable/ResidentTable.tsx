import AppTable from '../../../../components/AppTable/AppTable';
import type { TableColumn } from '../../../../components/AppTable/AppTable';
import type { ResidentDetail, ResidentTableProps } from '../../types/resident.types';
import { formatDate, getAvatarColor, getInitials } from './residentTableHelpers';
import RowActions from './RowActions';

const ResidentTable = ({ residents, loading, onView, onEdit, onDeactivate }: ResidentTableProps) => {

  const columns: TableColumn<ResidentDetail>[] = [
    {
      key: 'name',
      label: 'Resident Name',
      render: (r) => {
        const { bg, color } = getAvatarColor(r.user.name);
        return (
          <div className="d-flex align-items-center gap-3 py-1">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold"
              style={{
                background: bg,
                color: color,
                width: '42px',
                height: '42px',
                fontSize: '0.85rem'
              }}
            >
              {getInitials(r.user.name)}
            </div>
            <div>
              <p className="fw-bold m-0 text-dark" style={{ fontSize: '0.925rem', letterSpacing: '-0.01em' }}>
                {r.user.name}
              </p>
              <p className="m-0 text-muted" style={{ fontSize: '0.8rem' }}>
                {r.user.email}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'apartment',
      label: 'Apartment',
      render: (r) => r.apartment ? (
        <div>
          <p className="fw-semibold m-0 text-dark" style={{ fontSize: '0.9rem' }}>
            {r.apartment.block}-{r.apartment.floorNumber}{r.apartment.unitNumber}
          </p>
          <p className="m-0 text-muted" style={{ fontSize: '0.8rem' }}>
            Block {r.apartment.block} - Floor {r.apartment.floorNumber}
          </p>
        </div>
      ) : <span className="text-muted small">—</span>,
    },
    {
      key: 'type',
      label: 'Type',
      render: (r) => (
        <span
          className="badge rounded-pill fw-medium px-3 py-2"
          style={{
            fontSize: '0.8rem',
            backgroundColor: r.isOwner ? '#e0f2fe' : '#e0e7ff',
            color: r.isOwner ? '#0369a1' : '#4f46e5'
          }}
        >
          {r.isOwner ? 'Owner' : 'Tenant'}
        </span>
      ),
    },
    {
      key: 'moveInDate',
      label: 'Move-in Date',
      render: (r) => (
        <span className="text-dark fw-normal" style={{ fontSize: '0.875rem' }}>
          {formatDate(r.moveInDate)}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (r) => (
        <span
          className="badge rounded-pill fw-semibold px-3 py-2"
          style={{
            fontSize: '0.75rem',
            backgroundColor: r.isActive ? '#f0fdf4' : '#e5e7eb',
            color: r.isActive ? '#16a34a' : '#4b5563'
          }}
        >
          {r.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '80px',
      render: (r) => (
        <RowActions
          resident={r}
          onView={() => onView(r)}
          onEdit={() => onEdit(r)}
          onDeactivate={() => onDeactivate(r)}
        />
      ),
    },
  ];

  return (
    <AppTable
      columns={columns}
      data={residents}
      loading={loading}
      rowKey={(r) => r.id}
      emptyTitle="No residents found"
      emptySubtitle="Try adjusting your filters or add a new resident."
    />
  );
};

export default ResidentTable;