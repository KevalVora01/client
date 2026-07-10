import { useState } from 'react';
import { useInvoicesPage } from '../hooks/useInvoicesPage';
import { useInvoiceMutations } from '../hooks/useInvoiceMutations';
import { useMaintenanceSettings } from '../hooks/useMaintenanceSettings';
import { useDashboardMetrics } from '../hooks/useDashboardMetrics';
import InvoiceFilters from '../components/InvoiceFilters';
import InvoiceList from '../components/InvoiceList';
import GenerateInvoicesForm from '../components/GenerateInvoicesForm';
import MaintenanceSettingsForm from '../components/MaintenanceSettingsForm';
import MaintenanceStatsRow from '../components/MaintenanceStatsRow';
import Pagination from '../../../components/Pagination/Pagination';
import { useScrollLock } from '../../../hooks/useScrollLock';
import useAuth from '../../../hooks/useAuth';
import type { Invoice } from '../types/maintenance.types';
import type { AdminDashboardMetrics } from '../types/maintenance.types';

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

  const { generateInvoices, markInvoiceSettled, loading: mutationLoading } = useInvoiceMutations(refetch);
  const { setting, loading: settingLoading, updating, updateAmount } = useMaintenanceSettings();
  const { metrics, loading: metricsLoading, refetch: refetchMetrics } = useDashboardMetrics();

  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [settlingInvoice, setSettlingInvoice] = useState<Invoice | null>(null);

  useScrollLock(generateModalOpen);

  const handleGenerate = async (payload: Parameters<typeof generateInvoices>[0]): Promise<boolean> => {
    const success = await generateInvoices(payload);
    if (success) {
      setGenerateModalOpen(false);
      refetchMetrics();
    }
    return success;
  };

  const handleMarkSettled = async (invoice: Invoice) => {
    const success = await markInvoiceSettled(invoice.id);
    if (success) refetchMetrics();
  };

  return (
    <div className="container-fluid p-3 p-md-4 max-w-100 mx-auto">

      {/* ── Header Banner ── */}
      <div
        className="d-flex align-items-start justify-content-between gap-3 flex-wrap mb-4 p-4 rounded-3"
        style={{
          background: 'linear-gradient(135deg, #1a1f36 0%, #2d2a6e 50%, #1a1f36 100%)',
        }}
      >
        <div className="d-flex align-items-start gap-3">
          <div
            className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: '48px', height: '48px', backgroundColor: 'rgba(255,255,255,0.12)' }}
          >
            <i className="bi bi-receipt text-white" style={{ fontSize: '1.3rem' }} />
          </div>
          <div>
            <h4 className="fw-bold mb-1 text-white" style={{ fontSize: '1.3rem' }}>
              Maintenance
            </h4>
            <p className="mb-0 small" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {isAdmin
                ? 'Generate invoices and track collections.'
                : 'View and pay your maintenance dues.'}
            </p>
          </div>
        </div>
        {isAdmin && (
          <button
            className="btn d-flex align-items-center gap-1 fw-medium"
            onClick={() => setGenerateModalOpen(true)}
            style={{
              fontSize: '0.875rem', borderRadius: '8px', height: '40px',
              backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <i className="bi bi-plus-lg" /> Generate Invoices
          </button>
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

      {/* ── Content Card ── */}
      <div className="card bg-white border border-light-subtle rounded-3 shadow-sm">

        <div className="card-header bg-white border-bottom border-light-subtle p-3">
          <InvoiceFilters filters={filters} onFilterChange={updateFilters} />
        </div>

        <div className="card-body p-3">
          <InvoiceList
            invoices={invoices?.items ?? []}
            loading={loading}
            isAdmin={isAdmin}
            onMarkSettled={(invoice) => setSettlingInvoice(invoice)}
          />
        </div>

        {!loading && (invoices?.items?.length ?? 0) > 0 && (
          <div className="card-footer bg-white border-top border-light-subtle p-3 d-flex justify-content-end">
            <Pagination pagination={pagination} onPageChange={changePage} />
          </div>
        )}

      </div>

      {/* ── Generate Invoices Modal ── */}
      {generateModalOpen && (
        <div className="modal d-block bg-dark bg-opacity-50" style={{ backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content border-0 rounded-3 shadow-lg bg-white">
              <div className="modal-header border-bottom border-light-subtle px-4 pt-4 pb-3 position-relative">
                <h5 className="modal-title fw-bold fs-6" style={{ color: '#1a1f36' }}>
                  Generate Invoices
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
        <div className="modal d-block bg-dark bg-opacity-50" style={{ backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content border-0 rounded-3 shadow-lg bg-white p-4">
              <p className="mb-4" style={{ fontSize: '0.9rem' }}>
                Mark this invoice as settled manually (e.g. cash payment)?
              </p>
              <div className="d-flex justify-content-end gap-2">
                <button className="btn btn-outline-secondary" onClick={() => setSettlingInvoice(null)}>Cancel</button>
                <button
                  className="btn btn-primary"
                  onClick={async () => {
                    await handleMarkSettled(settlingInvoice);
                    setSettlingInvoice(null);
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MaintenancePage;