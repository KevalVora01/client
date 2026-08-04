import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { forgotPasswordApi } from '../api/authApi';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { showError } from '../../../utils/toast';

const validationSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email('Please provide a valid email')
    .required('Email is required'),
});

export const useForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        await forgotPasswordApi(values.email.trim());
        setIsSubmitted(true);
      } catch (err: unknown) {
        showError(getErrorMessage(err, 'Something went wrong. Please try again.'));
      } finally {
        setIsLoading(false);
      }
    },
  });

  return {
    formik,
    isLoading,
    isSubmitted,
  };
};
