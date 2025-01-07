import { View, Text } from 'react-native'
import React from 'react'
import { BottomTabScreenProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { CompositeScreenProps } from '@react-navigation/native'
import { RootStackScreenProps } from './RootNavigator'
import CustomBottomTabs from '../components/CustomBottomTabs'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import ChatScreen from '@screens/chats/ChatScreen'
import AssistScreen from '@screens/assists/AssistScreen'
import ProfileScreen from '@screens/profiles/ProfileScreen'
import CartScreen from '@screens/carts/CartScreen'
import HomeScreen from '@screens/homes/HomeScreen'
import ChatBotScreen from '@screens/chats/ChatBotScreen'

export type TabsStackParamList = {
  Home: undefined
  Cart: undefined
  Assist: undefined
  Chat: undefined
  Profile: undefined
}
const TabsStack = createBottomTabNavigator<TabsStackParamList>()

export type TabsStackScreenProps<T extends keyof TabsStackParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabsStackParamList, T>,
  RootStackScreenProps<'TabsStack'>
>

const TabsNavigator = ({ toggleTheme }: any) => {
  return (
    <TabsStack.Navigator
      screenOptions={{
        tabBarShowLabel: false
      }}
      tabBar={(props) => <CustomBottomTabs {...props} />}
    >
      <TabsStack.Screen
        name='Home'
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon(props) {
            return <MaterialCommunityIcons name='home' {...props} />
          }
        }}
      />
      <TabsStack.Screen
        name='Cart'
        component={CartScreen}
        options={{
          headerShown: false,
          tabBarIcon(props) {
            return <MaterialCommunityIcons name='cart' {...props} />
          }
        }}
      />
      <TabsStack.Screen
        name='Assist'
        component={ChatBotScreen}
        options={{
          headerShown: false,
          tabBarIcon(props) {
            return <MaterialCommunityIcons name='robot-happy-outline' {...props} />
          }
        }}
      />
      <TabsStack.Screen
        name='Chat'
        component={ChatScreen}
        options={{
          headerShown: false,
          tabBarIcon(props) {
            return <MaterialCommunityIcons name='chat-processing-outline' {...props} />
          }
        }}
      />

      <TabsStack.Screen
        name='Profile'
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon(props) {
            return <MaterialCommunityIcons name='account' {...props} />
          }
        }}
      />
    </TabsStack.Navigator>
  )
}

export default TabsNavigator

const Example = () => {
  return <View />
}
