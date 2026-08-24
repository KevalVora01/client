import { useEffect, useRef, useState } from 'react';
import type { Booking } from '../types/amenity.types';
import { bookingApi } from '../api/bookingApi';

interface BookingRowActionsProps {
  booking: Booking;
  isAdmin: boolean;
  onView: (booking: Booking) => void;
  onCancel?: (booking: Booking) => void;
  onSettle?: (booking: Booking) => void;
}

const BookingRowActions = ({
  booking,
  isAdmin,
  onView,
  onCancel,
  onSettle,
}: BookingRowActionsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('.dropdown-menu')
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setMenuStyle(
        spaceBelow < 180
          ? { bottom: window.innerHeight - rect.top, left: rect.right - 160, zIndex: 9999, minWidth: '160px' }
          : { top: rect.bottom, left: rect.right - 160, zIndex: 9999, minWidth: '160px' }
      );
    }
    setIsOpen((prev) => !prev);
  };

  const handleDownloadReceipt = async () => {
    if (booking.receiptUrl) {
      window.open(booking.receiptUrl, '_blank');
      setIsOpen(false);
      return;
    }
    setDownloading(true);
    try {
      const url = await bookingApi.getReceipt(booking.id);
      if (url) {
        window.open(url, '_blank');
      }
    } catch (err) {
      console.error('Failed to download booking receipt:', err);
    } finally {
      setDownloading(false);
      setIsOpen(false);
    }
  };

  const showVote = isAdmin && booking.status === 'Pending';
  const showPay = !isAdmin && booking.status === 'Confirmed' && !booking.paidAt && Boolean(onSettle);
  const showCancel = !isAdmin && booking.status !== 'Cancelled' && booking.status !== 'Rejected' && Boolean(onCancel);
  const showReceipt = Boolean(booking.paidAt);

  return (
    <>
      <button
        type="button"
        ref={buttonRef}
        onClick={handleToggle}
        className="btn p-0 border-0 text-secondary bg-transparent d-flex align-items-center justify-content-center mx-auto"
        style={{ width: '28px', height: '28px' }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#212529')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#6c757d')}
        title="Actions"
      >
        <i className="bi bi-three-dots-vertical fs-5" />
      </button>

      {isOpen && (
        <ul
          className="dropdown-menu shadow-sm border border-light-subtle rounded-3 p-1 show position-fixed"
          style={menuStyle}
        >
          {showVote ? (
            <li>
              <button
                type="button"
                className="dropdown-item d-flex align-items-center gap-2 px-3 py-2 rounded-2 small fw-semibold text-dark"
                onClick={() => {
                  onView(booking);
                  setIsOpen(false);
                }}
                style={{ fontSize: '0.85rem' }}
              >
                <i className="bi bi-shield-check text-primary" /> Vote & Review
              </button>
            </li>
          ) : (
            <li>
              <button
                type="button"
                className="dropdown-item d-flex align-items-center gap-2 px-3 py-2 rounded-2 small"
                onClick={() => {
                  onView(booking);
                  setIsOpen(false);
                }}
                style={{ fontSize: '0.85rem' }}
              >
                <i className="bi bi-eye text-muted" /> View Details
              </button>
            </li>
          )}

          {showReceipt && (
            <li>
              <button
                type="button"
                className="dropdown-item d-flex align-items-center gap-2 px-3 py-2 rounded-2 small text-dark"
                onClick={handleDownloadReceipt}
                disabled={downloading}
                style={{ fontSize: '0.85rem' }}
              >
                <i className="bi bi-file-earmark-pdf text-danger" /> {downloading ? 'Generating...' : 'Download Receipt'}
              </button>
            </li>
          )}

          {showPay && onSettle && (
            <li>
              <button
                type="button"
                className="dropdown-item d-flex align-items-center gap-2 px-3 py-2 rounded-2 small text-success fw-semibold"
                onClick={() => {
                  onSettle(booking);
                  setIsOpen(false);
                }}
                style={{ fontSize: '0.85rem' }}
              >
                <i className="bi bi-credit-card text-success" /> Pay via UPI
              </button>
            </li>
          )}

          {showCancel && onCancel && (
            <li>
              <button
                type="button"
                className="dropdown-item d-flex align-items-center gap-2 px-3 py-2 rounded-2 small text-danger"
                onClick={() => {
                  onCancel(booking);
                  setIsOpen(false);
                }}
                style={{ fontSize: '0.85rem' }}
              >
                <i className="bi bi-x-circle text-danger" /> Cancel Booking
              </button>
            </li>
          )}
        </ul>
      )}
    </>
  );
};

export default BookingRowActions;
