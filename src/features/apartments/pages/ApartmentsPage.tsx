import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useApartments } from '../hooks/useApartments';
import { useApartmentMutations } from '../hooks/useApartmentMutations';
import type { Apartment, CreateApartmentPayload, UpdateApartmentPayload } from '../types/apartment.types';
import ApartmentStatsCards from '../components/ApartmentStatsCards';
import ApartmentFiltersComponent from '../components/ApartmentFilters';
import ApartmentFormModal from '../components/ApartmentFormModal';
import Pagination from '../../../components/Pagination/Pagination';
import { showSuccess } from '../../../utils/toast';
import ApartmentTable from '../components/ApartmentTable';

const ApartmentsPage = () => {
  const { apartments, pagination, stats, filters, loading, updateFilters, changePage, refetch } = useApartments();
  const { createApartment, createLoading, updateApartment, updateLoading } = useApartmentMutations(refetch);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);

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
    <div className="apartments-page p-4">

      {/* ── Header ── */}
      <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap">
        <div>
          <h4 className="fw-bold mb-3" style={{ fontSize: '1.35rem', color: '#111827' }}>
            Apartment Management
          </h4>
          <p className="text-muted mb-3" style={{ fontSize: '0.875rem' }}>
            Manage all apartment units, occupancy and details.
          </p>
        </div>
        <button
          className="page-add-btn"
          onClick={() => { setModalMode("add"); setShowModal(true); }}
        >
          <Plus size={16} strokeWidth={2} />
          Add Apartment
        </button>
      </div>

      {/* ── Stats ── */}
      <ApartmentStatsCards
        stats={stats}
      />
      {/* ── Table card ── */}
      <div className="table-card">
        <div className="table-card__filters">
          <ApartmentFiltersComponent key={filters.block ?? ""} filters={filters} onFilterChange={updateFilters} />
        </div>

        <ApartmentTable apartments={apartments} loading={loading} onView={handleView} onEdit={handleEdit} />

        <div className="table-card__footer">
          <Pagination pagination={pagination} onPageChange={changePage} />
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

    </div>
  );
}

export default ApartmentsPage;