import { useState } from 'react';
import { forgotPasswordApi } from '../api/authApi';
import { getErrorMessage } from '../../../utils/getErrorMessage';

export const useForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please provide a valid email');
      return;
    }

    try {
      setIsLoading(true);
      await forgotPasswordApi(email);
      setIsSubmitted(true); // show success state
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Something went wrong. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    isLoading,
    isSubmitted,
    error,
    handleSubmit,
  };
};