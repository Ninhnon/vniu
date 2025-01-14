import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Keyboard,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {appColors} from '@constants/appColors';
import {setStorage} from 'src/functions/storageFunctions';
import {ENV} from '@configs/env';
import {useTheme} from '@react-navigation/native';
import CustomInput from '@components/Input/CustomInput';
import {useAppNavigation} from 'src/navigators/AppRouters';

const SignInScreen = () => {
  const navigation = useAppNavigation();
  const {colors} = useTheme();
  const [showPassword, setShowPassword] = React.useState(false);
  const [inputs, setInputs] = useState({
    Email: '',
    Password: '',
  });
  const [errors, setErrors] = useState({
    Email: null,
    Password: null,
  });
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validate = () => {
    Keyboard.dismiss();
    let isValid = true;
    if (
      !inputs.Email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      )
    ) {
      handleError('Please input a valid email', 'Email');
      isValid = false;
    }

    if (!inputs.Password) {
      handleError('Please input password', 'Password');
      isValid = false;
    } else if (inputs.Password.length < 8) {
      handleError('Min password length of 8', 'Password');
      isValid = false;
    }

    return isValid;
  };

  const handleOnchange = (text: any, input: string) => {
    setInputs(prevState => ({...prevState, [input]: text}));
  };

  const handleError = (error: string | null, input: string) => {
    setErrors(prevState => ({...prevState, [input]: error}));
  };

  const handleSubmitForm = async () => {
    navigation.navigate('TabsStack', {screen: 'Home'});
    return;
    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${ENV.API_URL}/api/v1/auths/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: inputs.Email,
          password: inputs.Password,
        }),
      });

      const data = await response.json();

      if (data.isSuccess) {
        setStorage('accessToken', data.value.accessToken);
        setStorage('userName', data.value.user.userName);
        setStorage('email', data.value.user.email);
        setStorage('id', data.value.user.id);
        navigation.navigate('TabsStack', {screen: 'Home'});
      } else {
        Alert.alert('Login Failed', 'Invalid email or password');
      }
    } catch (error) {
      Alert.alert('Login Failed', 'An error occurred while logging in');
      console.log('Login fail', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
      <View style={{padding: 20}}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: colors.text,
            paddingBottom: 14,
          }}>
          Sign in
        </Text>
        <Text style={{fontSize: 18, paddingBottom: 4, color: colors.text}}>
          Welcome! Don't have an account?
        </Text>
        <TouchableOpacity>
          <Text
            style={{fontSize: 18, color: appColors.Primary, marginBottom: 12}}
            onPress={() => {
              navigation.navigate('SignUpScreen');
            }}>
            Sign Up
          </Text>
        </TouchableOpacity>
        <View style={{alignSelf: 'stretch'}}>
          <Image
            resizeMode="contain"
            source={require('../../assets/images/logo.png')}
            style={{width: '100%', height: 100, marginBottom: 30}}
          />
        </View>
        <CustomInput
          label="Email"
          onChangeText={(text: any) => handleOnchange(text, 'Email')}
          error={errors.Email}
          onFocus={() => handleError(null, 'Email')}
        />

        <CustomInput
          label="Password"
          onChangeText={(text: any) => handleOnchange(text, 'Password')}
          error={errors.Password}
          onFocus={() => handleError(null, 'Password')}
          secureTextEntry={!showPassword}
        />

        {loading ? (
          <ActivityIndicator
            size="large"
            color={appColors.Primary}
            style={{marginVertical: 16}}
          />
        ) : (
          <TouchableOpacity
            onPress={handleSubmitForm}
            style={{
              backgroundColor: appColors.Primary,
              paddingVertical: 12,
              borderRadius: 8,
              marginBottom: 10,
              marginTop: 5,
            }}>
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                fontSize: 16,
                fontWeight: 'bold',
              }}>
              LOGIN
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

export default SignInScreen;
