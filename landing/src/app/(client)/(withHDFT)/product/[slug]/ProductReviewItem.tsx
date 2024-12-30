'use client';

import ReviewDetail from '@/components/ReviewDetail';

import React from 'react';
import { Pagination, Skeleton } from '@nextui-org/react';
const ProductReviewItem = ({
  reviewItemData,
  currentPage,
  setCurrentPage,
  isFetched,
}) => {
  const ref = React.useRef(null);

  //Set page state when change review page index
  const onPageChange = (page) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
    setCurrentPage(page);
  };

  return (
    <div ref={ref} className="pt-4">
      <div className="z-40 space-y-2 pt-4 flex flex-col items-center">
        <div className="flex flex-col w-full gap-y-3 items-center">
          {isFetched
            ? reviewItemData?.map((item, index) => (
                <div className="p-1 w-full" key={`review-${index}`}>
                  <ReviewDetail data={item} />
                </div>
              ))
            : [1, 2, 3].map((item) => (
                <div className="p-1 w-full" key={`skeleton-${item}`}>
                  <Skeleton className="rounded" disableAnimation>
                    <ReviewDetail data={{ title: 'ABCDEF' }} />
                  </Skeleton>
                </div>
              ))}
        </div>
        {/* {reviewItemData ? (
          <div></div>
        ) : (
          <Pagination
            showControls
            total={reviewItemData?.totalPages}
            initialPage={1}
            onChange={(page) => {
              onPageChange(page);
            }}
            page={currentPage}
          />
        )} */}
      </div>
    </div>
  );
};

export default ProductReviewItem;
