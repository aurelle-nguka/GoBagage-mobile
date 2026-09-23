import apiClient from '../../../shared/services/api.client';
import { Conversation, Message, MessagePage } from '../types/message.types';

export async function getMyConversations(status?: string): Promise<Conversation[]> {
  const response = await apiClient.get<Conversation[]>('/conversations', {
    params: status ? { status } : undefined,
  });
  return response.data;
}

export async function getConversationByBookingId(bookingId: string): Promise<Conversation> {
  const response = await apiClient.get<Conversation>(`/conversations/booking/${bookingId}`);
  return response.data;
}

export async function getMessages(
  conversationId: string,
  page = 0,
  size = 50,
): Promise<MessagePage> {
  const response = await apiClient.get<MessagePage>(
    `/conversations/${conversationId}/messages`,
    { params: { page, size } },
  );
  return response.data;
}

export async function sendMessage(conversationId: string, content: string): Promise<Message> {
  const response = await apiClient.post<Message>(`/conversations/${conversationId}/messages`, {
    content,
  });
  return response.data;
}

export async function sendAttachment(
  conversationId: string,
  fileUri: string,
  content?: string,
): Promise<Message> {
  const formData = new FormData();
  const filename = fileUri.split('/').pop() || 'attachment';
  const match = /\.(\w+)$/.exec(filename);
  const ext = match ? match[1].toLowerCase() : '';

  let type = 'application/octet-stream';
  if (['m4a', 'aac'].includes(ext)) {
    type = 'audio/mp4';
  } else if (ext === 'mp3') {
    type = 'audio/mpeg';
  } else if (ext === 'wav') {
    type = 'audio/wav';
  } else if (ext === 'ogg') {
    type = 'audio/ogg';
  } else if (ext === '3gp') {
    type = 'audio/3gpp';
  } else if (['jpg', 'jpeg'].includes(ext)) {
    type = 'image/jpeg';
  } else if (ext === 'png') {
    type = 'image/png';
  } else if (ext === 'webp') {
    type = 'image/webp';
  }

  // @ts-ignore
  formData.append('file', {
    uri: fileUri,
    name: filename,
    type,
  });

  if (content) {
    formData.append('content', content);
  }

  const response = await apiClient.post<Message>(
    `/conversations/${conversationId}/messages/attachment`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
}
