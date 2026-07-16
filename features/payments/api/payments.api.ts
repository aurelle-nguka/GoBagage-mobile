import apiClient from "../../../shared/services/api.client";

export interface InitiatePaymentRequest {
  bookingId: number;      
  provider: 'STRIPE' | 'ORANGE_MONEY' | 'MTN_MOMO' | 'INTERAC';
  currency?: string;
}

export interface InitiatePaymentResponse {
  paymentId: number;
  stripeClientSecret: string | null;  
  amountCad: number;
  currency: string;
  provider: string;
  status: string;
}

export async function initiatePayment(
  data: InitiatePaymentRequest,
): Promise<InitiatePaymentResponse> {
  const response = await apiClient.post<InitiatePaymentResponse>(
    '/payments/initiate',
    data,
  );
  return response.data;
}