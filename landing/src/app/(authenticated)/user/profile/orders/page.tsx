'use client';

import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { Zoom } from '@/components/ui/zoom-image';
import { getRequest, postRequest } from '@/lib/fetch';
import { currencyFormat } from '@/lib/utils';
import { Pagination } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { OrderDetail } from './OrderDetail';
import ProductReviewForm from './ProductReviewForm';

const page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const session = useSession();
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', session?.data?.user?.id],
    queryFn: async () => {
      if (!session?.data?.user?.id) return [];
      const res = await postRequest({
        endPoint: `/api/v1/users/${
          session?.data?.user?.id
        }/orders/filter-and-sort?PageSize=10&PageIndex=${1}`,
        formData: {
          orderStatusIds: [],
          paymentMethodIds: [],
          shippingMethodIds: [],
        },
        isFormData: false,
      });
      return res.value.items;
    },
    // refetchInterval: 1000,
    keepPreviousData: true,
  });
  useEffect(() => {
    if (!isLoading) {
      setTotalPages(1);
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  const handleOpenOrderDetail = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col px-10 gap-y-5 py-10">
      {orders?.map((item) => {
        return (
          <div className="flex flex-row gap-x-10" key={item?.id}>
            <Zoom>
              <img
                width={200}
                height={200}
                src={item?.orderLines?.[0]?.imageUrl}
              />
            </Zoom>
            <div className="flex flex-col gap-y-3">
              <div>Order id: {item?.id}</div>
              <div>Total: {currencyFormat(item?.orderTotal)}</div>
              <div>Status : {'pending'}</div>

              <OrderDetail data={item} />
              <div className="container w-full">
                <ProductReviewForm product={item} />
              </div>
            </div>
          </div>
        );
      })}

      <Pagination
        showControls
        total={orders?.totalPages}
        initialPage={1}
        onChange={(page) => {
          setCurrentPage(page);
        }}
        page={currentPage}
      />
    </div>
  );
};

export default page;
