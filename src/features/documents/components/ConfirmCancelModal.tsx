import { Trash2 } from "lucide-react";
import { DocModal } from "./DocModal";

interface Props {
  targetId: number | null;
  onClose: () => void;
  onConfirm: (id: number) => Promise<boolean>;
}

const ConfirmCancelModal = ({ targetId, onClose, onConfirm }: Props) => {
  if (!targetId) return null;

  return (
    <DocModal open={!!targetId} onClose={onClose} title="Cancel Request" maxWidth="400px">
      <div className="modal-body p-3 p-sm-4">
        <p className="text-secondary small mb-0">Are you sure you want to cancel this document request? This action cannot be undone.</p>
      </div>
      <div className="modal-footer border-top border-light-subtle px-3 px-sm-4 py-3 gap-2 d-grid d-sm-flex">
        <button type="button" className="btn btn-outline-secondary rounded-2 px-3 small" onClick={onClose}>Keep Request</button>
        <button type="button" className="btn btn-outline-danger rounded-2 px-3 fw-semibold small d-inline-flex align-items-center gap-1.5"
          onClick={async () => { const ok = await onConfirm(targetId); if (ok) onClose(); }}>
          <Trash2 size={15} /> Yes, Cancel
        </button>
      </div>
    </DocModal>
  );
};

export default ConfirmCancelModal;
