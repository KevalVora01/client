import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useScrollLock } from "../../hooks/useScrollLock";

type ConfirmVariant = "danger" | "warning" | "info";

interface ConfirmDialogProps {
  show: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const VARIANT_CONFIG = {
  danger: {
    icon: "bi-trash3",
    iconBg: "#fef2f2",
    iconColor: "#dc2626",
    btnClass: "btn-danger",
  },
  warning: {
    icon: "bi-person-x",
    iconBg: "#fffbeb",
    iconColor: "#d97706",
    btnClass: "btn-warning",
  },
  info: {
    icon: "bi-info-circle",
    iconBg: "#eff6ff",
    iconColor: "#2563eb",
    btnClass: "btn-primary",
  },
};

const ConfirmDialog = ({
  show,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const config = VARIANT_CONFIG[variant];

  useScrollLock(show);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onCancel]);

  if (!show) return null;

  return createPortal(
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
      style={{ background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(4px)', zIndex: 1070 }}
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-3 p-4 position-relative d-flex flex-column align-items-center text-center"
        style={{ width: '100%', maxWidth: '380px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="btn position-absolute d-flex align-items-center justify-content-center p-0 text-secondary"
          style={{ top: 14, right: 14, width: 28, height: 28, border: '1px solid #e9ecef', background: '#fff', fontSize: '1.1rem' }}
          onClick={onCancel}
          aria-label="Close"
        >
          <i className="bi bi-x" />
        </button>

        {/* Icon */}
        <div
          className="rounded-circle d-flex align-items-center justify-content-center mb-3 flex-shrink-0"
          style={{ width: 52, height: 52, fontSize: '1.4rem', background: config.iconBg }}
        >
          <i className={`bi ${config.icon}`} style={{ color: config.iconColor }} />
        </div>

        {/* Text */}
        <h6 className="fw-bold mb-1" style={{ color: '#1a1f36' }}>{title}</h6>
        <p className="text-muted mb-4" style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>{message}</p>

        {/* Actions */}
        <div className="d-flex gap-2 w-100">
          <button className="btn btn-outline-secondary flex-fill" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </button>
          <button className={`btn ${config.btnClass} flex-fill text-white`} onClick={onConfirm} disabled={loading}>
            {loading
              ? <><span className="cd-spinner" /> Processing...</>
              : confirmLabel
            }
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmDialog;