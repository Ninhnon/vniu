'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/useCart';
import { currencyFormat } from '@/lib/utils';
import Link from 'next/link';
import React, { use, useEffect, useState } from 'react';
import CheckoutModal from './checkout/CheckoutModal';
import { getRequest } from '@/lib/fetch';
import { Select, SelectItem } from '@nextui-org/react';

function RightCart({ checkedItems }) {
  const { cart } = useCart();
  const [total, setTotal] = useState(0);
  const [totalFirst, setTotalFirst] = useState(0);

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(new Set([]));
  const [selectedPromotion, setSelectedPromotion] = useState(new Set([]));
  const [selectedPaymentType, setSelectedPaymentType] = useState(new Set([]));
  const [selectedShippingValue, setSelectedShippingValue] = useState();
  const [selectedPromotionValue, setSelectedPromotionValue] = useState();
  const [shippingTouched, setShippingTouched] = React.useState(false);
  const [promotionTouched, setPromotionTouched] = React.useState(false);
  const [paymentTypeTouched, setPaymentTypeTouched] = React.useState(false);
  const [promotionPrice, setPromotionPrice] = useState(0);
  const [selectedPaymentTypeValue, setSelectedPaymentTypeValue] = useState();

  useEffect(() => {
    const newTotal = Object.values(checkedItems)
      .filter((item) => item !== null) // Filter out selected items
      .reduce(
        (sum: number, item: any) => sum + item.data.salePrice * item.quantity,
        0
      );

    setTotalFirst(newTotal);
    setTotal(newTotal);
  }, [checkedItems]);
  useEffect(() => {
    const totalSale = (totalFirst * selectedPromotionValue?.discountRate) / 100;
    setPromotionPrice(totalSale);
  }, [selectedPromotionValue, totalFirst]);
  useEffect(() => {
    const finalTotal =
      totalFirst - promotionPrice + selectedShippingValue?.price;
    setTotal(finalTotal);
  }, [selectedShippingValue, totalFirst, promotionPrice]);

  useEffect(() => {
    const fetchShippingMethods = async () => {
      const res = await getRequest({
        endPoint: '/api/v1/shipping-methods?PageIndex=1&PageSize=8',
      });

      setShippingMethods(res.value.items);
    };

    const fetchPromotions = async () => {
      const res = await getRequest({
        endPoint: '/api/v1/promotions?PageIndex=1&PageSize=8',
      });
      setPromotions(res.value.items);
    };

    const fetchPaymentTypes = async () => {
      const res = await getRequest({
        endPoint: '/api/v1/payment-types?PageIndex=1&PageSize=8',
      });
      setPaymentTypes(res.value.items);
    };

    fetchShippingMethods();
    fetchPromotions();
    fetchPaymentTypes();
  }, []);

  useEffect(() => {
    if (selectedShipping) {
      const shippingArray = Array.from(selectedShipping);
      setSelectedShippingValue(
        shippingMethods.find((method) => method.id === shippingArray?.[0])
      );
    }
  }, [selectedShipping]);

  useEffect(() => {
    if (selectedPromotion) {
      const promotionArray = Array.from(selectedPromotion);
      setSelectedPromotionValue(
        promotions.find((promo) => promo.id === promotionArray?.[0])
      );
    }
  }, [selectedPromotion]);

  useEffect(() => {
    if (selectedPaymentType) {
      const paymentTypeArray = Array.from(selectedPaymentType);
      setSelectedPaymentTypeValue(
        paymentTypes.find((type) => type.id === paymentTypeArray?.[0])
      );
    }
  }, [selectedPaymentType]);

  const isShippingValid = selectedShipping.size > 0;
  const isPromotionValid = selectedPromotion.size > 0;
  const isPaymentTypeValid = selectedPaymentType.size > 0;

  return (
    <div className="sticky bottom-0 lg:top-[100px] z-20 bg-white lg:bg-transparent">
      <h2 className="text-lg font-semibold">Summary</h2>
      <div className="grid gap-1.5 lg:gap-4 pr-6 text-sm ">
        <Separator className="mb-2" />
        <div className="flex">
          <span className="flex-1">Shipping</span>
          <Select
            key={'shipping'}
            label="Shipping Method"
            className="flex-1"
            selectedKeys={selectedShipping}
            onSelectionChange={(keys) => {
              setSelectedShipping(keys);
            }}
            isInvalid={isShippingValid || !shippingTouched ? false : true}
            errorMessage={
              isShippingValid || !shippingTouched
                ? ''
                : 'Please select a shippng method'
            }
            aria-label="Select Shipping Method"
            autoFocus={false}
            onClose={() => setShippingTouched(true)}
          >
            {shippingMethods.map((method) => (
              <SelectItem
                key={method.id}
                value={method.id}
                textValue={`${method.name} - ${method.price}$`}
              >
                {`${method.name} - ${method.price}$`}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="flex">
          <span className="flex-1">Promotion</span>
          <Select
            key={'promotion'}
            label="Promotion"
            className="flex-1"
            selectedKeys={selectedPromotion}
            onSelectionChange={setSelectedPromotion}
            isInvalid={isPromotionValid || !promotionTouched ? false : true}
            errorMessage={
              isPromotionValid || !promotionTouched
                ? ''
                : 'Please select a promotion'
            }
            aria-label="Select Promotion"
            autoFocus={false}
            onClose={() => setPromotionTouched(true)}
          >
            {promotions.map((promo) => (
              <SelectItem
                key={promo.id}
                value={promo.id}
                textValue={`${promo.name} - ${promo.discountRate}% off`}
              >
                {promo.name} - {promo.discountRate}% off
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="flex">
          <span className="flex-1">Payment Type</span>
          <Select
            key={'payment'}
            label="Payment Type"
            className="flex-1"
            selectedKeys={selectedPaymentType}
            onSelectionChange={setSelectedPaymentType}
            aria-label="Select Payment Type"
            isInvalid={isPaymentTypeValid || !paymentTypeTouched ? false : true}
            errorMessage={
              isPaymentTypeValid || !paymentTypeTouched
                ? ''
                : 'Please select a payment type'
            }
            autoFocus={false}
            onAbort={() => setPaymentTypeTouched(true)}
          >
            {paymentTypes.map((type) => (
              <SelectItem key={type.id} value={type.id} textValue={type.name}>
                {type.name}
              </SelectItem>
            ))}
          </Select>
        </div>
        <Separator className="mt-2" />
        <div className="flex">
          <span className="flex-1">Total Prices</span>
          <span>{currencyFormat(totalFirst)}</span>
        </div>

        <div className="flex">
          <span className="flex-1">Fee shipping</span>
          <span>{currencyFormat(selectedShippingValue?.price || 0)}</span>
        </div>
        <div className="flex">
          <span className="flex-1">Sale promotion</span>
          <span className="text-green-500 underline">
            {currencyFormat(promotionPrice)}
          </span>
        </div>
        <div className="flex">
          <span className="flex-1">Total</span>
          <span>{currencyFormat(total)}</span>
        </div>
        <div>
          <Button
            className="w-full h-full"
            disabled={
              total === 0 ||
              !Object.values(checkedItems).length ||
              !selectedShippingValue ||
              !selectedPromotionValue ||
              !selectedPaymentTypeValue
            }
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            Checkout
          </Button>

          {isModalOpen && (
            <div>
              <CheckoutModal
                checkedItems={checkedItems}
                total={total}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                selectedShipping={selectedShippingValue}
                selectedPromotion={selectedPromotionValue}
                selectedPaymentType={selectedPaymentTypeValue}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RightCart;
