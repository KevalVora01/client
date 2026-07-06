import { useState } from 'react';
import { useNoticesPage } from '../hooks/useNoticesPage';
import { useNoticeMutations } from '../hooks/useNoticeMutations';
import NoticeFilters from '../components/NoticeFilters';
import NoticeList from '../components/NoticeList';
import NoticeForm from '../components/NoticeForm';
import ConfirmDialog from '../../../components/ConfirmDialog/ConfirmDialog';
import Pagination from '../../../components/Pagination/Pagination';
import { useScrollLock } from '../../../hooks/useScrollLock';
import useAuth from '../../../hooks/useAuth';
import type { Notice, CreateNoticePayload, UpdateNoticePayload } from '../types/notice.types';

interface NoticesPageProps {
  readOnly?: boolean;
}

const NoticesPage = ({ readOnly: readOnlyProp }: NoticesPageProps) => {
  const { user } = useAuth();
  const readOnly = readOnlyProp ?? user?.role !== 'admin';
  const {
    notices,
    loading,
    filters,
    updateFilters,
    changePage,
    pagination,
    refetch,
  } = useNoticesPage();

  const { createNotice, updateNotice, deleteNotice, togglePin, loading: mutationLoading } = useNoticeMutations(refetch);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [deletingNotice, setDeletingNotice] = useState<Notice | null>(null);

  useScrollLock(modalOpen);

  const handleAdd = async (payload: CreateNoticePayload): Promise<boolean> => {
    const success = await createNotice(payload);
    if (success) { setModalOpen(false); setEditingNotice(null); }
    return success;
  };

  const handleEdit = async (payload: UpdateNoticePayload): Promise<boolean> => {
    if (!editingNotice) return false;
    const success = await updateNotice(editingNotice.id, payload);
    if (success) { setModalOpen(false); setEditingNotice(null); }
    return success;
  };

  const handleDeleteConfirm = async () => {
    if (!deletingNotice) return;
    await deleteNotice(deletingNotice.id);
    setDeletingNotice(null);
  };

  const openAddModal = () => {
    setEditingNotice(null);
    setModalOpen(true);
  };

  const openEditModal = (notice: Notice) => {
    setEditingNotice(notice);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingNotice(null);
  };

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
            <i className="bi bi-megaphone text-white" style={{ fontSize: '1.3rem' }} />
          </div>
          <div>
            <h4 className="fw-bold mb-1 text-white" style={{ fontSize: '1.3rem' }}>
              Notices
            </h4>
            <p className="mb-0 small" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Stay updated with the latest announcements from your society.
            </p>
          </div>
        </div>
        {!readOnly && (
          <button
            className="btn d-flex align-items-center gap-1 fw-medium"
            onClick={openAddModal}
            style={{
              fontSize: '0.875rem', borderRadius: '8px', height: '40px',
              backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <i className="bi bi-plus-lg" /> Add Notice
          </button>
        )}
      </div>

      {/* ── Content Card ── */}
      <div className="card bg-white border border-light-subtle rounded-3 shadow-sm">

        {/* Filters */}
        <div className="card-header bg-white border-bottom border-light-subtle p-3">
          <NoticeFilters
            filters={filters}
            onFilterChange={updateFilters}
          />
        </div>

        {/* Notice List */}
        <div className="card-body p-3">
          <NoticeList
            notices={notices?.items ?? []}
            loading={loading}
            onEdit={openEditModal}
            onDelete={(n) => setDeletingNotice(n)}
            onTogglePin={(n) => togglePin(n.id)}
            readOnly={readOnly}
          />
        </div>

        {/* Pagination */}
        {!loading && (notices?.items?.length ?? 0) > 0 && (
          <div className="card-footer bg-white border-top border-light-subtle p-3 d-flex justify-content-end">
            <Pagination
              pagination={pagination}
              onPageChange={changePage}
            />
          </div>
        )}

      </div>

      {/* ── Add / Edit Modal ── */}
      {modalOpen && (
        <div className="modal d-block bg-dark bg-opacity-50" style={{ backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content border-0 rounded-3 shadow-lg bg-white">

              <div className="modal-header border-bottom border-light-subtle px-4 pt-4 pb-3 align-items-start position-relative">
                <div>
                  <h5 className="modal-title fw-bold fs-6" style={{ color: '#1a1f36' }}>
                    {editingNotice ? `Edit Notice — ${editingNotice.title}` : 'Add Notice'}
                  </h5>
                  <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>
                    {editingNotice ? 'Update the notice details below.' : 'Fill in the details to create a notice.'}
                  </p>
                </div>
                <button
                  className="btn btn-outline-light border border-light-subtle text-secondary rounded-2 p-0 d-flex align-items-center justify-content-center position-absolute"
                  onClick={closeModal}
                  disabled={mutationLoading}
                  aria-label="Close"
                  style={{ width: '30px', height: '30px', top: '1.2rem', right: '1.2rem' }}
                >
                  <i className="bi bi-x fs-5" />
                </button>
              </div>

              <div className="modal-body p-4">
                <NoticeForm
                  notice={editingNotice}
                  loading={mutationLoading}
                  onSubmit={editingNotice ? handleEdit : handleAdd}
                  onCancel={closeModal}
                />
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      <ConfirmDialog
        show={!!deletingNotice}
        title="Delete Notice"
        message={deletingNotice ? `Are you sure you want to delete "${deletingNotice.title}"?` : ''}
        confirmLabel="Yes, Delete"
        variant="danger"
        loading={mutationLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingNotice(null)}
      />

    </div>
  );
};

export default NoticesPage;