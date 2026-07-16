import { useState, useEffect, useCallback } from 'react';
import {
  getActiveCorridors,
  createCorridor,
  updateCorridor,
  toggleCorridorStatus,
} from '../api/corridors.api';
import type { CorridorResponse, CorridorRequest } from '../types/corridor.types';
import { getApiErrorMessage } from '../../../shared/utils/api.error.utils';

interface UseAdminCorridorsResult {
  corridors: CorridorResponse[];
  loading: boolean;
  refreshing: boolean;
  error: string;
  refresh: () => void;
  create: (data: CorridorRequest) => Promise<boolean>;
  update: (id: number, data: CorridorRequest) => Promise<boolean>;
  toggle: (id: number, isActive: boolean) => Promise<boolean>;
}

export function useAdminCorridors(): UseAdminCorridorsResult {
  const [corridors, setCorridors] = useState<CorridorResponse[]>([]);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError]         = useState('');

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError('');

    try {
      const data = await getActiveCorridors();
      setCorridors(data);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, []);

  const create = async (data: CorridorRequest): Promise<boolean> => {
    try {
      const newCorridor = await createCorridor(data);
      setCorridors((prev) => [newCorridor, ...prev]);
      return true;
    } catch (err) {
      setError(getApiErrorMessage(err));
      return false;
    }
  };

  const update = async (id: number, data: CorridorRequest): Promise<boolean> => {
    try {
      const updated = await updateCorridor(id, data);
      setCorridors((prev) => prev.map((c) => (c.id === id ? updated : c)));
      return true;
    } catch (err) {
      setError(getApiErrorMessage(err));
      return false;
    }
  };

  const toggle = async (id: number, isActive: boolean): Promise<boolean> => {
    try {
      const updated = await toggleCorridorStatus(id, { isActive });
      setCorridors((prev) => prev.map((c) => (c.id === id ? updated : c)));
      return true;
    } catch (err) {
      setError(getApiErrorMessage(err));
      return false;
    }
  };

  return {
    corridors, loading, refreshing, error,
    refresh: () => load(true),
    create, update, toggle,
  };
}
