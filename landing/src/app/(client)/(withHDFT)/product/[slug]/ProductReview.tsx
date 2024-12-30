'use client';
import React, { useState } from 'react';
import ProductReviewRating from './ProductReviewRating';
import ProductReviewForm from './ProductReviewForm';
import ProductReviewItem from './ProductReviewItem';
import { useQuery } from '@tanstack/react-query';
import { useReview } from '@/hooks/useReview';

const ProductReview = ({ product }) => {
  //State of current page for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const onSetCurrentPage = (page) => {
    setCurrentPage(page);
  };

  const { onGetProductReview } = useReview();
  const reviewDataQueryKey = ['productReview', product?.id, currentPage];
  const fetchReviewData = async () => {
    const fetchedReviewData = await onGetProductReview(
      product?.id,
      currentPage
    );
    return fetchedReviewData;
  };

  // Fetch review data
  const {
    data: reviewData,
    isFetched: isReviewDataFetched,
    refetch: refetchReviewData,
  } = useQuery(reviewDataQueryKey, fetchReviewData, {
    staleTime: 1000 * 60 * 1,
    keepPreviousData: true,
  });

  return (
    <div>
      <div className=" flex-col gap-1 mt-20 lg:mt-25 justify-center items-center flex text-[34px] font-semibold mb-2 leading-tight">
        Review
        <div className="w-full pt-2">
          <ProductReviewRating reviewRatingData={reviewData} />
        </div>
        {/* <div className="container w-full">
          <ProductReviewForm
            product={product}
            reviewItemRefetch={refetchReviewData}
          ></ProductReviewForm>
        </div> */}
      </div>
      <div className="w-full py-5">
        <ProductReviewItem
          reviewItemData={reviewData}
          currentPage={currentPage}
          setCurrentPage={onSetCurrentPage}
          isFetched={isReviewDataFetched}
        />
      </div>
    </div>
  );
};

export default ProductReview;
