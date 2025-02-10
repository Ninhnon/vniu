import React from 'react';
import {NavigatorScreenParams} from '@react-navigation/native';
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import TabNavigation, {TabsStackParamList} from './TabsNavigator';
import ProductSearchScreen from '@screens/products/ProductSearchScreen';
import ChatScreen from '@screens/chats/ChatScreen';
import SignInScreen from '@screens/auths/SignInScreen';
import SignUpScreen from '@screens/auths/SignUpScreen';
import ProductDetailScreen from '@screens/products/ProductDetailScreen';
import {getStringStorage} from 'src/functions/storageFunctions';
import ImageSearchScreen from '@screens/searchs/ImageSearchScreen';
import SearchScreen from '@screens/searchs/SearchScreen';
import OrderScreen from '@screens/carts/OrderScreen';
import OrderHistoryScreen from '@screens/carts/OrderHistoryScreen';
import DonePaymentScreen from '@screens/carts/DonePaymentScreen';

export type RootStackParamList = {
  TabsStack: NavigatorScreenParams<TabsStackParamList>;
  Details: {
    id: string;
  };
  ForgotPasswordScreen: undefined;
  SignInScreen: undefined;
  SignUpScreen: undefined;
  HomeScreen: undefined;
  ProductDetailScreen: undefined;
  ProductSearchScreen: undefined;
  ChatScreen: undefined;
  ImageSearch: undefined;
  SearchScreen: undefined;
  OrderScreen: undefined;
  OrderHistory: undefined;
  DonePaymentScreen: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

const RootNavigator = ({toggleTheme}: any) => {
  return (
    <RootStack.Navigator
      initialRouteName={
        getStringStorage('accessToken') ? 'TabsStack' : 'SignInScreen'
      }
      screenOptions={{headerShown: false}}>
      <RootStack.Screen name="TabsStack">
        {props => <TabNavigation {...props} toggleTheme={toggleTheme} />}
      </RootStack.Screen>
      <RootStack.Screen name="ImageSearch" component={ImageSearchScreen} />
      <RootStack.Screen name="Details" component={ProductDetailScreen} />
      <RootStack.Screen name="SignInScreen" component={SignInScreen} />
      <RootStack.Screen name="SignUpScreen" component={SignUpScreen} />
      <RootStack.Screen name="SearchScreen" component={SearchScreen} />
      <RootStack.Screen
        name="ProductSearchScreen"
        component={ProductSearchScreen}
      />
      <RootStack.Screen name="ChatScreen" component={ChatScreen} />
      <RootStack.Screen name="OrderScreen" component={OrderScreen} />
      <RootStack.Screen name="OrderHistory" component={OrderHistoryScreen} />
      <RootStack.Screen
        name="DonePaymentScreen"
        component={DonePaymentScreen}
      />
    </RootStack.Navigator>
  );
};

export default RootNavigator;
