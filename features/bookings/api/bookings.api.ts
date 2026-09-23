import apiClient from "../../../shared/services/api.client";
import { BookingDTO, CreateBookingRequest, CreateParcelRequest, ParcelDTO } from "../types/booking.type";

export async function createParcel(data: CreateParcelRequest): Promise<ParcelDTO> {
  const response = await apiClient.post<ParcelDTO>('/parcels', data);
  return response.data;
}

export async function signParcelDeclaration(parcelId: string): Promise<ParcelDTO> {
  const response = await apiClient.post<ParcelDTO>(`/parcels/${parcelId}/sign`);
  return response.data;
}

export async function getParcel(parcelId: string): Promise<ParcelDTO> {
  const response = await apiClient.get<ParcelDTO>(`/parcels/${parcelId}`);
  return response.data;
}

export async function createBooking(data: CreateBookingRequest): Promise<BookingDTO> {
  const response = await apiClient.post<BookingDTO>('/bookings', data);
  return response.data;
}

export async function getBooking(bookingId: string): Promise<BookingDTO> {
  const response = await apiClient.get<BookingDTO>(`/bookings/${bookingId}`);
  return response.data;
}

export async function getMyBookings(role?: 'SENDER' | 'TRAVELER'): Promise<BookingDTO[]> {
  const response = await apiClient.get<BookingDTO[]>('/bookings', {
    params: role ? { role } : undefined,
  });
  return response.data;
}

export async function acceptBooking(bookingId: string): Promise<BookingDTO> {
  const response = await apiClient.patch<BookingDTO>(`/bookings/${bookingId}/accept`);
  return response.data;
}

export async function rejectBooking(bookingId: string, reason?: string): Promise<BookingDTO> {
  const response = await apiClient.patch<BookingDTO>(`/bookings/${bookingId}/reject`, {
    reason,
  });
  return response.data;
}

export async function markPickedUp(bookingId: string): Promise<BookingDTO> {
  const response = await apiClient.patch<BookingDTO>(`/bookings/${bookingId}/picked-up`);
  return response.data;
}

export async function markDelivered(bookingId: string): Promise<BookingDTO> {
  const response = await apiClient.patch<BookingDTO>(`/bookings/${bookingId}/delivered`);
  return response.data;
}

export async function confirmDelivery(bookingId: string): Promise<BookingDTO> {
  const response = await apiClient.patch<BookingDTO>(`/bookings/${bookingId}/confirm`);
  return response.data;
}

export async function cancelBooking(bookingId: string, reason?: string): Promise<BookingDTO> {
  const response = await apiClient.patch<BookingDTO>(`/bookings/${bookingId}/cancel`, {
    reason,
  });
  return response.data;
}
