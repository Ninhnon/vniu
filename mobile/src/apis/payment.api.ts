import { PaymentRequest, PaymentResponse } from '@appTypes/payment.type'
import { SuccessResponse } from '@appTypes/utils.type'
import http from 'src/utils/http'
const paymentApi = {
  createPaymentUrl(body: PaymentRequest) {
    return http.post<SuccessResponse<string>>(`api/User/online-payment/url`, body)
  },
  getPaymentResponse(orderId: number, url: string) {
    return http.get<SuccessResponse<PaymentResponse>>(`api/User/${orderId}/${url}`)
  }
}

export default paymentApi
