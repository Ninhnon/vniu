import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {format, isToday} from 'date-fns';
import {getStringStorage} from 'src/functions/storageFunctions';

interface MessageBoxProps {
  data: {
    userId: string;
    avatarUrl?: string;
    imageUrl?: string;
    content?: string;
    createdAt: string;
  };
}

const MessageBox: React.FC<MessageBoxProps> = ({data}) => {
  const currentUserId = getStringStorage('id');
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const isOwnMessage = data.userId === currentUserId;
  const messageDate = new Date(data.createdAt);

  return (
    <View style={[styles.container, isOwnMessage && styles.ownMessage]}>
      {!isOwnMessage && (
        <Image
          source={{uri: data.avatarUrl || 'https://via.placeholder.com/40'}}
          style={styles.avatar}
        />
      )}

      <View
        style={[
          styles.messageContainer,
          isOwnMessage ? styles.alignEnd : styles.alignStart,
        ]}>
        <View style={styles.header}>
          <Text style={[styles.sender]}>{isOwnMessage ? '' : 'Admin'}</Text>
          <Text style={[styles.timestamp]}>
            {isToday(messageDate)
              ? format(messageDate, 'p')
              : format(messageDate, 'M/d/yy p')}
          </Text>
        </View>

        {data.imageUrl ? (
          <>
            <TouchableOpacity onPress={() => setImageModalVisible(true)}>
              <Image
                source={{uri: data.imageUrl}}
                style={styles.image}
                resizeMode="cover"
              />
            </TouchableOpacity>

            <Modal visible={imageModalVisible} transparent={true}>
              <TouchableOpacity
                style={styles.modalBackground}
                onPress={() => setImageModalVisible(false)}>
                <Image
                  source={{uri: data.imageUrl}}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </Modal>
          </>
        ) : (
          <View
            style={[styles.textMessage, isOwnMessage && styles.ownTextMessage]}>
            <Text
              style={[styles.messageText, !isOwnMessage && {color: '#000'}]}>
              {data.content}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  ownMessage: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  messageContainer: {
    flex: 1,
  },
  alignEnd: {
    alignItems: 'flex-end',
  },
  alignStart: {
    alignItems: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  sender: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 5,
    color: '#000',
  },
  timestamp: {
    fontSize: 12,
    color: 'gray',
  },
  textMessage: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    maxWidth: '80%',
  },
  ownTextMessage: {
    backgroundColor: '#007bff',
  },
  messageText: {
    color: '#fff',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '90%',
    height: '90%',
  },
});

export default MessageBox;
