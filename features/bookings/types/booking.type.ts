export type BookingStatus =
  | 'PENDING' | 'ACCEPTED' | 'PICKED_UP'
  | 'IN_TRANSIT' | 'DELIVERED' | 'CONFIRMED'
  | 'REJECTED' | 'CANCELLED';

export interface Booking {
  id: string;
  tripId: string;
  parcelId: string;
  senderId: string;
  totalAmount: number;
  commissionAmount: number;
  declarationSigned: boolean;
  declarationSignedAt?: string;
  status: BookingStatus;
  pickedUpAt?: string;
  deliveredAt?: string;
  confirmedAt?: string;
}
