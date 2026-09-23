/**
 * Go Bagage — useKycQueue
 * Gère la file KYC : chargement, filtrage, pagination, refresh.
 */

import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { getKycQueue, reviewKyc } from '../api/admin.api';
import type { KycQueueItem, KycQueueParams, KycDecision } from '../types/admin.types';
import type { KycStatus } from '../../../types/user.types';

interface UseKycQueueResult {
  items: KycQueueItem[];
  loading: boolean;
  refreshing: boolean;
  error: string;
  totalElements: number;
  totalPages: number;
  currentPage: number;
  activeFilter: KycStatus | 'ALL';
  setFilter: (status: KycStatus | 'ALL') => void;
  loadPage: (page: number) => void;
  refresh: () => void;
  approve: (kycId: string) => Promise<boolean>;
  reject: (kycId: string, note: string) => Promise<boolean>;
}

export function useKycQueue(): UseKycQueueResult {
  const { t } = useTranslation();
  const [items, setItems]               = useState<KycQueueItem[]>([]);
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);
  const [error, setError]               = useState('');
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages]     = useState(0);
  const [currentPage, setCurrentPage]   = useState(0);
  const [activeFilter, setActiveFilter] = useState<KycStatus | 'ALL'>('PENDING');

const load = useCallback(async (page: number, filter: KycStatus | 'ALL', isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError('');

    try {
      const params: KycQueueParams = {
        page,
        size: 20,
        ...(filter !== 'ALL' ? { status: filter } : {}),
      };
      
      // ── LOG ──────────────────────────────────────────
      console.log('=== KYC QUEUE LOAD ===');
      console.log('params:', JSON.stringify(params));
      
      const data = await getKycQueue(params);
      console.log('premier item:', JSON.stringify(data.content[0]));
      
      console.log('response:', JSON.stringify(data));
      console.log('items count:', data.content?.length);
      // ─────────────────────────────────────────────────
      
      setItems(data.content);
      setTotalElements(data.totalElements);
      setTotalPages(data.totalPages);
      setCurrentPage(data.page);
    } catch (err: any) {
      console.log('❌ KYC Queue error:', err?.response?.status, JSON.stringify(err?.response?.data));
      setError(err?.response?.data?.message ?? t('admin.errors.load_kyc_failed', 'Failed to load KYC queue.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load(0, activeFilter);
  }, [activeFilter]);

  useFocusEffect(
    useCallback(() => {
      load(currentPage, activeFilter, true);
    }, [currentPage, activeFilter, load])
  );

  useEffect(() => {
    const interval = setInterval(() => {
      load(currentPage, activeFilter, true);
    }, 20000);
    return () => clearInterval(interval);
  }, [currentPage, activeFilter, load]);

  const setFilter = (status: KycStatus | 'ALL') => {
    setActiveFilter(status);
    setCurrentPage(0);
  };

  const loadPage = (page: number) => {
    load(page, activeFilter);
  };

  const refresh = () => {
    load(currentPage, activeFilter, true);
  };

  const approve = async (kycId: string): Promise<boolean> => {
    try {
      await reviewKyc(kycId, { decision: 'VERIFIED' });
      setItems((prev) => prev.filter((i) => i.kycId !== kycId));
      setTotalElements((prev) => prev - 1);
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message ?? t('admin.errors.approve_failed', 'Failed to approve KYC.'));
      return false;
    }
  };

  const reject = async (kycId: string, note: string): Promise<boolean> => {
    try {
      await reviewKyc(kycId, { decision: 'REJECTED', note });
      setItems((prev) => prev.filter((i) => i.kycId !== kycId));
      setTotalElements((prev) => prev - 1);
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message ?? t('admin.errors.reject_failed', 'Failed to reject KYC.'));
      return false;
    }
  };

  return {
    items, loading, refreshing, error,
    totalElements, totalPages, currentPage,
    activeFilter, setFilter, loadPage, refresh,
    approve, reject,
  };
}
