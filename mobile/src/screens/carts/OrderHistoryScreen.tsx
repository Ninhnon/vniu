import React, {useEffect, useState} from 'react';
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
import {getStringStorage} from 'src/functions/storageFunctions';
import {ENV} from '@configs/env';
import {RootStackScreenProps} from 'src/navigators/RootNavigator';
import {useTheme} from '@react-navigation/native';
import {useQuery} from '@tanstack/react-query';
import {postRequest} from '@configs/fetch';
const userId = getStringStorage('id');

const OrderHistoryScreen = ({
  navigation,
}: RootStackScreenProps<'OrderHistory'>) => {
  const {colors} = useTheme();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const {
    data: orders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['orders', userId],
    queryFn: async () => {
      if (!userId) return [];
      const res = await postRequest({
        endPoint: `/api/v1/users/${userId}/orders/filter-and-sort?PageSize=20&PageIndex=${1}`,
        formData: {
          orderStatusIds: [],
          paymentMethodIds: [],
          shippingMethodIds: [],
        },
        isFormData: false,
      });
      return res.data.value.items;
    },
  });
  console.log('🚀 ~ OrderHistoryScreen ~ orders:', orders);

  if (isLoading)
    return (
      <ActivityIndicator
        color={'blue'}
        size={10}
        style={{flex: 1, alignContent: 'center', justifyContent: 'center'}}
      />
    );
  if (error)
    return <Text style={styles.detailTitle}>Error: {error.message}</Text>;
  const handleSelectOrder = order => {
    setSelectedOrder(order);
  };

  const renderOrderItem = ({item}) => (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() => handleSelectOrder(item)}>
      <Text style={[styles.orderId, {color: colors.text}]}>
        Order Code: {item.code}
      </Text>
      <Text style={[styles.orderTotal, {color: colors.text}]}>
        Total: ${item.orderTotal}
      </Text>
      <Text style={[styles.orderDate, {color: colors.text}]}>
        Date: {new Date(item.createdDate).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  const renderOrderLineItem = ({item}) => {
    return (
      <View style={styles.orderLineItem}>
        <Image source={{uri: item?.imageUrl}} style={styles.productImage} />
        <View style={styles.productDetails}>
          <Text style={[styles.productName, {color: colors.text}]}>
            {item.productName}
          </Text>
          <Text style={[styles.productVariation, {color: colors.text}]}>
            Colour: {item.colourName} - Size: {item.sizeOptionName}
          </Text>
          <Text style={[styles.quantity, {color: colors.text}]}>
            Quantity: {item.quantity}
          </Text>
          <Text style={[styles.price, {color: colors.text}]}>
            Price: ${item?.price}
          </Text>
        </View>
      </View>
    );
  };
  const parseInformation = infoString => {
    return infoString
      .split(', ')
      .filter(item => !item.startsWith('Id:'))
      .map(item => item.split(': ')[1].trim());
  };
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          marginVertical: 16,
          alignContent: 'center',
          gap: 50,
          margin: 5,
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            width: 30,
            height: 30,
            justifyContent: 'center',
            alignContent: 'center',
            backgroundColor: 'gray',
            borderRadius: 15,
          }}>
          <MaterialCommunityIcons
            name="keyboard-backspace"
            size={24}
            color="black"
          />
        </TouchableOpacity>
        <Text
          style={{
            color: colors.text,
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center',
            alignSelf: 'center',
          }}>
          Order History
        </Text>
      </View>
      {selectedOrder ? (
        <>
          <View style={styles.orderDetails}>
            <Text style={styles.detailTitle}>Shipping Address Information</Text>
            <Text style={styles.detailTitle}>
              {parseInformation(selectedOrder.shippingAddressInformation).join(
                ', ',
              )}
            </Text>

            <Text style={styles.detailTitle}>Shipping Method Information</Text>
            <Text style={styles.detailTitle}>
              {parseInformation(selectedOrder.shippingMethodInformation).join(
                ', ',
              )}
            </Text>
          </View>

          <FlatList
            data={selectedOrder.orderLines}
            keyExtractor={item => item.id.toString()}
            renderItem={renderOrderLineItem}
            contentContainerStyle={styles.orderLineList}
          />

          <Button
            title="Back to Orders"
            onPress={() => setSelectedOrder(null)}
          />
        </>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.id.toString()}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.orderList}
        />
      )}
    </SafeAreaView>
  );
};

export default OrderHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  orderList: {
    padding: 16,
  },
  orderItem: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderDetails: {
    marginBottom: 16,
    padding: 16,
  },
  detailTitle: {
    fontWeight: 'bold',
    marginTop: 8,
    color: 'black',
  },
  orderTotal: {
    fontSize: 14,
  },
  orderDate: {
    fontSize: 12,
  },
  orderLineList: {
    padding: 16,
  },
  orderLineItem: {
    flexDirection: 'row',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
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
  quantity: {
    fontSize: 14,
  },
  price: {
    fontSize: 14,
  },
});
