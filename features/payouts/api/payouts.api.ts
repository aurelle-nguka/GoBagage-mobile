import apiClient from '../../../shared/services/api.client';
import type {
  BalanceResponse,
  PayoutDTO,
  RequestPayoutRequest,
} from '../types/payout.types';

export async function getBalance(): Promise<BalanceResponse> {
  const response = await apiClient.get<BalanceResponse>('/payouts/balance');
  return response.data;
}

export async function requestPayout(data: RequestPayoutRequest): Promise<PayoutDTO> {
  const response = await apiClient.post<PayoutDTO>('/payouts', data);
  return response.data;
}

export async function getMyPayouts(): Promise<PayoutDTO[]> {
  const response = await apiClient.get<PayoutDTO[]>('/payouts');
  return response.data;
}
