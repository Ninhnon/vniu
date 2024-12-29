'use client';

import React, { useEffect } from 'react';

import { Select, SelectItem } from '@nextui-org/react';
import { Web3Checkout } from './childComponents/Web3Checkout';
import { StripeCheckout } from './childComponents/StripeCheckout';
import VnPayCheckout from './childComponents/VnPayCheckout';
import { Button } from '@/components/ui/button';
const checkOutConst = [
  { value: 'Cash On Delivery' },
  { value: 'Paypal' },
  { value: 'Stripe' },
  { value: 'Blockchain Wallet' },
  { value: 'VnPay' },
];
export const PaymentForm = ({
  checkedItems,
  total,
  userFullName,
  userAddress,
  userEmail,
  selectedPaymentType,
  selectedShipping,
  selectedPromotion,
  addressId,
}) => {
  const [isTest, setIsTest] = React.useState(false);

  const [selectedType, setSelectedType] = React.useState(new Set([]));
  const [typeTouched, setTypeTouched] = React.useState(false);
  const [method, setMethod] = React.useState('');
  const isTypeValid = selectedType.size > 0;
  useEffect(() => {
    if (selectedType) {
      const paymentMethodArray = Array.from(selectedType);
      setMethod(paymentMethodArray?.[0]);
    }
  }, [selectedType]);

  const handleToggle = () => {
    setIsTest(!isTest);
  };
  return (
    <div className="w-full h-full px-1">
      <div className="flex justify-end">
        <button className="text-blue-500" onClick={handleToggle} type="button">
          {isTest ? 'Hide' : 'Show'}
        </button>
      </div>
      {isTest && (
        <div className="w-full h-full px-1">
          <Select
            key={'method'}
            radius={'md'}
            label="Payment Method"
            isInvalid={isTypeValid || !typeTouched ? false : true}
            errorMessage={
              isTypeValid || !typeTouched
                ? ''
                : 'Please select a payment method'
            }
            autoFocus={false}
            placeholder="Select payment method"
            selectedKeys={selectedType}
            onSelectionChange={(keys) => {
              setSelectedType(keys);
            }}
            onClose={() => setTypeTouched(true)}
            className="max-w-xs lg:max-w-lg"
          >
            {checkOutConst?.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.value.toString()}
              </SelectItem>
            ))}
          </Select>
          {method === 'Cash on Delivery' && (
            <Button
              className="text-2xl text-center font-bold mt-5"
              onClick={() => {
                console.log('Cash on Delivery');
              }}
            >
              Cash on Delivery
            </Button>
          )}
          {method === 'Paypal' && (
            <div className="text-2xl text-center font-bold mt-5">Paypal</div>
          )}
          {method === 'Stripe' && (
            <StripeCheckout
              userAddress={userAddress}
              userFullName={userFullName}
              userEmail={userEmail}
              checkedItems={checkedItems}
              total={total}
              selectedPaymentType={selectedPaymentType}
              selectedShipping={selectedShipping}
              selectedPromotion={selectedPromotion}
              addressId={addressId}
            />
          )}
          {method === 'Blockchain Wallet' && <Web3Checkout />}
          {method === 'VnPay' && (
            <VnPayCheckout checkedItems={checkedItems} total={total} />
          )}
        </div>
      )}
      {selectedPaymentType.name === 'Cash on Delivery' && (
        <div className="text-2xl text-center font-bold mt-5">
          Cash on Delivery
        </div>
      )}
      {selectedPaymentType.name === 'Paypal' && (
        <div className="text-2xl text-center font-bold mt-5">Paypal</div>
      )}
      {selectedPaymentType.name === 'Stripe' && (
        <StripeCheckout
          userAddress={userAddress}
          userFullName={userFullName}
          userEmail={userEmail}
          checkedItems={checkedItems}
          total={total}
          selectedPaymentType={selectedPaymentType}
          selectedShipping={selectedShipping}
          selectedPromotion={selectedPromotion}
          addressId={addressId}
        />
      )}
      {/* {method === 'Blockchain Wallet' && <Web3Checkout />} */}
      {selectedPaymentType.name === 'VNPay' && (
        <VnPayCheckout checkedItems={checkedItems} total={total} />
      )}
    </div>
  );
};
