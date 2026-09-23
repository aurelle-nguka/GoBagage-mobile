export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  contentType?: 'TEXT' | 'IMAGE' | 'AUDIO' | 'SYSTEM';
  mediaUrl?: string;
  readAt?: string;
  createdAt: string;
}

export interface ConversationParticipant {
  id: string;
  firstName: string;
  lastNameInitial: string;
  profilePhotoUrl?: string;
  averageRating?: number;
  kycVerified?: boolean;
  phoneNumber?: string;
}

export interface CorridorSummary {
  id: string;
  code: string;
  departureCity: string;
  departureCountry: string;
  arrivalCity: string;
  arrivalCountry: string;
}

export interface Conversation {
  id: string;
  bookingId: string;
  otherParticipant?: ConversationParticipant;
  corridor?: CorridorSummary;
  departureDate?: string;
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
}

export interface MessagePage {
  content: Message[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
