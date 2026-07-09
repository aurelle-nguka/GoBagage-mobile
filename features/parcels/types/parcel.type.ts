import { ParcelCategory } from "../../../types/common.types";

export type ParcelStatus = 'DECLARED' | 'MATCHED' | 'IN_TRANSIT' | 'DELIVERED';

export interface Parcel {
  id: string;
  senderId: string;
  description: string;
  estimatedWeight: number;
  category: ParcelCategory;
  photos: string[];
  declaredValue?: number;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  status: ParcelStatus;
}

export interface CreateParcelDto {
  description: string;
  estimatedWeight: number;
  category: ParcelCategory;
  declaredValue?: number;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
}
