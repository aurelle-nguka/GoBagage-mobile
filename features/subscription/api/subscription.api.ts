import apiClient from '../../../shared/services/api.client';
import type {
  ApplyPromoRequest,
  ConfirmSubscriptionRequest,
  LaunchOfferResponse,
  SubscribeInitiateResponse,
  SubscribeRequest,
  SubscriptionStatusResponse,
} from '../types/subscription.types';

export async function getSubscriptionStatus(): Promise<SubscriptionStatusResponse> {
  const response = await apiClient.get<SubscriptionStatusResponse>('/subscription/status');
  return response.data;
}

export async function getLaunchOfferStatus(): Promise<LaunchOfferResponse> {
  const response = await apiClient.get<LaunchOfferResponse>('/subscription/launch-offer');
  return response.data;
}

export async function subscribe(data: SubscribeRequest): Promise<SubscribeInitiateResponse> {
  const response = await apiClient.post<SubscribeInitiateResponse>('/subscription/subscribe', data);
  return response.data;
}

export async function confirmSubscription(
  data: ConfirmSubscriptionRequest,
): Promise<SubscriptionStatusResponse> {
  const response = await apiClient.post<SubscriptionStatusResponse>('/subscription/confirm', data);
  return response.data;
}

export async function cancelSubscription(): Promise<SubscriptionStatusResponse> {
  const response = await apiClient.post<SubscriptionStatusResponse>('/subscription/cancel');
  return response.data;
}

export async function applyPromo(data: ApplyPromoRequest): Promise<SubscriptionStatusResponse> {
  const response = await apiClient.post<SubscriptionStatusResponse>('/subscription/apply-promo', data);
  return response.data;
}
