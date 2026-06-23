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
    btnClass: "cd-btn--danger",
  },
  warning: {
    icon: "bi-person-x",
    iconBg: "#fffbeb",
    iconColor: "#d97706",
    btnClass: "cd-btn--warning",
  },
  info: {
    icon: "bi-info-circle",
    iconBg: "#eff6ff",
    iconColor: "#2563eb",
    btnClass: "cd-btn--info",
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

  // lock body scroll
  useScrollLock(show);

  // close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onCancel]);

  if (!show) return null;

  return createPortal(
    <div className="cd-backdrop" onClick={onCancel}>
      <div className="cd-dialog" onClick={(e) => e.stopPropagation()}>

        {/* Close button */}
        <button className="cd-close" onClick={onCancel} aria-label="Close">
          <i className="bi bi-x" />
        </button>

        {/* Icon */}
        <div className="cd-icon-wrap" style={{ background: config.iconBg }}>
          <i className={`bi ${config.icon}`} style={{ color: config.iconColor }} />
        </div>

        {/* Text */}
        <h6 className="cd-title">{title}</h6>
        <p className="cd-message">{message}</p>

        {/* Actions */}
        <div className="cd-footer">
          <button
            className="cd-btn cd-btn--cancel"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            className={`cd-btn ${config.btnClass}`}
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