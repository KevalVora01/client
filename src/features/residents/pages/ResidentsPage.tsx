import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { useResidents } from '../hooks/useResidents';
import { useResidentMutations } from '../hooks/useResidentMutations';
import type { ResidentDetail, CreateResidentPayload, UpdateResidentPayload } from '../types/resident.types';
import ResidentStatsCards from '../components/ResidentStatsCards/ResidentStatsCards';
import ResidentFiltersComponent from '../components/ResidentFilters/ResidentFilters';
import ResidentTable from '../components/ResidentTable/ResidentTable';
import Pagination from '../../../components/Pagination/Pagination';
import AddResidentModal from '../components/AddResidentModal/AddResidentModal';
import EditResidentModal from '../components/EditResidentModal/EditResidentModal';
import DeactivateConfirmModal from '../components/DeactivateConfirmModal/DeactivateConfirmModal';
import './ResidentsPage.css';

const ResidentsPage = () => {
  const { residents, pagination, filters, loading, error, updateFilters, changePage, refetch } = useResidents();
  const {
    createResident, createLoading, createError,
    updateResident, updateLoading, updateError,
    deactivateResident, deactivateLoading, deactivateError,
  } = useResidentMutations(refetch);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [selectedResident, setSelectedResident] = useState<ResidentDetail | null>(null);

  const handleEdit = (resident: ResidentDetail) => { setSelectedResident(resident); setShowEditModal(true); };
  const handleDeactivate = (resident: ResidentDetail) => { setSelectedResident(resident); setShowDeactivateModal(true); };
  const handleView = (resident: ResidentDetail) => { console.log('View resident', resident.id); };
  const handleCreate = async (payload: CreateResidentPayload): Promise<boolean> => await createResident(payload);
  const handleUpdate = async (id: number, payload: UpdateResidentPayload): Promise<boolean> => await updateResident(id, payload);
  const handleDeactivateConfirm = async (id: number): Promise<boolean> => await deactivateResident(id);

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
      <ResidentStatsCards
        residents={residents}
        totalCount={pagination.totalCount}
      />

      {/* ── Table card ── */}
      <div className="residents-table-card">
        <div className="residents-table-card__filters">
          <ResidentFiltersComponent filters={filters} onFilterChange={updateFilters} />
        </div>

        {error && (
          <div className="residents-page__error">
            {error}
            <button onClick={refetch} className="residents-page__retry">Retry</button>
          </div>
        )}

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
      <AddResidentModal show={showAddModal} loading={createLoading} error={createError} onClose={() => setShowAddModal(false)} onSubmit={handleCreate} />
      <EditResidentModal key={selectedResident?.id} show={showEditModal} loading={updateLoading} error={updateError} resident={selectedResident} onClose={() => { setShowEditModal(false); setSelectedResident(null); }} onSubmit={handleUpdate} />
      <DeactivateConfirmModal show={showDeactivateModal} loading={deactivateLoading} error={deactivateError} resident={selectedResident} onClose={() => { setShowDeactivateModal(false); setSelectedResident(null); }} onConfirm={handleDeactivateConfirm} />
    </div>
  );
};

export default ResidentsPage;