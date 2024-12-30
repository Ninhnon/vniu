'use client';
import ProductDetailRight from './ProductDetailRight';
import ProductUserMayLike from './ProductUserMayLike';
import ProductReview from './ProductReview';
import AddProductDialog from '../../(home)/AddProductDialog';
import { useState, useEffect, useMemo, use } from 'react';
import ProductDetailLeft from './ProductDetailLeft';
import { useProduct } from '@/hooks/useProduct';
import React from 'react';

function page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { onGetProductDetail } = useProduct();
  const [data, setData] = useState(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  useEffect(() => {
    if (slug) {
      const fetchProductDetail = async () => {
        try {
          const productDetail = await onGetProductDetail({
            slug: slug,
          });
          setData(productDetail);
        } catch (err) {
          setError('Failed to fetch product details');
        }
      };
      fetchProductDetail();
    }
  }, []);

  const handleColorSelect = async (colourId: string) => {
    try {
      if (slug) {
        const productDetail = await onGetProductDetail({
          slug: slug,
          colourId,
        });
        setData(productDetail);
        setSelectedColor(colourId);
      }
    } catch (err) {
      setError('Failed to fetch product details for the selected color');
    }
  };

  return (
    <div className="w-full md:py-20 overflow-hidden">
      <div
        className="w-full flex-col max-w-[1280px] px-5
  md:px-10 mx-auto"
      >
        <div className="flex flex-col lg:flex-row gap-[50px] lg:gap-[100px] ">
          <div className=" w-full md:w-auto flex-[1.2] max-w-[500px] lg:max-w-full lg:mx-0">
            <ProductDetailLeft data={data} />
          </div>

          <div className="flex-[0.8] py-5">
            <ProductDetailRight
              data={data}
              selectedColor={selectedColor}
              handleColorSelect={handleColorSelect}
              // selectedItem={selectedItem}
              // setSelectedItem={setSelectedItem}
            />
          </div>
        </div>
        <div>
          <ProductReview product={data} />
        </div>
        {/* <div>
          <ProductUserMayLike data={data} />
        </div> */}
      </div>

      <AddProductDialog />
    </div>
  );
}

export default page;
