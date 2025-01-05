import {
  NavigatorScreenParams,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import React from 'react';
import { RootStackParamList } from 'src/navigators/RootNavigator';

export const useAppNavigation = () => {
  return useNavigation<NativeStackNavigationProp<RootStackParamList>>();
};

export const useAppRoute = <RouteName extends keyof RootStackParamList>(
  name: RouteName,
) => {
  return useRoute<RouteProp<RootStackParamList, typeof name>>();
};
