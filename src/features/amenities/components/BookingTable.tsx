import AppTable from '../../../components/AppTable/AppTable';
import type { TableColumn } from '../../../components/AppTable/AppTable';
import BookingStatusBadge from './BookingStatusBadge';
import type { Booking } from '../types/amenity.types';
import { Gavel, Eye, Calendar, Clock, CreditCard, Armchair, X } from 'lucide-react';

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
  const columns: TableColumn<Booking>[] = [
    {
      key: 'id',
      label: 'ID',
      width: '8%',
      align: 'center',
      render: (b) => (
        <button
          type="button"
          className="btn btn-link p-0 text-decoration-none fw-bold"
          style={{ color: '#1a1f36', fontSize: '0.875rem' }}
          onClick={() => onView(b)}
        >
          #{b.id}
        </button>
      ),
    },
    {
      key: 'amenity',
      label: 'Amenity',
      width: '22%',
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
              <p className="fw-bold m-0 text-dark text-truncate" style={{ fontSize: '0.9rem', letterSpacing: '-0.01em' }}>
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
    {
      key: 'bookingDate',
      label: 'Date',
      width: '15%',
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
      width: '16%',
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
      width: '14%',
      align: 'center',
      render: (b) => <BookingStatusBadge status={b.status} />,
    },
    {
      key: 'payment',
      label: 'Payment',
      width: '11%',
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
      width: '14%',
      align: 'center',
      render: (b) => (
        <div className="d-flex align-items-center justify-content-center gap-1">
          {isAdmin && b.status === 'Pending' ? (
            <button
              type="button"
              className="btn btn-sm btn-dark d-inline-flex align-items-center gap-1 px-3 py-1 fw-semibold shadow-sm"
              style={{ borderRadius: '8px', fontSize: '0.8rem', backgroundColor: '#1a1f36' }}
              onClick={() => onView(b)}
            >
              <Gavel size={13} /> Vote
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1 px-2 py-1"
              style={{ borderRadius: '8px', fontSize: '0.8rem' }}
              onClick={() => onView(b)}
            >
              <Eye size={13} /> View
            </button>
          )}
          {!isAdmin && b.status === 'Confirmed' && !b.paidAt && onSettle && (
            <button
              type="button"
              className="btn btn-sm btn-dark d-inline-flex align-items-center gap-1 px-2 py-1"
              style={{ borderRadius: '8px', fontSize: '0.8rem' }}
              onClick={() => onSettle(b)}
              title="Record Payment"
            >
              <CreditCard size={13} />
            </button>
          )}
          {!isAdmin && b.status !== 'Cancelled' && b.status !== 'Rejected' && onCancel && (
            <button
              type="button"
              className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1 px-2 py-1"
              style={{ borderRadius: '8px', fontSize: '0.8rem' }}
              onClick={() => onCancel(b)}
              title="Cancel Booking"
            >
              <X size={13} />
            </button>
          )}
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
