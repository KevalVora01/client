import InvoiceCard from './InvoiceCard';
import type { Invoice } from '../types/maintenance.types';

interface InvoiceListProps {
  invoices: Invoice[];
  loading: boolean;
  isAdmin?: boolean;
  onMarkSettled?: (invoice: Invoice) => void;
}

const InvoiceList = ({ invoices, loading, isAdmin = false, onMarkSettled }: InvoiceListProps) => {

  if (loading) {
    return (
      <div className="d-flex flex-column gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="d-flex align-items-start justify-content-between p-3 rounded-3 border border-light-subtle bg-white"
            style={{ gap: '12px' }}
          >
            <div className="flex-grow-1 overflow-hidden">
              <div className="skeleton mb-2" style={{ width: '140px', height: '18px', borderRadius: '6px' }} />
              <div className="skeleton mb-2" style={{ width: '40%', height: '16px' }} />
              <div className="skeleton" style={{ width: '120px', height: '12px' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5 text-center">
        <div
          className="rounded-circle d-flex align-items-center justify-content-center mb-3"
          style={{ width: '64px', height: '64px', backgroundColor: '#f3f4f6' }}
        >
          <i className="bi bi-receipt" style={{ fontSize: '1.6rem', color: '#9ca3af' }} />
        </div>
        <p className="fw-semibold mb-1" style={{ fontSize: '0.95rem', color: '#4b5563' }}>No invoices found</p>
        <p className="text-secondary small" style={{ fontSize: '0.8rem', maxWidth: '280px' }}>
          There are no invoices matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-3">
      {invoices.map((invoice) => (
        <InvoiceCard
          key={invoice.id}
          invoice={invoice}
          isAdmin={isAdmin}
          onMarkSettled={onMarkSettled}
        />
      ))}
    </div>
  );
};

export default InvoiceList;