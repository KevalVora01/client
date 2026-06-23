import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resetPasswordApi } from '../api/authApi';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { showSuccess } from '../../../utils/toast';

export const useResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token') ?? '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = (): boolean => {
    if (!token) {
      setError('Invalid or missing reset token. Please request a new reset link.');
      return false;
    }
    if (!newPassword) {
      setError('Password is required');
      return false;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setError('Password must contain at least one uppercase letter');
      return false;
    }
    if (!/[0-9]/.test(newPassword)) {
      setError('Password must contain at least one number');
      return false;
    }
    if (!/[\W_]/.test(newPassword)) {
      setError('Password must contain at least one special character');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validate()) return;

    try {
      setIsLoading(true);
      await resetPasswordApi(token, newPassword);
      showSuccess('Password reset successfully. Please log in.');
      navigate('/login');
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to reset password. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    token,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    isLoading,
    error,
    handleSubmit,
  };
};