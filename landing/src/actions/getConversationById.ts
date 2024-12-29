import { getRequest } from '@/lib/fetch';

const getConversationById = async (id: string) => {
  try {
    const response = await getRequest({
      endPoint: `/api/v1/users/${id}/cart-items/filter-and-sort/PageIndex=1&PageSize=2`,
    });
    console.log('🚀 ~ ChatId ~ response:', response);
    if (response.isSuccess) return response.value.item;
    else return null;
  } catch (error: any) {
    return null;
  }
};

export default getConversationById;
