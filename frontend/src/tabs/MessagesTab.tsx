import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import React, {useRef} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import images from '../constants/images';
import Animated from 'react-native-reanimated';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types';
import { io } from 'socket.io-client';

type ScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;
type MessageTabProps = {
  route: ScreenRouteProp;
};
interface MessagesTabProps {
  name: string;
}

const SOCKET_URL = 'http://192.168.1.8:4000';
const socket = io(SOCKET_URL);
const MessagesTab: React.FC<MessagesTabProps> = ({ name }) => {
 
  console.log(name);
  
  const sheetRef = useRef<BottomSheet>(null);
  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="flex flex-row justify-between items-center mx-3">
        <View>
          <Text className="text-base text-black-200">Welcome {name} 👋</Text>
          <Text className="text-3xl font-bold text-white">Chatdong</Text>
        </View>
        <View className="flex items-center justify-center bg-black-200/30 p-2 rounded-full">
          <Image source={images.bell} className="w-5 h-5 " />
        </View>
      </View>
      {/* Story */}
      <View className="flex flex-row justify-between my-5 items-center mx-3">
        <Text className="text-xl font-bold text-white">Story</Text>
        <Text className="text-base text-black-200">See All</Text>
      </View>
      {/* stories and add your own */}
      <View>
        <FlatList
          data={StoryData}
          renderItem={({item}) => (
            <Pressable className="flex flex-col items-center">
              <View
                className="flex justify-center items-center p-5 rounded-full "
                style={{backgroundColor: item.backgroundColor}}>
                <Text className="scale-125">{item.emoji}</Text>
              </View>
              <Text className="text-white text-base font-semibold">
                {' '}
                {item.name}{' '}
              </Text>
            </Pressable>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View className="w-4" />}
          ListHeaderComponent={() => (
            <View className="flex flex-col items-center">
              <TouchableOpacity className="p-4 mx-3 bg-black-200/20 rounded-full">
                <Image className="w-7 h-7" source={images.add} />
              </TouchableOpacity>
              <View className="flex flex-col  items-center">
                <Text className="text-black-200 text-sm "> Add </Text>
                <Text className="text-white text-base font-semibold">
                  {' '}
                  Story{' '}
                </Text>
              </View>
            </View>
          )}
        />
      </View>
      {/* chats => */}
      <BottomSheet
        ref={sheetRef}
        snapPoints={['65%', '86%']}
        index={0}
        backgroundStyle={{borderRadius: 40}}>
        <View style={{flex: 1, padding: 10}}>
          <View className="flex flex-row justify-between mx-5 items-center">
            <Text className="text-black-100/80 text-2xl font-semibold">
              Recent Chat
            </Text>
            <View className="flex flex-row justify-between gap-x-1 items-center bg-accent rounded-full px-3 py-2">
              <View className="flex justify-center items-center rounded-sm p-px bg-black-100">
                <Image
                  className="w-3 h-3"
                  resizeMode="contain"
                  source={images.add}
                />
              </View>
              <Text className="text- font-semibold text-black-100">
                Archine Chat
              </Text>
            </View>
          </View>
          <FlatList
            data={chatGroups}
            renderItem={({item}) => <ChatItem item={item} username={name} />} // name={item.name} message={item.message} time={item.time} image={item.image}
            keyExtractor={(_, index) => index.toString()}
            ItemSeparatorComponent={() => <View className="h-5" />}
          />
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default MessagesTab;

interface StoryDataProp {
  name: string;
  backgroundColor: string;
  emoji: string;
}

// Define the props interface
interface ChatItemProps {
  item: ChatGroupProps;
  username: string;
}
// Define the chat group props interface
interface ChatGroupProps {
  emoji: string;
  name: string; 
  shortDescription: string;
  btn: string;
  bg?: string;
}

const ChatItem: React.FC<ChatItemProps> = ({item, username}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleJoinChat = () => {
    // Join the chat room
    socket.emit('joinRoom', item.name);

    // Navigate to the ChatScreen with the chat group name
    navigation.navigate('Chat', { groupName: item.name, username: username });
  };
  return (
    <TouchableOpacity
      onPress={handleJoinChat}
      className="flex flex-row justify-between mx-5 items-center">
      {/* profile + name +message */}
      <View className="flex flex-row justify-between gap-x-2 items-center">
        <View
          className="flex justify-center items-center p-3 rounded-full "
          style={{backgroundColor: item?.bg}}>
          <Text className="text-3xl object-contain">{item.emoji}</Text>
        </View>
        {/* message + name */}
        <View className="flex items-start">
          <Text className="text-black-100 font-bold text-xl">{item.name}</Text>
          <Text className="text-black-200">{item.shortDescription}</Text>
        </View>
      </View>
      <Text className="text-black-200"> {item.btn} </Text>
    </TouchableOpacity>
  );
};

const chatGroups: ChatGroupProps[] = [
  { 
    name: 'React Native Squad',
    shortDescription: 'React Native tips by Web Minds ⚛️ 🚀',
    btn: '03:00',
    emoji: '⚛️',
    bg: '#9D3CBA',
  },
  { 
    name: 'Full Stack Fam',
    shortDescription: 'Chill dev talk - sub👇 to Web Minds 💻',
    btn: '03:00',
    emoji: '💻',
    bg: '#6B6B6B',
  },
];
// dummy data for stories
const StoryData: StoryDataProp[] = [
  {
    name: 'Yo0',
    backgroundColor: '#E8F7FE',
    emoji: '🎤',
  },
  {
    name: 'Dano',
    backgroundColor: '#EED9E1',
    emoji: '🏀',
  },
  {
    name: 'Dani',
    backgroundColor: '#FFF6D8',
    emoji: '💪',
  },
  {
    name: 'Yo0',
    backgroundColor: '#E8F7FE',
    emoji: '🎤',
  },
  {
    name: 'Dano',
    backgroundColor: '#EED9E1',
    emoji: '🏀',
  },
  {
    name: 'Dani',
    backgroundColor: '#FFF6D8',
    emoji: '💪',
  },
  {
    name: 'Yo0',
    backgroundColor: '#E8F7FE',
    emoji: '🎤',
  },
  {
    name: 'Dano',
    backgroundColor: '#EED9E1',
    emoji: '🏀',
  },
  {
    name: 'Dani',
    backgroundColor: '#FFF6D8',
    emoji: '💪',
  },
];
