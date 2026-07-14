import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useInvoicesPage } from '../hooks/useInvoicesPage';
import { useInvoiceMutations } from '../hooks/useInvoiceMutations';
import { useMaintenanceSettings } from '../hooks/useMaintenanceSettings';
import { useDashboardMetrics } from '../hooks/useDashboardMetrics';
import InvoiceFilters from '../components/InvoiceFilters';
import GenerateInvoicesForm from '../components/GenerateInvoicesForm';
import MaintenanceSettingsForm from '../components/MaintenanceSettingsForm';
import MaintenanceStatsRow from '../components/MaintenanceStatsRow';
import AppTable from '../../../components/AppTable/AppTable';
import Pagination from '../../../components/Pagination/Pagination';
import InvoiceStatusBadge from '../components/InvoiceStatusBadge';
import PayInvoiceButton from '../components/PayInvoiceButton';
import ConfirmDialog from '../../../components/ConfirmDialog/ConfirmDialog';
import { maintenanceApi } from '../api/maintenanceApi';
import { useScrollLock } from '../../../hooks/useScrollLock';
import useAuth from '../../../hooks/useAuth';
import { showError, showSuccess } from '../../../utils/toast';
import type { TableColumn } from '../../../components/AppTable/AppTable';
import type { Invoice, AdminDashboardMetrics } from '../types/maintenance.types';

