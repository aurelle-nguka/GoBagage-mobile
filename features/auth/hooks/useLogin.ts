import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { login, getMyProfile } from '../api/auth.api';
import type { LoginDto } from '../types/auth.types';
import { useAuthStore } from '../../../store/auth.store';
import { getFirstZodError, loginSchema } from '../../../shared/utils/validation.utils';
import { tokenService } from '../../../shared/services/token.service';
import type { User } from '../../../types/user.types';
import { getApiErrorMessage } from '../../../shared/utils/api.error.utils';

export type LoginResult = 'ADMIN' | 'USER' | false;

interface UseLoginResult {
  loading: boolean;
  error: string;
  submit: (data: LoginDto) => Promise<LoginResult>;
}

export function useLogin(): UseLoginResult {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const { setUser }           = useAuthStore();

  const submit = async (data: LoginDto): Promise<LoginResult> => {
    const validation = loginSchema.safeParse(data);
    if (!validation.success) {
      setError(getFirstZodError(validation) ?? t('common.errors.validation_error', 'Validation error'));
      return false;
    }

    setError('');
    setLoading(true);

    try {
      const jwtResponse = await login(data);
      await tokenService.setTokens(jwtResponse.accessToken, jwtResponse.refreshToken);
 
      const userDto = await getMyProfile();
      const user: User = {
        id:               userDto.id,
        firstName:        userDto.firstName,
        lastName:         userDto.lastName,
        email:            userDto.email,
        phone:            userDto.phone,
        roles:            userDto.roles,
        kycStatus:        userDto.kycStatus,
        kycRejectionReason:  userDto.kycRejectionReason ?? undefined,
        profilePhoto:     userDto.profilePhotoUrl ?? undefined,
        bio:              userDto.bio ?? undefined,
        averageRating:    userDto.averageRating ?? 0,
        totalDeliveries:  userDto.totalDeliveries,
        subscriptionType: userDto.subscriptionPlan,
        createdAt:        userDto.createdAt,
      };

      setUser(user);

      return user.roles.includes('ADMIN') ? 'ADMIN' : 'USER';

} catch (err: any) {
  setError(getApiErrorMessage(err, t));
  return false;
} finally {
      setLoading(false);
    }
  };

  return { loading, error, submit };
}