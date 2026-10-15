import axios from 'axios';
import type { TFunction } from 'i18next';
import { ApiErrorResponse } from '../../features/auth/types/auth.types';

export function getApiErrorMessage(error: unknown, t: TFunction): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (data?.message && typeof data.message === 'string') {
      return data.message;
    }

    if (data?.details && Array.isArray(data.details) && data.details.length > 0) {
      return data.details.map((d: any) => d.message).join('\n');
    }

    switch (error.response?.status) {
      case 400: return t('common.errors.invalid_request', 'Invalid request. Please check your information.');
      case 401: return t('common.errors.unauthorized', 'Incorrect email or password.');
      case 403: return t('common.errors.forbidden', 'Access denied.');
      case 404: return t('common.errors.not_found', 'Resource not found.');
      case 409: return t('common.errors.conflict', 'Conflict error.');
      case 500: return t('common.errors.server_error', 'Server error. Please try again later.');
      case 501: return t('common.errors.service_unavailable', 'Service unavailable. Please try again later.');
      case 502: return t('common.errors.server_error', 'Server error. Please try again later.');
      case 503: return t('common.errors.service_unavailable', 'Service unavailable. Please try again later.');
      case 504: return t('common.errors.gateway_timeout', 'Gateway timeout. Please try again later.');
    }

    if (!error.response) {
      return t('common.network_error', 'Cannot reach the server. Please check your internet connection.');
    }
  }

  if (error instanceof Error && error.message === 'No refresh token') {
    return t('common.errors.session_expired', 'Session expired. Please log in again.');
  }

  if (error instanceof Error) {
    return error.message;
  }

  return t('common.error', 'An unexpected error occurred. Please try again.');
}
