import { postRequest } from "@configs/fetch";

export const useProduct = () => {
  const onGetProductDetail = async ({
    slug,
    colourId,
  }: {
    slug: string;
    colourId?: string;
  }) => {
    const formData = colourId ? { colourId } : {};

    const productDetail = await postRequest({
      endPoint: `/api/v1/products/${slug}`,
      formData,
      isFormData: false,
    });
    // const data = await productDetail?.json();

    return productDetail.value;
  };

  const fetchProduct = async ({
    PageIndex = 1,
    PageSize = 8,
    colourIds,
    price_range,
    SearchTerm,
    categoryIds,
    productItemIds = [],
  }: {
    PageIndex: number;
    PageSize: number;
    SearchTerm: string | null;
    categoryIds: string | null;
    price_range: string | null;
    colourIds: string | null;
    productItemIds?: string[] | null;
  }) => {
    const params = {
      PageIndex,
      SearchTerm,
    };

    // Construct the base endpoint
    let endpoint = '/api/v1/products/filter-and-sort?PageSize=4';

    // Add parameters to the endpoint
    for (const [key, value] of Object.entries(params)) {
      if (value !== null && value !== undefined) {
        endpoint += `&${key}=${value}`;
      }
    }
    const CategoryIds = categoryIds ? categoryIds.split('.') : [];
    const ColourIds = colourIds ? colourIds.split('.') : [];
    const { minPrice, maxPrice } = price_range
      ? {
          minPrice: price_range.split('-')[0],
          maxPrice: price_range.split('-')[1],
        }
      : { minPrice: 0, maxPrice: 500 };
    const products = await postRequest({
      endPoint: endpoint,
      formData: {
        CategoryIds,
        ratingValue: 0,
        minPrice,
        maxPrice,
        colourIds: ColourIds,
        sizeOptionIds: [],
        productItemIds,
      },
      isFormData: false,
    });
    
    return {
      data: products.data.value.items,
      totalPages: Math.round(products.data.value.totalCount / PageSize),
      totalItems: products.data.value.totalCount,
      page: PageIndex,
    };
  };

  return {
    onGetProductDetail,
    fetchProduct,
  };
};
