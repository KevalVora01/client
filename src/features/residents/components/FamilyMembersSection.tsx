import { useFamilyMembers } from "../../myApartment/hooks/useFamilyMembers";
import type { FamilyRelation } from "../../myApartment/types/familyMember.types";


interface FamilyMembersSectionProps {
  residentId: number;
}

const relationColors: Record<FamilyRelation, { bg: string; color: string }> = {
  Spouse: { bg: "#fce4ec", color: "#c62828" },
  Child: { bg: "#e8f5e9", color: "#2e7d32" },
  Parent: { bg: "#e3f2fd", color: "#1565c0" },
  Sibling: { bg: "#f3e5f5", color: "#6a1b9a" },
  Other: { bg: "#f3f4f6", color: "#374151" },
};

const getInitial = (name: string) => name.charAt(0).toUpperCase();

const FamilyMembersSection = ({ residentId }: FamilyMembersSectionProps) => {
  const { familyMembers, loading } = useFamilyMembers(residentId);

  return (
    <div className="section-card">
      <div className="section-card__header d-flex align-items-center justify-content-between">
        <h6 className="section-card__title">Family Members</h6>
        {!loading && (
          <span className="text-muted" style={{ fontSize: '0.775rem' }}>
            {familyMembers.length} {familyMembers.length === 1 ? 'member' : 'members'}
          </span>
        )}
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div className="px-4 py-3 d-flex flex-column gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="d-flex align-items-center gap-3">
              <div className="skeleton rounded-circle" style={{ width: 38, height: 38, flexShrink: 0 }} />
              <div className="d-flex flex-column gap-1 flex-grow-1">
                <div className="skeleton" style={{ width: 120, height: 12, borderRadius: 6 }} />
                <div className="skeleton" style={{ width: 80, height: 12, borderRadius: 6 }} />
              </div>
            </div>
          ))}
        </div>
      )}



      {/* ── Empty ── */}
      {!loading && familyMembers.length === 0 && (
        <div className="section-card__body--empty">
          <i className="bi bi-people placeholder-icon" />
          <p className="placeholder-text">No family members added yet</p>
        </div>
      )}

      {/* ── List ── */}
      {!loading && familyMembers.length > 0 && (
        <div>
          {familyMembers.map((member, index) => {
            const { bg, color } = relationColors[member.relation] ?? relationColors.Other;
            return (
              <div
                key={member.id}
                className="d-flex align-items-center justify-content-between px-4 py-3 gap-3"
                style={{
                  borderBottom: index < familyMembers.length - 1 ? '1px solid #f3f4f6' : 'none',
                }}
              >
                {/* Left — avatar + name + relation */}
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-circle fw-bold d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: 38, height: 38, fontSize: '0.875rem', background: bg, color }}
                  >
                    {getInitial(member.name)}
                  </div>
                  <div>
                    <p className="fw-semibold mb-0" style={{ fontSize: '0.875rem', color: '#111827' }}>
                      {member.name}
                    </p>
                    <p className="mb-0" style={{ fontSize: '0.775rem', color: '#6b7280' }}>
                      {member.relation}
                    </p>
                  </div>
                </div>

                {/* Right — age */}
                {member.age !== null && member.age !== undefined && (
                  <div className="text-end flex-shrink-0">
                    <p className="mb-0" style={{ fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#9ca3af' }}>
                      Age
                    </p>
                    <p className="mb-0 fw-semibold" style={{ fontSize: '0.875rem', color: '#111827' }}>
                      {member.age}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FamilyMembersSection;