import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Ban } from "lucide-react";
import { DocModal } from "./DocModal";
import type { DocumentRequestItem } from "../types/documentRequest.types";

interface Props {
  target: DocumentRequestItem | null;
  onClose: () => void;
  onSubmit: (requestId: number, reason?: string) => Promise<boolean>;
}

const validationSchema = Yup.object({
  reason: Yup.string()
    .trim()
    .max(300, "Reason must be at most 300 characters"),
});

const RejectDocumentModal = ({ target, onClose, onSubmit }: Props) => {
  const [rejecting, setRejecting] = useState(false);

  const formik = useFormik({
    initialValues: { reason: "" },
    validationSchema,
    onSubmit: async (values) => {
      if (!target) return;
      setRejecting(true);
      const ok = await onSubmit(target.id, values.reason);
      setRejecting(false);
      if (ok) {
        formik.resetForm();
        onClose();
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <DocModal open={!!target} onClose={handleClose} title="Decline Request" maxWidth="460px">
      <form onSubmit={formik.handleSubmit}>
        <div className="modal-body p-3 p-sm-4 d-flex flex-column gap-3">
          <p className="text-secondary small mb-0">
            Are you sure you want to decline the request for <strong className="text-dark">{target?.documentType}</strong>?
          </p>
          <div>
            <label className="form-label fw-medium text-secondary small mb-1">Reason <span className="text-muted fw-normal">(optional)</span></label>
            <textarea
              className="form-control rounded-2 shadow-none small"
              placeholder="e.g. Document expired or invalid request..."
              {...formik.getFieldProps("reason")}
              style={{
                fontSize: "0.875rem",
                height: 80,
                resize: "none",
                borderColor: formik.touched.reason && formik.errors.reason
                  ? '#dc3545'
                  : undefined,
              }}
            />
            {formik.touched.reason && formik.errors.reason && (
              <small className="text-danger d-block mt-1" style={{ fontSize: '0.78rem' }}>{formik.errors.reason}</small>
            )}
          </div>
        </div>
        <div className="modal-footer border-top border-light-subtle px-3 px-sm-4 py-3 gap-2 d-grid d-sm-flex">
          <button type="button" className="btn btn-outline-secondary rounded-2 px-3 small" onClick={handleClose} disabled={rejecting}>Cancel</button>
          <button type="submit" className="btn btn-danger rounded-2 px-3 fw-semibold small d-inline-flex align-items-center gap-1.5" disabled={rejecting}>
            {rejecting ? <span className="spinner-border spinner-border-sm" /> : <Ban size={16} />} Decline Request
          </button>
        </div>
      </form>
    </DocModal>
  );
};

export default RejectDocumentModal;
