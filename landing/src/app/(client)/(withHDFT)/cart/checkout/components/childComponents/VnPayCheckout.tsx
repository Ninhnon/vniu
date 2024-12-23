import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { postRequest } from '@/lib/fetch';
import React, { useEffect, useState } from 'react';

const VnPayCheckout = ({ checkedItems, total }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [paymentUrl, setPaymentUrl] = useState('');
  useEffect(() => {
    const getPaymentUrl = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/vnpay/checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            total,
            checkedItems,
          }),
        }
      );

      console.log(
        '🚀 ~ file: VnPayCheckout.tsx:16 ~ getPaymentUrl ~ res:',
        res
      );
      setIsLoading(false);
      setPaymentUrl(res?.vnpUrl);
    };
    getPaymentUrl();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-full flex">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex">
      <Button
        onClick={() => {
          window.open(paymentUrl, '_blank');
        }}
      >
        Open VnPay
      </Button>
    </div>
  );
};

export default VnPayCheckout;
