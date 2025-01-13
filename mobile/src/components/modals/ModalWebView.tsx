import React from 'react';

import {appColors} from '@constants/appColors';
import {useNavigation} from '@react-navigation/native';
import {ActivityIndicator, Modal, View} from 'react-native';
import WebView, {WebViewNavigation} from 'react-native-webview';
import {ENV} from '@configs/env';
interface Props {
  webViewUrl: string | null;
  setWebViewUrl: React.Dispatch<React.SetStateAction<string | null>>;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  orderId: string;
}

const ModalWebView = (props: Props) => {
  const {webViewUrl, isVisible, setIsVisible, setWebViewUrl} = props;

  const navigation: any = useNavigation();

  const onUrlChange = (webViewState: WebViewNavigation) => {
    if (webViewState.url.includes(`${ENV.API_URL}/api`)) {
      // Removed the extra closing brace

      clearWebViewState();
    }
  };

  const clearWebViewState = () => {
    setWebViewUrl(null);
    setIsVisible(false);
    //TODO:
    //Cập nhật tình trạng thanh toán

    navigation.navigate('DonePaymentScreen');
  };

  return (
    <Modal
      visible={isVisible}
      style={{flex: 1}}
      transparent
      animationType="slide"
      statusBarTranslucent>
      <View style={{flex: 1, paddingTop: 32}}>
        <WebView
          source={{
            uri: `${webViewUrl}`,
          }}
          onNavigationStateChange={onUrlChange}
          startInLoadingState
          renderLoading={() => (
            <ActivityIndicator
              color={appColors.black}
              size={40}
              style={{flex: 1}}
            />
          )}
        />
      </View>
    </Modal>
  );
};
export default ModalWebView;
