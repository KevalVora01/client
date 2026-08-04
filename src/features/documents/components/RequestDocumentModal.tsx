import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
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
  const [submitting, setSubmitting] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const validationSchema = Yup.object().shape({
    selectedDocType: Yup.string().required("Document type is required"),
    customDocName: Yup.string().when("selectedDocType", {
      is: "Other",
      then: (schema) => schema.trim().max(150, "Must be at most 150 characters").required("Document name is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    requestNote: Yup.string().trim().max(500, "Must be at most 500 characters").optional(),
  });

  const formik = useFormik({
    initialValues: {
      selectedDocType: docTypes[0],
      customDocName: "",
      requestNote: "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setSubmitting(true);
      const ok = await onSubmit({
        documentType: values.selectedDocType === "Other" ? values.customDocName : values.selectedDocType,
        customDocumentName: values.selectedDocType === "Other" ? values.customDocName : undefined,
        note: values.requestNote || undefined,
      });
      setSubmitting(false);
      if (ok) {
        formik.resetForm();
        onClose();
      }
    },
  });

  // Reset document list when the modal type changes
  const [prevIsOwner, setPrevIsOwner] = useState(isOwner);
  if (isOwner !== prevIsOwner) {
    setPrevIsOwner(isOwner);
    formik.setFieldValue("selectedDocType", docTypes[0]);
  }

  const handleCancel = () => {
    const hasChanges =
      formik.values.selectedDocType !== docTypes[0] ||
      formik.values.customDocName ||
      formik.values.requestNote;
    if (hasChanges) {
      setShowCancelConfirm(true);
    } else {
      formik.resetForm();
      onClose();
    }
  };

  const confirmCancel = () => {
    setShowCancelConfirm(false);
    formik.resetForm();
    onClose();
  };

  const hasError = (field: keyof typeof formik.values) =>
    formik.touched[field] && formik.errors[field];

  const getBorderColor = (field: keyof typeof formik.values) =>
    hasError(field) ? "#dc3545" : undefined;

  return (
    <>
      <DocModal open={open} onClose={handleCancel} title={`Request Document (${isOwner ? "Admin" : "Owner"})`} maxWidth="520px">
        <form onSubmit={formik.handleSubmit}>
          <div className="modal-body p-3 p-sm-4 d-flex flex-column gap-3">
            <Select
              label="Document Type"
              required
              options={docTypes}
              value={formik.values.selectedDocType}
              onChange={(e) => formik.setFieldValue("selectedDocType", e.target.value)}
            />
            {hasError("selectedDocType") && (
              <small className="text-danger d-block" style={{ fontSize: "0.78rem", marginTop: "-0.5rem" }}>
                {formik.errors.selectedDocType}
              </small>
            )}
            {formik.values.selectedDocType === "Other" && (
              <div>
                <label className="form-label fw-medium text-secondary small mb-1">Custom Document Name <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control rounded-2 shadow-none small"
                  placeholder="e.g. Electricity Meter Registration Copy"
                  value={formik.values.customDocName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="customDocName"
                  style={{ fontSize: "0.875rem", borderColor: getBorderColor("customDocName") }}
                />
                {hasError("customDocName") && (
                  <small className="text-danger d-block mt-1" style={{ fontSize: "0.78rem" }}>
                    {formik.errors.customDocName}
                  </small>
                )}
              </div>
            )}
            <div>
              <label className="form-label fw-medium text-secondary small mb-1">Note / Reason <span className="text-muted fw-normal">(optional)</span></label>
              <textarea
                rows={3}
                className="form-control rounded-2 shadow-none small"
                placeholder={isOwner ? "e.g. Required for property registration process..." : "e.g. Needed for passport address update application..."}
                value={formik.values.requestNote}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="requestNote"
                style={{ fontSize: "0.875rem", height: "80px", resize: "none", borderColor: getBorderColor("requestNote") }}
              />
              {hasError("requestNote") && (
                <small className="text-danger d-block mt-1" style={{ fontSize: "0.78rem" }}>
                  {formik.errors.requestNote}
                </small>
              )}
            </div>
          </div>
          <div className="modal-footer border-top border-light-subtle px-3 px-sm-4 py-3 gap-2 d-grid d-sm-flex">
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
