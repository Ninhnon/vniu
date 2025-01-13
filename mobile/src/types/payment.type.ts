export interface PaymentRequest {
  orderId: string;
  orderType: string;
  orderTotal: number;
  isVnPay: boolean;
}

export interface PaymentResponse {
  paymentMethodId: number;
  paymentTransactionNo: string;
  paymentProvider?: string;
  paymentCartType?: string;
  paymentDate?: string;
  paymentStatus?: number;
  isDefault?: boolean;
  paymentDescription?: string;
  paymentTypeId: number;
}
