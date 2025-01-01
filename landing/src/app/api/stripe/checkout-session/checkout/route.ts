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
          // checkedItems: JSON.stringify(body.checkedItems),
          // amount: body.amount,
          // userFullName: body.userFullName,
          // userEmail: body.userEmail,
          // userAddress: body.userAddress,
          // uuid: body.uuid,
          // selectedShippingId: body.selectedShippingId,
          // selectedPromotionId: body.selectedPromotionId,
          // selectedPaymentTypeId: body.selectedPaymentTypeId,
          // addressId: body.addressId,
        },
      });
      return new Response(
        JSON.stringify({ clientSecret: stripeSession.client_secret }),
        {
          status: 200,
        }
      );
    } catch (e) {
      console.log('🚀 ~ POST ~ e:', e);
      return new Response('Unauthorized', { status: 401 });
    }
  } catch (e) {
    console.log(e);
  }
}
