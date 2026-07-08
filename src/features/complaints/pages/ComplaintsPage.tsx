import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useComplaintsPage } from '../hooks/useComplaintsPage';
import { useComplaintMutations } from '../hooks/useComplaintMutations';
import ComplaintFilters from '../components/ComplaintFilters';
import ComplaintList from '../components/ComplaintList';
import ComplaintForm from '../components/ComplaintForm';
import Pagination from '../../../components/Pagination/Pagination';
import { useScrollLock } from '../../../hooks/useScrollLock';
import useAuth from '../../../hooks/useAuth';
import type { Complaint, ComplaintStatus } from '../types/complaint.types';

const ComplaintsPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const navigate = useNavigate();

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

  const goToDetail = (complaint: Complaint) => navigate(`/complaints/${complaint.id}`);

  return (
    <div className="container-fluid p-3 p-md-4 max-w-100 mx-auto">

      {/* ── Header Banner ── */}
      <div
        className="d-flex align-items-start justify-content-between gap-3 flex-wrap mb-4 p-4 rounded-3"
        style={{
          background: 'linear-gradient(135deg, #1a1f36 0%, #2d2a6e 50%, #1a1f36 100%)',
        }}
      >
        <div className="d-flex align-items-start gap-3">
          <div
            className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: '48px', height: '48px', backgroundColor: 'rgba(255,255,255,0.12)' }}
          >
            <i className="bi bi-clipboard-check text-white" style={{ fontSize: '1.3rem' }} />
          </div>
          <div>
            <h4 className="fw-bold mb-1 text-white" style={{ fontSize: '1.3rem' }}>
              Complaints
            </h4>
            <p className="mb-0 small" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {isAdmin
                ? 'Review and resolve complaints raised by residents.'
                : 'Track the status of complaints you have raised.'}
            </p>
          </div>
        </div>
        {!isAdmin && (
          <button
            className="btn d-flex align-items-center gap-1 fw-medium"
            onClick={openAddModal}
            style={{
              fontSize: '0.875rem', borderRadius: '8px', height: '40px',
              backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <i className="bi bi-plus-lg" /> Raise Complaint
          </button>
        )}
      </div>

      {/* ── Content Card ── */}
      <div className="card bg-white border border-light-subtle rounded-3 shadow-sm">

        {/* Filters */}
        <div className="card-header bg-white border-bottom border-light-subtle p-3">
          <ComplaintFilters
            filters={filters}
            onFilterChange={updateFilters}
          />
        </div>

        {/* Complaint List */}
        <div className="card-body p-3">
          <ComplaintList
            complaints={complaints?.items ?? []}
            loading={loading}
            onView={goToDetail}
            onUpdateStatus={handleUpdateStatus}
            isAdmin={isAdmin}
          />
        </div>

        {/* Pagination */}
        {!loading && (complaints?.items?.length ?? 0) > 0 && (
          <div className="card-footer bg-white border-top border-light-subtle p-3 d-flex justify-content-end">
            <Pagination
              pagination={pagination}
              onPageChange={changePage}
            />
          </div>
        )}

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