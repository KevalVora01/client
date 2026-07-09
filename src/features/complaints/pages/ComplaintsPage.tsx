import { useState } from 'react';
import { useComplaintsPage } from '../hooks/useComplaintsPage';
import { useComplaintMutations } from '../hooks/useComplaintMutations';
import ComplaintFilters from '../components/ComplaintFilters';
import ComplaintList from '../components/ComplaintList';
import ComplaintForm from '../components/ComplaintForm';
import { useScrollLock } from '../../../hooks/useScrollLock';
import useAuth from '../../../hooks/useAuth';
import type { Complaint, ComplaintStatus } from '../types/complaint.types';

const ComplaintsPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const {
    complaints,
    loading,
    filters,
    updateFilters,
    changePage,
    pagination,
    refetch,
  } = useComplaintsPage(isAdmin);

  const {
    createComplaint,
    updateStatus,
    loading: mutationLoading,
  } = useComplaintMutations(refetch);

  const [addModalOpen, setAddModalOpen] = useState(false);

  useScrollLock(addModalOpen);

  const handleAdd = async (formData: FormData): Promise<boolean> => {
    const success = await createComplaint(formData);
    if (success) setAddModalOpen(false);
    return success;
  };

  const handleUpdateStatus = async (complaint: Complaint, status: ComplaintStatus) => {
    await updateStatus(complaint.id, { status });
  };

  const openAddModal = () => setAddModalOpen(true);
  const closeAddModal = () => setAddModalOpen(false);

  return (
    <div className="container-fluid p-3 p-md-4 max-w-100 mx-auto">

      {/* ── Header ── */}
      <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap mb-4">
        <div>
          <h4 className="fw-bold mb-3" style={{ fontSize: '1.4rem', color: '#1a1f36' }}>
            Complaints Management
          </h4>
          <p className="text-muted mb-0 small">
            Review and resolve resident issues.
          </p>
        </div>
        {!isAdmin && (
          <button
            className="btn btn-dark fw-medium d-inline-flex align-items-center gap-2 px-3 py-2"
            onClick={openAddModal}
            style={{ fontSize: '0.875rem', borderRadius: '8px', backgroundColor: '#1a1f36', borderColor: '#1a1f36' }}
          >
            <i className="bi bi-plus-lg" /> Raise Complaint
          </button>
        )}
      </div>

      {/* ── Filters ── */}
      <div className="d-flex align-items-center gap-3 mb-3">
        <ComplaintFilters
          filters={filters}
          onFilterChange={updateFilters}
        />
      </div>

      {/* ── Complaint Table ── */}
      <div className="mb-3">
        <ComplaintList
          complaints={complaints?.items ?? []}
          loading={loading}
          onUpdateStatus={handleUpdateStatus}
          isAdmin={isAdmin}
          pagination={pagination}
          onPageChange={changePage}
        />
      </div>

      {/* ── Add Complaint Modal (Resident only) ── */}
      {addModalOpen && (
        <div className="modal d-block bg-dark bg-opacity-50" style={{ backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content border-0 rounded-3 shadow-lg bg-white">

              <div className="modal-header border-bottom border-light-subtle px-4 pt-4 pb-3 align-items-start position-relative">
                <div>
                  <h5 className="modal-title fw-bold fs-6" style={{ color: '#1a1f36' }}>
                    Raise a Complaint
                  </h5>
                  <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>
                    Describe the issue and attach photos if needed.
                  </p>
                </div>
                <button
                  className="btn btn-outline-light border border-light-subtle text-secondary rounded-2 p-0 d-flex align-items-center justify-content-center position-absolute"
                  onClick={closeAddModal}
                  disabled={mutationLoading}
                  aria-label="Close"
                  style={{ width: '30px', height: '30px', top: '1.2rem', right: '1.2rem' }}
                >
                  <i className="bi bi-x fs-5" />
                </button>
              </div>

              <div className="modal-body p-4">
                <ComplaintForm
                  loading={mutationLoading}
                  onSubmit={handleAdd}
                  onCancel={closeAddModal}
                />
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ComplaintsPage;
