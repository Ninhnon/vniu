import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectProduct,
  toggleDialog,
  toggleSuccess,
  unselectProduct,
} from '@/redux/cart/selected-product/selectedProduct';

export const useSelectedProduct = () => {
  const dispatch = useDispatch();
  const selectedProduct =
    useSelector((state: any) => state.selectedProduct?.productData) || null;
  const isShowDialog =
    useSelector((state: any) => state.selectedProduct?.isShowDialog) || null;
  const isShowSuccess =
    useSelector((state: any) => state.selectedProduct?.isShowDialog) || null;

  const onSelectProduct = useCallback(async (data: any) => {
    try {
      dispatch(selectProduct(data.data));
    } catch (error) {
      console.error(error);
    }
  }, []);

  const onToggleDialog = useCallback(() => {
    dispatch(toggleDialog());
  }, []);

  const onToggleSuccess = useCallback(() => {
    dispatch(toggleSuccess());
  }, []);

  const onUnselectProduct = useCallback(() => {
    dispatch(unselectProduct());
  }, []);

  return {
    onSelectProduct,
    onUnselectProduct,
    onToggleDialog,
    onToggleSuccess,
    selectedProduct,
    isShowDialog,
    isShowSuccess,
  };
};
