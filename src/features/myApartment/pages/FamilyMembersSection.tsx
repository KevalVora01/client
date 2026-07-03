import { useState } from "react";
import { useFamilyMembers } from "../hooks/useFamilyMembers";
import ConfirmDialog from "../../../components/ConfirmDialog/ConfirmDialog";
import type { FamilyMember, CreateFamilyMemberPayload, UpdateFamilyMemberPayload } from "../types/familyMember.types";
import FamilyMemberForm from "../components/FamilyMemberForm";
import FamilyMemberCard from "../components/FamilyMemberCard";

interface FamilyMembersSectionProps {
  residentId: number;
  readOnly?: boolean;
}

const FamilyMembersSection = ({ residentId, readOnly = false }: FamilyMembersSectionProps) => {
  const { familyMembers, loading, addFamilyMember, editFamilyMember, removeFamilyMember } = useFamilyMembers(residentId);

  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [deletingMember, setDeletingMember] = useState<FamilyMember | null>(null);
  const [mutationLoading, setMutationLoading] = useState(false);

  const handleAdd = async (payload: CreateFamilyMemberPayload): Promise<boolean> => {
    setMutationLoading(true);
    const success = await addFamilyMember(payload);
    setMutationLoading(false);
    if (success) setShowForm(false);
    return success;
  };

  const handleEdit = async (payload: UpdateFamilyMemberPayload): Promise<boolean> => {
    if (!editingMember) return false;
    setMutationLoading(true);
    const success = await editFamilyMember(editingMember.id, payload);
    setMutationLoading(false);
    if (success) setEditingMember(null);
    return success;
  };

  const handleDelete = async (): Promise<void> => {
    if (!deletingMember) return;
    setMutationLoading(true);
    await removeFamilyMember(deletingMember.id);
    setMutationLoading(false);
    setDeletingMember(null);
  };

  return (
    <>
      <div className="card bg-white border border-light-subtle rounded-3 shadow-sm">
        <div className="card-header bg-white border-bottom border-light-subtle px-4 py-3 d-flex align-items-center justify-content-between">
          <h6 className="fw-bold mb-0" style={{ color: '#1a1f36' }}>
            <i className="bi bi-people me-2" />Family Members
          </h6>
          {!readOnly && !showForm && !editingMember && (
            <button
              className="btn btn-dark btn-sm d-flex align-items-center gap-1"
              onClick={() => setShowForm(true)}
              style={{ fontSize: "0.875rem", borderRadius: "8px", backgroundColor: "#1a1f36", borderColor: "#1a1f36" }}
            >
              <i className="bi bi-plus-lg" /> Add Member
            </button>
          )}
        </div>

        <div className="card-body px-4 py-3">

          {/* ── Add Form ── */}
          {!readOnly && showForm && (
            <div className="mb-3 p-3 rounded-3 border border-light-subtle" style={{ background: '#f8f9fa' }}>
              <p className="fw-semibold mb-3 text-dark" style={{ fontSize: '0.875rem' }}>Add Family Member</p>
              <FamilyMemberForm
                loading={mutationLoading}
                onSubmit={(payload) => handleAdd(payload as CreateFamilyMemberPayload)}
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}

          {/* ── Edit Form ── */}
          {!readOnly && editingMember && (
            <div className="mb-3 p-3 rounded-3 border border-light-subtle" style={{ background: '#f8f9fa' }}>
              <p className="fw-semibold mb-3 text-dark" style={{ fontSize: '0.875rem' }}>Edit Family Member</p>
              <FamilyMemberForm
                member={editingMember}
                loading={mutationLoading}
                onSubmit={(payload) => handleEdit(payload as UpdateFamilyMemberPayload)}
                onCancel={() => setEditingMember(null)}
              />
            </div>
          )}

          {/* ── List ── */}
          {loading ? (
            <div className="d-flex flex-column gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 64, borderRadius: 12 }} />
              ))}
            </div>
          ) : familyMembers.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-people d-block mb-2" style={{ fontSize: '2rem', color: '#d1d5db' }} />
              <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>No family members added yet</p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-2">
              {familyMembers.map((member) => (
                <FamilyMemberCard
                  key={member.id}
                  member={member}
                  onEdit={(m) => { setEditingMember(m); setShowForm(false); }}
                  onDelete={(m) => setDeletingMember(m)}
                  readOnly={readOnly}
                />
              ))}
            </div>
          )}

        </div>
      </div>

      {/* ── Delete Confirm ── */}
      <ConfirmDialog
        show={!!deletingMember}
        title="Remove Family Member"
        message={deletingMember ? `Are you sure you want to remove ${deletingMember.name}?` : ""}
        confirmLabel="Yes, Remove"
        variant="danger"
        loading={mutationLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeletingMember(null)}
      />
    </>
  );
};

export default FamilyMembersSection;
