import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  Button,
  Platform,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import images from '../constants/images';
import Animated from 'react-native-reanimated';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types';
import {io} from 'socket.io-client';
import ReactNativeModal from 'react-native-modal';
import InputField from '../components/InputField';
import axios from 'axios';
import ColorPicker, {
  Panel1,
  Swatches,
  Preview,
  OpacitySlider,
  HueSlider,
} from 'reanimated-color-picker';
import EmojiSelector, {Categories} from 'react-native-emoji-selector';

interface MessagesTabProps {
  name: string;
}

const SOCKET_URL = `https://chatdong01.onrender.com`;
const socket = io(SOCKET_URL);
const MessagesTab: React.FC<MessagesTabProps> = ({name}) => {
  const [modelIsOpened, setModelIsOpened] = useState(false);

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [emojiPicker, setEmojiPicker] = useState(false);
  const [groupForm, setGroupForm] = useState({
    name: '',
    emoji: '',
    desc: '',
    background: '',
  });
  const [groupData, setGroupData] = useState([]);
  // console.log(name);

  const sheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      const response = await axios.get(
        `https://chatdong01.onrender.com/api/groups/`,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );

      const data = await response.data;

      setGroupData(data);
      // console.log(`Data`, response.data);
    };
    fetchGroups();
  }, [groupData]);

  const handleCreateGroup = async () => {
    try {
      // add new group
      await axios.post(
        `https://chatdong01.onrender.com/api/groups/`,
        groupForm,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );
      setGroupForm({
        name: '',
        emoji: '',
        desc: '',
        background: '',
      });
      setModelIsOpened(false);
    } catch (error) {
      console.log(error);
      Alert.alert("Couldn't Create Group", 'Man, make sure everything is fine');
    }
  };

  // Note: 👇 This can be a `worklet` function.
  const onSelectColor = ({hex}) => {
    // do something with the selected color.
    console.log(hex);
    setGroupForm({...groupForm, background: hex});
  };

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
              <Pressable className="p-3 px-5  mx-3 bg-black-200/20 flex items-center justify-center rounded-full">
                <Text className="text-4xl text-white object-contain ">+</Text>
              </Pressable>
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
            <TouchableOpacity
              onPress={() => setModelIsOpened(true)}
              className="flex flex-row justify-between gap-x-1 items-center bg-accent rounded-full px-3 py-2">
              <View className="flex justify-center items-center rounded-sm p-px bg-black-100">
                <Image
                  className="w-3 h-3"
                  resizeMode="contain"
                  source={images.add}
                />
              </View>
              <Text className="text- font-semibold text-black-100">
                New Chat
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={groupData ?? []}
            renderItem={({item}) => <ChatItem item={item} username={name} />} // name={item.name} message={item.message} time={item.time} image={item.image}
            keyExtractor={(_, index) => index.toString()}
            ItemSeparatorComponent={() => <View className="h-5" />}
          />
        </View>

        <ReactNativeModal isVisible={modelIsOpened}>
          <View className="min-h-[300px] bg-white rounded-2xl z-30 py-3 px-5">
            <View className="flex flex-row justify-between items-center">
              <Text className="text-primary text-xl font-bold">
                Create A New Group
              </Text>
              <TouchableOpacity onPress={() => setModelIsOpened(false)}>
                <Text className="text-primary text-xl font-bold">x</Text>
              </TouchableOpacity>
            </View>

            <InputField
              onChangeText={(text: string) =>
                setGroupForm({...groupForm, name: text})
              }
              placeholder="React"
              title="Group Name"
              value={groupForm.name}
            />

            <InputField
              onChangeText={(text: string) =>
                setGroupForm({...groupForm, desc: text})
              }
              placeholder="React For Dev"
              title="Group short Description"
              value={groupForm.desc}
            />
            <View>
              <Text className="text-base mt-5 mb-1">Group Background</Text>
              <TouchableOpacity
                onPress={() => setShowColorPicker(true)}
                style={{backgroundColor: groupForm.background}}
                className="py-4 px-3 rounded-xl border  border-black-200/80">
                {groupForm.background === '' && (
                  <Text className="text-lg text-black-200/60">
                    Press To Pick A Color
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <View>
              <Text className="text-base mt-5 mb-1">Group Emoji</Text>
              <TouchableOpacity
                onPress={() => setEmojiPicker(true)}
                className={`py-4 ${
                  groupForm.emoji === '' ? 'py-4' : 'py-3'
                } px-3 rounded-xl border  border-black-200/80`}>
                <Text
                  className={`${
                    groupForm.emoji === ''
                      ? 'text-lg  text-black-200/60'
                      : 'text-4xl'
                  }`}>
                  {groupForm.emoji === ''
                    ? 'Press To Pick A Color'
                    : groupForm.emoji}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleCreateGroup}
              className="py-4 mt-9   rounded-full bg-primary">
              <Text className="text-white text-lg text-center font-bold">
                Finish
              </Text>
            </TouchableOpacity>
          </View>
          <ReactNativeModal isVisible={showColorPicker}>
            <View className="px-2 mx-9  flex items-center justify-center z-50 py-4 rounded-xl min-h-[200px] bg-blue">
              <ColorPicker
                value="#a67c1c"
                style={{width: '90%'}}
                onComplete={onSelectColor}>
                {/* <Preview /> */}
                <View className="w-full  ">
                  <Panel1 style={{borderRadius: 12}} />
                </View>
                <View className="w-full my-5">
                  <HueSlider style={{borderRadius: 50}} />
                </View>
                <View className="w-full mb-5">
                  <OpacitySlider style={{borderRadius: 50}} />
                </View>
                <View className="w-full mb-2">
                  <Swatches
                    colors={[
                      '#9C7C29',
                      '#0E0E12',
                      '#D56C80',
                      '#F6E0CD',
                      '#B5F16E',
                      '#E57CD8',
                    ]}
                  />
                </View>
                <View className="h-px w-full bg-black-200/30" />

                <View className="w-full my-5">
                  <Preview hideInitialColor />
                </View>
              </ColorPicker>
              <TouchableOpacity onPress={() => setShowColorPicker(false)}>
                <Text className="text-[#1c29d8] text-base">OK</Text>
              </TouchableOpacity>
            </View>
          </ReactNativeModal>

          <ReactNativeModal isVisible={emojiPicker}>
            <View className="h-[500px] bg-white  rounded-2xl py-4 pb-9">
              <View className="h-[87%]">
                <EmojiSelector
                  onEmojiSelected={emoji => {
                    setGroupForm({...groupForm, emoji});
                    setEmojiPicker(false);
                  }}
                />
              </View>
              <TouchableOpacity
                className="  bg-blue w-[80%] self-center rounded-full mt-11"
                onPress={() => setEmojiPicker(false)}>
                <Text className="text-[#1c29d8] text-center py-2 text-base">
                  OK
                </Text>
              </TouchableOpacity>
            </View>
          </ReactNativeModal>
        </ReactNativeModal>
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
  desc: string;
  background: string;
}

