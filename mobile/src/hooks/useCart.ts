// 'use client';

// import {useCallback} from 'react';
// import {useAppToastMessage} from '@hooks/app/useAppToastMessage';
// import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
// import {getStringStorage} from 'src/functions/storageFunctions';
// import {
//   deleteRequest,
//   getRequest,
//   putRequest,
//   postRequest,
// } from '@configs/fetch';

// export const useCart = () => {
//   // Lay userId cua user
//   const userId = getStringStorage('id');
//   const {showToast} = useAppToastMessage();

//   const fetchUserCart = async () => {
//     console.log('🚀 ~ fetchUserCart ~ userId:', userId);
//     // Shopping Cart
//     const userShoppingCart = await getRequest({
//       endPoint: `/api/v1/users/${userId}/cart-items/filter-and-sort?PageIndex=1&PageSize=100`,
//     });
//     console.log('🚀 ~ fetchUserCart ~ userShoppingCart:', userShoppingCart);

//     return userShoppingCart.value.items;
//   };

//   const {
//     data: userCart,
//     refetch,
//     isLoading,
//   } = useQuery({
//     queryKey: ['useCart'],
//     queryFn: () => fetchUserCart(),
//   });
//   console.log('🚀 ~ useCart ~ userCart:', userCart);

//   const cart = userId ? (isLoading ? null : userCart) : [];

//   const queryClient = useQueryClient();

//   // const addToCartMutationFn = async ({ data, selectedSize, quantity }: { data: any; selectedSize: any; quantity: number }) => {
//   //   console.log('🚀 ~ updateCartMutationFn ~ quantity:', quantity);
//   //   console.log('🚀 ~ updateCartMutationFn ~ selectedSize:', selectedSize);
//   //   console.log(
//   //     '🚀 ~ file: useCart.ts:126 ~ updateCartMutationFn ~ data:',
//   //     data
//   //   );
//   //   const response = await postRequest({
//   //     endPoint: `/api/v1/cart-items`,
//   //     formData: {
//   //       quantity: quantity,
//   //       productItemId: data.activeObject.activeProductItem.id,
//   //       variationId: selectedSize.variationId,
//   //     },

//   //     isFormData: false,
//   //   });
//   //   console.log('🚀 ~ addToCartMutationFn ~ response:', response);

//   //   if (!response.isSuccess) {
//   //     throw new Error('Failed to add to cart');
//   //   }

//   //   /// Trường hợp out of stock
//   //   if (response.status === 201) {
//   //     showToast('error', "Out of Stock")
//   //   }

//   //   return response.data;
//   // };

//   // const addToCartMutation = useMutation({
//   //   mutationKey: ['onAddToCart'],
//   //   mutationFn: addToCartMutationFn,
//   //   onError: (error) => {
//   //     console.log('🚀 ~ useCart ~ error:', error);
//   //   },
//   //   onSettled: (data, error) => {
//   //     if (error) {
//   //       console.log('Mutation failed with error:', error);
//   //     } else {
//   //       queryClient.invalidateQueries({ queryKey: ['useCart'] });
//   //     }
//   //   },
//   // });
//   // const onAddToCart = ({ data, selectedSize, quantity }: { data: any; selectedSize: any; quantity: number }) => {
//   //     try {
//   //       addToCartMutation.mutate({ data, selectedSize, quantity });
//   //       console.log('So luong them', quantity);
//   //     } catch (error) {
//   //       console.error(error);
//   //     }

//   // };

//   // const updateCartMutationFn = async ({ data, selectedSize, quantity }: { data: any; selectedSize: any; quantity: number }) => {
//   //   const response = await putRequest({
//   //     endPoint: `/api/v1/cart-items`,
//   //     formData: {
//   //       quantity: quantity,
//   //       productItemId: data.cartItem.productItemId,
//   //       variationId: data.cartItem.variationId,
//   //     },
//   //     isFormData: false,
//   //   });
//   //   console.log('🚀 ~ updateCartMutationFn ~ response:', response);
//   //   if (response.status < 200 || response.status >= 300) {
//   //     throw new Error('Failed to update cart');
//   //   }

//   //   /// Trường hợp out of stock
//   //   if (response.status === 201) {
//   //     showToast('error', "Out of Stock")
//   //   }
//   //   queryClient.invalidateQueries({ queryKey: ['useCart'] });

//   //   return response.data;
//   // };
//   // const updateCartMutation = useMutation<any, Error, { data: any; selectedSize: any; quantity: number }>({
//   //   mutationFn: updateCartMutationFn,
//   //   onError: (error) => {
//   //     console.error(error);
//   //   },
//   //   onSettled: (data, error) => {
//   //     if (error) {
//   //       console.error('Mutation failed with error:', error);
//   //     } else {
//   //       queryClient.invalidateQueries({ queryKey: ['useCart'] });
//   //     }
//   //   },
//   // });
//   // const onUpdateCart = ({ data, selectedSize, quantity }: { data: any; selectedSize: any; quantity: number }) => {
//   //   if (userId) {
//   //     updateCartMutation.mutate({ data, selectedSize, quantity });
//   //     console.log('So luong them', quantity);
//   //   } else {
//   //     console.log('So luong them', quantity);
//   //   }
//   // };

