import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import { showError } from '../../../utils/toast';
import type { UserRole } from '../types/auth.types';

const useLogin = () => {
  const [role, setRole] = useState<UserRole>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login({ email, password, role });
      navigate('/', { replace: true });
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string } } };
      showError(
        axiosError?.response?.data?.error || 'Invalid email or password.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    role, setRole,
    email, setEmail,
    password, setPassword,
    showPassword, setShowPassword,
    isLoading,
    handleSubmit,
  };
};

export default useLogin;