const ChatItem: React.FC<ChatItemProps> = ({item, username}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleJoinChat = () => {
    // Join the chat room
    socket.emit('joinRoom', item.name);

    // Navigate to the ChatScreen with the chat group name
    navigation.navigate('Chat', {
      groupName: item.name,
      username: username,
      background: item.background,
      emoji: item.emoji,
    });
  };
  return (
    <TouchableOpacity
      onPress={handleJoinChat}
      className="flex flex-row justify-between mx-5 items-center">
      {/* profile + name +message */}
      <View className="flex flex-row justify-between gap-x-2 items-center">
        <View
          className="flex justify-center items-center p-3 rounded-full "
          style={{backgroundColor: item?.background}}>
          <Text className="text-3xl object-contain">{item.emoji}</Text>
        </View>
        {/* message + name */}
        <View className="flex items-start">
          <Text className="text-black-100 font-bold text-xl">{item.name}</Text>
          <Text className="text-black-200">{item.desc}</Text>
        </View>
      </View>
      <Text className="text-black-200"> Start </Text>
    </TouchableOpacity>
  );
};

// const chatGroups: ChatGroupProps[] = [
//   {
//     name: 'React Native Squad',
//     shortDescription: 'React Native tips by Web Minds ⚛️ 🚀',
//     btn: '03:00',
//     emoji: '⚛️',
//     bg: '#9D3CBA',
//   },
//   {
//     name: 'Full Stack Fam',
//     shortDescription: 'Chill dev talk - sub👇 to Web Minds 💻',
//     btn: '03:00',
//     emoji: '💻',
//     bg: '#6B6B6B',
//   },
// ];
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
