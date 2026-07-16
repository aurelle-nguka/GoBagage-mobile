import axios from 'axios';
import { ApiErrorResponse } from '../../features/auth/types/auth.types';

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (data?.message && typeof data.message === 'string') {
      return data.message;
    }

    if (data?.details && Array.isArray(data.details) && data.details.length > 0) {
      return data.details.map((d: any) => d.message).join('\n');
    }

    switch (error.response?.status) {
      case 400: return 'Invalid request. Please check your information.';
      case 401: return 'Incorrect email or password.';
      case 403: return 'Access denied.';
      case 404: return 'Resource not found.';
      case 409: return 'Conflict error.';
      case 500: return 'Server error. Please try again later.';
      case 501: return 'Service unavailable. Please try again later.';
      case 502: return 'Server error. Please try again later.';
      case 503: return 'Service unavailable. Please try again later.';
      case 504: return 'Gateway timeout. Please try again later.';
    }

    if (!error.response) {
      return 'Cannot reach the server. Please check your internet connection.';
    }
  }

  if (error instanceof Error && error.message === 'No refresh token') {
    return 'Session expired. Please log in again.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}
