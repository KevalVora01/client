import { useEffect } from "react";
import { createPortal } from "react-dom";
import "./ConfirmDialog.css";
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
    <div className="cd-backdrop" onClick={onCancel}>
      <div
        className="bg-white rounded-3 p-4 position-relative d-flex flex-column align-items-center text-center cd-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="btn btn-sm position-absolute cd-close"
          style={{ top: 22, right: 22 }}
          onClick={onCancel}
          aria-label="Close"
        >
          <i className="bi bi-x" />
        </button>

        {/* Icon */}
        <div
          className="rounded-circle d-flex align-items-center justify-content-center mb-3 cd-icon-wrap"
          style={{ background: config.iconBg }}
        >
          <i className={`bi ${config.icon}`} style={{ color: config.iconColor }} />
        </div>

        {/* Text */}
        <h6 className="fw-bold mb-1" style={{ color: '#1a1f36' }}>{title}</h6>
        <p className="text-muted mb-4" style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>{message}</p>

        {/* Actions */}
        <div className="d-flex gap-2 w-100">
          <button
            className="btn btn-outline-secondary flex-fill"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            className={`btn ${config.btnClass} flex-fill text-white`}
            onClick={onConfirm}
            disabled={loading}
          >
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