import { useState } from 'react';
import { forgotPasswordApi } from '../api/authApi';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { showError } from '../../../utils/toast';

export const useForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) { showError('Email is required'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { showError('Please provide a valid email'); return; }

    try {
      setIsLoading(true);
      await forgotPasswordApi(email);
      setIsSubmitted(true);
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Something went wrong. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    isLoading,
    isSubmitted,
    handleSubmit,
  };
};