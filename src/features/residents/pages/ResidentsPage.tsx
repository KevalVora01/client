import { UserPlus } from "lucide-react";
import { useResidentsPage } from "../hooks/useResidentsPage";
import ResidentStatsCards from "../components/ResidentStatsCards/ResidentStatsCards";
import ResidentFiltersComponent from "../components/ResidentFilters/ResidentFilters";
import ResidentTable from "../components/ResidentTable/ResidentTable";
import Pagination from "../../../components/Pagination/Pagination";
import "./ResidentsPage.css";
import ResidentFormModal from "../components/ResidentFormModal/ResidentFormModal";
import type { CreateResidentPayload, UpdateResidentPayload } from "../types/resident.types";
import ConfirmDialog from "../../../components/ConfirmDialog/ConfirmDialog";

const ResidentsPage = () => {
  const {
    residents, pagination, filters, loading,
    updateFilters, changePage,
    showAddModal, showEditModal, showDeactivateModal,
    setShowAddModal, selectedResident,
    deactivateLoading,
    handleView, handleEdit, handleDeactivate,
    handleCreate, handleUpdate, handleDeactivateConfirm,
    handleCloseEdit, handleCloseDeactivate,
  } = useResidentsPage();

  return (
    <div className="residents-page">

      {/* ── Header ── */}
      <div className="residents-page__header">
        <div>
          <h4 className="residents-page__title">Residents Management</h4>
          <p className="residents-page__subtitle">
            Oversee all resident accounts, tenancy status, and unit allocations.
          </p>
        </div>
        <button className="residents-page__add-btn" onClick={() => setShowAddModal(true)}>
          <UserPlus size={16} strokeWidth={2} />
          Add Resident
        </button>
      </div>

      {/* ── Stats ── */}
      <ResidentStatsCards residents={residents} totalCount={pagination.totalCount} />

      {/* ── Table card ── */}
      <div className="residents-table-card">
        <div className="residents-table-card__filters">
          <ResidentFiltersComponent filters={filters} onFilterChange={updateFilters} />
        </div>

        <ResidentTable
          residents={residents}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDeactivate={handleDeactivate}
        />

        <div className="residents-table-card__footer">
          <Pagination pagination={pagination} onPageChange={changePage} />
        </div>
      </div>

      {/* ── Modals ── */}
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
        onConfirm={() => selectedResident && handleDeactivateConfirm(selectedResident.id)}
        onCancel={handleCloseDeactivate}
      />

    </div>
  );
};

export default ResidentsPage;