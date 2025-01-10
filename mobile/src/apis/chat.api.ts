import {
  ChatRoomResponseType,
  ChatbotResponseType,
  MessageRequestType,
  MessageResponseType,
} from '@appTypes/chat.type';
import {SuccessResponse} from '@appTypes/utils.type';
import {apiClient} from '@configs/apiClient';

const chatApi = {
  getChatRoomByUser(userId: string) {
    return apiClient.get<SuccessResponse<ChatRoomResponseType>>(
      `api/Chat/chatrooms/${userId}`,
    );
  },

  // getMessagesByUser(userId: string) {
  //   return http.get<SuccessResponse<MessageResponseType[]>>(`api/Chat/chatrooms/${userId}/messages`)
  // },

  // sendMessageByUser({ userId, body }: { userId: string; body: MessageRequestType }) {
  //   return http.post<SuccessResponse<MessageResponseType>>(`api/Chat/chatrooms/${userId}/messages`, body)
  // },

  // chatbotResponse(userMessage: string) {
  //   return http.post<SuccessResponse<ChatbotResponseType>>(`api/Chat/chatbot`, userMessage)
  // }
  getMessagesByUser(userId: string) {
    return apiClient.get<SuccessResponse<MessageResponseType[]>>(
      `/api/v1/users/${userId}/chat-messages/filter-and-sort?PageIndex=1&PageSize=100`,
    );
  },

  sendMessageByUser({body}: {body: MessageRequestType}) {
    return apiClient.post<SuccessResponse<MessageResponseType>>(
      `/api/v1/chat-messages`,
      body,
    );
  },

  chatbotResponse(userMessage: string) {
    return apiClient.post<SuccessResponse<ChatbotResponseType>>(
      `/api/v1/chat-messages/chatbot`,
      userMessage,
    );
  },
};

export default chatApi;