//   // const onIncreaseItemFromCart = useCallback(async ({ data, selectedSize }: { data: any; selectedSize: any }) => {
//   //     try {
//   //       // const user = userId?.user as User;
//   //       addToCartMutation.mutate({ data, selectedSize, quantity: 1 });
//   //     } catch (error) {
//   //       console.error(error);
//   //     }

//   // }, []);

//   // const onDecreaseItemFromCart = useCallback(async ({ data, selectedSize }: { data: any; selectedSize: any }) => {
//   //     try {
//   //       addToCartMutation.mutate({ data, selectedSize, quantity: -1 });
//   //     } catch (error) {
//   //       console.error(error);
//   //     }

//   // }, []);

//   // const deleteItemFromCartMutation = useMutation<
//   //   any,
//   //   Error,
//   //   { data: any;}
//   // >(
//   //   async ({ data }: { data: any}) => {
//   //     const response = await deleteRequest({
//   //       endPoint: `/api/v1/cart-items/delete-by-id`,
//   //       formData: {
//   //         productItemId: data.cartItem.productItemId,
//   //         variationId: data.cartItem.variationId,
//   //       },
//   //     });

//   //     if (response.status !== 200) {
//   //       throw new Error('Failed to delete item from cart');
//   //     }

//   //     return response.data;
//   //   },
//   //   {
//   //     onError: (error) => {
//   //       console.error(error);
//   //     },
//   //     onSuccess: () => {
//   //       queryClient.invalidateQueries({ queryKey: ['useCart'] });
//   //     },
//   //     onSettled: () => {
//   //       queryClient.invalidateQueries({ queryKey: ['useCart'] });
//   //     },
//   //   }
//   // );

//   // const onDeleteItemFromCart = ({
//   //   data,
//   // }: {
//   //   data: any;
//   //   selectedSize: any;
//   //   quantity: any;
//   // }) => {
//   //     deleteItemFromCartMutation.mutate(
//   //       { data, },
//   //       {
//   //         onSuccess: () => {
//   //           queryClient.invalidateQueries({ queryKey: ['useCart'] });
//   //         },
//   //         onError: (error) => {
//   //           queryClient.invalidateQueries({ queryKey: ['useCart'] });
//   //           console.log(error, 'Error delete item from cart mutation');
//   //         },
//   //       }
//   //     );
//   //     console.log('Da xoa', data);

//   // };

//   return {
//     // onAddToCart,
//     // onIncreaseItemFromCart,
//     // onDecreaseItemFromCart,
//     // onDeleteItemFromCart,
//     cart,
//     refetch,
//     // onUpdateCart,
//     // isAddingToCart: addToCartMutation.isPending,
//     // successAdded: addToCartMutation.isSuccess,
//   };
// };

import {useState, useEffect} from 'react';
import {useQueryClient, useMutation} from '@tanstack/react-query';
import {
  postRequest,
  putRequest,
  deleteRequest,
  getRequest,
} from '@configs/fetch';
import {useAppToastMessage} from '@hooks/app/useAppToastMessage';
import {getStringStorage} from 'src/functions/storageFunctions';

export const useCart = () => {
  const queryClient = useQueryClient();
  const {showToast} = useAppToastMessage();
  const [cart, setCart] = useState([]);
  const userId = getStringStorage('id');

  const fetchUserCart = async () => {
    try {
      const response = await getRequest({
        endPoint: `/api/v1/users/${userId}/cart-items/filter-and-sort?PageIndex=1&PageSize=100`,
      });
      console.log('🚀 ~ fetchUserCart ~ response:', response);
      setCart(response.data.value.items);
    } catch (error) {
      console.error('Error fetching user cart:', error);
    }
  };

  useEffect(() => {
    fetchUserCart();
  }, []);

  const addToCartMutation = useMutation({
    mutationFn: async ({data, selectedSize, quantity}) => {
      const response = await postRequest({
        endPoint: `/api/v1/cart-items`,
        formData: {
          quantity,
          productItemId: data.activeObject.activeProductItem.id,
          variationId: selectedSize.variationId,
        },
        isFormData: false,
      });

      if (!response.isSuccess) {
        throw new Error('Failed to add to cart');
      }

      if (response.status === 201) {
        showToast('error', 'Out of Stock');
      }

      return response.data;
    },
    onError: error => {
      console.error('Error adding to cart:', error);
    },
    onSettled: () => {
      queryClient.refetchQueries(['useCart']);
    },
  });

  const onAddToCart = ({data, selectedSize, quantity}) => {
    addToCartMutation.mutate({data, selectedSize, quantity});
  };

  return {
    cart,
    onAddToCart,
    isAddingToCart: addToCartMutation.isLoading,
    successAdded: addToCartMutation.isSuccess,
  };
};
