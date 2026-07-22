import { useState } from "react";
import { Ban } from "lucide-react";
import { DocModal } from "./DocModal";
import type { DocumentRequestItem } from "../types/documentRequest.types";

interface Props {
  target: DocumentRequestItem | null;
  onClose: () => void;
  onSubmit: (requestId: number, reason?: string) => Promise<boolean>;
}

const RejectDocumentModal = ({ target, onClose, onSubmit }: Props) => {
  const [reason, setReason] = useState("");
  const [rejecting, setRejecting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target) return;
    setRejecting(true);
    const ok = await onSubmit(target.id, reason);
    setRejecting(false);
    if (ok) {
      setReason("");
      onClose();
    }
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <DocModal open={!!target} onClose={handleClose} title="Decline Request" maxWidth="460px">
      <form onSubmit={handleSubmit}>
        <div className="modal-body p-4 d-flex flex-column gap-3">
          <p className="text-secondary small mb-0">
            Are you sure you want to decline the request for <strong className="text-dark">{target?.documentType}</strong>?
          </p>
          <div>
            <label className="form-label fw-medium text-secondary small mb-1">Reason <span className="text-muted fw-normal">(optional)</span></label>
            <textarea className="form-control rounded-2 shadow-none small"
              placeholder="e.g. Document expired or invalid request..." value={reason}
              onChange={(e) => setReason(e.target.value)} style={{ fontSize: "0.875rem", height: 80, resize: "none" }} />
          </div>
        </div>
        <div className="modal-footer border-top border-light-subtle px-4 py-3 gap-2">
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
