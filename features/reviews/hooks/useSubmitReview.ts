import { useState } from 'react';
import { submitReview, type CreateReviewRequest } from '../api/reviews.api';
import { getApiErrorMessage } from '../../../shared/utils/api.error.utils';

interface UseSubmitReviewResult {
  loading: boolean;
  error: string;
  submit: (data: CreateReviewRequest) => Promise<boolean>;
}

export function useSubmitReview(): UseSubmitReviewResult {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const submit = async (data: CreateReviewRequest): Promise<boolean> => {
    setLoading(true);
    setError('');
    try {
      console.log('=== SUBMIT REVIEW ===', JSON.stringify(data));
      await submitReview(data);
      console.log('Review submitted');
      return true;
    } catch (err) {
      console.log('Review error:', err);
      setError(getApiErrorMessage(err));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, submit };
}