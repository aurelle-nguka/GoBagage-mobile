import { KycStatus, UserRole } from "../../../types/user.types";
import type { Dispute, DisputeStatus } from "../../disputes/types/dispute.types";

export type { Dispute, DisputeStatus };

export interface DecideDisputeRequest {
  decision: 'RELEASE_FUNDS' | 'REFUND';
  note?: string;
}

export interface CloseDisputeRequest {
  note?: string;
}

export type KycDocumentType = 'CNI' | 'PASSPORT';
export type KycDecision = 'VERIFIED' | 'REJECTED';

export interface KycQueueItem {
  kycId: string;
  userId: string;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  documentType: KycDocumentType;
  frontDocumentUrl: string;
  backDocumentUrl: string | null;
  status: KycStatus;
  submittedAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
}

export interface KycQueuePage {
  content: KycQueueItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface KycReviewRequest {
  decision: KycDecision;
  note?: string;
}

export interface KycReviewResponse {
  kycId: string;
  userId: string;
  decision: KycDecision;
  note: string | null;
  reviewedAt: string;
  reviewedBy: string;
  message: string;
}

export interface KycQueueParams {
  page?: number;
  size?: number;
  status?: KycStatus;
}

export interface AdminStatsResponse {
  totalUsers: number;
  activeUsers30d: number;
  newUsersToday: number;
  activeTrips: number;
  totalTrips: number;
  todayTransactions: number;
  pendingBookings: number;
  todayRevenueCad: number;
  totalRevenueCad: number;
  conversionRate: number;
  avgBookingValue: number;
}

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roles: UserRole[];
  kycStatus: KycStatus;
  isActive: boolean;
  suspensionReason: string | null;
  averageRating: number | null;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface AdminUserPage {
  content: AdminUser[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface AdminUserParams {
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  page?: number;
  size?: number;
}