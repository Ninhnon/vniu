import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ForgotPasswordScreen from '@screens/auths/ForgotPasswordScreen'
import SignInScreen from '@screens/auths/SignInScreen'
import SignUpScreen from '@screens/auths/SignUpScreen'
import HomeScreen from '@screens/homes/HomeScreen'
import ProductDetailScreen from '@screens/products/ProductDetailScreen'
import { RootStackParamList } from 'src/types/screen.type'
const AppRouters = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>()
  return (
    <Stack.Navigator initialRouteName='ForgotPasswordScreen' screenOptions={{ headerShown: false }}>
      <Stack.Screen name='ForgotPasswordScreen' component={ForgotPasswordScreen} />
      <Stack.Screen name='SignUpScreen' component={SignUpScreen} />
      <Stack.Screen name='SignInScreen' component={SignInScreen} />
      <Stack.Screen name='HomeScreen' component={HomeScreen} />
      <Stack.Screen name='ProductDetailScreen' component={ProductDetailScreen} />
    </Stack.Navigator>
  )
}
export default AppRouters
