import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import {HubConnectionBuilder, HttpTransportType} from '@microsoft/signalr';
import {useQuery} from '@tanstack/react-query';
import {getStringStorage} from 'src/functions/storageFunctions';
import MessageBox from './MessageBox';
import {chatApi} from '@apis';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useImage} from '@hooks/useImage';
import {postRequest} from '@configs/fetch';
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';

const ChatScreen = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [imageFiles, setImageFiles] = useState<ImageOrVideo[]>([]);
  const {onUploadImage} = useImage();
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<
    Array<{
      id: string;
      content?: string;
      createdAt: string;
      userId: string;
      name?: string;
      avatarUrl?: string;
      imageUrl?: string;
    }>
  >([]);
  const [connection, setConnection] = useState(null);
  const userId =
    getStringStorage('id') || '4b98e7c5-8440-4789-8b31-de5d10171404';

  const {data: messagesData, refetch} = useQuery({
    queryKey: ['message', userId],
    queryFn: () => chatApi.getMessagesByUser(userId),
  });

  useEffect(() => {
    if (messagesData) {
      console.log('🚀 ~ useEffect ~ messagesData:', messagesData.data);
      setMessages(
        messagesData.data.value.items.map(msg => ({
          id: msg.id,
          content: msg.content,
          createdAt: new Date(msg.createdDate),
          userId: msg.user.id,
          name: msg.user.userName,
          avatarUrl: msg.user.avatarUrl,
          imageUrl: msg.imageUrl,
        })),
      );
    }
  }, [messagesData]);
  const pickImage = () => {
    ImagePicker.openPicker({
      multiple: true,
    }).then(images => {
      console.log(images);
      setImageFiles(images);
    });
  };
  useEffect(() => {
    const accessToken = getStringStorage('accessToken');
    const connect = new HubConnectionBuilder()
      .withUrl(
        `https://vniuvm.southeastasia.cloudapp.azure.com:5000/hubs/chat?access_token=${accessToken}`,
        {
          skipNegotiation: true,
          transport: HttpTransportType.WebSockets,
        },
      )
      .withAutomaticReconnect()
      .build();

    setConnection(connect);

    connect
      .start()
      .then(() => {
        connect.on('ReceiveMessage', message => {
          const newMessage = {
            id: message.id,
            content: message.content,
            createdAt: new Date(message.createdDate),
            userId: message.user.id,
            name: message.user.userName,
            avatarUrl: message.user.avatarUrl,
            imageUrl: message.imageUrl,
          };
          setMessages(prevMessages => [...prevMessages, newMessage]);
        });
      })
      .catch(err => console.error('Connection failed:', err));
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage && imageFiles.length === 0) return;

    if (newMessage) {
      const temporaryMessage = {
        id: Date.now().toString(),
        content: newMessage,
        userId,
        createdAt: new Date().toISOString(),
      };
      setMessages([...messages, temporaryMessage]);
      const response = await postRequest({
        endPoint: '/api/v1/chat-messages',
        formData: {
          userId,
          content: newMessage,
        },
        isFormData: false,
      });
      console.log('🚀 ~ handleSendMessage ~ response:', response);
      setNewMessage('');
    }

    if (imageFiles.length > 0) {
      setIsUploading(true);
      const res = await postRequest({
        endPoint: '/api/v1/file-storages/upload',
        formData: imageFiles,
        isFormData: true,
      });
      console.log('🚀 ~ onUploadImage ~ res.data.value:', res.data);
      const uploadedImages = res.data.value.map((image: any) => image.url);
      if (!res.data.isSuccess) return;
      console.log('🚀 ~ handleSendMessage ~ uploadedImages:', uploadedImages);
      uploadedImages.forEach(async (imageUrl: any) => {
        const temporaryMessage = {
          id: Date.now().toString(),
          userId,
          imageUrl,
          createdAt: new Date().toISOString(),
        };
        setMessages([...messages, temporaryMessage]);
        const response = await postRequest({
          endPoint: '/api/v1/chat-messages',
          formData: {
            userId,
            imageUrl,
          },
          isFormData: false,
        });
        console.log('🚀 ~ handleSendMessage ~ response:', response);
      });
      setIsUploading(false);
      setImageFiles([]);
    }
  };
  const handleDelete = (path: string) => {
    setImageFiles(prevFiles => prevFiles.filter(file => file.path !== path));
  };
  return (
    <View style={styles.container}>
      {isUploading && (
        <View style={styles.uploadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Uploading...</Text>
        </View>
      )}

      <FlatList
        data={messages}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => <MessageBox data={item} />}
        contentContainerStyle={styles.messageList}
        // inverted
      />
      {imageFiles.length > 0 && (
        <FlatList
          data={imageFiles}
          horizontal
          keyExtractor={item => item.path}
          renderItem={({item}) => (
            <View style={styles.imageContainer}>
              <Image source={{uri: item.path}} style={styles.image} />
              <TouchableOpacity
                onPress={() => handleDelete(item.path)}
                style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>X</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={pickImage}>
          <Ionicons name="grid-outline" size={24} color="#007BFF" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor={'#000'}
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity onPress={handleSendMessage}>
          <Ionicons name="paper-plane-outline" size={24} color="#007BFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  messageList: {
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#DDD',
  },
  input: {
    flex: 1,
    padding: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    marginHorizontal: 8,
    borderWidth: 1,
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  image: {
    width: 80,
    height: 100,
    borderRadius: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    padding: 4,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ChatScreen;
