import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getActiveCorridors } from '../api/corridors.api';
import type { CorridorResponse } from '../types/corridor.types';

interface UseCorridorsResult {
  corridors: CorridorResponse[];
  loading: boolean;
  error: string;
  reload: () => void;
}

export function useCorridors(): UseCorridorsResult {
  const { t } = useTranslation();
  const [corridors, setCorridors] = useState<CorridorResponse[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [tick, setTick]           = useState(0);

  useEffect(() => {
    setLoading(true);
    setError('');

    getActiveCorridors()
      .then((data) => setCorridors(data))
      .catch((err) => {
        setError(err?.response?.data?.message ?? t('corridor.errors.load_failed', 'Failed to load corridors.'));
      })
      .finally(() => setLoading(false));
  }, [tick]);

  return {
    corridors,
    loading,
    error,
    reload: () => setTick((t) => t + 1),
  };
}
