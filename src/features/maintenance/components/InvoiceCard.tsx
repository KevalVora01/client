import { useNavigate } from 'react-router-dom';
import InvoiceStatusBadge from './InvoiceStatusBadge';
import { STATUS_CONFIG } from '../constants/invoiceStyles';
import type { Invoice } from '../types/maintenance.types';

function formatMonth(month: number, year: number): string {
  return new Date(year, month - 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' });
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface InvoiceCardProps {
  invoice: Invoice;
  isAdmin?: boolean;
  onMarkSettled?: (invoice: Invoice) => void;
}

const InvoiceCard = ({ invoice, isAdmin = false, onMarkSettled }: InvoiceCardProps) => {
  const navigate = useNavigate();
  const borderColor = STATUS_CONFIG[invoice.status].color;
  const isPaid = invoice.status === 'Paid';

  return (
    <div
      className="d-flex align-items-start justify-content-between bg-white"
      style={{
        gap: '16px',
        borderTop: '0.5px solid #e5e7eb',
        borderRight: '0.5px solid #e5e7eb',
        borderBottom: '0.5px solid #e5e7eb',
        borderLeft: `3px solid ${borderColor}`,
        borderRadius: '0 12px 12px 0',
        padding: '14px 18px',
        opacity: isPaid ? 0.85 : 1,
        cursor: 'pointer',
        transition: 'box-shadow 0.15s',
      }}
      onClick={() => navigate(`/maintenance/invoices/${invoice.id}`)}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div className="flex-grow-1 overflow-hidden">
        <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
          <InvoiceStatusBadge status={invoice.status} />
          <span className="text-secondary" style={{ fontSize: '0.8rem' }}>
            {formatMonth(invoice.month, invoice.year)}
          </span>
        </div>

        <p className="fw-medium mb-1" style={{ fontSize: '0.95rem', color: '#1a1f36' }}>
          ₹{invoice.totalAmount.toFixed(2)}
          {invoice.extraCharges.length > 0 && (
            <span className="text-secondary fw-normal ms-2" style={{ fontSize: '0.78rem' }}>
              (₹{invoice.baseAmount.toFixed(2)} + {invoice.extraCharges.length} charge{invoice.extraCharges.length > 1 ? 's' : ''})
            </span>
          )}
        </p>

        <div className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: '0.75rem' }}>
          <i className="bi bi-calendar" />
          Due {formatDate(invoice.dueDate)}
          {isPaid && invoice.paidAt && (
            <>
              <span className="mx-1">&middot;</span>
              <i className="bi bi-check2" />
              Paid {formatDate(invoice.paidAt)}
            </>
          )}
        </div>
      </div>

      {isAdmin && !isPaid && onMarkSettled && (
        <button
          className="btn btn-sm btn-outline-secondary flex-shrink-0"
          onClick={(e) => { e.stopPropagation(); onMarkSettled(invoice); }}
          style={{ fontSize: '0.78rem', borderRadius: '8px' }}
        >
          Mark Settled
        </button>
      )}
    </div>
  );
};

export default InvoiceCard;