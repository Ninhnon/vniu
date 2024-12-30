import {
  ChatRoomResponseType,
  ChatbotResponseType,
  MessageRequestType,
  MessageResponseType,
} from './ChatType';
import { SuccessResponse } from './AppType';
import axiosClient from '.././axios';

const chatApi = {
  getMessagesByUser(userId: string) {
    return axiosClient.get<SuccessResponse<MessageResponseType[]>>(
      `/api/v1/users/${userId}/chat-messages/filter-and-sort?PageIndex=1&PageSize=100`
    );
  },

  sendMessageByUser({ body }: { body: MessageRequestType }) {
    return axiosClient.post<SuccessResponse<MessageResponseType>>(
      `/api/v1/chat-messages`,
      body
    );
  },

  chatbotResponse(userMessage: string) {
    return axiosClient.post<SuccessResponse<ChatbotResponseType>>(
      `api/Chat/chatbot`,
      userMessage
    );
  },
};

export default chatApi;
