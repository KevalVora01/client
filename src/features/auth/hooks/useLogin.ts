import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import { showError, showSuccess } from '../../../utils/toast';

const useLogin = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await login({ identifier, password });
      showSuccess('Logged in successfully');
      if (user?.mustResetPassword) {
        navigate('/set-password-required', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string } } };
      showError(
        axiosError?.response?.data?.error || 'Invalid credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    identifier, setIdentifier,
    password, setPassword,
    showPassword, setShowPassword,
    isLoading,
    handleSubmit,
  };
};

export default useLogin;