import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  ListRenderItem,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BottomSheet from '@gorhom/bottom-sheet';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import images from '../constants/images';
import { RootStackParamList } from '../types';

interface Message {
  id: number;
  text: string;
  sender: 'me' | 'other';
  timestamp: string;
}

const ChatScreen: React.FC = () => {
  const sheetRef = useRef<BottomSheet>(null);
  const flatListRef = useRef<FlatList<Message>>(null);
  const [newMessage, setNewMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hi buddy, what's up?", sender: 'other', timestamp: '03:00' },
    { id: 2, text: 'Not much, just coding!', sender: 'me', timestamp: '03:01' },
    { id: 3, text: 'Nice! Keep it up.', sender: 'other', timestamp: '03:02' },
    { id: 4, text: 'Thanks!', sender: 'me', timestamp: '03:03' },
  ]);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMessageData: Message = {
        id: messages.length + 1,
        text: newMessage,
        sender: 'me',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prevMessages) => [...prevMessages, newMessageData]);
      setNewMessage(''); // Clear the input after sending

      // Scroll to the latest message
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  // Initialize shared values and animation styles outside the renderItem function
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, { duration: 500 }),
      transform: [{ translateY: withSpring(translateY.value) }],
    };
  });

  // Trigger animation on mount for each message
  React.useEffect(() => {
    opacity.value = 1;
    translateY.value = 0;
  }, [messages]);

  const renderItem: ListRenderItem<Message> = ({ item }) => {
    return (
      <Animated.View style={[animatedStyle, { marginBottom: 10 }]}>
        <View
          className={`${
            item.sender === 'me' ? 'self-end bg-secondary' : 'self-start bg-accent'
          } mt-2 w-[60%] px-5 py-2 rounded-3xl`}>
          <Text className="text-base">{item.text}</Text>
        </View>
        <Text
          className={`text-xs mt-1 ${
            item.sender === 'me' ? 'self-end' : 'self-start'
          } text-black-200`}>
          {item.timestamp}
        </Text>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="flex flex-row justify-around items-center">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="bg-black-200/20 p-3 flex items-center rounded-full justify-center">
          <Image
            className="w-6 h-6"
            resizeMode="contain"
            source={images.leftChevron}
          />
        </TouchableOpacity>

        <View className="flex flex-row justify-between gap-x-3 items-center">
          <View
            className="flex justify-center items-center p-3 rounded-full "
            style={{ backgroundColor: '#FFF6D8' }}>
            <Text className="text-3xl object-contain">🏀 </Text>
          </View>
          <View className="flex items">
            <Text className="text-white font-bold text-xl">Dumb Chat</Text>
            <Text className="text-black-200">online</Text>
          </View>
        </View>

        <Image className="w-6 h-6" resizeMode="contain" source={images.menu} />
      </View>

      <BottomSheet
        ref={sheetRef}
        snapPoints={['85%']}
        index={0}
        backgroundStyle={{ borderRadius: 40 }}>
        <BottomSheetScrollView style={{ flex: 1, padding: 10, marginBottom: 100 }}>
          <Text className="text-lg self-center text-center px-3 py-2 rounded-full text-white bg-purple">
            today
          </Text>

          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
        </BottomSheetScrollView>
      </BottomSheet>

      <View className="bg-secondary flex flex-row justify-between gap-x-2 w-[93%] self-center bottom-9 absolute px-1 rounded-full py-2">
        <View className="flex flex-row items-center w-[70%]">
          <TouchableOpacity
            className="bg-pink p-3 flex items-center rounded-full justify-center">
            <Image className="w-6 h-6" resizeMode="contain" source={images.mic} />
          </TouchableOpacity>

          <TextInput
            placeholder="Message..."
            placeholderTextColor={'#C5C6CC'}
            className="flex-start h-6 pl-2"
            multiline={true}
            value={newMessage}
            onChangeText={(text) => setNewMessage(text)}
          />
        </View>

        <TouchableOpacity
          onPress={handleSendMessage}
          className="bg-blue p-3 flex items-center rounded-full justify-center mr-2">
          <Image className="w-6 h-6" resizeMode="contain" source={images.send} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;
