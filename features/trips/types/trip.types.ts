import { ParcelCategory, PickupMode } from "../../../types/common.types";

export type TripStatus = 'OPEN' | 'BOOKED' | 'IN_TRANSIT' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED';

export interface Trip {
  id: string;
  travelerId: string;
  corridorId: string;
  departureDate: string;
  availableKg: number;
  pricePerKg: number;
  acceptedCategories: ParcelCategory[];
  restrictions?: string;
  pickupMode: PickupMode;
  status: TripStatus;
  createdAt: string;
}

export interface CreateTripDto {
  corridorId: string;
  departureDate: string;
  availableKg: number;
  pricePerKg: number;
  acceptedCategories: ParcelCategory[];
  restrictions?: string;
  pickupMode: PickupMode;
}
