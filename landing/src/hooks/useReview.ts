import { getRequest, postRequest } from '@/lib/fetch';
import { useImage } from './useImage';

export const useReview = () => {
  const { onUploadImage } = useImage();

  const onGetProductReview = async (productId, page) => {
    if (!productId) return [];
    const productReview = await getRequest({
      endPoint: `/api/v1/products/${productId}/reviews/filter-and-sort?PageIndex=${page}&PageSize=8`,
    });
    return productReview.value.items;
  };

  const onPostProductReview = async (data) => {
    console.log('🚀 ~ onPostProductReview ~ data:', data);
    const formData1 = new FormData();
    data.files.forEach((file) => {
      formData1.append('images', file);
    });
    const image = await onUploadImage({
      formData: formData1,
      callback: () => {},
    });
    const reviewImages = image.map((imgUrl) => ({
      imageUrl: imgUrl,
      reviewId: data.reviewId || '3fa85f64-5717-4562-b3fc-2c963f66afa6', // Use a default or generated reviewId if not provided
    }));

    const productReviewBody = {
      ratingValue: data.rating,
      comment: data.text,
      userId: data.userId,
      orderedLineId: data.orderedLineId,
      reviewImages: reviewImages,
    };

    const productReview = await postRequest({
      endPoint: '/api/v1/reviews',
      formData: productReviewBody,
      isFormData: false,
    });
    console.log('🚀 ~ onPostProductReview ~ productReview:', productReview);
    return productReview;
  };

  const onGetProductReviewRating = async (productId) => {
    const productReviewRating = await getRequest({
      endPoint: `/api/product/user-review/rating?productId=${productId}`,
    });

    return productReviewRating;
  };
  return { onGetProductReview, onPostProductReview, onGetProductReviewRating };
};
