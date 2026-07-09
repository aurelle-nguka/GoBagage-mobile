/**
 * Go Bagage — Admin API
 * Endpoints réservés au rôle ADMIN.
 * Contrat OpenAPI v1.0.0 — /admin/*
 */

import apiClient from '../../../shared/services/api.client';
import type {
  KycQueuePage,
  KycQueueParams,
  KycReviewRequest,
  KycReviewResponse,
} from '../types/admin.types';

export async function getKycQueue(params: KycQueueParams = {}): Promise<KycQueuePage> {
  console.log('=== GET KYC QUEUE ===');
  console.log('URL: GET /admin/kyc-queue');
  console.log('params:', JSON.stringify(params));
  
  const response = await apiClient.get<KycQueuePage>('/admin/kyc-queue', {
    params: {
      page: params.page ?? 0,
      size: params.size ?? 20,
      ...(params.status ? { status: params.status } : {}),
    },
  });
  
  console.log('status:', response.status);
  console.log('data:', JSON.stringify(response.data));
  
  return response.data;
}

export async function reviewKyc(
  kycId: string,
  data: KycReviewRequest,
): Promise<KycReviewResponse> {
  const response = await apiClient.patch<KycReviewResponse>(
    `/admin/kyc/${kycId}`,
    data,
  );
  return response.data;
}
