export type PaymentProvider = 'STRIPE' | 'ORANGE' | 'MTN';
export type EscrowStatus = 'INITIATED' | 'HELD' | 'RELEASED' | 'REFUNDED' | 'FAILED';

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  provider: PaymentProvider;
  escrowStatus: EscrowStatus;
  providerPaymentId?: string;
  releasedAt?: string;
  refundedAt?: string;
}

export interface InitiatePaymentDto {
  bookingId: string;
  provider: PaymentProvider;
  amount: number;
  currency: string;
  mobileMoneyPhone?: string;
}