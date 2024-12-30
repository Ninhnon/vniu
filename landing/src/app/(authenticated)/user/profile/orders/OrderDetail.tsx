/** @format */

import { useProduct } from '@/hooks/useProduct';
import { useQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Loader } from 'lucide-react';
import { Image } from '@nextui-org/react';
import DialogCustom from '@/components/ui/dialogCustom';
import OrderItem from './OrderItem';
import { DialogContent, DialogTrigger } from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';

export const OrderDetail = ({ data }: { data: any }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Details</Button>
      </DialogTrigger>
      <DialogContent>
        <div className="w-full flex flex-col border-3 p-1 rounded-md">
          <div className="flex flex-row justify-center items-center text-lg font-bold">
            ORDER INFORMATION
          </div>

          <div className="w-full h-fit flex flex-col justify-start">
            <div className="w-full h-fit flex flex-row justify-between border-t-1 border-b-1 p-4">
              <span className="font-bold ">ID: {data.id}</span>
              <span className="font-bold">
                Order Time: {new Date(data.createdDate).toLocaleString()}
              </span>
            </div>
            <div className="w-full h-fit flex flex-col border-b-1 p-4 gap-3">
              <span className="font-bold">CUSTOMER INFORMATION</span>

              {data.userId ? (
                <div className="w-full h-fit flex flex-row font-bold gap-3 items-center">
                  <Image src={data.user.avatarUrl} width={100} height={100} />
                  <div className="w-full h-fit flex flex-col font-bold">
                    <span>Customer ID: {data.user.id}</span>
                    <span>Customer Name: {data.user.fullName}</span>
                    <span>Customer Email: {data.user.email}</span>
                    <span className="max-w-[70ch]">
                      Shipping Address: {data.shippingAddressInformation}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-full h-fit flex flex-row font-bold gap-3 items-center">
                  <Image
                    src={'../../../../person.png'}
                    width={64}
                    height={64}
                  />
                  <div className="w-full h-fit flex flex-col">
                    <span className="font-bold">Guest</span>
                    <span className="font-bold">
                      Shipping Address: {data.address}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="w-full h-fit flex flex-col border-b-1 p-4 gap-3">
            <span className="font-bold">ORDER DETAILS</span>

            <Swiper
              style={
                {
                  '--swiper-pagination-bullet-inactive-color': '#999999',
                  '--swiper-pagination-color': '#000000',
                  '--swiper-pagination-bullet-size': '12px',
                  '--swiper-pagination-bullet-inactive-opacity': '0.2',
                  '--swiper-pagination-bullet-opacity': '1',
                  '--swiper-pagination-bullet-vertical-gap': '0px',
                  '--swiper-pagination-bullet-horizontal-gap': '6px',
                } as React.CSSProperties
              }
              direction="horizontal"
              navigation={true}
              pagination={{
                clickable: true,
              }}
              modules={[Pagination, Navigation]}
              breakpoints={{
                450: {
                  slidesPerView: 1,
                  spaceBetween: 50,
                },
                700: {
                  slidesPerView: 2,
                  spaceBetween: 50,
                },
                900: {
                  slidesPerView: 3,
                  spaceBetween: 50,
                },
              }}
              className="w-full h-auto overflow-visible relative flex items-center justify-center"
            >
              {data.orderLines.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="w-fit">
                    <OrderItem order={item} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="w-full h-fit flex flex-row justify-between font-bold text-lg">
            <div className="w-fit h-fit flex flex-row gap-3 font-bold">
              <span>Status:</span>
              {data.status === 'Pending' ? (
                <span className="text-yellow-300">Pending</span>
              ) : data.status === 'Shipping' ? (
                <span className="text-green-300">Shipping</span>
              ) : data.status === 'Completed' ? (
                <span className="text-green-500">Completed</span>
              ) : null}
            </div>

            <div className="w-fit h-fit flex flex-row gap-3 font-bold">
              <span>Total:</span>
              <span className="text-green-400">{data.orderTotal} USD</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
