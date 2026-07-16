import { ParcelCategory } from "../../../types/common.types";

export type BookingStatus =
  | 'PENDING'
  | 'AWAITING_ACCEPTANCE'
  | 'ACCEPTED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CONFIRMED'
  | 'REJECTED'
  | 'CANCELLED';

export type PaymentEscrowStatus =
  | 'INITIATED'
  | 'HELD'
  | 'RELEASED'
  | 'REFUNDED'
  | 'FAILED';

export interface CreateParcelRequest {
  description: string;
  estimatedWeightKg: number;
  category: ParcelCategory;
  declaredValueCAD?: number;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
}

export interface ParcelDTO {
  id: string;
  senderId: string;
  description: string;
  estimatedWeightKg: number;
  category: ParcelCategory;
  declaredValueCAD: number | null;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  declarationSigned: boolean;
  declarationSignedAt: string | null;
  status: string;
  createdAt: string;
}

export interface CreateBookingRequest {
  tripId: string;
  parcelId: string;
  requestedKg: number;
  messageToTraveler?: string;
}

export interface BookingUserSummary {
  id: number;
  firstName: string;
  lastNameInitial: string;
  averageRating: number | null;
  totalDeliveries: number;
  kycVerified: boolean;
}

export interface BookingParcelSummary {
  id: number;
  description: string;
  category: string;
  estimatedWeightKg: number | null;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
}

export interface BookingCorridorSummary {
  id: number;
  code: string;
  departureCity: string;
  departureCountry: string;
  arrivalCity: string;
  arrivalCountry: string;
}

export interface BookingTripSummary {
  id: number;
  departureDate: string;
  availableKg: number;
  pricePerKg: number | null;
  corridor: BookingCorridorSummary | null;
  traveler: BookingUserSummary | null;
}

export interface BookingDTO {
  id: string;
  tripId: string;
  parcelId: string;
  senderId: string;
  requestedKg: number;
  totalAmountCad: number | null;
  commissionAmountCad: number | null;
  travelerAmountCad: number | null;
  status: BookingStatus;
  paymentStatus: string | null;
  messageToTraveler: string | null;
  pickedUpAt: string | null;
  deliveredAt: string | null;
  confirmedAt: string | null;
  createdAt: string;
  updatedAt: string;
  trip: BookingTripSummary | null;
  parcel: BookingParcelSummary | null;
  sender: BookingUserSummary | null;
  traveler: BookingUserSummary | null;
}