import { useScrollLock } from "../../../hooks/useScrollLock";
import type { ReactNode } from "react";

interface ConfirmModalProps {
  show: boolean;
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({
  show,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  useScrollLock(show);

  if (!show) return null;

  return (
    <div
      className="modal d-block bg-dark bg-opacity-50"
      style={{ backdropFilter: "blur(4px)", zIndex: 1080 }}
      onClick={onCancel}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-0 rounded-3 shadow-lg bg-white">
          <div className="modal-header border-bottom border-light-subtle px-4 pt-4 pb-3 position-relative">
            <h5
              className="modal-title fw-bold fs-6 d-inline-flex align-items-center gap-2"
              style={{ color: "#1a1f36" }}
            >
              {title}
            </h5>
            <button
              type="button"
              className="btn position-absolute d-flex align-items-center justify-content-center p-0 text-secondary"
              style={{ top: 20, right: 20, width: 28, height: 28, border: '1px solid #e9ecef', background: '#fff', fontSize: '1.1rem', borderRadius: '6px' }}
              onClick={onCancel}
              disabled={loading}
              aria-label="Close"
            >
              <i className="bi bi-x" />
            </button>
          </div>
          <div className="modal-body p-4">
            <p className="text-secondary mb-0" style={{ fontSize: "0.9rem" }}>
              {message}
            </p>
          </div>
          <div className="modal-footer border-0 pt-0 pb-4 px-4 d-flex justify-content-end gap-2">
            <button
              className="btn btn-light border border-light-subtle fw-semibold"
              onClick={onCancel}
              disabled={loading}
            >
              {cancelLabel}
            </button>
            <button
              className="btn fw-semibold d-flex align-items-center gap-1"
              style={{
                backgroundColor: danger ? "#991b1b" : "#111827",
                color: "#fff",
                border: "none",
              }}
              onClick={onConfirm}
              disabled={loading}
            >
              {loading && <span className="spinner-border spinner-border-sm" />}
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
