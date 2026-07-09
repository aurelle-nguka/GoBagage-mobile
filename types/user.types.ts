
export type UserRole = 'TRAVELER' | 'SENDER' | 'ADMIN';

export type KycStatus = 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED';

export type SubscriptionType = 'FREE' | 'PREMIUM';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roles: UserRole[];
  kycStatus: KycStatus;
  kycRejectionReason?: string;
  kycDocumentUrl?: string;
  profilePhoto?: string;
  bio?: string;
  averageRating: number;
  totalDeliveries: number;
  subscriptionType: SubscriptionType;
  createdAt: string;
}

export interface PublicUser {
  id: string;
  firstName: string;
  lastName: string;
  profilePhoto?: string;
  averageRating: number;
  totalDeliveries: number;
  kycStatus: KycStatus;
  bio?: string;
}
