import { useState } from "react";
import Select from "../../../components/Select/Select";
import ConfirmDialog from "../../../components/ConfirmDialog/ConfirmDialog";
import { DocModal } from "./DocModal";

const TENANT_DOC_TYPES = [
  "Rent / Lease Agreement",
  "NOC for Address Proof (Passport/Aadhaar)",
  "Police Verification Certificate Form",
  "Utility Bill Copy (Electricity/Water)",
  "Rent Receipt (HRA Claim)",
  "NOC for Wi-Fi / Gas / DTH Connection",
  "Maintenance / Sinking Fund Receipt",
  "Property Tax Paid Certificate",
  "Water / Electricity Meter Reading Statement",
  "Society ID Card / Gate Pass Letter",
  "Other",
];

const OWNER_DOC_TYPES = [
  "No Due Certificate / Clearance Certificate",
  "Society Maintenance Ledger / Statement",
  "NOC for Property Sale / Rental",
  "Building Plan / Layout Approval Copy",
  "Membership Transfer / Share Certificate",
  "AGM / Committee Meeting Minutes",
  "Fire Safety Compliance Certificate",
  "Parking Slot Allocation / Transfer Letter",
  "Property Tax Receipt (Society-Level)",
  "Common Area Maintenance Certificate",
  "Other",
];

interface Props {
  open: boolean;
  onClose: () => void;
  isOwner: boolean;
  onSubmit: (payload: { documentType: string; customDocumentName?: string; note?: string }) => Promise<boolean>;
}

const RequestDocumentModal = ({ open, onClose, isOwner, onSubmit }: Props) => {
  const docTypes = isOwner ? OWNER_DOC_TYPES : TENANT_DOC_TYPES;
  const [selectedDocType, setSelectedDocType] = useState(docTypes[0]);
  const [customDocName, setCustomDocName] = useState("");
  const [requestNote, setRequestNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Reset document list when the modal type changes
  const [prevIsOwner, setPrevIsOwner] = useState(isOwner);
  if (isOwner !== prevIsOwner) {
    setPrevIsOwner(isOwner);
    setSelectedDocType(docTypes[0]);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDocType === "Other" && !customDocName.trim()) return;

    setSubmitting(true);
    const ok = await onSubmit({
      documentType: selectedDocType === "Other" ? customDocName : selectedDocType,
      customDocumentName: selectedDocType === "Other" ? customDocName : undefined,
      note: requestNote || undefined,
    });
    setSubmitting(false);
    if (ok) {
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setSelectedDocType(docTypes[0]);
    setCustomDocName("");
    setRequestNote("");
  };

  const handleCancel = () => {
    const hasChanges = selectedDocType !== docTypes[0] || customDocName || requestNote;
    if (hasChanges) {
      setShowCancelConfirm(true);
    } else {
      resetForm();
      onClose();
    }
  };

  const confirmCancel = () => {
    setShowCancelConfirm(false);
    resetForm();
    onClose();
  };

  return (
    <>
      <DocModal open={open} onClose={handleCancel} title={`Request Document (${isOwner ? "Admin" : "Owner"})`} maxWidth="520px">
        <form onSubmit={handleSubmit}>
          <div className="modal-body p-4 d-flex flex-column gap-3">
            <Select
              label="Document Type"
              required
              options={docTypes}
              value={selectedDocType}
              onChange={(e) => setSelectedDocType(e.target.value)}
            />
            {selectedDocType === "Other" && (
              <div>
                <label className="form-label fw-medium text-secondary small mb-1">Custom Document Name <span className="text-danger">*</span></label>
                <input type="text" className="form-control rounded-2 shadow-none small"
                  placeholder="e.g. Electricity Meter Registration Copy" value={customDocName}
                  onChange={(e) => setCustomDocName(e.target.value)} style={{ fontSize: "0.875rem" }} />
              </div>
            )}
            <div>
              <label className="form-label fw-medium text-secondary small mb-1">Note / Reason <span className="text-muted fw-normal">(optional)</span></label>
              <textarea rows={3} className="form-control rounded-2 shadow-none small"
                placeholder={isOwner ? "e.g. Required for property registration process..." : "e.g. Needed for passport address update application..."}
                value={requestNote}
                onChange={(e) => setRequestNote(e.target.value)}
                style={{ fontSize: "0.875rem", height: "80px", resize: "none" }} />
            </div>
          </div>
          <div className="modal-footer border-top border-light-subtle px-4 py-3 gap-2">
            <button type="button" className="btn btn-outline-secondary rounded-2 px-3 small" onClick={handleCancel} disabled={submitting}>Cancel</button>
            <button type="submit" className="btn btn-dark rounded-2 px-3 fw-semibold small d-inline-flex align-items-center justify-content-center gap-1.5"
              disabled={submitting} style={{ minWidth: "130px" }}>
              {submitting ? <span className="spinner-border spinner-border-sm" /> : "Submit Request"}
            </button>
          </div>
        </form>
      </DocModal>

      <ConfirmDialog
        show={showCancelConfirm}
        title="Discard Changes?"
        message="You have unsaved changes. Are you sure you want to discard them?"
        confirmLabel="Discard"
        cancelLabel="Keep Editing"
        variant="warning"
        onConfirm={confirmCancel}
        onCancel={() => setShowCancelConfirm(false)}
      />
    </>
  );
};

export default RequestDocumentModal;
