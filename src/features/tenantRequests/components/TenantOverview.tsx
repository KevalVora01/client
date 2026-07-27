import { useState } from "react";
import { ArrowLeft, Receipt, ClipboardList, Calendar, Mail, Phone, Users, CarFront, UserCheck } from "lucide-react";
import { useComplaints } from "../../complaints/hooks/useComplaints";
import { useInvoicesPage } from "../../maintenance/hooks/useInvoicesPage";
import { maintenanceApi } from "../../maintenance/api/maintenanceApi";
import FamilyMembersSection from "../../myApartment/pages/FamilyMembersSection";
import VehiclesSection from "../../myApartment/pages/VehiclesSection";
import ComplaintList from "../../complaints/components/ComplaintList";
import AppTable from "../../../components/AppTable/AppTable";
import InvoiceStatusBadge from "../../maintenance/components/InvoiceStatusBadge";
import type { TableColumn } from "../../../components/AppTable/AppTable";
import type { Invoice } from "../../maintenance/types/maintenance.types";
import type { TenantHistoryItem } from "../../residents/types/resident.types";
import { getAvatarColor, getInitials } from "../../residents/components/residentTableHelpers";
import { showError } from "../../../utils/toast";

interface TenantOverviewProps {
  tenant: TenantHistoryItem;
  onBack: () => void;
}

const formatDate = (d: string | null): string =>
  d ? new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : "—";

