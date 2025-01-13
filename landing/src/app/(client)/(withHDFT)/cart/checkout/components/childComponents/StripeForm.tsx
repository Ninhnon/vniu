import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { deleteRequest, postRequest } from '@/lib/fetch';
import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';

const StripeForm = ({
  checkedItems,
  total,
  selectedShipping,
  selectedPromotion,
  selectedPaymentType,
  addressId,
}) => {
  const session = useSession();
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = React.useState(false);
  const onSubmit = async () => {
    if (!stripe || !elements) return;

    setLoading(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // return_url: `${window.location.origin}/agency/goi-dich-vu`,
      },
      redirect: 'if_required',
    });
    const dataArray = Object.values(checkedItems).map((item) => {
      return {
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        productItemId: item.productItemId,
        variationId: item.variationId,
        price: item.price,
        productName: item.productName,
      };
    });
    console.log('🚀 ~ dataArray ~ dataArray:', dataArray);
    const dataArrayDelete = dataArray.map((item) => {
      return {
        productItemId: item.productItemId,
        variationId: item.variationId,
      };
    });
    const response = await postRequest({
      endPoint: '/api/v1/orders',
      formData: {
        orderTotal: total,
        userId: session?.data?.user?.id,
        note: 'Order note',
        paymentTypeId: selectedPaymentType.id,
        shippingAddressId: addressId,
        shippingMethodId: selectedShipping.id,
        promotionId: selectedPromotion.id,
        orderLines: dataArray,
        phoneNumber: '0123456789',
      },
      isFormData: false,
    });
    console.log('🚀 ~ onSubmit ~ response:', response);
    const responseDelete = await deleteRequest({
      endPoint: '/api/v1/cart-items',
      formData: dataArrayDelete,
    });
    console.log('🚀 ~ onSubmit ~ responseDelete:', responseDelete);
    if (!response.isSuccess || !responseDelete.isSuccess) {
      toast.error('Order failed');
      setLoading(false);
      return;
    }
    if (error) {
      toast.error(error?.message);
    } else if (paymentIntent.status === 'succeeded') {
      setLoading(false);
      toast.success('Payment successful');
      router.push('/user/profile/orders');
    } else {
      toast.error('Payment failed');
    }
  };
  return stripe && elements ? (
    <div className="px-1 py-10">
      <div className="flex flex-col w-full gap-y-6 ">
        <PaymentElement />
        <div className="w-full flex items-center justify-center">
          <Button disabled={loading} className="w-[60%]" onClick={onSubmit}>
            <span>Pay</span>
          </Button>
        </div>
        {loading ? (
          <div className="w-full flex items-center justify-center">
            <Loader />
            Your payment is being processed...
          </div>
        ) : null}
      </div>
    </div>
  ) : null;
};

export default StripeForm;
