import { getRequest } from '@/lib/fetch';

export const useUser = () => {
  const onGetUserDetail = async () => {
    const userDetail = await getRequest({
      endPoint: `/api/v1/users/profile`,
    });

    return userDetail.value;
  };

  return { onGetUserDetail };
};
