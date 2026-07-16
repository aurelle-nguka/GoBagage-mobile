
import apiClient from '../../../shared/services/api.client';
import type {
  CorridorResponse,
  CorridorRequest,
  CorridorStatusRequest,
} from '../types/corridor.types';

export async function getActiveCorridors(): Promise<CorridorResponse[]> {
  const response = await apiClient.get<CorridorResponse[]>('/corridors');
  return response.data;
}

export async function getCorridorInfo(id: number): Promise<CorridorResponse> {
  const response = await apiClient.get<CorridorResponse>(`/corridors/${id}/info`);
  return response.data;
}

export async function createCorridor(data: CorridorRequest): Promise<CorridorResponse> {
  const response = await apiClient.post<CorridorResponse>('/admin/corridors', data);
  return response.data;
}

export async function updateCorridor(id: number, data: CorridorRequest): Promise<CorridorResponse> {
  const response = await apiClient.put<CorridorResponse>(`/admin/corridors/${id}`, data);
  return response.data;
}

export async function toggleCorridorStatus(
  id: number,
  data: CorridorStatusRequest,
): Promise<CorridorResponse> {
  const response = await apiClient.patch<CorridorResponse>(
    `/admin/corridors/${id}/status`,
    data,
  );
  return response.data;
}
