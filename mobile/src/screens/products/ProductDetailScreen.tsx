import {Layout} from '@components/base';
import BottomSheet from '@components/base/BottomSheet/BottomSheet';
import SkeletonContainer from '@components/base/Skeleton/SkeletonContainer';
import SkeletonItem from '@components/base/Skeleton/SkeletonItem';
import PriceDisplay from '@components/ui/detail/PriceDisplay';
import BottomSheetHeader from '@components/ui/search/BottomSheetHeader';
import {postRequest} from '@configs/fetch';
import {Hooks} from '@hooks/index';
import {useProduct} from '@hooks/useProduct';
import {useTheme} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {showToast} from '@hooks/app/useAppToastMessage';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  Image,
  SafeAreaView,
  TextInput,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getStringStorage} from 'src/functions/storageFunctions';
import {RootStackScreenProps} from 'src/navigators/RootNavigator';
import {useQueryClient} from '@tanstack/react-query';

function ProductDetailScreen({
  navigation,
  route: {
    params: {id},
  },
}: RootStackScreenProps<'Details'>) {
  const queryClient = useQueryClient();
  const {colors} = useTheme();
  const [data, setData] = useState(null);
  const [showError, setShowError] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const {onGetProductDetail} = useProduct();
  const [loading, setLoading] = useState(true); // Add loading state
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    undefined,
  );
  const [selectedImage, setSelectedImage] = useState(
    data?.activeObject?.activeProductImages[0].imageUrl ||
      data?.productImages[0].imageUrl,
  );
  const selectedListImages =
    data?.activeObject?.activeProductImages ||
    data?.productImages.slice(0, 3) ||
    [];
  const [quantity, setQuantity] = useState(1);
  const productSizeQuantity = [{quantity: 100}]; // Example data, replace with actual data

  const handleDecreaseItemQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  const handleIncreaseItemQuantity = () => {
    if (quantity < productSizeQuantity[0]?.quantity) {
      setQuantity(prevQuantity => prevQuantity + 1);
    }
  };

  const handleQuantityChange = text => {
    if (text === '') {
      setQuantity('');
    } else {
      const newQuantity = parseInt(text, 10);
      if (
        !isNaN(newQuantity) &&
        newQuantity > 0 &&
        newQuantity <= productSizeQuantity[0]?.quantity
      ) {
        setQuantity(newQuantity);
      }
    }
  };

  const addToCart = async () => {
    try {
      const response = await postRequest({
        endPoint: `/api/v1/cart-items`,
        formData: {
          quantity: quantity,
          productItemId: data?.activeObject.activeProductItem.id,
          variationId: selectedSize?.variationId,
        },
        isFormData: false,
      });
      if (!response.data.isSuccess) {
        showToast('error', 'Add to cart failed');
      } else {
        showToast('success', 'Add to cart successfully');
        queryClient.invalidateQueries({queryKey: ['cartItems']});
        navigation.navigate('TabsStack', {screen: 'Cart'});
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      showToast('error', 'Add to cart');
    } finally {
      closeBottomSheet();
    }
  };

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const productDetail = await onGetProductDetail({
          slug: id,
          colourId: selectedColor,
        });
        setData(productDetail);
        setSelectedImage(productDetail?.productImages[0].imageUrl);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [selectedColor]);
  const isQuantityEnabled = (!!selectedColor && !!selectedSize) || false;
  const isAddToCartDisabled = !isQuantityEnabled || quantity === 0;
  const {
    ref: bottomSheetRef,
    open: openBottomSheet,
    close: closeBottomSheet,
  } = Hooks.App.useAppBottomSheet();
  if (loading) {
    return (
      <SkeletonContainer>
        <View style={{gap: 2}}>
          <SkeletonItem height={300} width={400} style={styles.skeletonImage} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              marginTop: 6,
            }}>
            {[...Array(3)].map((_, index) => (
              <SkeletonItem
                key={index}
                style={styles.skeletonThumbnail}
                width={100}
                height={100}
              />
            ))}
          </ScrollView>
          <SkeletonItem style={styles.skeletonText} height={40} width={200} />
          <SkeletonItem style={styles.skeletonText} height={20} width={200} />
          <SkeletonItem style={styles.skeletonColor} height={50} width={100} />
          <SkeletonItem style={styles.skeletonButton} height={50} width={100} />
        </View>
      </SkeletonContainer>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {selectedImage ? (
          <ImageBackground
            style={{height: 300, width: '100%', justifyContent: 'flex-end'}}
            source={{
              uri: selectedImage,
            }}>
            <View style={styles.backgroundImage}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}>
                <MaterialCommunityIcons
                  name="keyboard-backspace"
                  size={24}
                  color={'#fff'}
                />
              </TouchableOpacity>
              <View style={{flex: 1}} />
              {/* <TouchableOpacity style={styles.cartButton}>
                <MaterialCommunityIcons name="cart" size={24} color={'#fff'} />
              </TouchableOpacity> */}
            </View>
          </ImageBackground>
        ) : (
          <ActivityIndicator
            style={styles.flexCenter}
            size="large"
            color="#0000ff"
          />
        )}
        {/* List Product Image */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            marginTop: 6,
          }}>
          {selectedListImages.map(i => (
            <TouchableOpacity
              key={i.id}
              onPress={() => setSelectedImage(i.imageUrl)}
              style={{
                margin: 6,
              }}>
              <Image
                source={{uri: i.imageUrl}}
                style={styles.renderImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
        {/* Product Title */}
        <Text style={[styles.productTitle, {color: colors.text}]}>
          {data?.name}
        </Text>

        {/* Product Subtitle */}
        <Text style={[styles.productSubtitle, {color: colors.text}]}>
          {data?.description}
        </Text>
        {data?.activeObject?.activeProductItem && (
          <PriceDisplay
            discountedPrice={data?.activeObject?.activeProductItem?.salePrice}
            originalPrice={data?.activeObject?.activeProductItem?.originalPrice}
          />
        )}
        {/* Choose Color */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: colors.text}]}>
            Choose Color
          </Text>
          <View style={styles.colorGrid}>
            {data?.colours?.map((colour, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.colorOption,
                  {
                    backgroundColor: colour.hexCode,
                    borderColor:
                      selectedColor === colour.id ? 'black' : 'transparent',
                  },
                ]}
                onPress={() => {
                  setSelectedColor(colour.id);
                  setShowError(false);
                }}>
                <Text
                  style={[
                    styles.colorText,
                    {
                      color: colour.hexCode?.includes('000000')
                        ? 'white'
                        : 'black',
                    },
                  ]}>
                  {colour.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {showError && !selectedColor && (
            <Text style={styles.errorText}>Please choose a color</Text>
          )}
        </View>

        {/* Choose Size */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: colors.text}]}>
            Choose Size
          </Text>
          <View style={styles.sizeGrid}>
            {data?.activeObject?.activeSizeOptionAndQuantityInStocks?.map(
              (size, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.sizeOption,
                    selectedSize?.sizeOptionName === size.sizeOptionName &&
                      styles.selectedSizeOption,
                    size.sizeOptionQuantityInStock <= 0 &&
                      styles.disabledSizeOption,
                  ]}
                  disabled={size.sizeOptionQuantityInStock <= 0}
                  onPress={() => {
                    setSelectedSize(size);
                    setShowError(false);
                  }}>
                  <Text style={[styles.sizeText, {color: colors.text}]}>
                    {size.sizeOptionName} -{' '}
                    {size.sizeOptionQuantityInStock > 0
                      ? size.sizeOptionQuantityInStock
                      : 'Out of stock'}
                  </Text>
                </TouchableOpacity>
              ),
            )}
          </View>
        </View>

        {/* Add to Cart Button */}
        <View style={styles.addToCartContainer}>
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={() => {
              // if (!selectedColor) {
              //   setShowError(true);
              //   Alert.alert('Error', 'Please select a color');
              // } else {
              // onSelectProduct({data});
              // onToggleDialog();
              openBottomSheet();
              // TODO: Add to cart
              // }
            }}>
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomSheet ref={bottomSheetRef}>
        <Layout.Wrapper>
          <BottomSheetHeader close={closeBottomSheet} />
          <View style={{padding: 16}}>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, {color: colors.text}]}>
                Choose Color
              </Text>
              <View style={styles.colorGrid}>
                {data?.colours?.map((colour, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.colorOption,
                      {
                        backgroundColor: colour.hexCode,
                        borderColor:
                          selectedColor === colour.id ? 'black' : 'transparent',
                      },
                    ]}
                    onPress={() => {
                      setSelectedColor(colour.id);
                      setShowError(false);
                    }}>
                    <Text
                      style={[
                        styles.colorText,
                        {
                          color: colour.hexCode?.includes('000000')
                            ? 'white'
                            : 'black',
                        },
                      ]}>
                      {colour.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {showError && !selectedColor && (
                <Text style={styles.errorText}>Please choose a color</Text>
              )}
            </View>

            {/* Choose Size */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, {color: colors.text}]}>
                Choose Size
              </Text>
              <View style={styles.sizeGrid}>
                {data?.activeObject?.activeSizeOptionAndQuantityInStocks?.map(
                  (size, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.sizeOption,
                        selectedSize?.sizeOptionName === size.sizeOptionName &&
                          styles.selectedSizeOption,
                        size.sizeOptionQuantityInStock <= 0 &&
                          styles.disabledSizeOption,
                      ]}
                      disabled={size.sizeOptionQuantityInStock <= 0}
                      onPress={() => {
                        setSelectedSize(size);
                        setShowError(false);
                      }}>
                      <Text style={[styles.sizeText, {color: colors.text}]}>
                        {size.sizeOptionName} -{' '}
                        {size.sizeOptionQuantityInStock > 0
                          ? size.sizeOptionQuantityInStock
                          : 'Out of stock'}
                      </Text>
                    </TouchableOpacity>
                  ),
                )}
              </View>
            </View>
            <View
              style={{
                width: '100%',
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <Text style={[styles.sectionTitle, {color: colors.text}]}>
                Quantity
              </Text>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  onPress={handleDecreaseItemQuantity}
                  disabled={quantity === 1 || !isQuantityEnabled}
                  style={[
                    styles.quantityButton,
                    {borderColor: colors.text},
                    quantity === 1 && styles.disabledButton,
                    !isQuantityEnabled && styles.disabledButton,
                  ]}>
                  <MaterialCommunityIcons
                    name="minus"
                    size={24}
                    color={colors.text}
                  />
                </TouchableOpacity>
                <TextInput
                  style={[
                    styles.quantityInput,
                    !isQuantityEnabled && styles.disabledButton,
                  ]}
                  value={quantity.toString()}
                  onChangeText={handleQuantityChange}
                  keyboardType="numeric"
                  editable={isQuantityEnabled}
                />
                <TouchableOpacity
                  onPress={handleIncreaseItemQuantity}
                  disabled={
                    quantity >= productSizeQuantity[0]?.quantity ||
                    !isQuantityEnabled
                  }
                  style={[
                    styles.quantityButton,
                    {borderColor: colors.text},
                    quantity >= productSizeQuantity[0]?.quantity &&
                      styles.disabledButton,
                    !isQuantityEnabled && styles.disabledButton,
                  ]}>
                  <MaterialCommunityIcons
                    name="plus"
                    size={24}
                    color={colors.text}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.addToCartContainer}>
              <TouchableOpacity
                style={[
                  styles.addToCartButton,
                  isAddToCartDisabled && styles.disabledButton,
                ]}
                onPress={addToCart}
                disabled={isAddToCartDisabled}>
                <Text style={styles.addToCartText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Layout.Wrapper>
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  renderImage: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: 'black',
  },
  flexCenter: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
  },
  cartButton: {
    width: 52,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 52,
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: 'gray',
  },
  backButton: {
    width: 52,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 52,
    borderWidth: 1,
    backgroundColor: 'gray',
    borderColor: 'black',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 8,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  productTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productSubtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorOption: {
    borderWidth: 2,
    borderRadius: 8,
    padding: 8,
    margin: 4,
    width: 80,
    alignItems: 'center',
  },
  colorText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 8,
  },
  salePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  discount: {
    fontSize: 14,
    color: 'green',
  },
  sizeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sizeOption: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    margin: 4,
    width: 100,
    alignItems: 'center',
  },
  selectedSizeOption: {
    borderColor: 'black',
    borderWidth: 3,
  },
  disabledSizeOption: {
    backgroundColor: '#e0e0e0',
    opacity: 0.5,
  },
  sizeText: {
    fontSize: 14,
  },
  addToCartContainer: {
    marginTop: 16,
  },
  addToCartButton: {
    backgroundColor: 'black',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addToCartText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailsSection: {
    marginTop: 16,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailsText: {
    fontSize: 14,
    color: 'gray',
  },
  skeletonImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 16,
  },
  skeletonThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
    margin: 6,
  },
  skeletonText: {
    width: '80%',
    height: 20,
    borderRadius: 8,
    marginVertical: 8,
  },
  skeletonColor: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    marginVertical: 8,
  },
  skeletonButton: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    marginVertical: 16,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
  },
  quantityButton: {
    height: 32,
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  disabledButton: {
    opacity: 0.5,
  },
  quantityInput: {
    height: 40,
    textAlign: 'center',
    color: 'black',
    fontSize: 16,
  },
});

export default ProductDetailScreen;
