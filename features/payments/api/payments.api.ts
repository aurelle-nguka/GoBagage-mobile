import apiClient from "../../../shared/services/api.client";
import type { PaymentProvider, EscrowStatus } from "../types/payment.types";

export interface InitiatePaymentRequest {
  bookingId: number;
  provider: PaymentProvider;
  currency?: string;
  mobileMoneyPhone?: string;
}

export interface InitiatePaymentResponse {
  paymentId: number;
  stripeClientSecret: string | null;
  amountCad: number;
  currency: string;
  provider: string;
  status: string;
}

export interface PaymentDto {
  id: number;
  bookingId: number;
  amountCad: number;
  commissionCad: number;
  travelerAmountCad: number;
  currency: string;
  provider: string;
  escrowStatus: EscrowStatus;
  providerPaymentId?: string;
  reason?: string;
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

export async function getPayment(paymentId: number): Promise<PaymentDto> {
  const response = await apiClient.get<PaymentDto>(`/payments/${paymentId}`);
  return response.data;
}