const formatMonth = (month: number, year: number): string =>
  new Date(year, month - 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' });

const SectionCard = ({ icon: Icon, title, children }: { icon: typeof Receipt; title: string; children: React.ReactNode }) => (
  <div className="card bg-white border border-light-subtle rounded-3 shadow-sm mt-3">
    <div className="card-header bg-white border-bottom border-light-subtle px-4 py-3 d-flex align-items-center gap-2">
      <Icon size={18} className="text-dark" />
      <h6 className="fw-bold mb-0" style={{ color: '#1a1f36' }}>{title}</h6>
    </div>
    <div className="card-body px-4 py-3">{children}</div>
  </div>
);

type TabKey = 'family' | 'vehicles' | 'maintenance' | 'complaints';

const TABS: { key: TabKey; label: string; icon: typeof Users }[] = [
  { key: 'family', label: 'Family', icon: Users },
  { key: 'vehicles', label: 'Vehicles', icon: CarFront },
  { key: 'maintenance', label: 'Maintenance', icon: Receipt },
  { key: 'complaints', label: 'Complaints', icon: ClipboardList },
];

const TenantOverview = ({ tenant, onBack }: TenantOverviewProps) => {
  const [activeTab, setActiveTab] = useState<TabKey>('family');

  const { complaints: complaintData, loading: cLoading } = useComplaints({}, false, false);
  const complaintItems = (complaintData?.items ?? []).filter((c) => c.residentId === tenant.id);

  const { invoices, loading: invLoading } = useInvoicesPage(false, true);
  const invoiceItems = (invoices?.items ?? []).filter((inv) => inv.residentId === tenant.id);

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

  const isCurrent = tenant.isActive && !tenant.moveOutDate;
  const { bg, color } = getAvatarColor(tenant.user.name);

  const infoCards = [
    { icon: Phone, label: 'PHONE', value: tenant.user.phone, accent: 'info-card--blue' },
    { icon: Mail, label: 'EMAIL', value: tenant.user.email, accent: 'info-card--green' },
    { icon: Calendar, label: 'MOVE-IN DATE', value: formatDate(tenant.moveInDate), accent: 'info-card--purple' },
    { icon: UserCheck, label: 'OCCUPANCY', value: tenant.isOccupant ? 'Occupant' : 'Non-occupant', accent: 'info-card--amber' },
  ];

  const invoiceColumns: TableColumn<Invoice>[] = [
    {
      key: 'monthYear', label: 'Month / Year', width: '10%', align: 'center',
      render: (inv) => (
        <span className="fw-medium" style={{ fontSize: '0.875rem', color: '#1a1f36' }}>
          {formatMonth(inv.month, inv.year)}
        </span>
      ),
    },
    {
      key: 'baseAmount', label: 'Base Amount', width: '15%', align: 'center',
      render: (inv) => (
        <span className="fw-medium text-dark" style={{ fontSize: '0.875rem' }}>
          ₹{inv.baseAmount.toFixed(2)}
        </span>
      ),
    },
    {
      key: 'extraCharges', label: 'Extra Charges', width: '17%', align: 'center',
      render: (inv) => {
        const hasExtra = inv.extraCharges && inv.extraCharges.length > 0;
        if (!hasExtra) return <span className="text-muted" style={{ fontSize: '0.875rem' }}>—</span>;
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
      key: 'totalAmount', label: 'Total Amount', width: '17%', align: 'center',
      render: (inv) => (
        <span className="fw-semibold text-dark" style={{ fontSize: '0.875rem' }}>
          ₹{inv.totalAmount.toFixed(2)}
        </span>
      ),
    },
    {
      key: 'dueDate', label: 'Due Date', width: '17%', align: 'center',
      render: (inv) => (
        <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>
          {new Date(inv.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      ),
    },
    {
      key: 'status', label: 'Status', width: '11%', align: 'center',
      render: (inv) => <InvoiceStatusBadge status={inv.status} />,
    },
    {
      key: 'actions', label: 'Actions', width: '13%', align: 'center',
      render: (inv) => inv.status === 'Paid' ? (
        <button
          className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1"
          onClick={() => handleDownload(inv.id)}
          style={{ borderRadius: '6px', fontSize: '0.78rem' }}
          title="Download receipt"
        >
          <i className="bi bi-download text-dark" />
        </button>
      ) : (
        <span className="text-muted" style={{ fontSize: '0.78rem' }}>—</span>
      ),
    },
  ];

  return (
    <div className="d-flex flex-column gap-4">
      <button
        type="button"
        onClick={onBack}
        className="back-btn"
      >
        <ArrowLeft size={16} strokeWidth={2} /> Back to tenants
      </button>

      {/* ── Current Active Tenant Card (same card layout as tenant history) ── */}
      <div className="section-card">
        <div className="section-card__header d-flex align-items-center justify-content-between px-4 py-3 border-bottom">
          <h6 className="section-card__title d-flex align-items-center gap-2 mb-0" style={{ fontSize: '0.95rem', color: '#111827' }}>
            <UserCheck size={18} className="text-success" />
            {isCurrent ? "Current Active Tenant" : "Past Tenant Details"}
          </h6>
          <span className={`badge-pill badge-pill--${isCurrent ? 'active' : 'inactive'}`}>
            {isCurrent ? 'Active Occupant' : 'Past Tenant'}
          </span>
        </div>

        <div className="p-4">
          <div className="d-flex flex-column gap-4">
            {/* Header Card copied directly from Resident Detail */}
            <div className="detail-header">
              <div className="detail-header__left min-w-0">
                <div
                  className="rounded-circle fw-bold d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: 56, height: 56, fontSize: '1rem', background: bg, color }}
                >
                  {getInitials(tenant.user.name)}
                </div>
                <div className="min-w-0 flex-grow-1">
                  <div className="detail-header__name-row">
                    <h4 className="detail-header__name text-truncate">{tenant.user.name}</h4>
                    <span className={`badge-pill badge-pill--${isCurrent ? 'active' : 'inactive'}`}>
                      {isCurrent ? 'Active' : 'Inactive'}
                    </span>
                    <span className="badge-pill badge-pill--tenant">Tenant</span>
                  </div>
                  <div className="detail-header__meta">
                    <span><Calendar size={13} strokeWidth={1.75} /> Moved in {formatDate(tenant.moveInDate)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Cards Grid copied directly from Resident Detail */}
            <div className="info-grid">
              {infoCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.label} className={`info-card ${card.accent}`}>
                    <div className="info-card__icon-box">
                      <Icon size={18} strokeWidth={1.75} />
                    </div>
                    <div className="min-w-0 flex-grow-1">
                      <p className="info-card__label">{card.label}</p>
                      <p className="info-card__value text-truncate" title={String(card.value)}>{card.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── 4 Tabs below the Current Active Tenant Card ── */}
      <div>
        <div className="d-flex flex-wrap gap-2 mb-3">
          {TABS.map(({ key, label, icon: Icon }) => {
            const active = activeTab === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className="btn btn-sm fw-semibold d-inline-flex align-items-center gap-2 px-3 py-2"
                style={{
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  backgroundColor: active ? '#1a1f36' : '#fff',
                  color: active ? '#fff' : '#4b5563',
                  border: `1px solid ${active ? '#1a1f36' : '#e5e7eb'}`,
                }}
              >
                <Icon size={16} /> {label}
              </button>
            );
          })}
        </div>

        {/* Active section */}
        {activeTab === 'family' && (
          <FamilyMembersSection residentId={tenant.id} readOnly />
        )}

        {activeTab === 'vehicles' && (
          <VehiclesSection residentId={tenant.id} readOnly />
        )}

        {activeTab === 'complaints' && (
          <SectionCard icon={ClipboardList} title="Complaints Raised">
            <ComplaintList
              complaints={complaintItems}
              loading={cLoading}
              isAdmin={false}
              disableChat
              hideChatColumn
              bare
            />
          </SectionCard>
        )}

        {activeTab === 'maintenance' && (
          <SectionCard icon={Receipt} title="Maintenance">
            <AppTable
              columns={invoiceColumns}
              data={invoiceItems}
              loading={invLoading}
              rowKey={(inv) => inv.id}
              emptyTitle="No invoices found"
              emptySubtitle="No maintenance records for this tenant."
              emptyIcon="bi-receipt"
              skeletonRows={4}
            />
          </SectionCard>
        )}
      </div>
    </div>
  );
};

export default TenantOverview;
