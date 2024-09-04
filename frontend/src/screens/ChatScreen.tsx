import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetFlatListMethods,
} from '@gorhom/bottom-sheet';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import io from 'socket.io-client';
import images from '../constants/images';
import {RootStackParamList} from '../types';
import axios from 'axios';
import {launchCamera} from 'react-native-image-picker';

const SOCKET_URL = 'http://192.168.1.8:4000';
const socket = io(SOCKET_URL);

interface Message {
  message: string;
  sender: 'me' | 'other';
  timestamp: string;
}

type ScreenRoute = RouteProp<RootStackParamList, 'Chat'>;
type ChatScreenProp = {
  route: ScreenRoute;
};

const ChatScreen: React.FC<ChatScreenProp> = ({route}) => {
  const {groupName, username} = route.params;
  const [isTyping, setIsTyping] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const sheetRef = useRef<BottomSheet>(null);
  const flatListRef = useRef<BottomSheetFlatListMethods>(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    socket.emit('joinRoom', groupName);

    socket.on('userTyping', (data) => {
      if (data.groupName === groupName) {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }
    });

    socket.on('newMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('userTyping');
      socket.off('newMessage');
    };
  }, [groupName]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://192.168.1.8:4000/api/messages/`
        );
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();
  }, [groupName]);

  const handleTyping = () => {
    socket.emit('typing', {groupName});
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const messageData = {
        message: newMessage,
        sender: username,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        groupName,
      };
      socket.emit('newMessage', messageData);
      setNewMessage('');
    }
  };

  const handleUploadFile = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 1,
    });

    if (!result.didCancel && !result.errorCode && result.assets?.length) {
      const image = result.assets[0];
      setSelectedImage(image.uri || null);
      console.log('Selected Image:', image);
    } else {
      console.error('Image selection failed or was cancelled.');
    }
  };

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, {duration: 500}),
      transform: [{translateY: withSpring(translateY.value)}],
    };
  });

  useEffect(() => {
    opacity.value = 1;
    translateY.value = 0;
  }, [messages]);

  const renderItem = ({item}: {item: Message}) => (
    <Animated.View style={[animatedStyle, styles.messageContainer]}>
      <View
        style={[
          styles.messageBubble,
          item.sender === username ? styles.selfMessage : styles.otherMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.message}</Text>
      </View>
      <Text
        style={[
          styles.timestamp,
          item.sender === username ? styles.selfTimestamp : styles.otherTimestamp,
        ]}
      >
        {item.timestamp}
      </Text>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Image style={styles.icon} resizeMode="contain" source={images.leftChevron} />
        </TouchableOpacity>

        <View style={styles.groupInfo}>
          <View style={styles.groupIconContainer}>
            <Text style={styles.groupIcon}>🏀</Text>
          </View>
          <View>
            <Text style={styles.groupName}>Dumb Chat</Text>
            <Text style={styles.status}>online</Text>
          </View>
        </View>

        <Image style={styles.icon} resizeMode="contain" source={images.menu} />
      </View>

      <BottomSheet
        ref={sheetRef}
        snapPoints={['85%']}
        index={0}
        backgroundStyle={styles.bottomSheet}
      >
        <BottomSheetFlatList
          style={styles.messagesList}
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          ListHeaderComponent={
            <Text style={styles.todayHeader}>today</Text>
          }
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({animated: true})
          }
        />
      </BottomSheet>

      <View style={styles.typingIndicator}>
        {isTyping && (
          <Text style={styles.typingText}>{username} is typing...</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <TouchableOpacity
          onPress={handleUploadFile}
          style={styles.uploadButton}
        >
          <Image style={styles.icon} resizeMode="contain" source={images.mic} />
        </TouchableOpacity>

        <TextInput
          placeholder="Message..."
          placeholderTextColor="#C5C6CC"
          style={styles.textInput}
          multiline={true}
          value={newMessage}
          onChangeText={setNewMessage}
          onKeyPress={handleTyping}
        />

        <TouchableOpacity
          onPress={handleSendMessage}
          style={styles.sendButton}
        >
          <Image style={styles.icon} resizeMode="contain" source={images.send} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0704', // primary color
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 12,
    borderRadius: 24,
  },
  icon: {
    width: 24,
    height: 24,
  },
  groupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 24,
    backgroundColor: '#fef3ce', // accent color
  },
  groupIcon: {
    fontSize: 24,
  },
  groupName: {
    color: '#ffffff', // white color
    fontWeight: 'bold',
    fontSize: 18,
  },
  status: {
    color: '#8d8d8f', // black-200 color
    fontSize: 14,
  },
  bottomSheet: {
    borderRadius: 40,
  },
  messagesList: {
    flex: 1,
    padding: 10,
    marginBottom: 110
  },
  messageContainer: {
    marginBottom: 10,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 24,
    maxWidth: '80%',
  },
  selfMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#a5d6a7', // light green for self messages
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#eecbd1', // purple color for other messages
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
  },
  selfTimestamp: {
    alignSelf: 'flex-end',
    color: '#555',
  },
  otherTimestamp: {
    alignSelf: 'flex-start',
    color: '#888',
  },
  todayHeader: {
    textAlign: 'center',
    marginVertical: 8,
    backgroundColor: '#f5f5f5', // secondary color
    color: '#333',
    fontWeight: 'bold',
    fontSize: 12,
  },
  typingIndicator: {
    padding: 16,
  },
  typingText: {
    color: '#c5c5c5',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16, 
    borderRadius: 50,
    backgroundColor: "#D0C3F0",  
    marginHorizontal: 12,
    position: "absolute",
    bottom: 24
  },
  uploadButton: {
    marginRight: 16,
  },
  textInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#333',
    borderRadius: 24,
  },
  sendButton: {
    marginLeft: 16,
  },
});

export default ChatScreen;
