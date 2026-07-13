import { UserPlus } from "lucide-react";
import { useResidentsPage } from "../hooks/useResidentsPage";
import ResidentStatsCards from "../components/ResidentStatsCards";
import ResidentFiltersComponent from "../components/ResidentFilters";
import ResidentTable from "../components/ResidentTable";
import Pagination from "../../../components/Pagination/Pagination";
import ResidentFormModal from "../components/ResidentFormModal";
import type { CreateResidentPayload, UpdateResidentPayload } from "../types/resident.types";
import ConfirmDialog from "../../../components/ConfirmDialog/ConfirmDialog";

const ResidentsPage = () => {
  const {
    residents, pagination, stats, filters, loading,
    updateFilters, changePage,
    showAddModal, showEditModal, showDeactivateModal,
    setShowAddModal, selectedResident,
    deactivateLoading,
    handleView, handleEdit, handleDeactivate,
    handleCreate, handleUpdate, handleDeactivateConfirm,
    handleCloseEdit, handleCloseDeactivate,
  } = useResidentsPage();

  return (
    <div className="container-fluid p-3 p-md-4 max-w-100 mx-auto">

      {/* ── Header ── */}
      <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ fontSize: '1.4rem', color: '#1a1f36' }}>
            Residents Management
          </h4>
          <p className="text-secondary mt-3 mb-0 small">
            Oversee all resident accounts, tenancy status, and unit allocations.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-dark fw-medium d-inline-flex align-items-center gap-2 px-3 py-2 small shadow-sm"
          onClick={() => setShowAddModal(true)}
          style={{ fontSize: "0.875rem", borderRadius: "8px", backgroundColor: "#1a1f36", borderColor: "#1a1f36" }}
        >
          <UserPlus size={16} strokeWidth={2} />
          Add Resident
        </button>
      </div>

      {/* ── Stats Cards Grid ── */}
      <ResidentStatsCards stats={stats} loading={loading} />

      {/* ── Table Container Card ── */}
      <div className="card bg-white border border-light-subtle rounded-3 shadow-sm mt-4">
        {/* Filters Wrapper Block */}
        <div className="card-header bg-white border-bottom border-light-subtle p-3">
          <ResidentFiltersComponent filters={filters} onFilterChange={updateFilters} />
        </div>

        {/* Dynamic List Table Area */}
        <div className="table-responsive">
          <ResidentTable
            residents={residents}
            loading={loading}
            onView={handleView}
            onEdit={handleEdit}
            onDeactivate={handleDeactivate}
          />
        </div>

        {/* Dynamic List Footer Section */}
        <div className="card-footer bg-white border-top border-light-subtle p-3 d-flex justify-content-end">
          <Pagination
            pagination={pagination}
            onPageChange={changePage}
            onPageSizeChange={(size) => updateFilters({ pageSize: size })}
          />
        </div>
      </div>

      {/* Form Action Triggers */}
      <ResidentFormModal
        key={selectedResident?.id ?? "add"}
        show={showAddModal || showEditModal}
        mode={showEditModal ? "edit" : "add"}
        resident={selectedResident}
        loading={showEditModal ? false : false}
        onClose={showEditModal ? handleCloseEdit : () => setShowAddModal(false)}
        onSubmit={(payload, id) =>
          showEditModal
            ? handleUpdate(id!, payload as UpdateResidentPayload)
            : handleCreate(payload as CreateResidentPayload)
        }
      />

      {/* Status Warning Triggers */}
      <ConfirmDialog
        show={showDeactivateModal}
        title="Deactivate Resident"
        message={
          selectedResident
            ? `Are you sure you want to deactivate ${selectedResident.user.name}? They will lose access to the system.`
            : "Are you sure you want to deactivate this resident?"
        }
        confirmLabel="Yes, Deactivate"
        variant="warning"
        loading={deactivateLoading}
        onConfirm={async () => {
          if (!selectedResident) return;
          const success = await handleDeactivateConfirm(selectedResident.id);
          if (success) handleCloseDeactivate();
        }}
        onCancel={handleCloseDeactivate}
      />

    </div>
  );
};

export default ResidentsPage;