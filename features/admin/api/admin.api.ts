/**
 * Go Bagage — Admin API
 * Endpoints réservés au rôle ADMIN.
 * Contrat OpenAPI v1.0.0 — /admin/*
 */

import apiClient from '../../../shared/services/api.client';
import type {
  AdminStatsResponse,
  AdminUser,
  AdminUserPage,
  AdminUserParams,
  CloseDisputeRequest,
  DecideDisputeRequest,
  Dispute,
  DisputeStatus,
  KycQueuePage,
  KycQueueParams,
  KycReviewRequest,
  KycReviewResponse,
} from '../types/admin.types';

export async function getAdminStats(): Promise<AdminStatsResponse> {
  const response = await apiClient.get<AdminStatsResponse>('/admin/stats');
  return response.data;
}

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

export async function getAdminUsers(params: AdminUserParams = {}): Promise<AdminUserPage> {
  const response = await apiClient.get<AdminUserPage>('/admin/users', {
    params: {
      page: params.page ?? 0,
      size: params.size ?? 20,
      ...(params.search ? { search: params.search } : {}),
      ...(params.role ? { role: params.role } : {}),
      ...(params.isActive !== undefined ? { isActive: params.isActive } : {}),
    },
  });
  return response.data;
}

export async function getAdminUserById(id: string): Promise<AdminUser> {
  const response = await apiClient.get<AdminUser>(`/admin/users/${id}`);
  return response.data;
}

export async function suspendUser(id: string, reason?: string): Promise<AdminUser> {
  const response = await apiClient.patch<AdminUser>(
    `/admin/users/${id}/suspend`,
    reason ? { reason } : undefined,
  );
  return response.data;
}

export async function reactivateUser(id: string): Promise<AdminUser> {
  const response = await apiClient.patch<AdminUser>(`/admin/users/${id}/reactivate`);
  return response.data;
}

export async function getAdminDisputes(status?: DisputeStatus | 'ALL'): Promise<Dispute[]> {
  const response = await apiClient.get<Dispute[]>('/admin/disputes', {
    params: status && status !== 'ALL' ? { status } : undefined,
  });
  return response.data;
}

export async function getAdminDispute(id: string): Promise<Dispute> {
  const response = await apiClient.get<Dispute>(`/admin/disputes/${id}`);
  return response.data;
}

export async function startDisputeInvestigation(id: string): Promise<Dispute> {
  const response = await apiClient.patch<Dispute>(`/admin/disputes/${id}/investigate`);
  return response.data;
}

export async function decideDispute(id: string, data: DecideDisputeRequest): Promise<Dispute> {
  const response = await apiClient.post<Dispute>(`/admin/disputes/${id}/decide`, data);
  return response.data;
}

export async function closeDispute(id: string, data: CloseDisputeRequest = {}): Promise<Dispute> {
  const response = await apiClient.post<Dispute>(`/admin/disputes/${id}/close`, data);
  return response.data;
}
