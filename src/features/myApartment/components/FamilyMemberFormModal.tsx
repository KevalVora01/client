import { useScrollLock } from "../../../hooks/useScrollLock";
import FamilyMemberForm from "./FamilyMemberForm";
import type { FamilyMember, CreateFamilyMemberPayload, UpdateFamilyMemberPayload } from "../types/familyMember.types";

interface FamilyMemberFormModalProps {
  show: boolean;
  mode: "add" | "edit";
  member?: FamilyMember | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateFamilyMemberPayload | UpdateFamilyMemberPayload) => Promise<boolean>;
}

const FamilyMemberFormModal = ({ show, mode, member, loading, onClose, onSubmit }: FamilyMemberFormModalProps) => {
  const isEdit = mode === "edit";
  useScrollLock(show);

  if (!show) return null;

  return (
    <div
      className="modal d-block bg-dark bg-opacity-50"
      style={{ backdropFilter: "blur(4px)" }}
    >
      <div
        className="modal-dialog modal-lg modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-0 rounded-3 shadow-lg bg-white">

          {/* ── Header ── */}
          <div className="modal-header border-bottom border-light-subtle px-4 pt-4 pb-3 align-items-start position-relative">
            <div>
              <h5 className="modal-title fw-bold fs-6" style={{ color: "#1a1f36" }}>
                {isEdit ? `Edit Family Member — ${member?.name}` : "Add Family Member"}
              </h5>
              <p className="text-muted mb-0" style={{ fontSize: "0.8rem" }}>
                {isEdit ? "Update the family member's details below." : "Fill in the details to add a family member."}
              </p>
            </div>
            <button
              className="btn btn-outline-light border border-light-subtle text-secondary rounded-2 p-0 d-flex align-items-center justify-content-center position-absolute"
              onClick={onClose}
              disabled={loading}
              aria-label="Close"
              style={{ width: "30px", height: "30px", top: "1.2rem", right: "1.2rem" }}
            >
              <i className="bi bi-x fs-5" />
            </button>
          </div>

          {/* ── Body ── */}
          <div className="modal-body p-4">
            <FamilyMemberForm
              member={isEdit ? member : null}
              loading={loading}
              onSubmit={onSubmit}
              onCancel={onClose}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default FamilyMemberFormModal;
