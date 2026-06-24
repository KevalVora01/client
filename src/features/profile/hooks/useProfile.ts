import { useState } from "react";
import { profileApi } from "../api/profileApi";
import type { UpdateProfilePayload, ChangePasswordPayload } from "../types/profile.types";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { showSuccess, showError } from "../../../utils/toast";

export const useProfile = () => {
  const [updateLoading, setUpdateLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const updateProfile = async (payload: UpdateProfilePayload): Promise<boolean> => {
    try {
      setUpdateLoading(true);
      await profileApi.updateProfile(payload);
      showSuccess("Profile updated successfully");
      return true;
    } catch (err: unknown) {
      showError(getErrorMessage(err, "Failed to update profile"));
      return false;
    } finally {
      setUpdateLoading(false);
    }
  };

  const changePassword = async (payload: ChangePasswordPayload): Promise<boolean> => {
    try {
      setPasswordLoading(true);
      await profileApi.changePassword(payload);
      showSuccess("Password changed successfully");
      return true;
    } catch (err: unknown) {
      showError(getErrorMessage(err, "Failed to change password"));
      return false;
    } finally {
      setPasswordLoading(false);
    }
  };

  return {
    updateProfile,
    updateLoading,
    changePassword,
    passwordLoading,
  };
};