function formatMonth(month: number, year: number): string {
  return new Date(year, month - 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' });
}

const MaintenancePage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const {
    invoices,
    loading,
    filters,
    updateFilters,
    changePage,
    pagination,
    refetch,
  } = useInvoicesPage(isAdmin);

  const { generateInvoices, markInvoiceSettled, applyOverduePenalties, loading: mutationLoading } = useInvoiceMutations(refetch);
  const { setting, loading: settingLoading, updating, updateAmount } = useMaintenanceSettings(isAdmin);
  const { metrics, loading: metricsLoading, refetch: refetchMetrics } = useDashboardMetrics();

  const [searchParams, setSearchParams] = useSearchParams();
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [settlingInvoice, setSettlingInvoice] = useState<Invoice | null>(null);
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'Cheque'>('Cash');
  const [chequeNumber, setChequeNumber] = useState<string>('');
  const [chequeTouched, setChequeTouched] = useState<boolean>(false);
  const [applyPenaltiesConfirmOpen, setApplyPenaltiesConfirmOpen] = useState(false);

  useScrollLock(generateModalOpen);

  useEffect(() => {
    const redirectStatus = searchParams.get('redirect_status');
    const paymentIntentId = searchParams.get('payment_intent');
    const invoiceId = searchParams.get('invoice_id');
    if (redirectStatus) {
      setSearchParams({}, { replace: true });
      if (redirectStatus === 'succeeded') {
        if (paymentIntentId && invoiceId) {
          maintenanceApi.confirmPayment(Number(invoiceId), paymentIntentId).catch(() => {});
        }
        showSuccess('Payment successful!');
      } else {
        showError('Payment failed. Please try again.');
      }
      refetch();
      refetchMetrics();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerate = async (payload: Parameters<typeof generateInvoices>[0]): Promise<boolean> => {
    const success = await generateInvoices(payload);
    if (success) {
      setGenerateModalOpen(false);
      refetchMetrics();
    }
    return success;
  };

  const handleMarkSettled = async (invoice: Invoice) => {
    const paymentRef = paymentMode === 'Cheque'
      ? `Cheque - #${chequeNumber.trim()}`
      : '-';

    const success = await markInvoiceSettled(invoice.id, paymentRef);
    if (success) {
      refetchMetrics();
      setSettlingInvoice(null);
      setPaymentMode('Cash');
      setChequeNumber('');
      setChequeTouched(false);
    }
  };

  const handleDownload = async (invoiceId: number) => {
    try {
      const blob = await maintenanceApi.downloadReceipt(invoiceId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      showError('Failed to download receipt');
    }
  };

  const highlightMatch = (text: string, search: string) => {
    if (!search || !search.trim()) return <span>{text}</span>;
    const cleanSearch = search.trim();
    const regex = new RegExp(`(${cleanSearch.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
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

  const allColumnDefs: {
    key: string;
    label: string;
    adminWidth: string;
    residentWidth: string;
    align?: 'start' | 'center' | 'end';
    render: (inv: Invoice) => React.ReactNode;
  }[] = [
    {
      key: 'monthYear',
      label: 'Month / Year',
      adminWidth: '10%',
      residentWidth: '10%',
      align: 'center',
      render: (inv) => (
        <span className="fw-medium" style={{ fontSize: '0.875rem', color: '#1a1f36' }}>
          {formatMonth(inv.month, inv.year)}
        </span>
      ),
    },
    {
      key: 'apartment',
      label: 'Apartment',
      adminWidth: '12%',
      residentWidth: '0%',
      align: 'center',
      render: (inv) => (
        inv.apartment ? (
          <div className="d-flex flex-column align-items-center">
            <Link
              to={`/apartments/${inv.apartmentId}`}
              className="fw-semibold text-primary text-decoration-none"
              style={{ fontSize: '0.875rem' }}
            >
              {highlightMatch(`${inv.apartment.block}-${inv.apartment.floorNumber}${inv.apartment.unitNumber}`, filters.search ?? '')}
            </Link>
            {inv.resident?.name && (
              <span className="text-secondary mt-0.5" style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                {highlightMatch(inv.resident.name, filters.search ?? '')}
              </span>
            )}
          </div>
        ) : (
          <span className="text-muted">—</span>
        )
      ),
    },
    {
      key: 'baseAmount',
      label: 'Base Amount',
      adminWidth: '11%',
      residentWidth: '15%',
      align: 'center',
      render: (inv) => (
        <span className="fw-medium text-dark" style={{ fontSize: '0.875rem' }}>
          ₹{inv.baseAmount.toFixed(2)}
        </span>
      ),
    },
    {
      key: 'extraCharges',
      label: 'Extra Charges',
      adminWidth: '16%',
      residentWidth: '17%',
      align: 'center',
      render: (inv) => {
        const hasExtra = inv.extraCharges && inv.extraCharges.length > 0;
        if (!hasExtra) {
          return <span className="text-muted" style={{ fontSize: '0.875rem' }}>—</span>;
        }
        return (
          <div className="d-flex flex-wrap justify-content-center gap-1" style={{ maxWidth: '200px', margin: '0 auto' }}>
            {inv.extraCharges.map((charge, idx) => (
              <span
                key={idx}
                className="badge bg-primary-subtle text-primary-emphasis border border-primary-subtle"
                style={{ fontSize: '0.65rem', padding: '2px 5px', fontWeight: 500 }}
              >
                {charge.label}: ₹{charge.amount}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      key: 'totalAmount',
      label: 'Total Amount',
      adminWidth: '14%',
      residentWidth: '17%',
      align: 'center',
      render: (inv) => (
        <span className="fw-semibold text-dark" style={{ fontSize: '0.875rem' }}>
          ₹{inv.totalAmount.toFixed(2)}
        </span>
      ),
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      adminWidth: '14%',
      residentWidth: '17%',
      align: 'center',
      render: (inv) => (
        <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>
          {new Date(inv.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      adminWidth: '12%',
      residentWidth: '11%',
      align: 'center',
      render: (inv) => <InvoiceStatusBadge status={inv.status} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      adminWidth: '13%',
      residentWidth: '13%',
      align: 'center',
      render: (inv) => {
        const isPaid = inv.status === 'Paid';
        if (isAdmin) {
          return isPaid ? (
            <button
              className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1"
              onClick={() => handleDownload(inv.id)}
              style={{ borderRadius: '6px', fontSize: '0.78rem' }}
              title="Download receipt"
            >
              <i className="bi bi-download" />
            </button>
          ) : (
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setSettlingInvoice(inv)}
              style={{ borderRadius: '6px', fontSize: '0.78rem' }}
            >
              Mark Settled
            </button>
          );
        }
        return isPaid ? (
          <button
            className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1"
            onClick={() => handleDownload(inv.id)}
            style={{ borderRadius: '6px', fontSize: '0.78rem' }}
            title="Download receipt"
          >
            <i className="bi bi-download" />
          </button>
        ) : (
          <PayInvoiceButton invoiceId={inv.id} onPaymentSuccess={refetch} />
        );
      },
    },
  ];

  const columns: TableColumn<Invoice>[] = allColumnDefs
    .filter((col) => isAdmin || (col.adminWidth !== '0%' && col.residentWidth !== '0%'))
    .map((col) => ({
      key: col.key,
      label: col.label,
      width: isAdmin ? col.adminWidth : col.residentWidth,
      align: col.align,
      render: col.render,
    }));

  return (
    <div className="container-fluid p-3 p-md-4 max-w-100 mx-auto">

      {/* ── Header ── */}
      <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ fontSize: '1.4rem', color: '#1a1f36' }}>
            Maintenance
          </h4>
          <p className="text-muted mb-0 small">
            {isAdmin
              ? 'Generate invoices and track collections.'
              : 'View and pay your maintenance dues.'}
          </p>
        </div>
        {isAdmin && (
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-primary fw-medium d-inline-flex align-items-center gap-2 px-3 py-2"
              onClick={() => setApplyPenaltiesConfirmOpen(true)}
              style={{ fontSize: '0.875rem', borderRadius: '8px' }}
              disabled={mutationLoading}
            >
              <i className="bi bi-arrow-repeat" /> Apply Penalties
            </button>
            <button
              className="btn btn-dark fw-medium d-inline-flex align-items-center gap-2 px-3 py-2"
              onClick={() => setGenerateModalOpen(true)}
              style={{ fontSize: '0.875rem', borderRadius: '8px', backgroundColor: '#1a1f36', borderColor: '#1a1f36' }}
              disabled={mutationLoading}
            >
              <i className="bi bi-plus-lg" /> Generate Invoices
            </button>
          </div>
        )}
      </div>

      {/* ── Stats (Admin only) ── */}
      {isAdmin && !metricsLoading && metrics && (
        <MaintenanceStatsRow metrics={metrics as AdminDashboardMetrics} />
      )}

      {/* ── Maintenance Amount Setting (Admin only) ── */}
      {isAdmin && (
        <div className="card bg-white border border-light-subtle rounded-3 shadow-sm mb-4 p-3">
          {!settingLoading && setting && (
            <MaintenanceSettingsForm
              key={setting.amount}
              currentAmount={setting.amount}
              updating={updating}
              onSubmit={updateAmount}
            />
          )}
        </div>
      )}

      {/* ── Filters ── */}
      <div className="d-flex align-items-center gap-3 mb-3">
        <InvoiceFilters filters={filters} onFilterChange={updateFilters} />
      </div>

      {/* ── Table ── */}
      <div className="table-card mb-4">
        <AppTable
          columns={columns}
          data={invoices?.items ?? []}
          loading={loading}
          rowKey={(inv) => inv.id}
          emptyTitle="No invoices found"
          emptySubtitle="There are no invoices matching your criteria. Try adjusting your filters or check back later."
          emptyIcon="bi-receipt"
          skeletonRows={4}
        />
        {!loading && (invoices?.items?.length ?? 0) > 0 && pagination && (
          <div className="table-card__footer">
            <Pagination
              pagination={pagination}
              onPageChange={changePage}
              onPageSizeChange={(size) => updateFilters({ pageSize: size })}
            />
          </div>
        )}
      </div>

      {/* ── Generate Invoices Modal ── */}
      {generateModalOpen && (
        <div className="modal d-block bg-dark bg-opacity-50" style={{ backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content border-0 rounded-3 shadow-lg bg-white">
              <div className="modal-header border-bottom border-light-subtle px-4 pt-4 pb-3 position-relative">
                <h5 className="modal-title fw-bold fs-6 d-inline-flex align-items-center gap-2" style={{ color: '#1a1f36' }}>
                  Generate Invoices
                  <i
                    className="bi bi-info-circle text-muted fs-7"
                    style={{ cursor: 'help' }}
                    title="This will generate an invoice for every active resident. Duplicate invoices for the same month are not automatically prevented."
                  />
                </h5>
                <button
                  className="btn btn-outline-light border border-light-subtle text-secondary rounded-2 p-0 d-flex align-items-center justify-content-center position-absolute"
                  onClick={() => setGenerateModalOpen(false)}
                  disabled={mutationLoading}
                  aria-label="Close"
                  style={{ width: '30px', height: '30px', top: '1.2rem', right: '1.2rem' }}
                >
                  <i className="bi bi-x fs-5" />
                </button>
              </div>
              <div className="modal-body p-4">
                <GenerateInvoicesForm
                  loading={mutationLoading}
                  onSubmit={handleGenerate}
                  onCancel={() => setGenerateModalOpen(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Mark Settled Confirm ── */}
      {settlingInvoice && (
        <div className="modal d-block bg-dark bg-opacity-50" style={{ backdropFilter: 'blur(4px)', zIndex: 1070 }} onClick={() => setSettlingInvoice(null)}>
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content border-0 rounded-3 shadow-lg bg-white p-4">
              <div className="d-flex align-items-center justify-content-between mb-3 border-bottom border-light-subtle pb-2">
                <h5 className="modal-title fw-bold fs-6 text-dark mb-0">Mark Invoice Settled</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSettlingInvoice(null)}
                  aria-label="Close"
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary small">Payment Mode</label>
                <div className="d-flex gap-4 mt-1">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMode"
                      id="modeCash"
                      checked={paymentMode === 'Cash'}
                      onChange={() => setPaymentMode('Cash')}
                      style={{
                        backgroundColor: paymentMode === 'Cash' ? '#1a1f36' : '',
                        borderColor: paymentMode === 'Cash' ? '#1a1f36' : '',
                        boxShadow: 'none',
                        cursor: 'pointer'
                      }}
                    />
                    <label className="form-check-label text-dark small" htmlFor="modeCash" style={{ cursor: 'pointer' }}>
                      Cash
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMode"
                      id="modeCheque"
                      checked={paymentMode === 'Cheque'}
                      onChange={() => setPaymentMode('Cheque')}
                      style={{
                        backgroundColor: paymentMode === 'Cheque' ? '#1a1f36' : '',
                        borderColor: paymentMode === 'Cheque' ? '#1a1f36' : '',
                        boxShadow: 'none',
                        cursor: 'pointer'
                      }}
                    />
                    <label className="form-check-label text-dark small" htmlFor="modeCheque" style={{ cursor: 'pointer' }}>
                      Cheque
                    </label>
                  </div>
                </div>
              </div>

              {paymentMode === 'Cheque' && (
                <div className="mb-4">
                  <label className="form-label fw-semibold text-secondary small" htmlFor="chequeNumber">
                    Cheque Number
                  </label>
                  <input
                    type="text"
                    id="chequeNumber"
                    className={`form-control form-control-sm shadow-none ${chequeTouched && !/^\d{6}$/.test(chequeNumber.trim()) ? 'is-invalid' : ''}`}
                    placeholder="Enter 6-digit cheque number"
                    value={chequeNumber}
                    onChange={(e) => {
                      setChequeNumber(e.target.value.replace(/\D/g, '').slice(0, 6));
                    }}
                    onBlur={() => setChequeTouched(true)}
                    style={{ borderRadius: '6px' }}
                    required
                  />
                  {chequeTouched && !/^\d{6}$/.test(chequeNumber.trim()) && (
                    <div className="invalid-feedback" style={{ fontSize: '0.78rem' }}>
                      Cheque number must be exactly 6 digits.
                    </div>
                  )}
                </div>
              )}

              <div className="d-flex justify-content-end gap-2 border-top border-light-subtle pt-3">
                <button
                  className="btn btn-sm btn-outline-secondary px-3"
                  onClick={() => {
                    setSettlingInvoice(null);
                    setChequeNumber('');
                    setChequeTouched(false);
                  }}
                  disabled={mutationLoading}
                  style={{ borderRadius: '6px' }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-sm btn-primary px-3"
                  onClick={async () => { await handleMarkSettled(settlingInvoice); }}
                  disabled={mutationLoading || (paymentMode === 'Cheque' && !/^\d{6}$/.test(chequeNumber.trim()))}
                  style={{ borderRadius: '6px' }}
                >
                  {mutationLoading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                  ) : (
                    'Confirm'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Apply Penalties Confirm ── */}
      <ConfirmDialog
        show={applyPenaltiesConfirmOpen}
        title="Apply Overdue Penalties"
        message="Are you sure you want to run the penalty job right now? This will scan all pending invoices whose due date has passed, flag them as Overdue, and apply the 5% late fee penalty."
        confirmLabel="Run Job"
        cancelLabel="Cancel"
        variant="warning"
        loading={mutationLoading}
        onConfirm={async () => {
          const success = await applyOverduePenalties();
          if (success) {
            setApplyPenaltiesConfirmOpen(false);
            refetchMetrics();
            showSuccess("Overdue penalties applied successfully!");
          }
        }}
        onCancel={() => setApplyPenaltiesConfirmOpen(false)}
      />

    </div>
  );
};

export default MaintenancePage;