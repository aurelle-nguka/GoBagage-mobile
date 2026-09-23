export type SubscriptionStatus =
  | 'ACTIVE'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'LAUNCH_OFFER_ACTIVE'
  | 'LAUNCH_OFFER_EXPIRED'
  | 'INACTIVE';

export interface SubscriptionStatusResponse {
  type: string;
  status: SubscriptionStatus;
  active: boolean;
  launchOfferApplied: boolean;
  startDate: string | null;
  endDate: string | null;
  daysRemaining: number;
}

export interface LaunchOfferResponse {
  available: boolean;
  remainingSlots: number;
  offerEndDate: string;
}

export interface SubscribeRequest {
  paymentProvider: 'STRIPE';
}

export interface SubscribeInitiateResponse {
  clientSecret: string | null;
  paymentIntentId: string;
  amountCad: number;
  currency: string;
}

export interface ConfirmSubscriptionRequest {
  paymentIntentId: string;
}

export interface ApplyPromoRequest {
  promoCode: string;
}
