import type { ResidentDetail } from "../../types/resident.types";

interface DeactivateConfirmModalProps {
  show: boolean;
  loading: boolean;
  error: string | null;
  resident: ResidentDetail | null;
  onClose: () => void;
  onConfirm: (id: number) => Promise<boolean>;
}

const DeactivateConfirmModal = ({
  show,
  loading,
  error,
  resident,
  onClose,
  onConfirm,
}: DeactivateConfirmModalProps) => {
  if (!show || !resident) return null;

  const handleConfirm = async () => {
    const success = await onConfirm(resident.id);
    if (success) onClose();
  };

  return (
    <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">

          <div className="modal-header border-0 pb-0">
            <button
              className="btn-close ms-auto"
              onClick={onClose}
              disabled={loading}
            />
          </div>

          <div className="modal-body text-center px-4 pb-2">
            <div
              className="bg-danger bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: 56, height: 56 }}
            >
              <i className="bi bi-person-x text-danger fs-3"></i>
            </div>

            <h5 className="fw-semibold mb-1">Deactivate resident</h5>
            <p className="text-muted small mb-1">
              Are you sure you want to deactivate
            </p>
            <p className="fw-semibold mb-1">{resident.user.name}</p>
            <p className="text-muted small mb-3">
              {resident.user.email} · {resident.apartment?.block}-{resident.apartment?.flateNumber}
            </p>

            <div className="alert alert-warning py-2 text-start small">
              <i className="bi bi-exclamation-triangle me-1"></i>
              This will deactivate both the resident profile and their user account.
              They will no longer be able to log in.
            </div>

            {error && (
              <div className="alert alert-danger py-2 text-start small">
                <i className="bi bi-exclamation-circle me-1"></i>
                {error}
              </div>
            )}
          </div>

          <div className="modal-footer border-0 pt-0 justify-content-center gap-2">
            <button
              className="btn btn-outline-secondary px-4"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="btn btn-danger px-4"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Deactivating...
                </>
              ) : (
                <>
                  <i className="bi bi-person-x me-1"></i>
                  Yes, deactivate
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DeactivateConfirmModal;