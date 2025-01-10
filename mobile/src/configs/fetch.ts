/** @format */

import {apiClient} from './apiClient';

export const getRequest = async ({endPoint}: {endPoint: string}) => {
  const res = await apiClient.get(endPoint);
  return res;
};

export const postRequest = async ({
  endPoint,
  formData,
  isFormData,
}: {
  endPoint: string;
  formData: any;
  isFormData: any;
}) => {
  const res = await apiClient.post(
    endPoint,
    isFormData ? formData : JSON.stringify(formData),
    isFormData && {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Access-Control-Allow-Origin': '*',
      },
    },
  );
  return res;
};

export const putRequest = async ({
  endPoint,
  formData,
  isFormData,
}: {
  endPoint: string;
  formData: any;
  isFormData: any;
}) => {
  const res = await apiClient.put(
    endPoint,
    isFormData ? formData : JSON.stringify(formData),
    isFormData && {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Access-Control-Allow-Origin': '*',
      },
    },
  );
  return res;
};
export const deleteRequest = async ({
  endPoint,
  formData,
}: {
  endPoint: string;
  formData: any;
}) => {
  const res = await apiClient.delete(endPoint, {
    data: formData,
  });
  return res;
};
