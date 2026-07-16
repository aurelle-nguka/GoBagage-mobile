import apiClient from "../../../shared/services/api.client";

export interface CreateReviewRequest {
  bookingId: number;
  revieweeId: number;
  rating: number;
  comment?: string;
  badges?: string[];
}

export interface ReviewDTO {
  id: number;
  bookingId: number;
  reviewerId: number;
  reviewerFirstName: string;
  revieweeId: number;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export async function submitReview(data: CreateReviewRequest): Promise<ReviewDTO> {
  const response = await apiClient.post<ReviewDTO>('/reviews', data);
  return response.data;
}