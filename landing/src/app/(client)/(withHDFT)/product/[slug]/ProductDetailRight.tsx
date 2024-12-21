'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { currencyFormat, parseJSON } from '@/lib/utils';
import React, { use, useEffect, useState } from 'react';
import { IoMdHeartEmpty } from 'react-icons/io';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import Image from 'next/legacy/image';
import { useCart } from '@/hooks/useCart';
import { useSelectedProduct } from '@/hooks/useSelectedProduct';

function ProductDetailRight({ data, selectedColor, handleColorSelect }) {
  const [showError, setShowError] = useState(false);
  const [selectedSize, setSelectedSize] = useState<{
    sizeOptionName: string;
    sizeOptionQuantityInStock: number;
  } | null>(null);

  const { onSelectProduct, onToggleDialog } = useSelectedProduct();

  const { cart } = useCart();
  return (
    <div className="flex-[1] py-3">
      {/* Product Title */}
      <div className="text-[34px] font-semibold mb-2 leading-tight">
        {data?.name}
      </div>

      {/* Product Subtitle */}
      <div className="text-lg font-semibold mb-5">{data?.description}</div>

      {/* Product size */}

      <div className="mb-10">
        {/* Heading */}
        <div className="flex justify-between mb-2">
          <div className="text-md font-semibold">Choose Color</div>
          <div className="text-md font-medium text-black/[0.5] cursor pointer">
            Color
          </div>
        </div>
        {/* Heading */}

        {/* Size start */}
        <div id="coloursGrid" className="grid grid-cols-3 gap-2">
          {data?.colours?.map((colour, index) => (
            <div
              onClick={() => {
                console.log('🚀 ~ ProductDetailRight ~ colour:', colour);

                handleColorSelect(colour.id);
                setShowError(false);
              }}
              key={index}
              className={`border-2 rounded-md text-center py-2.5 font-medium hover:bg-slate-300 cursor-pointer ${'hover:border-black cursor-pointer'} ${
                selectedColor === colour.id ? 'border-black' : ''
              } `}
              style={{
                backgroundColor: colour.hexCode,
                color: colour.hexCode?.includes('000000') ? 'white' : 'black',
              }}
            >
              {colour.name}
            </div>
          ))}
        </div>
        {/* Size end */}

        {/* Show error */}
        {showError && !selectedColor && (
          <div className="text-red-600 mt-1">Please choose colour</div>
        )}
        {/* Show error */}
      </div>
      {/* Product Price */}
      {data?.activeObject?.activeProductItem?.salePrice && (
        <div className="text-lg font-semibold ">
          {currencyFormat(data?.activeObject?.activeProductItem?.salePrice)}
        </div>
      )}

      {data?.activeObject?.activeProductItem?.originalPrice && (
        <div>
          <p className="text-base font-medium line-through ">
            {currencyFormat(
              data?.activeObject?.activeProductItem?.originalPrice
            )}
          </p>
          <p className="ml-auto text-base font-medium text-green-500">
            {' '}
            12% off
          </p>
        </div>
      )}
      {/* Size start */}
      <div id="sizesGrid" className="grid grid-cols-3 gap-2">
        {data?.activeObject?.activeSizeOptionAndQuantityInStocks?.map(
          (size, index) => (
            <div
              onClick={
                size.sizeOptionQuantityInStock > 0
                  ? () => {
                      setSelectedSize(size);
                      setShowError(false);
                    }
                  : () => {}
              }
              key={index}
              className={`border-2 rounded-md text-center py-2.5 font-medium
    hover:bg-slate-300 
      cursor-pointer ${
        size.number > 0
          ? 'hover:border-black cursor-pointer'
          : 'cursor-not-allowed disabled bg-black/[0.1] opacity-50'
      } ${
                selectedSize?.sizeOptionName === size.sizeOptionName
                  ? 'border-black'
                  : ''
              } `}
            >
              {size.sizeOptionName}
              {' - '}
              {size.sizeOptionQuantityInStock > 0
                ? `(${size.sizeOptionQuantityInStock})`
                : '0'}
            </div>
          )
        )}
      </div>
      {/* Size end */}
      <div className="flex flex-col gap-2 w-full items-center justify-center">
        {/* Product size */}
        {selectedColor ? (
          <Button
            className="w-full py-4 rounded-full bg-black text-white text-lg mt-2
                  font-medium transition-transform active:scale-95 mb-3 hover:opacity-75
                  "
            onClick={() => {
              console.log('🚀 ~ ProductDetailRight ~ data:', data);
              onSelectProduct({ data: data });
              onToggleDialog();
            }}
          >
            Add to Cart
          </Button>
        ) : (
          <div className="w-full flex">
            <Button
              className="w-full py-4  rounded-full bg-black text-white text-lg
        font-medium transition-transform active:scale-95 mb-3 hover:opacity-75"
              onClick={() => {
                if (!selectedColor) {
                  setShowError(true);
                  document.getElementById('coloursGrid')?.scrollIntoView({
                    block: 'center',
                    behavior: 'smooth',
                  });
                }
              }}
            >
              Add to Cart
            </Button>
          </div>
        )}
      </div>

      <div>
        <div className="text-lg font-bold mb-5">Details</div>
        <div className="markdown text-md mb-5">{data?.description}</div>
      </div>
    </div>
  );
}

export default ProductDetailRight;
