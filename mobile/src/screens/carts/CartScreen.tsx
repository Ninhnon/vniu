import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Button,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {TabsStackScreenProps} from 'src/navigators/TabsNavigator';
import {useTheme} from '@react-navigation/native';
import AppHeader from '@components/ui/navigation/header/AppHeader';
import {useCart} from '@hooks/useCart';
import {CheckBox} from '@components/base';
import {getRequest} from '@configs/fetch';
import {getStringStorage} from 'src/functions/storageFunctions';
import {useQuery} from '@tanstack/react-query';
import {showToast} from '@hooks/app/useAppToastMessage';
const userId = getStringStorage('id');
const fetchUserCart = async () => {
  try {
    const response = await getRequest({
      endPoint: `/api/v1/users/${userId}/cart-items/filter-and-sort?PageIndex=1&PageSize=100`,
    });
    return response.data.value.items;
  } catch (error) {
    console.error('Error fetching user cart:', error);
  }
};
const CartScreen = ({navigation}: TabsStackScreenProps<'Cart'>) => {
  const {colors} = useTheme();
  const [selectedItems, setSelectedItems] = useState([]);

  const {data: cartItems} = useQuery({
    queryKey: ['cartItems'],
    queryFn: () => fetchUserCart(),
  });
  const handleSelectItem = (cartItemId: any) => {
    setSelectedItems(prevSelected =>
      prevSelected.includes(cartItemId)
        ? prevSelected.filter(id => id !== cartItemId)
        : [...prevSelected, cartItemId],
    );
  };

  const calculateTotalPrice = () => {
    if (!cartItems) return 0;
    return selectedItems.reduce((total, itemId) => {
      const item = cartItems.find((item: {cartItemId: any}) => {
        return item?.id === itemId;
      });
      if (!item) return total;
      return total + item?.salePrice * item?.cartItem.quantity;
    }, 0);
  };
  const handleOrderCHPlay = () => {
    showToast('warning', 'This feature is not available on this platform');
  };
  const handleOrder = () => {
    const itemsToOrder = cartItems.filter((item: {cartItemId: any}) =>
      selectedItems.includes(item?.id),
    );

    navigation.navigate('OrderScreen', {
      itemsToOrder,
      total: calculateTotalPrice(),
    });
  };

  const formatNumber = (number: number | bigint) => {
    return new Intl.NumberFormat('en-US').format(number);
  };

  const renderCartItem = ({item}: {item: any}) => {
    return (
      <View style={styles.cartItem}>
        <CheckBox
          value={selectedItems.includes(item?.id)}
          onPress={() => handleSelectItem(item?.id)}
        />
        <Image
          source={{uri: item?.productImages[0].imageUrl}}
          style={styles.productImage}
        />
        <View style={styles.productDetails}>
          <Text style={[styles.productName, {color: colors.text}]}>
            {item?.productName}
          </Text>
          <View style={styles.quantityContainer}>
            <Text style={[styles.productVariation, {color: colors.text}]}>
              Colour: {item?.colourName}
            </Text>
            <Text style={[styles.productVariation, {color: colors.text}]}>
              Size: {item?.sizeOptionName}
            </Text>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styles.quantityButton}
                // onPress={() => updateQuantityMutation(item?.id, Math.max(1, quantity - 1))}
              >
                <MaterialCommunityIcons name="minus" size={20} color="black" />
              </TouchableOpacity>
              <Text style={[styles.quantity, {color: colors.text}]}>
                {item?.cartItem?.quantity}
              </Text>
              <TouchableOpacity
                style={styles.quantityButton}
                // onPress={() => updateQuantityMutation(item?.id, quantity + 1)}
              >
                <MaterialCommunityIcons name="plus" size={20} color="black" />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={[styles.productVariation, {color: colors.text}]}>
            $ {formatNumber(item?.salePrice)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Cart" />
      <FlatList
        data={cartItems}
        keyExtractor={item => item.id}
        renderItem={renderCartItem}
        contentContainerStyle={styles.cartList}
      />
      <View style={styles.bottomMenu}>
        <Text style={[styles.totalPrice, {color: colors.text}]}>
          Total: ${formatNumber(calculateTotalPrice())}
        </Text>
        <Button
          disabled={!selectedItems || calculateTotalPrice() === 0}
          title="Order"
          onPress={handleOrderCHPlay}
        />
      </View>
    </SafeAreaView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cartList: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    marginRight: 16,
    borderRadius: 8,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productVariation: {
    fontSize: 12,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  quantityButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 8,
  },
  bottomMenu: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
