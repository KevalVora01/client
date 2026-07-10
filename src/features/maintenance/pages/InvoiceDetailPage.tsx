import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { maintenanceApi } from '../api/maintenanceApi';
import InvoiceStatusBadge from '../components/InvoiceStatusBadge';
import PayInvoiceButton from '../components/PayInvoiceButton';
import useAuth from '../../../hooks/useAuth';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { showError } from '../../../utils/toast';
import type { Invoice } from '../types/maintenance.types';

function formatMonth(month: number, year: number): string {
  return new Date(year, month - 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' });
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

const InvoiceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isResident = user?.role === 'resident';

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    maintenanceApi.getInvoice(Number(id))
      .then(data => { if (!cancelled) setInvoice(data); })
      .catch(err => { if (!cancelled) showError(getErrorMessage(err, 'Failed to load invoice')); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [id, refreshKey]);

  if (loading) {
    return (
      <div className="container-fluid p-3 p-md-4">
        <div className="skeleton" style={{ width: '50%', height: '28px', borderRadius: '6px', marginBottom: '16px' }} />
        <div className="skeleton" style={{ width: '100%', height: '200px', borderRadius: '12px' }} />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="container-fluid p-3 p-md-4 text-center py-5">
        <p className="text-secondary">Invoice not found.</p>
      </div>
    );
  }

  const isPaid = invoice.status === 'Paid';

  return (
    <div className="container-fluid p-3 p-md-4 max-w-100 mx-auto" style={{ maxWidth: '700px' }}>

      <button
        className="btn btn-link p-0 d-flex align-items-center gap-2 mb-4 text-secondary text-decoration-none"
        onClick={() => navigate(-1)}
        style={{ fontSize: '0.85rem' }}
      >
        <i className="bi bi-arrow-left" />
        Back to invoices
      </button>

      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div>
          <div className="mb-2"><InvoiceStatusBadge status={invoice.status} /></div>
          <h4 className="fw-bold mb-1" style={{ color: '#1a1f36' }}>
            {formatMonth(invoice.month, invoice.year)} Maintenance
          </h4>
          <p className="mb-0 text-muted" style={{ fontSize: '0.8rem' }}>Invoice #{invoice.id}</p>
        </div>

        {isResident && !isPaid && (
          <PayInvoiceButton invoiceId={invoice.id} onPaymentSuccess={() => setRefreshKey(k => k + 1)} />
        )}

        {isPaid && invoice.pdfUrl && (
          <button
            className="btn btn-outline-secondary"
            onClick={async () => {
              try {
                const blob = await maintenanceApi.downloadReceipt(invoice.id);
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `invoice-${invoice.id}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              } catch {
                showError('Failed to download receipt');
              }
            }}
            style={{ borderRadius: '8px', fontSize: '0.875rem' }}
          >
            <i className="bi bi-download me-1" /> Download Receipt
          </button>
        )}
      </div>

      <div className="rounded-3 p-4 mb-4" style={{ backgroundColor: '#f9fafb' }}>
        <table className="w-100" style={{ fontSize: '0.9rem' }}>
          <tbody>
            <tr>
              <td className="py-2 text-secondary">Maintenance charge</td>
              <td className="py-2 text-end">₹{invoice.baseAmount.toFixed(2)}</td>
            </tr>
            {invoice.extraCharges.map((charge, i) => (
              <tr key={i}>
                <td className="py-2 text-secondary">{charge.label}</td>
                <td className="py-2 text-end">₹{charge.amount.toFixed(2)}</td>
              </tr>
            ))}
            <tr style={{ borderTop: '2px solid #1a1f36' }}>
              <td className="py-2 fw-bold">Total</td>
              <td className="py-2 text-end fw-bold">₹{invoice.totalAmount.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <hr />

        <div className="d-flex justify-content-between" style={{ fontSize: '0.85rem' }}>
          <span className="text-secondary">Due date</span>
          <span>{formatDate(invoice.dueDate)}</span>
        </div>
        {invoice.paidAt && (
          <div className="d-flex justify-content-between mt-1" style={{ fontSize: '0.85rem' }}>
            <span className="text-secondary">Paid on</span>
            <span>{formatDate(invoice.paidAt)}</span>
          </div>
        )}
        {invoice.paymentRef && (
          <div className="d-flex justify-content-between mt-1" style={{ fontSize: '0.85rem' }}>
            <span className="text-secondary">Payment reference</span>
            <span>{invoice.paymentRef}</span>
          </div>
        )}
      </div>

    </div>
  );
};

export default InvoiceDetailPage;