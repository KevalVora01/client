export type FamilyRelation = "Spouse" | "Child" | "Parent" | "Sibling" | "Other";

export interface FamilyMember {
  id: number;
  residentId: number;
  name: string;
  relation: FamilyRelation;
  age: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFamilyMemberPayload {
  name: string;
  relation: FamilyRelation;
  age?: number | null;
}

export interface UpdateFamilyMemberPayload {
  name?: string;
  relation?: FamilyRelation;
  age?: number | null;
}