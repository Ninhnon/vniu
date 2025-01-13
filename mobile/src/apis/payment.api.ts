import {PaymentRequest, PaymentResponse} from '@appTypes/payment.type';
import {SuccessResponse} from '@appTypes/utils.type';
import http from 'src/utils/http';
const paymentApi = {
  createPaymentUrl(body: PaymentRequest) {
    return http.post<SuccessResponse<string>>(
      `/api/v1/users/online-payment/generate-url`,
      body,
    );
  },
  getPaymentResponse(orderId: number, url: string) {
    return http.get<SuccessResponse<PaymentResponse>>(
      `/api/v1/users/online-payment/result/${orderId}/${url}`,
    );
  },
};

export default paymentApi;
