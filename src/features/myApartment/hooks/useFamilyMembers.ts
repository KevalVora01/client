import { useState, useEffect } from "react";
import { familyApi } from "../api/familyApi";
import type { FamilyMember, CreateFamilyMemberPayload, UpdateFamilyMemberPayload } from "../types/familyMember.types";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { showError, showSuccess } from "../../../utils/toast";

export const useFamilyMembers = (residentId: number) => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;

    const fetch = async () => {
      setLoading(true);
      try {
        const data = await familyApi.getFamilyMembers(residentId);
        if (!cancelled) setFamilyMembers(data);
      } catch (err: unknown) {
        if (!cancelled) showError(getErrorMessage(err, "Failed to fetch family members"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();
    return () => { cancelled = true; };
  }, [residentId]);

  const addFamilyMember = async (payload: CreateFamilyMemberPayload): Promise<boolean> => {
    try {
      const newMember = await familyApi.createFamilyMember(residentId, payload);
      setFamilyMembers((prev) => [...prev, newMember]);
      showSuccess("Family member added successfully");
      return true;
    } catch (err: unknown) {
      showError(getErrorMessage(err, "Failed to add family member"));
      return false;
    }
  };

  const editFamilyMember = async (id: number, payload: UpdateFamilyMemberPayload): Promise<boolean> => {
    try {
      const updated = await familyApi.updateFamilyMember(residentId, id, payload);
      setFamilyMembers((prev) => prev.map((fm) => fm.id === id ? updated : fm));
      showSuccess("Family member updated successfully");
      return true;
    } catch (err: unknown) {
      showError(getErrorMessage(err, "Failed to update family member"));
      return false;
    }
  };

  const removeFamilyMember = async (id: number): Promise<boolean> => {
    try {
      await familyApi.deleteFamilyMember(residentId, id);
      setFamilyMembers((prev) => prev.filter((fm) => fm.id !== id));
      showSuccess("Family member removed successfully");
      return true;
    } catch (err: unknown) {
      showError(getErrorMessage(err, "Failed to remove family member"));
      return false;
    }
  };

  return {
    familyMembers,
    loading,
    addFamilyMember,
    editFamilyMember,
    removeFamilyMember,
  };
};