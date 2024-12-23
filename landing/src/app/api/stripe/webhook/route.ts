// import prisma from '@/lib/prisma';
import { postRequest } from '@/lib/fetch';
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import type Stripe from 'stripe';

export async function POST(request: Request) {
  const body = await request.text();

  const signature = (headers().get('Stripe-Signature') as string) ?? '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature.toString(),
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err) {
    console.log(err?.message);
    return new Response(
      `Webhook Error: ${err instanceof Error ? err.message : 'Unknown Error'}`,
      { status: 400 }
    );
  }

  const session = event.data.object as Stripe.Checkout.Session;
  console.log('🚀 ~ file: route.ts:29 ~ POST ~ event.type:', event.type);

  // if (!session?.metadata?.userId) {
  //   return new Response(null, {
  //     status: 200,
  //   });
  // }
  console.log(event.type);

  // if (event.type === 'payment_intent.succeeded') {
  //   console.log('metadataaaaaaaaaaaaaaaaaaaaaaaaa');

  //   console.log(
  //     '🚀 ~ file: route.ts:109 ~ POST ~ session.metadata:',
  //     session.metadata
  //   );
  // }
  if (event.type === 'charge.succeeded') {
    console.log('metadataaaaaaaaaaaaaaaaaaaaaaaaa');

    const {
      userId,
      userFullName,
      checkedItems,
      userEmail,
      userAddress,
      amount,
      uuid,
      selectedShippingId,
      selectedPromotionId,
      selectedPaymentTypeId,
      addressId,
    } = session.metadata;
    const orderItems = JSON.parse(checkedItems).map((item: any) => ({
      quantity: item.quantity,
      sizeOptionName: item.selectedSize,
      productItemId: item.productItemId,
      variationId: item.variationId,
      price: item.price,
      productName: item.productName,
    }));

    try {
      // const response = await postRequest({
      //   endPoint: '/api/v1/orders',
      //   formData: {
      //     orderTotal: orderItems.reduce(
      //       (sum: number, item: any) => sum + item.quantity,
      //       0
      //     ),
      //     note: 'Order note',
      //     paymentTypeId: selectedPaymentTypeId,
      //     shippingAddressId: addressId,
      //     shippingMethodId: selectedShippingId,
      //     promotionId: selectedPromotionId,
      //     orderLines: orderItems,
      //   },
      //   isFormData: false,
      // });
      // console.log('🚀 ~ POST ~ response:', response);
      // if (!response.ok) {
      //   throw new Error('Network response was not ok');
      // }
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
    console.log('🚀 ~ POST ~ session.metadata:', session.metadata);
    //TODO: create order => xong
  }
  return new Response(JSON.stringify('ok'), { status: 200 });
}
