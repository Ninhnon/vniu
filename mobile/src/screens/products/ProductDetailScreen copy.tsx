import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  Modal,
  TextInput,
  Button,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {RootStackScreenProps} from 'src/navigators/RootNavigator';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '@react-navigation/native';
import {ENV} from '@configs/env';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Dropdown} from 'react-native-element-dropdown';
import {getStringStorage} from 'src/functions/storageFunctions';
import {useQueryClient} from '@tanstack/react-query';
import {useProduct} from '@hooks/useProduct';

const ProductDetailScreen = ({
  navigation,
  route: {
    params: {id},
  },
}: RootStackScreenProps<'Details'>) => {
  const userId = getStringStorage('id');
  const {colors} = useTheme();
  const [product, setProduct] = useState();
  const [selectedImage, setSelectedImage] = useState();
  const [selectedItem, setSelectedItem] = useState({
    productItemId: null,
    salePrice: 0,
    originalPrice: 0,
    productItemSold: 0,
    productImages: [],
    variations: [{size: {sizeName: null}, variationId: null}],
    colourVMs: [{colourName: null}],
  });
  const [isFocus, setIsFocus] = useState(false);
  const [optionData, setOptionData] = useState([]);
  const [optionName, setOptionName] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const queryClient = useQueryClient();
  const {onGetProductDetail} = useProduct();

  const fetchProduct = async () => {
    try {
      const productDetail = await onGetProductDetail({
        slug: id,
      });
      console.log('🚀 ~ fetchProduct ~ id:', id);
      console.log('🚀 ~ fetchProduct ~ productDetail:', productDetail);

      setProduct(productDetail);

      // const options = data.data.productItems.map(item => {
      //   const {productItemId} = item;
      //   const {sizeName} = item.variations[0].size;
      //   const {colourName} = item.colourVMs[0];
      //   const optionName = `${colourName} - ${sizeName}`;

      //   return {
      //     productItemId,
      //     sizeName,
      //     colourName,
      //     optionName,
      //   };
      // });
      // setOptionData(options);
      // setSelectedImage(data.data.productItems[0].productImages[0]);
      // setSelectedItem(data.data.productItems[0]);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const fetchCartId = async userId => {
    try {
      const response = await fetch(`${ENV.API_URL}/api/Cart/${userId}`);
      const data = await response.json();
      return data.data.cartId;
    } catch (error) {
      console.error('Error fetching cart ID:', error);
    }
  };
  useEffect(() => {
    fetchProduct();
  }, []);
  const createCartItem = async () => {
    try {
      const cartId = await fetchCartId(userId);
      const cartItemData = {
        quantity,
        cartId,
        productItemId: selectedItem.productItemId,
        variationId: selectedItem.variations[0].variationId, // Assuming the first variation is the one to be added
      };
      console.log('🚀 ~ createCartItem ~ cartItemData:', cartItemData);

      const response = await fetch(`${ENV.API_URL}/api/CartItem`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartItemData),
      });
      const data = await response.json();
      console.log('🚀 ~ createCartItem ~ data:', data);
      if (data.message === 'Create cart item successfully') {
        queryClient.invalidateQueries({queryKey: ['cartItems', userId]});

        setIsModalVisible(false);
        navigation.navigate('TabsStack', {screen: 'Cart'});
      }
    } catch (error) {
      console.error('Error creating cart item:', error);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView style={{flex: 1, flexDirection: 'column', flexGrow: 1}}>
        {selectedImage?.productImageUrl ? (
          <ImageBackground
            style={{height: 300, width: '100%', justifyContent: 'flex-end'}}
            source={{
              uri: selectedImage?.productImageUrl,
            }}>
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                flexDirection: 'row',
                alignItems: 'center',
                padding: 20,
                gap: 8,
              }}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  width: 52,
                  aspectRatio: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 52,
                  borderWidth: 1,
                  backgroundColor: 'gray',
                  borderColor: 'black',
                }}>
                <MaterialCommunityIcons
                  name="keyboard-backspace"
                  size={24}
                  color={'#fff'}
                />
              </TouchableOpacity>
              <View style={{flex: 1}} />
              <TouchableOpacity
                style={{
                  width: 52,
                  aspectRatio: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 52,
                  borderWidth: 1,
                  borderColor: '#fff',
                  backgroundColor: 'gray',
                }}
                onPress={() => setIsModalVisible(true)}>
                <MaterialCommunityIcons name="cart" size={24} color={'#fff'} />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        ) : (
          <ActivityIndicator
            style={{flex: 1, alignContent: 'center', justifyContent: 'center'}}
            size="large"
            color="#0000ff"
          />
        )}

        <View style={{padding: 16, gap: 16, flex: 1}}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{marginTop: 6, gap: 6}}>
            {selectedItem?.productImages.map(i => (
              <TouchableOpacity
                key={i.productImageId}
                onPress={() => setSelectedImage(i)}
                style={{
                  width: 100,
                  height: 100,
                  margin: 6,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: 'black',
                  borderWidth: 1,
                }}>
                <Image
                  source={{uri: i.productImageUrl}}
                  style={{width: 100, height: 100}}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={{fontSize: 20, fontWeight: '600', color: colors.text}}>
            {product?.productName}
          </Text>

          <View style={{flexDirection: 'row', gap: 2}}>
            <Text
              style={{
                fontSize: 14,
                color: colors.text,
                opacity: 0.5,
              }}>
              {3}
            </Text>
            <View style={{flexDirection: 'row', gap: 2}}>
              {new Array(5).fill('').map((_, i) => (
                <Ionicons
                  key={i}
                  name={i < 3 ? 'star' : 'star-outline'}
                  color="#facc15"
                  size={20}
                />
              ))}
            </View>
            <Text
              style={{
                fontSize: 14,
                color: colors.text,
                opacity: 0.5,
              }}>
              {'(' + 3 + ' ) | sold ' + (selectedItem?.productItemSold || 0)}
            </Text>
          </View>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Text style={{color: colors.text, fontSize: 18, fontWeight: '600'}}>
              ${selectedItem?.salePrice}
            </Text>
            <View
              style={{
                width: 40,
                height: 20,
                borderRadius: 20,
                backgroundColor: '#888',
                margin: 2,
              }}>
              <Text
                style={{
                  color: colors.text,
                  fontSize: 12,
                  fontWeight: '600',
                  textAlign: 'center',
                }}>
                {'- ' +
                  Math.round(
                    ((selectedItem?.originalPrice - selectedItem?.salePrice) /
                      selectedItem?.originalPrice) *
                      100,
                  ) +
                  ' %'}
              </Text>
            </View>
          </View>
        </View>

        <Dropdown
          style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
          placeholderStyle={{color: 'black', opacity: 1, fontSize: 14}}
          selectedTextStyle={{color: colors.text, opacity: 1, fontSize: 14}}
          itemTextStyle={{color: 'black', opacity: 1, fontSize: 14}}
          inputSearchStyle={[styles.inputSearchStyle, {color: colors.text}]}
          iconStyle={styles.iconStyle}
          data={optionData}
          search
          maxHeight={300}
          labelField="optionName"
          valueField="optionName"
          placeholder={!isFocus ? 'Select option' : '...'}
          searchPlaceholder="Search..."
          value={optionName}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setOptionName(item.optionName);
            const foundItem = product?.productItems?.find(
              (i: {productItemId: any}) =>
                i.productItemId === item?.productItemId,
            );
            if (foundItem) {
              setSelectedItem(foundItem);
              setSelectedImage(foundItem.productImages[0]);
            }
          }}
        />
      </ScrollView>
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 20}}>
              Enter Quantity
            </Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(quantity)}
              onChangeText={text => setQuantity(Number(text))}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                gap: 3,
              }}>
              <Button title="Add to Cart" onPress={createCartItem} />
              <Button title="Cancel" onPress={() => setIsModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#533483',
    padding: 16,
    justifyContent: 'center',
    alignContent: 'center',
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
    color: 'black',
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'black',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'black',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  input: {
    color: 'black',
    width: '100%',
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
});

export default ProductDetailScreen;
