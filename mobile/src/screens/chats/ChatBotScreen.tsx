import React from 'react';
import {chatApi} from '@apis';
import ContainerComponent from '@components/ContainerComponent';
import {appColors} from '@constants/appColors';
import {useMutation} from '@tanstack/react-query';
import {useCallback, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Bubble,
  BubbleProps,
  GiftedChat,
  IMessage,
  InputToolbar,
  InputToolbarProps,
  Send as SendGiftedChat,
  SendProps,
  SystemMessage,
} from 'react-native-gifted-chat';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {globalStyles} from 'src/styles/globalStyles';
import {postRequest} from '@configs/fetch';
const generateRandomId = () => {
  return `${Math.random().toString(36).substr(2, 9)}-${Date.now()}`;
};
const ChatBotScreen = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [text, setText] = useState('');

  const insets = useSafeAreaInsets();

  const onSend = useCallback(async (messages: IMessage[]) => {
    setMessages(prevMsg => GiftedChat.append(prevMsg, messages));
    console.log(messages);

    const input = messages[0].text;
    console.log('🚀 ~ onSend ~ input:', input);

    try {
      const response = await postRequest({
        endPoint: '/api/v1/chat-messages/chatbot',
        formData: {content: input},
        isFormData: false,
      });

      const chatbotResponseData = response.data.value;

      const botMessage: IMessage = {
        _id: generateRandomId(),
        text: chatbotResponseData.content,
        createdAt: new Date(chatbotResponseData.createdDate),
        user: {
          _id: 2,
          name: 'Bot',
        },
        image: chatbotResponseData.imageUrl
          ? chatbotResponseData.imageUrl
          : undefined,
      };
      setMessages(prevMessages => GiftedChat.append(prevMessages, botMessage));
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, []);

  const renderInputToolbar = (props: InputToolbarProps<IMessage>) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{backgroundColor: appColors.bgPrimary, borderWidth: 1}}
        renderActions={() => (
          <View
            style={{
              height: 49,
              justifyContent: 'center',
              alignItems: 'center',
              left: 5,
            }}>
            <Ionicons name="add" color={appColors.primary} size={28} />
          </View>
        )}
      />
    );
  };

  const renderBubble = (props: Readonly<BubbleProps<IMessage>>) => {
    return (
      <Bubble
        {...props}
        textStyle={{
          right: {
            color: appColors.bgPrimary,
          },
        }}
        wrapperStyle={{
          left: [
            {
              backgroundColor: '#fff',
            },
            globalStyles.shadow,
          ],
          right: [
            {
              backgroundColor: appColors.primary,
            },
            globalStyles.shadow,
          ],
        }}
      />
    );
  };

  const renderSend = (props: SendProps<IMessage>) => (
    <View
      style={{
        height: 49,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        paddingHorizontal: 14,
      }}>
      {/* {text === '' && (
        <>
          <Ionicons name='camera-outline' color={appColors.primary} size={28} />
          <Ionicons name='mic-outline' color={appColors.primary} size={28} />
        </>
      )} */}
      {text !== '' && (
        <SendGiftedChat
          {...props}
          containerStyle={{
            justifyContent: 'center',
          }}>
          <Ionicons name="send" color={appColors.primary} size={28} />
        </SendGiftedChat>
      )}
    </View>
  );

  return (
    <>
      <ContainerComponent isBack isChat>
        {/* chat-message */}
        <View
          style={{
            flex: 1,
            marginBottom: insets.bottom,
            backgroundColor: appColors.gray,
          }}>
          <GiftedChat
            messages={messages}
            onSend={(messages: any) => onSend(messages)}
            onInputTextChanged={setText}
            user={{
              _id: 1,
            }}
            renderSystemMessage={props => (
              <SystemMessage {...props} textStyle={{color: appColors.gray}} />
            )}
            renderSend={renderSend}
            renderBubble={renderBubble}
            // renderInputToolbar={renderInputToolbar}
            textInputProps={styles.composer}
            maxComposerHeight={100}
            bottomOffset={insets.bottom}
            scrollToBottom
          />
        </View>
      </ContainerComponent>
    </>
  );
};
export default ChatBotScreen;

const styles = StyleSheet.create({
  composer: {
    backgroundColor: '#fff',
    color: 'black',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: appColors.text2,
    paddingHorizontal: 10,
    paddingTop: 8,
    fontSize: 16,
    marginTop: 4,
    marginBottom: 4,
  },
});
