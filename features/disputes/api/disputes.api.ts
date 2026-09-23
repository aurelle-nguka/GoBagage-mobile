import apiClient from '../../../shared/services/api.client';
import type { CreateDisputeRequest, Dispute } from '../types/dispute.types';

export async function openDispute(data: CreateDisputeRequest): Promise<Dispute> {
  const response = await apiClient.post<Dispute>('/disputes', data);
  return response.data;
}
