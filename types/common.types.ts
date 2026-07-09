export interface Corridor {
  id: string;
  departureCountry: string;
  arrivalCountry: string;
  departureCity: string;
  arrivalCity: string;
  code: string;        
  active: boolean;
  regulatoryInfo?: string;
  createdAt: string;
}

export type ParcelCategory =
  | 'CLOTHING'
  | 'FOOD'
  | 'ELECTRONICS'
  | 'COSMETICS'
  | 'DOCUMENTS'
  | 'BOOKS'
  | 'OTHER';

export type PickupMode = 'HOME' | 'AIRPORT' | 'MEETING_POINT';
