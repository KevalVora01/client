import { useState } from "react";
import { ArrowLeft, Receipt, ClipboardList, Calendar, ArrowRight, Mail, Phone, Users, CarFront } from "lucide-react";
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

  // Complaints — apartment-wide, filtered to this tenant, read-only.
  const { complaints: complaintData, loading: cLoading } = useComplaints({}, false, false);
  const complaintItems = (complaintData?.items ?? []).filter((c) => c.residentId === tenant.id);

  // Maintenance — apartment invoices, filtered to this tenant, read-only.
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

  // Same columns as the resident-side maintenance table.
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
    <div>
      <button
        type="button"
        onClick={onBack}
        className="btn btn-sm btn-link text-decoration-none d-inline-flex align-items-center gap-1 px-0 mb-3 fw-semibold"
        style={{ color: '#4b5563' }}
      >
        <ArrowLeft size={16} color="#000" /> Back to tenants
      </button>

      {/* Tenant header */}
      <div className="card bg-white border border-light-subtle rounded-3 shadow-sm mb-3">
        <div className="card-body px-4 py-3 d-flex align-items-center gap-3">
          <div className="rounded-circle fw-bold d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: 52, height: 52, fontSize: '1rem', background: bg, color }}>
            {getInitials(tenant.user.name)}
          </div>
          <div className="min-w-0">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <span className="fw-bold text-dark" style={{ fontSize: '1.05rem' }}>{tenant.user.name}</span>
              {isCurrent ? (
                <span className="badge rounded-pill fw-medium" style={{ backgroundColor: '#dcfce7', color: '#166534', fontSize: '0.7rem' }}>Current</span>
              ) : (
                <span className="badge rounded-pill fw-medium" style={{ backgroundColor: '#f3f4f6', color: '#6b7280', fontSize: '0.7rem' }}>Past</span>
              )}
            </div>
            <div className="d-flex align-items-center gap-3 mt-1 text-muted flex-wrap" style={{ fontSize: '0.8rem' }}>
              <span className="d-inline-flex align-items-center gap-1"><Mail size={13} /> {tenant.user.email}</span>
              <span className="d-inline-flex align-items-center gap-1"><Phone size={13} /> {tenant.user.phone}</span>
            </div>
            <div className="d-flex align-items-center gap-1 mt-1 text-muted" style={{ fontSize: '0.8rem' }}>
              <Calendar size={13} className="me-1" />
              <span>{formatDate(tenant.moveInDate)}</span>
              <ArrowRight size={13} className="mx-1" />
              <span>{tenant.moveOutDate ? formatDate(tenant.moveOutDate) : 'Present'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section tabs */}
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
  );
};

export default TenantOverview;
