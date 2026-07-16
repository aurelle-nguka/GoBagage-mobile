export interface CorridorResponse {
  id: number;
  code: string;
  departureCountry: string;
  departureCity: string;
  arrivalCountry: string;
  arrivalCity: string;
  isActive: boolean;
  basePricePerKg: number | null;
  regulatoryInfo: string | null;
  createdAt: string;
}

export interface CorridorRequest {
  departureCountry: string;
  departureCity: string;
  arrivalCountry: string;
  arrivalCity: string;
  code: string;
  basePricePerKg?: number;
  regulatoryInfo?: string;
}

export interface CorridorStatusRequest {
  isActive: boolean;
}

export function corridorLabel(c: CorridorResponse): string {
  return `${c.departureCity} → ${c.arrivalCity}`;
}

export function corridorSubLabel(c: CorridorResponse): string {
  return `${c.departureCountry} → ${c.arrivalCountry}`;
}
