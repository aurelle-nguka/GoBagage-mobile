/**
 * Go Bagage — Utilitaire de gestion des erreurs API
 * Extrait le message d'erreur lisible depuis la réponse du backend.
 */

import axios from 'axios';
import { ApiErrorResponse } from '../../features/auth/types/auth.types';

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse | undefined;

    if (data?.details && data.details.length > 0) {
      return data.details.map((d) => d.message).join('\n');
    }

    if (data?.message) {
      return data.message;
    }

    switch (error.response?.status) {
      case 400: return 'Invalid request. Please check your information.';
      case 401: return 'Incorrect email or password.';
      case 403: return 'Access denied.';
      case 409: return 'This email or phone number is already in use.';
      case 429: return 'Too many requests. Please wait before trying again.';
      case 500: return 'Server error. Please try again later.';
    }

    if (error.code === 'ECONNABORTED' || !error.response) {
      return 'Unable to connect to the server. Check your internet connection.';
    }
  }

  return 'An unexpected error occurred. Please try again.';
}
