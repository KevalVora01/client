import { useState } from 'react';
import { Link } from 'react-router-dom';
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
import useMyResident from '../../residents/hooks/useMyResident';
import { showError, showSuccess } from '../../../utils/toast';
import type { TableColumn } from '../../../components/AppTable/AppTable';
import type { Invoice, AdminDashboardMetrics } from '../types/maintenance.types';

function formatMonth(month: number, year: number): string {
  return new Date(year, month - 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' });
}

type InvoiceScope = 'self' | 'tenant';

const MaintenancePage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const { resident, isOwner, isCurrentOccupant } = useMyResident(!isAdmin);

  // Owners can toggle between their own invoices and their tenant's invoices,
  // regardless of whether they currently occupy the unit.
  const showScopeToggle = !isAdmin && isOwner;
  const [scope, setScope] = useState<InvoiceScope>('self');

  // Owners: Self tab shows their own invoices, Tenant tab shows the apartment's
  // tenant invoices (read-only). Non-owner tenants always see their own list.
  const apartmentView = showScopeToggle && scope === 'tenant';

  const {
    invoices,
    loading,
    filters,
    updateFilters,
    changePage,
    pagination,
    refetch,
  } = useInvoicesPage(isAdmin, apartmentView);

  const showResidentName = showScopeToggle && scope === 'tenant';

  // On the tenant tab, exclude the owner's own invoices.
  const invoiceItems = (invoices?.items ?? []).filter((inv) =>
    showResidentName ? inv.resident?.userId !== user?.id : true
  );

  const { generateInvoices, applyOverduePenalties, loading: mutationLoading } = useInvoiceMutations(refetch);
  const { setting, loading: settingLoading, updating, updateAmount } = useMaintenanceSettings(isAdmin);
  const { metrics, loading: metricsLoading, refetch: refetchMetrics } = useDashboardMetrics();

  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [applyPenaltiesConfirmOpen, setApplyPenaltiesConfirmOpen] = useState(false);

  useScrollLock(generateModalOpen);

  const handleGenerate = async (payload: Parameters<typeof generateInvoices>[0]): Promise<boolean> => {
    const success = await generateInvoices(payload);
    if (success) {
      setGenerateModalOpen(false);
      refetchMetrics();
    }
    return success;
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
    const flexSearch = cleanSearch
      .split('')
      .map((char) => char.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'))
      .join('[- ]*');
    const regex = new RegExp(`(${flexSearch})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, index) =>
          part && regex.test(part) ? (
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
    show?: boolean;
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
      key: 'raisedBy',
      label: 'Tenant',
      adminWidth: '0%',
      residentWidth: '14%',
      align: 'center',
      show: showResidentName,
      render: (inv) => (
        <span className="fw-medium" style={{ fontSize: '0.85rem', color: '#1a1f36' }}>
          {highlightMatch(inv.resident?.name ?? '\u2014', filters.search ?? '')}
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
      residentWidth: showResidentName ? '12%' : '15%',
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
      residentWidth: showResidentName ? '18%' : '17%',
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
      residentWidth: showResidentName ? '12%' : '17%',
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
      residentWidth: showResidentName ? '13%' : '17%',
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
      residentWidth: showResidentName ? '11%' : '11%',
      align: 'center',
      render: (inv) => <InvoiceStatusBadge status={inv.status} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      adminWidth: '13%',
      residentWidth: showResidentName ? '10%' : '13%',
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
            <span className="text-muted" style={{ fontSize: '0.78rem' }}>—</span>
          );
        }
        const currentResId = resident?.id ?? user?.residentId ?? user?.resident?.id;
        return isPaid ? (
          <button
            className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1"
            onClick={() => handleDownload(inv.id)}
            style={{ borderRadius: '6px', fontSize: '0.78rem' }}
            title="Download receipt"
          >
            <i className="bi bi-download" />
          </button>
        ) : (isCurrentOccupant || (currentResId && inv.residentId === currentResId)) ? (
          <PayInvoiceButton invoiceId={inv.id} amount={inv.totalAmount} onPaymentSuccess={refetch} />
        ) : (
          <span className="text-muted" style={{ fontSize: '0.78rem' }}>—</span>
        );
      },
    },
  ];

  const columns: TableColumn<Invoice>[] = allColumnDefs
    .filter((col) => col.show !== false)
    .filter((col) => (isAdmin ? col.adminWidth !== '0%' : col.residentWidth !== '0%'))
    .map((col) => ({
      key: col.key,
      label: col.label,
      width: isAdmin ? col.adminWidth : col.residentWidth,
      align: col.align,
      render: col.render,
    }));

  return (
    <div className="container-fluid p-3 p-md-4">

      {/* ── Header ── */}
      <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap mb-4">
        <div>
          <h4 className="fw-bold mb-2 fs-4 fs-sm-3" style={{ color: '#1a1f36' }}>
            Maintenance
          </h4>
          <p className="text-muted mb-0 small">
            {isAdmin
              ? 'Generate invoices and track collections.'
              : 'View and pay your maintenance dues.'}
          </p>
        </div>
        {isAdmin && (
          <div className="d-flex flex-column flex-sm-row gap-2 flex-shrink-0">
            <button
              className="btn btn-outline-primary fw-medium d-inline-flex align-items-center justify-content-center gap-2 px-3 py-2"
              onClick={() => setApplyPenaltiesConfirmOpen(true)}
              style={{ fontSize: '0.875rem', borderRadius: '8px' }}
              disabled={mutationLoading}
            >
              <i className="bi bi-arrow-repeat" /> Apply Penalties
            </button>
            <button
              className="btn btn-dark fw-medium d-inline-flex align-items-center justify-content-center gap-2 px-3 py-2"
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
      {isAdmin && (
        <div className="mb-4">
          <MaintenanceStatsRow metrics={metrics as AdminDashboardMetrics | null} loading={metricsLoading} />
        </div>
      )}

      {/* ── Maintenance Amount Setting (Admin only) ── */}
      {isAdmin && (
        <div className="card bg-white border border-light-subtle rounded-3 shadow-sm mb-4 p-3">
          <MaintenanceSettingsForm
            currentAmount={setting?.amount}
            updating={updating || settingLoading}
            onSubmit={updateAmount}
          />
        </div>
      )}

      {/* ── Self / Tenant toggle (owners only) ── */}
      {showScopeToggle && (
        <div className="d-flex flex-wrap gap-2 mb-3">
          {([
            { key: 'self', label: 'Self' },
            { key: 'tenant', label: 'Tenant' },
          ] as { key: InvoiceScope; label: string }[]).map(({ key, label }) => {
            const active = scope === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setScope(key)}
                className="btn btn-sm fw-semibold px-3 py-2"
                style={{
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  backgroundColor: active ? '#1a1f36' : '#fff',
                  color: active ? '#fff' : '#4b5563',
                  border: `1px solid ${active ? '#1a1f36' : '#e5e7eb'}`,
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Table Container Card (Matching Resident Page Layout) ── */}
      <div className="card bg-white border border-light-subtle rounded-3 shadow-sm mt-4 mb-4">
        {/* Filters Header Block */}
        <div className="card-header bg-white border-bottom border-light-subtle p-3">
          <InvoiceFilters
            filters={filters}
            onFilterChange={updateFilters}
            isAdmin={isAdmin}
            apartmentView={apartmentView}
          />
        </div>

        {/* Dynamic List Table Area */}
        <div className="table-responsive">
          <AppTable
            columns={columns}
            data={invoiceItems}
            loading={loading}
            rowKey={(inv) => inv.id}
            emptyTitle="No invoices found"
            emptySubtitle="There are no invoices matching your criteria. Try adjusting your filters or check back later."
            emptyIcon="bi-receipt"
            skeletonRows={4}
          />
        </div>

        {/* Card Footer Section for Pagination */}
        {!loading && invoiceItems.length > 0 && pagination && (
          <div className="card-footer bg-white border-top border-light-subtle p-3 d-flex justify-content-end">
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
            <div className="modal-content border-0 rounded-3 shadow-lg bg-white" style={{ overflow: 'visible' }}>
              <div className="modal-header border-bottom border-light-subtle px-3 px-sm-4 pt-4 pb-3 position-relative">
                <h5 className="modal-title fw-bold fs-6 d-inline-flex align-items-center gap-2" style={{ color: '#1a1f36' }}>
                  Generate Invoices
                  <i
                    className="bi bi-info-circle text-muted fs-7"
                    style={{ cursor: 'help' }}
                    title="This will generate an invoice for every active resident. Duplicate invoices for the same month are not automatically prevented."
                  />
                </h5>
                <button
                  type="button"
                  className="btn position-absolute d-flex align-items-center justify-content-center p-0 text-secondary"
                  style={{ top: 22, right: 22, width: 28, height: 28, border: '1px solid #e9ecef', background: '#fff', fontSize: '1.1rem', borderRadius: '6px' }}
                  onClick={() => setGenerateModalOpen(false)}
                  disabled={mutationLoading}
                  aria-label="Close"
                >
                  <i className="bi bi-x" />
                </button>
              </div>
              <div className="modal-body p-3 p-sm-4" style={{ overflow: 'visible' }}>
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
          const result = await applyOverduePenalties();
          if (result) {
            setApplyPenaltiesConfirmOpen(false);
            refetchMetrics();
            showSuccess(
              result.penaltiesApplied > 0
                ? `Penalties applied — ${result.penaltiesApplied} invoice(s) penalized.`
                : "Penalties applied — no new penalties."
            );
          }
        }}
        onCancel={() => setApplyPenaltiesConfirmOpen(false)}
      />

    </div>
  );
};

export default MaintenancePage;
