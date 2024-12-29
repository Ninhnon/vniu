/** @format */

import toast from 'react-hot-toast';
import { postRequest } from '@/lib/fetch';

export const useImage = () => {
  const onUploadImage = async ({ formData, callback }) => {
    try {
      const res = await postRequest({
        endPoint: '/api/v1/file-storages/upload',
        formData,
        isFormData: true,
      });
      console.log('🚀 ~ onUploadImage ~ response:', res);

      if (res?.isSuccess) {
        console.log(
          '🚀 ~ file: useProduct.ts:49 ~ onCreateProduct ~ res:',
          res.data
        );
        toast.success('Image successfully');
        callback();
        return res.value;
      } else {
        toast.error('Image fail');
        return;
      }
    } catch (e) {
      console.log(e);
    }
  };

  return {
    onUploadImage,
  };
};
