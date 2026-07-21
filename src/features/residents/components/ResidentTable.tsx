import AppTable from '../../../components/AppTable/AppTable';
import type { TableColumn } from '../../../components/AppTable/AppTable';
import type { ResidentDetail, ResidentTableProps } from '../types/resident.types';
import { formatDate, getAvatarColor, getInitials } from './residentTableHelpers';
import RowActions from './RowActions';
import { useResidentStore } from '../hooks/useResidentStore';

const ResidentTable = ({ residents, loading, onView, onEdit, onDeactivate }: ResidentTableProps) => {
  const { filters } = useResidentStore();
  const searchVal = filters.search ?? '';

  const highlightMatch = (text: string, search: string) => {
    if (!search || !search.trim()) return <span>{text}</span>;
    const cleanSearch = search.trim();
    const regex = new RegExp(`(${cleanSearch.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, index) =>
          regex.test(part) ? (
            <mark
              key={index}
              style={{
                backgroundColor: '#ffe066',
                color: '#1a1f36',
                padding: '0 2px',
                borderRadius: '3px',
              }}
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

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
                {highlightMatch(r.user.name, searchVal)}
              </p>
              <p className="m-0 text-muted" style={{ fontSize: '0.8rem' }}>
                {highlightMatch(r.user.email, searchVal)}
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
            {highlightMatch(`${r.apartment.block}-${r.apartment.floorNumber}${r.apartment.unitNumber}`, searchVal)}
          </p>
          <p className="m-0 text-muted" style={{ fontSize: '0.8rem' }}>
            Block {highlightMatch(r.apartment.block, searchVal)} - Floor {r.apartment.floorNumber}
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
      key: 'occupant',
      label: 'Occupant',
      render: (r) => (
        <span
          className="badge rounded-pill fw-semibold px-3 py-2"
          style={{
            fontSize: '0.75rem',
            backgroundColor: r.isOccupant ? '#dcfce7' : '#e5e7eb',
            color: r.isOccupant ? '#166534' : '#6b7280'
          }}
        >
          {r.isOccupant ? 'Occupant' : 'Non-occupant'}
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
      emptyIcon="bi-people"
    />
  );
};

export default ResidentTable;