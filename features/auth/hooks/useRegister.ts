import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { register } from '../api/auth.api';
import type { RegisterDto } from '../types/auth.types';
import { getFirstZodError, registerSchema } from '../../../shared/utils/validation.utils';
import { getApiErrorMessage } from '../../../shared/utils/api.error.utils';

interface UseRegisterResult {
  loading: boolean;
  error: string;
  submit: (data: RegisterDto) => Promise<{ phone: string } | null>;
}

export function useRegister(): UseRegisterResult {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (data: RegisterDto): Promise<{ phone: string } | null> => {

    // ── LOG 1 : données reçues ─────────────────────────────────────────
    console.log('=== REGISTER SUBMIT ===');
    console.log('firstName:', JSON.stringify(data.firstName));
    console.log('lastName:', JSON.stringify(data.lastName));
    console.log('email:', JSON.stringify(data.email));
    console.log('phone:', JSON.stringify(data.phone));
    console.log('password length:', data.password?.length ?? 0);
    console.log('roles:', JSON.stringify(data.roles));

    // ── LOG 2 : validation ────────────────────────────────────────────
    const validation = registerSchema.safeParse(data);
    console.log('validation.success:', validation.success);
    if (!validation.success) {
      console.log('validation errors:');
      validation.error.issues.forEach((issue, i) => {
        console.log(`  [${i}] field=${issue.path.join('.')} message=${issue.message}`);
      });
      const msg = getFirstZodError(validation) ?? t('common.errors.validation_error', 'Validation error');
      setError(msg);
      return null;
    }

    console.log('✅ Validation OK — calling API...');

    // ── LOG 3 : requête ───────────────────────────────────────────────
    console.log('payload:', JSON.stringify({ ...data, password: '***' }));

    setError('');
    setLoading(true);

    try {
      const response = await register(data);
      console.log('✅ Success:', JSON.stringify(response));
      return { phone: data.phone };
    } catch (err: any) {
      console.log('❌ Error:');
      console.log('  message:', err?.message);
      console.log('  code:', err?.code);
      console.log('  status:', err?.response?.status);
      console.log('  data:', JSON.stringify(err?.response?.data));
      setError(getApiErrorMessage(err, t));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, submit };
}