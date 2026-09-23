/**
 * Go Bagage — useResetPassword
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { resetPassword } from '../api/auth.api';
import { resetPasswordSchema, getFirstZodError } from '../../../shared/utils/validation.utils';
import { getApiErrorMessage } from '../../../shared/utils/api.error.utils';

interface UseResetPasswordResult {
  loading: boolean;
  error: string;
  submit: (token: string, newPassword: string, confirmPassword: string) => Promise<boolean>;
}

export function useResetPassword(): UseResetPasswordResult {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (
    token: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<boolean> => {
    const validation = resetPasswordSchema.safeParse({
      token: token.trim(),
      newPassword,
      confirmPassword,
    });

    if (!validation.success) {
      setError(
        getFirstZodError(validation) ??
          t('auth.errors.invalid_form', 'Please check the form for errors.'),
      );
      return false;
    }

    setError('');
    setLoading(true);

    try {
      await resetPassword({
        token: token.trim(),
        newPassword,
      });
      return true;
    } catch (err) {
      setError(getApiErrorMessage(err, t));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, submit };
}
