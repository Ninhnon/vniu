/** @format */

import {postRequest} from '@configs/fetch';

export const useImage = () => {
  const onUploadImage = async ({
    formData,
    callback,
  }: {
    formData: any;
    callback: () => void;
  }) => {
    console.log('🚀 ~ onUploadImage ~ formData:', formData);
    try {
      const res = await postRequest({
        endPoint: '/api/v1/file-storages/upload',
        formData,
        isFormData: true,
      });
      console.log('🚀 ~ onUploadImage ~ res.data.value:', res.data);

      if (res.data.isSuccess) {
        callback();
        return res.data.value;
      } else {
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
