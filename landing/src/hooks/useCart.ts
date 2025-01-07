'use client';

import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
// import { User } from '@/models';
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from '@/lib/fetch';
//dispatch, selector
import {
  addToCart,
  increaseItemFromCart,
  decreaseItemFromCart,
  deleteItemFromCart,
} from '@/redux/cart/cart';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useCart = () => {
  // Lay session cua user
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const reduxCart = useSelector((state: any) => state.cart) || null;

  const fetchUserCart = async () => {
    // Shopping Cart
    const userShoppingCart = await getRequest({
      endPoint: `/api/v1/users/${session?.user?.id}/cart-items/filter-and-sort?PageIndex=1&PageSize=100`,
    });
    return userShoppingCart.value.items;
  };

  const {
    data: userCart,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['useCart'],
    queryFn: () => fetchUserCart(),
    enabled: !!session,
  });

  const convertToReduxCart = (userCart) => {
    const listItem = userCart.map((item) => ({
      data: item,
      quantity: item.cartItem.quantity,
      selectedSize: item.sizeOptionName,
      selectedColour: item.colourName,
    }));

    const total = listItem.reduce(
      (sum, item) => sum + item.data.salePrice * item.quantity,
      0
    );

    return {
      error: null,
      loading: false,
      total,
      listItem,
    };
  };

  const cart = session
    ? isLoading
      ? null
      : userCart
      ? convertToReduxCart(userCart)
      : null
    : reduxCart;

  const queryClient = useQueryClient();

  // useEffect(() => {
  //   queryClient.removeQueries(['cartQuery']);
  // }, [session]);

  const addToCartMutationFn = async ({ data, selectedSize, quantity }) => {
    console.log('🚀 ~ updateCartMutationFn ~ quantity:', quantity);
    console.log('🚀 ~ updateCartMutationFn ~ selectedSize:', selectedSize);
    console.log(
      '🚀 ~ file: useCart.ts:126 ~ updateCartMutationFn ~ data:',
      data
    );
    const response = await postRequest({
      endPoint: `/api/v1/cart-items`,
      formData: {
        quantity: quantity,
        productItemId: data.activeObject.activeProductItem.id,
        variationId: selectedSize.variationId,
      },

      isFormData: false,
    });
    console.log('🚀 ~ addToCartMutationFn ~ response:', response);

    if (!response.isSuccess) {
      throw new Error('Failed to add to cart');
    }

    /// Trường hợp out of stock
    if (response.status === 201) {
      toast.error(response.data.message);
    }

    return response.data;
  };
  const addToCartMutation = useMutation({
    mutationKey: ['onAddToCart'],
    mutationFn: addToCartMutationFn,
    onError: (error) => {
      console.log('🚀 ~ useCart ~ error:', error);
    },
    onSettled: (data, error) => {
      if (error) {
        console.log('Mutation failed with error:', error);
      } else {
        queryClient.refetchQueries(['useCart']);
        // queryClient.resetQueries(['cartQuery']);
      }
    },
  });
  const onAddToCart = ({ data, selectedSize, quantity }) => {
    if (session) {
      try {
        addToCartMutation.mutate({ data, selectedSize, quantity });
        console.log('So luong them', quantity);
      } catch (error) {
        console.error(error);
      }
    } else {
      dispatch(addToCart({ data, selectedSize, quantity }));
    }
  };

  const updateCartMutationFn = async ({ data, selectedSize, quantity }) => {
    const response = await putRequest({
      endPoint: `/api/v1/cart-items`,
      formData: {
        quantity: quantity,
        productItemId: data.cartItem.productItemId,
        variationId: data.cartItem.variationId,
      },
      isFormData: false,
    });
    console.log('🚀 ~ updateCartMutationFn ~ response:', response);
    if (response.status < 200 || response.status >= 300) {
      throw new Error('Failed to update cart');
    }

    /// Trường hợp out of stock
    if (response.status === 201) {
      toast.success(response.data.message);
    }
    queryClient.refetchQueries(['useCart']);

    return response.data;
  };
  const updateCartMutation = useMutation(updateCartMutationFn, {
    onError: (error) => {
      console.error(error);
    },
    onSettled: (data, error) => {
      if (error) {
        console.error('Mutation failed with error:', error);
      } else {
        queryClient.refetchQueries(['useCart']);
      }
    },
  });
  const onUpdateCart = ({ data, selectedSize, quantity }) => {
    if (session) {
      updateCartMutation.mutate({ data, selectedSize, quantity });
      console.log('So luong them', quantity);
    } else {
      console.log('So luong them', quantity);
    }
  };

  const onIncreaseItemFromCart = useCallback(async ({ data, selectedSize }) => {
    if (session) {
      try {
        // const user = session?.user as User;
        addToCartMutation.mutate({ data, selectedSize, quantity: 1 });
      } catch (error) {
        console.error(error);
      }
    } else {
      dispatch(increaseItemFromCart({ data, selectedSize }));
    }
  }, []);

  const onDecreaseItemFromCart = useCallback(async ({ data, selectedSize }) => {
    if (session) {
      try {
        addToCartMutation.mutate({ data, selectedSize, quantity: -1 });
      } catch (error) {
        console.error(error);
      }
    } else {
      dispatch(decreaseItemFromCart({ data, selectedSize }));
    }
  }, []);

  const deleteItemFromCartMutation = useMutation<
    any,
    Error,
    { data: any; selectedSize: any; quantity: any }
  >(
    async ({ data, selectedSize, quantity }) => {
      const response = await deleteRequest({
        endPoint: `/api/v1/cart-items/delete-by-id`,
        formData: {
          productItemId: data.cartItem.productItemId,
          variationId: data.cartItem.variationId,
        },
      });

      if (response.status !== 200) {
        throw new Error('Failed to delete item from cart');
      }

      return response.data;
    },
    {
      onError: (error) => {
        console.error(error);
      },
    }
  );

  const onDeleteItemFromCart = ({
    data,
    selectedSize,
    quantity,
  }: {
    data: any;
    selectedSize: any;
    quantity: any;
  }) => {
    if (session) {
      deleteItemFromCartMutation.mutate(
        { data, selectedSize, quantity },
        {
          onSuccess: () => {
            queryClient.refetchQueries(['useCart']);
            queryClient.removeQueries(['cartQuery']);
          },
          onError: (error) => {
            queryClient.refetchQueries(['useCart']);
            queryClient.removeQueries(['cartQuery']);
            console.log(error, 'Error delete item from cart mutation');
          },
        }
      );
      console.log('Da xoa', data);
    } else {
      dispatch(deleteItemFromCart({ data, selectedSize, quantity }));
    }
  };

  return {
    onAddToCart,
    onIncreaseItemFromCart,
    onDecreaseItemFromCart,
    onDeleteItemFromCart,
    cart,
    refetch,
    onUpdateCart,
    isAddingToCart: addToCartMutation.isLoading,
    successAdded: addToCartMutation.isSuccess,
  };
};
