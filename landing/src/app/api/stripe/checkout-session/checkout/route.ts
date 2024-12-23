import { postRequest } from '@/lib/fetch';
import { stripe } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('🚀 ~ file: route.ts:7 ~ POST ~ body:', body);
    try {
      const stripeSession = await stripe.paymentIntents.create({
        amount: body.amount,
        currency: 'usd',
        payment_method_types: ['card'],
        metadata: {
          userId: body.userId,
          checkedItems: JSON.stringify(body.checkedItems),
          amount: body.amount,
          userFullName: body.userFullName,
          userEmail: body.userEmail,
          userAddress: body.userAddress,
          uuid: body.uuid,
          selectedShippingId: body.selectedShippingId,
          selectedPromotionId: body.selectedPromotionId,
          selectedPaymentTypeId: body.selectedPaymentTypeId,
          addressId: body.addressId,
        },
      });
      // const orderItems = body.checkedItems.map((item: any) => ({
      //   quantity: item.quantity,
      //   sizeOptionName: item.selectedSize,
      //   productItemId: item.productItemId,
      //   variationId: item.variationId,
      //   price: item.price,
      //   productName: item.productName,
      // }));
      // try {
      //   const response = await postRequest({
      //     endPoint: '/api/v1/orders',
      //     formData: {
      //       orderTotal: orderItems.reduce(
      //         (sum: number, item: any) => sum + item.quantity,
      //         0
      //       ),
      //       note: 'Order note',
      //       paymentTypeId: body.selectedPaymentTypeId,
      //       shippingAddressId: body.addressId,
      //       shippingMethodId: body.selectedShippingId,
      //       promotionId: body.selectedPromotionId,
      //       orderLines: orderItems,
      //     },
      //     isFormData: false,
      //   });
      //   console.log('🚀 ~ POST ~ response:', response);
      // } catch (e) {
      //   console.log(e);
      //   return new Response('Unauthorized', { status: 401 });
      // }
      return new Response(
        JSON.stringify({ clientSecret: stripeSession.client_secret }),
        {
          status: 200,
        }
      );
    } catch (e) {
      console.log(e);
      return new Response('Unauthorized', { status: 401 });
    }
  } catch (e) {
    console.log(e);
  }
}
