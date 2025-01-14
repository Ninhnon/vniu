export interface ChatRoomResponseType {
  chatRoomId: number;
  userId: string;
}

export interface MessageResponseType {
  messageId: number;
  messageContent: string;
  imageUrl: string;
  isFromUser: boolean;
  messageCreateAt: string;
  messageReadAt: string;
  isRead: boolean;
  chatRoomId: number;
}

export interface MessageRequestType {
  content?: string;
  imageUrl?: string;
}

export interface ChatbotResponseType {
  chatbotId: string;
  chatbotContent: string;
  imageUrl?: string;
  isFromUser: boolean;
  messageCreateAt: string;
}
