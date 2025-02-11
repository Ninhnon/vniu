'use client';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import { BiArrowBack } from 'react-icons/bi';

function ProductDetailLeft({ data }) {
  return (
    <div className=" text-white text-[20px] w-full max-w-[1360px] sticky top-[50px]">
      <Carousel
        renderArrowNext={(onClickHandler) => (
          <div
            onClick={onClickHandler}
            className="absolute right-0 bottom-0 w-[30px] md:w-[50px]
                h-[30px] md:h-[50px] bg-black z-10 flex items-center justify-center cursor-pointer
                hover:opacity-90"
          >
            <BiArrowBack className="rotate-180 text-sm md:text-lg" />
          </div>
        )}
        renderArrowPrev={(onClickHandler) => (
          <div
            onClick={onClickHandler}
            className="absolute right-[31px] md:right-[51px] bottom-0 w-[30px] md:w-[50px]
                h-[30px] md:h-[50px] bg-black z-10 flex items-center justify-center cursor-pointer
                hover:opacity-90"
          >
            <BiArrowBack className="text-sm md:text-lg" />
          </div>
        )}
        infiniteLoop={true}
        showStatus={false}
        showIndicators={false}
        thumbWidth={60}
        className="productCarousel"
      >
        {data?.activeObject &&
        data?.activeObject?.activeProductImages.length() > 8
          ? data?.activeObject?.activeProductImages
              .slice(0, 8)
              .map((item, index) => (
                <div key={`${item.id}-${index}`}>
                  <img src={item.imageUrl} alt="product" />
                </div>
              ))
          : data?.activeObject?.activeProductImages
          ? data?.activeObject?.activeProductImages.map((item, index) => (
              <div key={`${item.id}-${index}`}>
                <img src={item.imageUrl} alt="product" />
              </div>
            ))
          : data?.productImages.slice(0, 3).map((item, index) => (
              <div key={`${item.id}-${index}`}>
                <img src={item.imageUrl} alt="product" />
              </div>
            ))}
      </Carousel>
    </div>
  );
}

export default ProductDetailLeft;
