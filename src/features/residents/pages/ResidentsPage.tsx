import { UserPlus, RefreshCw, Upload } from "lucide-react";
import { useState } from "react";
import { useResidentsPage } from "../hooks/useResidentsPage";
import ResidentStatsCards from "../components/ResidentStatsCards";
import ResidentFiltersComponent from "../components/ResidentFilters";
import ResidentTable from "../components/ResidentTable";
import Pagination from "../../../components/Pagination/Pagination";
import ResidentFormModal from "../components/ResidentFormModal";
import type { CreateResidentPayload, UpdateResidentPayload } from "../types/resident.types";
import ConfirmDialog from "../../../components/ConfirmDialog/ConfirmDialog";
import { residentApi } from "../api/residentApi";
import { showSuccess, showError } from "../../../utils/toast";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import ImportResultsModal, { type FailedImportItem } from "../../../components/ImportResultsModal/ImportResultsModal";
import { ImportModal } from "../../../components/ImportModal/ImportModal";

const ResidentsPage = () => {
  const {
    residents, pagination, stats, filters, loading,
    updateFilters, changePage,
    showAddModal, showEditModal, showDeactivateModal,
    setShowAddModal, selectedResident,
    deactivateLoading, importLoading,
    handleView, handleEdit, handleDeactivate,
    handleCreate, handleUpdate, handleDeactivateConfirm,
    handleCloseEdit, handleCloseDeactivate, importResidents,
  } = useResidentsPage();

  const [promoting, setPromoting] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const [showResultsModal, setShowResultsModal] = useState(false);
  const [importResults, setImportResults] = useState<{
    successCount: number;
    failedCount: number;
    failedItems: FailedImportItem[];
  } | null>(null);

  const handlePromoteOccupants = async () => {
    setPromoting(true);
    try {
      const result = await residentApi.promoteOccupants();
      showSuccess(
        result.promoted > 0
          ? `Occupant promotion ran — ${result.promoted} resident(s) promoted.`
          : "Occupant promotion ran — no pending promotions."
      );
    } catch (err: unknown) {
      showError(getErrorMessage(err, "Failed to run occupant promotion"));
    } finally {
      setPromoting(false);
    }
  };

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

        <div className="d-flex align-items-center gap-2 flex-wrap">
          <button
            type="button"
            className="btn btn-outline-dark fw-medium d-inline-flex align-items-center gap-2 px-3 py-2 small shadow-sm"
            onClick={handlePromoteOccupants}
            disabled={promoting}
            style={{ fontSize: "0.875rem", borderRadius: "8px" }}
            title="Manually run the occupant promotion job (normally run by the hourly cron)"
          >
            {promoting ? (
              <span className="spinner-border spinner-border-sm" />
            ) : (
              <RefreshCw size={16} strokeWidth={2} />
            )}
            Run Occupant Promotion
          </button>

          <button
            type="button"
            className="btn btn-outline-dark fw-medium d-inline-flex align-items-center gap-2 px-3 py-2 small shadow-sm"
            onClick={() => setShowImportModal(true)}
            disabled={importLoading}
            style={{ fontSize: "0.875rem", borderRadius: "8px" }}
          >
            {importLoading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
            ) : (
              <Upload size={16} strokeWidth={2} />
            )}
            {importLoading ? "Importing..." : "Import Excel"}
          </button>

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
      </div>

      {/* ── Stats Cards Grid ── */}
      <ResidentStatsCards stats={stats} loading={loading && stats.totalCount === 0} />

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

      <ImportResultsModal
        show={showResultsModal}
        onClose={() => {
          setShowResultsModal(false);
          setImportResults(null);
        }}
        successCount={importResults?.successCount ?? 0}
        failedCount={importResults?.failedCount ?? 0}
        failedItems={importResults?.failedItems ?? []}
        title="Resident Import Results"
      />

      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        title="Import Residents"
        templateUrl="/templates/residents_template.xlsx"
        templateName="residents_template.xlsx"
        loading={importLoading}
        onUpload={async (file) => {
          const result = await importResidents(file);
          if (result) {
            setImportResults(result);
            setShowResultsModal(true);
            showSuccess(`Import finished. Successfully imported ${result.successCount} residents.`);
          }
        }}
      />

    </div>
  );
};

export default ResidentsPage;