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
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types';
const MessagesTab = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const sheetRef = useRef<BottomSheet>(null);
  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="flex flex-row justify-between items-center mx-3">
        <View>
          <Text className="text-base text-black-200">Welcome OJ 👋</Text>
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
        snapPoints={['65%', '85%']}
        index={0}
        backgroundStyle={{borderRadius: 40}}>
        <BottomSheetScrollView style={{flex: 1, padding: 10}}>
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
            data={[1, 2, 3, 4]}
            renderItem={({item}) => <ChatItem />} // name={item.name} message={item.message} time={item.time} image={item.image}
            keyExtractor={(_, index) => index.toString()}
            ItemSeparatorComponent={() => <View className="h-5" />}
          />
        </BottomSheetScrollView>
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
const ChatItem = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Chat')}
      className="flex flex-row justify-between mx-5 items-center">
      {/* profile + name +message */}
      <View className="flex flex-row justify-between gap-x-2 items-center">
        <View
          className="flex justify-center items-center p-3 rounded-full "
          style={{backgroundColor: '#FFF6D8'}}>
          <Text className="text-3xl object-contain">🏀 </Text>
        </View>
        {/* message + name */}
        <View className="flex items">
          <Text className="text-black-100 font-bold text-xl"> Dona </Text>
          <Text className="text-black-200"> Hey, what's up? </Text>
        </View>
      </View>
      <Text className="text-black-200"> 03:00 </Text>
    </TouchableOpacity>
  );
};
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
