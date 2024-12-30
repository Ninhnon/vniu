import { Image } from '@nextui-org/react';

const OrderItem = ({ order }) => {
  console.log('🚀 ~ OrderItem ~ order:', order);
  return (
    <div className="w-60 h-48 flex flex-col justify-between gap-3 border-1 rounded-md p-3 m-2">
      <div className="w-full h-[80%] flex flex-row justify-between gap-3">
        <div className="w-[50%] h-[80%]">
          <Image
            src={order?.imageUrl}
            alt={order?.productName}
            width={100}
            height={100}
          />
        </div>
        <div className="w-full h-[70%] flex flex-col font-bold">
          <div className="flex flex-col gap-y-2 items-end">
            <div className="text-sm">{order?.productName}</div>
            <div className="text-sm">
              Price: {order?.price?.toLocaleString()} USD
            </div>
            <div className="text-sm">Quantity: {order?.quantity}</div>
          </div>
        </div>
      </div>
      <div className="h-[15%] font-bold flex flex-row justify-between">
        <span>Total:</span>
        <span className="text-green-300">
          {(order?.quantity * order?.price)?.toLocaleString()} VND
        </span>
      </div>
    </div>
  );
};

export default OrderItem;
