export type PayoutProvider = 'ORANGE' | 'MTN' | 'INTERAC' | 'BANK_TRANSFER';
export type PayoutStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
export type PayoutType = 'TRAVELER_EARNINGS' | 'PLATFORM_COMMISSION';

export interface BalanceResponse {
  availableCad: number;
  currency: string;
}

export interface RequestPayoutRequest {
  amountCad: number;
  provider: PayoutProvider;
  destinationPhone?: string;
  destinationDetails?: string;
}

export interface PayoutDTO {
  id: number;
  type: PayoutType;
  amountCad: number;
  provider: PayoutProvider;
  status: PayoutStatus;
  destinationPhone?: string | null;
  destinationDetails?: string | null;
  reference?: string | null;
  failureReason?: string | null;
  requestedAt: string;
  processedAt?: string | null;
}
