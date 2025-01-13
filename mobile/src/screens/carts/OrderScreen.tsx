import {ENV} from '@configs/env';
import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Button,
  Alert,
  Modal,
  Image,
  ActivityIndicator,
} from 'react-native';
import UserInformationCard from 'src/components/Cards/UserInformationCard';
import {getStringStorage} from 'src/functions/storageFunctions';
import {Dropdown} from 'react-native-element-dropdown';
import AddAddress from 'src/components/AddAddress';
import DropDownPicker from 'react-native-dropdown-picker';
import {useTheme} from '@react-navigation/native';
import ModalWebView from 'src/components/modals/ModalWebView';
import {paymentApi} from '@apis';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {deleteRequest, getRequest, postRequest} from '@configs/fetch';
import {AppUser} from '@constants/appUsers';
import {showToast} from '@hooks/app/useAppToastMessage';
import {useAppNavigation} from '@hooks/app/useAppNavigation';

const OrderScreen = ({route}) => {
  const navigation = useAppNavigation();
  const {colors} = useTheme();
  const {itemsToOrder, total} = route.params;
  const [showEditModal, setShowEditModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState(null);
  const [note, setNote] = useState('');
  const [shippingMethod, setShippingMethod] = useState([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState();
  const [promotions, setPromotions] = useState([]);
  const [selectedPromotion, setSelectedPromotion] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentType, setPaymentType] = useState([]);
  const [selectedPaymentType, setSelectedPaymentType] = useState();
  const totalCart = useMemo(() => {
    let discount = 0;
    let shippingPrice = 0;

    if (selectedPromotion?.discountRate) {
      discount = (selectedPromotion.discountRate * total) / 100;
    }

    if (selectedShippingMethod?.price) {
      shippingPrice = selectedShippingMethod.price;
    }

    return total - discount + shippingPrice;
  }, [total, selectedPromotion, selectedShippingMethod]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const userId = getStringStorage('id') || AppUser.userId;

  const [addressData, setAddressData] = useState([]);
  const [openAddressDropdown, setOpenAddressDropdown] = useState(false);
  const [isShowModalWebView, setIsShowModalWebView] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [orderId, setOrderId] = useState(
    'd3e39297-8e3c-4c98-86e2-bb99df218a87',
  );
  const createPaymentMutation = useMutation({
    mutationFn: paymentApi.createPaymentUrl,
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    // Fetch user data from API
    fetchAddressData(userId); // Call your API endpoint to fetch user data
    fetchShippingData();
    fetchPaymentTypes();
    fetchPromotions();
  }, []);

  const fetchAddressData = async userId => {
    try {
      const response = await getRequest({
        endPoint: `/api/v1/users/${userId}/addresses/filter-and-sort?PageIndex=1&PageSize=10`,
      });

      // setAddressData(data.data)
      const dataAddress = response.data.value.items.map(item => ({
        label: `${item.streetNumber}, ${item.unitNumber}, ${item.addressLine1}, ${item.addressLine2}, ${item.province}, ${item.city}`,
        isDefault: item.isDefault,
        value: `${item.streetNumber}, ${item.unitNumber}, ${item.addressLine1}, ${item.addressLine2}, ${item.province}, ${item.city}`,
        id: item.id,
        fullAddress: `${item.streetNumber}, ${item.unitNumber}, ${item.addressLine1}, ${item.addressLine2}, ${item.province}, ${item.city}`,
        userName: getStringStorage('userName'),
        phoneNumber: '0123456789',
      }));
      setAddressData(dataAddress);

      const defaultAddresses = dataAddress.find(
        address => address.isDefault === 1,
      );
      setAddress(defaultAddresses);
      setUserName(defaultAddresses.userName); // Access the userName from the first element of userDetails
      setPhoneNumber(defaultAddresses.phoneNumber); // Access the phoneNumber from the first element of userDetails
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  //Fetch Shipping

  const fetchShippingData = async () => {
    try {
      const response = await getRequest({
        endPoint: `/api/v1/shipping-methods?PageIndex=1&PageSize=10`,
      });
      setShippingMethod(response.data.value.items);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchPaymentTypes = async () => {
    const res = await getRequest({
      endPoint: '/api/v1/payment-types?PageIndex=1&PageSize=8',
    });
    setPaymentType(res.data.value.items);
  };

  const fetchPromotions = async () => {
    const res = await getRequest({
      endPoint: '/api/v1/promotions?PageIndex=1&PageSize=8',
    });
    setPromotions(res.data.value.items);
  };
  const handleOpenEditModal = () => {
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };
  const handleChangeAddress = () => {
    handleOpenEditModal();
  };
  const handleShippingMethodSelect = method => {
    setSelectedShippingMethod(method);
  };
  const handlePaymentTypeSelect = method => {
    setSelectedPaymentType(method);
  };
  const handlePromotionSelect = promotion => {
    setSelectedPromotion(promotion);
  };
  const handleAddressSelect = address => {
    setAddress(address);
  };
  const handleSave = () => {
    handleCloseEditModal();
  };

  const handleCompleteOrder = async () => {
    if (userName && phoneNumber && address) {
      setIsLoading(true);

      const orderId1 = await createOrder();
      setIsLoading(false);
      handlePayment(orderId1);
    } else {
      Alert.alert('Please fill out all required fields.');
    }
  };

  async function createOrder() {
    try {
      setIsLoading(true);
      const dataArray = itemsToOrder.map(item => {
        return {
          quantity: item.cartItem.quantity,
          selectedSize: item.sizeOptionName,
          productItemId: item.cartItem.productItemId,
          variationId: item.cartItem.variationId,
          price: item.salePrice,
          productName: item.productName,
        };
      });
      const dataArrayDelete = dataArray.map(item => {
        return {
          productItemId: item.productItemId,
          variationId: item.variationId,
        };
      });

      const response = await postRequest({
        endPoint: '/api/v1/orders',
        formData: {
          orderTotal: totalCart,
          note: note,
          paymentTypeId: selectedPaymentType.id,
          shippingAddressId: address.id,
          shippingMethodId: selectedShippingMethod.id,
          promotionId: selectedPromotion.id,
          orderLines: dataArray,
          phoneNumber: phoneNumber,
        },
        isFormData: false,
      });
      setOrderId(response.data.value.id);
      const responseDelete = await deleteRequest({
        endPoint: '/api/v1/cart-items',
        formData: dataArrayDelete,
      });
      if (!response.data.isSuccess || !responseDelete.data.isSuccess) {
        showToast('error', 'Order failed');
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      queryClient.invalidateQueries({queryKey: ['cartItems']});
      queryClient.invalidateQueries({queryKey: ['orders', userId]});
      return response.data.value.id;
    } catch (error) {
      console.error('Error processing order:', error);
    }
  }

  const handlePayment = async orderId1 => {
    if (selectedPaymentType.name === 'Cash On Delivery') {
      navigation.navigate('DonePaymentScreen');
      return;
    }
    const payLoad = {
      orderTotal: totalCart,
      orderType: 'Order',
      orderId: orderId1,
      isVnPay: selectedPaymentType?.name === 'VNPay',
    };
    console.log('🚀 ~ handlePayment ~ payLoad:', payLoad);
    try {
      const response = await postRequest({
        endPoint: '/api/v1/users/online-payment/generate-url',
        formData: {
          orderTotal: totalCart,
          orderType: 'Order',
          orderId: orderId1,
          isVnPay: selectedPaymentType?.name === 'VNPay',
        },
        isFormData: false,
      });
      console.log('🚀 ~ OrderScreen ~ response:', response.data.value);
      setPaymentUrl(response.data.value);
      setIsShowModalWebView(true);
    } catch (error) {
      console.error('Payment:', error);
    }
  };
  if (isLoading)
    return (
      <ActivityIndicator
        color={'blue'}
        size={20}
        style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}
      />
    );
  return (
    <View style={styles.container}>
      <ModalWebView
        webViewUrl={paymentUrl}
        isVisible={isShowModalWebView}
        setIsVisible={setIsShowModalWebView}
        setWebViewUrl={setPaymentUrl}
        orderId={orderId}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={showEditModal}
        onRequestClose={handleCloseEditModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={handleCloseEditModal}
              style={styles.closeButton}>
              <Text style={{color: colors.text}}>X</Text>
            </TouchableOpacity>
            <Text style={{color: colors.text}}>Edit User Information</Text>
            <TextInput
              style={[styles.input, {color: colors.text}]}
              placeholder="User Name"
              placeholderTextColor={colors.text}
              value={userName}
              onChangeText={setUserName}
            />
            <TextInput
              style={[styles.input, {color: colors.text}]}
              placeholder="Phone Number"
              placeholderTextColor={colors.text}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
            <View style={[styles.dropdownContainer, {width: '100%'}]}>
              <Text style={{color: colors.text}}>Select Address</Text>
              <Dropdown
                style={[styles.dropdown]}
                placeholder="Select Address"
                placeholderStyle={{color: colors.text}}
                itemTextStyle={{color: colors.text}}
                selectedTextStyle={{color: colors.text}}
                inputSearchStyle={{color: colors.text}}
                data={addressData}
                value={address}
                labelField="fullAddress"
                valueField="id"
                onChange={method => handleAddressSelect(method)}
              />
            </View>
            <View style={{gap: 5}}>
              <Button
                title="Thêm địa chỉ"
                onPress={() => {
                  setIsModalOpen(true);
                }}
              />

              {isModalOpen && (
                <AddAddress
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                />
              )}
              <Button title="Save" onPress={handleSave} />
            </View>
          </View>
        </View>
      </Modal>
      <FlatList
        data={itemsToOrder}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.cartItem}>
            <Image
              source={{
                uri: item.productImages[0]?.imageUrl,
              }}
              style={styles.productImage}
            />

            <View style={styles.orderItem}>
              <Text style={{color: colors.text}}>{item.productName}</Text>
              <Text style={{color: colors.text}}>
                Quantity: {item.cartItem.quantity}
              </Text>
              <Text style={{color: colors.text}}>Price: ${item.salePrice}</Text>
            </View>
          </View>
        )}
        ListHeaderComponent={
          <View>
            {addressData && (
              <UserInformationCard
                userName={userName}
                phoneNumber={phoneNumber}
                defaultAddress={address?.fullAddress}
                onChangeAddress={handleChangeAddress}
              />
            )}
            <View style={styles.dropdownContainer}>
              <Text style={{color: colors.text}}>
                Shipping Method: ${' '}
                {selectedShippingMethod ? selectedShippingMethod?.price : 0}
              </Text>
              <Dropdown
                style={styles.dropdown}
                placeholder="Select Shipping Method"
                placeholderStyle={{color: colors.text}}
                itemTextStyle={{color: colors.text}}
                selectedTextStyle={{color: colors.text}}
                inputSearchStyle={{color: colors.text}}
                data={shippingMethod}
                value={selectedShippingMethod}
                labelField="name"
                valueField="id"
                onChange={method => handleShippingMethodSelect(method)}
              />
            </View>
            <TextInput
              style={[styles.input, {color: colors.text}]}
              placeholder="Note"
              placeholderTextColor={colors.text}
              value={note}
              onChangeText={setNote}
            />

            <View style={styles.dropdownContainer}>
              <Text style={{color: colors.text}}>
                Promotions: -
                {selectedPromotion ? selectedPromotion?.discountRate : 0}
                {'%'}
              </Text>
              <Dropdown
                style={styles.dropdown}
                placeholder="Select Promotion"
                placeholderStyle={{color: colors.text}}
                itemTextStyle={{color: colors.text}}
                selectedTextStyle={{color: colors.text}}
                inputSearchStyle={{color: colors.text}}
                data={promotions}
                value={selectedPromotion}
                labelField="name"
                valueField="id"
                onChange={method => handlePromotionSelect(method)}
              />
            </View>
            <View style={styles.dropdownContainer}>
              <Text style={{color: colors.text}}>Payment Method:</Text>
              <Dropdown
                style={styles.dropdown}
                placeholder="Select Payment Tyle"
                placeholderStyle={{color: colors.text}}
                itemTextStyle={{color: colors.text}}
                selectedTextStyle={{color: colors.text}}
                inputSearchStyle={{color: colors.text}}
                data={paymentType}
                value={selectedPaymentType}
                labelField="name"
                valueField="id"
                onChange={method => handlePaymentTypeSelect(method)}
              />
            </View>
          </View>
        }
      />
      <View style={styles.bottomMenu}>
        <Text style={[styles.totalPrice, {color: colors.text}]}>
          Total: ${totalCart.toFixed(2)}
        </Text>
        <TouchableOpacity
          disabled={!selectedShippingMethod || !selectedPaymentType}
          style={[
            styles.completeOrderButton,
            {
              backgroundColor:
                !selectedShippingMethod || !selectedPaymentType
                  ? 'gray'
                  : '#007bff',
            },
          ]}
          onPress={handleCompleteOrder}>
          <Text style={[styles.completeOrderButtonText, {color: colors.text}]}>
            Complete Order
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  productImage: {
    width: 80,
    height: 80,
    marginRight: 16,
    borderRadius: 8,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  addressInput: {
    flex: 1,
  },
  addressButton: {
    marginLeft: 8,
    padding: 8,
    backgroundColor: '#ddd',
    borderRadius: 8,
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  selected: {
    fontWeight: 'bold',
    color: 'blue',
  },
  unselected: {
    color: 'gray',
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
  orderItem: {
    paddingBottom: 8,
    marginBottom: 8,
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
  completeOrderButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
  },
  completeOrderButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  editButton: {
    marginTop: 16,
    padding: 8,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },

  selectedAddress: {
    backgroundColor: 'lightblue',
  },
});
