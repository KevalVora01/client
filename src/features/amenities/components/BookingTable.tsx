import AppTable from '../../../components/AppTable/AppTable';
import type { TableColumn } from '../../../components/AppTable/AppTable';
import BookingStatusBadge from './BookingStatusBadge';
import BookingRowActions from './BookingRowActions';
import type { Booking } from '../types/amenity.types';
import { Calendar, Clock, Armchair } from 'lucide-react';

interface BookingTableProps {
  bookings: Booking[];
  loading: boolean;
  amenityMap: Record<number, string>;
  isAdmin: boolean;
  onView: (booking: Booking) => void;
  onCancel?: (booking: Booking) => void;
  onSettle?: (booking: Booking) => void;
}

const BookingTable = ({
  bookings,
  loading,
  amenityMap,
  isAdmin,
  onView,
  onCancel,
  onSettle,
}: BookingTableProps) => {
  const firstColWidth = isAdmin ? '22%' : '25%';
  const otherColWidth = isAdmin ? '13%' : '15%';

  const columns: TableColumn<Booking>[] = [
    {
      key: 'amenity',
      label: 'Amenity',
      width: firstColWidth,
      render: (b) => {
        const amenityName = amenityMap[b.amenityId] ?? `Amenity #${b.amenityId}`;
        return (
          <div className="d-flex align-items-center gap-2 py-1 overflow-hidden">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
              style={{
                background: '#f3f4f6',
                color: '#1a1f36',
                width: '36px',
                height: '36px',
              }}
            >
              <Armchair size={18} />
            </div>
            <div className="overflow-hidden text-truncate">
              <p className="fw-bold m-0 text-dark text-truncate" style={{ fontSize: '0.88rem', letterSpacing: '-0.01em' }}>
                {amenityName}
              </p>
              {b.purpose && (
                <p className="m-0 text-muted text-truncate" style={{ fontSize: '0.78rem' }}>
                  {b.purpose}
                </p>
              )}
            </div>
          </div>
        );
      },
    },
    ...(isAdmin
      ? ([
          {
            key: 'requestedBy',
            label: 'Requested By',
            width: otherColWidth,
            render: (b: Booking) => {
              const residentName = b.resident?.name || (b.residentId ? `Resident #${b.residentId}` : '—');

              let aptDisplay = '';
              const apt = b.apartment;
              if (apt) {
                if (apt.unitFormatted) {
                  aptDisplay = apt.unitFormatted;
                } else {
                  const block = apt.block || '';
                  const floor = apt.floorNumber !== undefined && apt.floorNumber !== null ? String(apt.floorNumber) : '';
                  const unit = String(apt.unitNumber || '');
                  const fullUnit = unit.startsWith(floor) ? unit : `${floor}${unit}`;
                  aptDisplay = `${block}-${fullUnit}`;
                }
              } else if (b.apartmentId) {
                aptDisplay = `Apt #${b.apartmentId}`;
              }

              return (
                <div className="py-1 overflow-hidden">
                  <p className="fw-bold m-0 text-dark text-truncate" style={{ fontSize: '0.88rem' }}>
                    {residentName}
                  </p>
                  {aptDisplay ? (
                    <p className="m-0 text-muted text-truncate" style={{ fontSize: '0.78rem' }}>
                      {aptDisplay}
                    </p>
                  ) : null}
                </div>
              );
            },
          },
        ] as TableColumn<Booking>[])
      : []),
    {
      key: 'bookingDate',
      label: 'Date',
      width: otherColWidth,
      align: 'center',
      render: (b) => (
        <span className="d-inline-flex align-items-center gap-1 text-dark fw-medium" style={{ fontSize: '0.85rem' }}>
          <Calendar size={14} className="text-secondary" />
          {b.bookingDate}
        </span>
      ),
    },
    {
      key: 'time',
      label: 'Time Slot',
      width: otherColWidth,
      align: 'center',
      render: (b) => (
        <span className="d-inline-flex align-items-center gap-1 text-secondary" style={{ fontSize: '0.85rem' }}>
          <Clock size={14} />
          {b.startTime} – {b.endTime}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: otherColWidth,
      align: 'center',
      render: (b) => <BookingStatusBadge status={b.status} />,
    },
    {
      key: 'payment',
      label: 'Payment',
      width: otherColWidth,
      align: 'center',
      render: (b) =>
        b.paidAt ? (
          <span
            className="badge rounded-pill fw-medium px-2 py-1"
            style={{
              fontSize: '0.75rem',
              backgroundColor: '#dcfce7',
              color: '#166534',
            }}
          >
            Paid
          </span>
        ) : (
          <span
            className="badge rounded-pill fw-medium px-2 py-1"
            style={{
              fontSize: '0.75rem',
              backgroundColor: '#f3f4f6',
              color: '#6b7280',
            }}
          >
            Unpaid
          </span>
        ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: otherColWidth,
      align: 'center',
      render: (b) => (
        <div className="d-flex justify-content-center">
          <BookingRowActions
            booking={b}
            isAdmin={isAdmin}
            onView={onView}
            onCancel={onCancel}
            onSettle={onSettle}
          />
        </div>
      ),
    },
  ];

  return (
    <AppTable
      columns={columns}
      data={bookings}
      loading={loading}
      rowKey={(b) => b.id}
      emptyTitle="No bookings found"
      emptySubtitle={isAdmin ? "No bookings match your selected filters." : "You have no bookings under this tab."}
      emptyIcon="bi-calendar-x"
      tableStyle={{ tableLayout: 'fixed' }}
    />
  );
};

export default BookingTable;
