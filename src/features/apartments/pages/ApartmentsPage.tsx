import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Upload, Plus } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useApartments } from '../hooks/useApartments';
import { useApartmentMutations } from '../hooks/useApartmentMutations';
import type { Apartment, CreateApartmentPayload, UpdateApartmentPayload } from '../types/apartment.types';
import ApartmentStatsCards from '../components/ApartmentStatsCards';
import ApartmentFiltersComponent from '../components/ApartmentFilters';
import ApartmentFormModal from '../components/ApartmentFormModal';
import Pagination from '../../../components/Pagination/Pagination';
import { showSuccess } from '../../../utils/toast';
import ApartmentTable from '../components/ApartmentTable';
import ImportResultsModal, { type FailedImportItem } from '../../../components/ImportResultsModal/ImportResultsModal';

const ApartmentsPage = () => {
  const { apartments, pagination, stats, filters, loading, updateFilters, changePage, refetch } = useApartments();
  const { createApartment, createLoading, updateApartment, updateLoading, importApartments, importLoading } = useApartmentMutations(refetch);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);

  const [showResultsModal, setShowResultsModal] = useState(false);
  const [importResults, setImportResults] = useState<{
    successCount: number;
    failedCount: number;
    failedItems: FailedImportItem[];
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input value so same file can be selected again
    e.target.value = '';

    const result = await importApartments(file);
    if (result) {
      setImportResults(result);
      setShowResultsModal(true);
      showSuccess(`Import finished. Successfully imported ${result.successCount} apartments.`);
    }
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      {
        "Block": "A",
        "Floor Number": 1,
        "Unit Number": "01",
        "Area (Sqft)": 1200,
        "Type": "2bhk" // studio, 1bhk, 2bhk, 3bhk, 4bhk
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Apartments Template");
    XLSX.writeFile(workbook, "apartment_import_template.xlsx");
  };

  const handleView = (apartment: Apartment) => {
    navigate(`/apartments/${apartment.id}`);
  };

  const handleEdit = (apartment: Apartment) => {
    setSelectedApartment(apartment);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedApartment(null);
  };

  const handleFormSubmit = async (
    payload: CreateApartmentPayload | UpdateApartmentPayload,
    id?: number
  ): Promise<boolean> => {
    if (id) {
      const success = await updateApartment(id, payload as UpdateApartmentPayload);
      if (success) showSuccess("Apartment updated successfully");
      return success;
    } else {
      const success = await createApartment(payload as CreateApartmentPayload);
      if (success) showSuccess("Apartment created successfully");
      return success;
    }
  };

  return (
    <div className="container-fluid p-3 p-md-4 max-w-100 mx-auto">

      {/* ── Header ── */}
      <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ fontSize: '1.35rem', color: '#1a1f36' }}>
            Apartment Management
          </h4>
          <p className="text-secondary mt-3 mb-0 small">
            Manage all apartment units, occupancy and details.
          </p>
        </div>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <button
            type="button"
            className="btn btn-outline-dark fw-medium d-inline-flex align-items-center gap-2 px-3 py-2 small shadow-sm"
            onClick={handleDownloadTemplate}
            style={{ fontSize: "0.875rem", borderRadius: "8px" }}
          >
            <Download size={16} strokeWidth={2} />
            Download Template
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xlsx, .xls"
            style={{ display: "none" }}
          />

          <button
            type="button"
            className="btn btn-dark fw-medium d-inline-flex align-items-center gap-2 px-3 py-2 small shadow-sm"
            onClick={handleImportClick}
            disabled={importLoading}
            style={{ fontSize: "0.875rem", borderRadius: "8px", backgroundColor: "#1a1f36", borderColor: "#1a1f36" }}
          >
            {importLoading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
            ) : (
              <Upload size={16} strokeWidth={2} />
            )}
            {importLoading ? "Importing..." : "Import Excel"}
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <ApartmentStatsCards stats={stats} loading={loading && stats.totalCount === 0} />

      {/* ── Table card ── */}
      <div className="card bg-white border border-light-subtle rounded-3 shadow-sm mt-4">
        <div className="card-header bg-white border-bottom border-light-subtle p-3">
          <ApartmentFiltersComponent filters={filters} onFilterChange={updateFilters} />
        </div>

        <div className="table-responsive">
          <ApartmentTable apartments={apartments} loading={loading} onView={handleView} />
        </div>

        <div className="card-footer bg-white border-top border-light-subtle p-3 d-flex justify-content-end">
          <Pagination
            pagination={pagination}
            onPageChange={changePage}
            onPageSizeChange={(size) => updateFilters({ pageSize: size })}
          />
        </div>
      </div>

      <ApartmentFormModal
        key={selectedApartment?.id ?? "add"}
        show={showModal}
        mode={modalMode}
        apartment={selectedApartment}
        loading={modalMode === "add" ? createLoading : updateLoading}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
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
        title="Apartment Import Results"
      />

    </div>
  );
}

export default ApartmentsPage;