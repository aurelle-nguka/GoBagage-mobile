export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  readAt?: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  bookingId: string;
  lastMessage?: Message;
  createdAt: string;
}
