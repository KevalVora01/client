import AppTable from '../../../../components/AppTable/AppTable';
import type { TableColumn } from '../../../../components/AppTable/AppTable';
import type { ResidentDetail, ResidentTableProps } from '../../types/resident.types';
import { formatDate, getAvatarColor, getInitials } from './residentTableHelpers';
import RowActions from './RowActions';
import './ResidentTable.css'


const ResidentTable = ({ residents, loading, onView, onEdit, onDeactivate }: ResidentTableProps) => {

  const columns: TableColumn<ResidentDetail>[] = [
    {
      key: 'name',
      label: 'Resident Name',
      render: (r) => {
        const { bg, color } = getAvatarColor(r.user.name);
        return (
          <div className="rt-resident">
            <div className="rt-avatar" style={{ background: bg, color }}>
              {getInitials(r.user.name)}
            </div>
            <div>
              <p className="rt-name">{r.user.name}</p>
              <p className="rt-email">{r.user.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'apartment',
      label: 'Apartment',
      render: (r) => r.apartment ? (
        <>
          <p className="rt-unit">Unit {r.apartment.flateNumber}</p>
          <p className="rt-floor">Floor {r.apartment.block}</p>
        </>
      ) : <span className="rt-muted">—</span>,
    },
    {
      key: 'type',
      label: 'Type',
      render: (r) => (
        <span className={`rt-badge rt-badge--${r.isOwner ? 'owner' : 'tenant'}`}>
          {r.isOwner ? 'Owner' : 'Tenant'}
        </span>
      ),
    },
    {
      key: 'moveInDate',
      label: 'Move-in Date',
      render: (r) => <span className="rt-muted">{formatDate(r.moveInDate)}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (r) => (
        <span className={`rt-badge rt-badge--${r.isActive ? 'active' : 'inactive'}`}>
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