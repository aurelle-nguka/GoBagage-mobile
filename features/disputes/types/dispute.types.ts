export type DisputeStatus = 'OPEN' | 'UNDER_INVESTIGATION' | 'DECIDED' | 'CLOSED';
export type DisputeDecision = 'PENDING' | 'RELEASE_FUNDS' | 'REFUND';

export interface Dispute {
  id: string;
  bookingId: string;
  openedBy: string;
  reason: string;
  description: string | null;
  status: DisputeStatus;
  decision: DisputeDecision;
  adminNotes: string | null;
  closedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDisputeRequest {
  bookingId: string;
  reason: string;
  description?: string;
}
