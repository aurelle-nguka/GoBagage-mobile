/**
 * Go Bagage — Types Admin
 * Alignés sur le contrat OpenAPI v1.0.0 — /admin/*
 */

import { KycStatus } from "../../../types/user.types";

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