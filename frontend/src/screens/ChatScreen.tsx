import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
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
import {
  Asset,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {PermissionsAndroid} from 'react-native';

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
  const [selectedImage, setSelectedImage] = useState<Asset | null>(null);
  const sheetRef = useRef<BottomSheet>(null);
  const flatListRef = useRef<BottomSheetFlatListMethods>(null);
  const [finalImage, setFinalImage] = useState<String | null>(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    socket.emit('joinRoom', groupName);

    socket.on('userTyping', data => {
      if (data.groupName === groupName) {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }
    });

    socket.on('newMessage', message => {
      setMessages(prevMessages => [...prevMessages, message]);
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
          `http://192.168.1.8:4000/api/messages/${groupName}`,
        );
        setMessages(response.data);
        // console.log(`Messages`,response.data);
        
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
        image: finalImage,
      };
      socket.emit('newMessage', messageData);
      setNewMessage('');
      setSelectedImage(null);
      setFinalImage(null)
      
    }
  };
  // select image

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'We need access to your storage to pick an image.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      return result === RESULTS.GRANTED;
    }
    //  if(Platform.OS === 'ios') {
    //   const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
    //   return result === RESULTS.GRANTED;
    // }
  };
  const handleUploadFile = async () => {
    const hasStoragePermission = await requestStoragePermission();
  
    if (hasStoragePermission) {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
      });
  
      if (!result.didCancel && !result.errorCode && result.assets?.length) {
        const image = result.assets[0];
        setSelectedImage(image);
  console.log(image);
  
        // upload to the backend
        const data = new FormData();
        data.append('myFile', {
          uri: image.uri, // Use the selected image's URI
          type: image.type,
          name: image.fileName,
        });
  
        try {
          const response = await axios.post(
            'http://192.168.1.8:4000/api/upload/',
            data,
            {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
              },
            }
          );
  
          // Assuming the server response contains the URL of the uploaded image
          const uploadedImageUrl = response.data.url; // Adjust this based on your backend response
          console.log('Uploaded Image URL:', uploadedImageUrl);
          setFinalImage(uploadedImageUrl); // Store the final image URL
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      } else {
        console.error('Image selection failed or was cancelled.');
      }
    } else {
      console.error('Storage permission not granted');
    }
  };
  
  const CancelUploadImage = () => {
    setSelectedImage(null)
    setFinalImage(null)
  }

  // const handleUploadFile = async () => {
  //   const result = await launchCamera({
  //     mediaType: 'photo',
  //     quality: 1,
  //   });

  //   if (!result.didCancel && !result.errorCode && result.assets?.length) {
  //     const image = result.assets[0];
  //     setSelectedImage(image);
  //     console.log('Selected Image:', image); // You can see the image details in the console
  //   } else {
  //     console.error('Image selection failed or was cancelled.');
  //   }
  // };
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

  const renderItem = ({item}) => (
    <Animated.View style={[animatedStyle, {marginBottom: 10}]}>
      <View
        className={`${
          item.sender === username
            ? 'self-end bg-secondary'
            : 'self-start bg-accent'
        } mt-2 w-[80%] px-5 py-2 rounded-3xl`}>
        {item.image && (
          <View className="">
            <Image
              className="w-52  h-52"
              resizeMode="contain"
              source={{uri: item.image}}
            />
          </View>
        )}
        <Text className="text-base">{item.message}</Text>
      </View>
      <Text
        className={`text-xs mt-1 ${
          item.sender === username ? 'self-end' : 'self-start'
        } text-black-200`}>
        {item.timestamp}
      </Text>
    </Animated.View>
  );

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
            className="flex justify-center items-center p-3 rounded-full"
            style={{backgroundColor: '#FFF6D8'}}>
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
        backgroundStyle={{borderRadius: 40}}>
        <BottomSheetFlatList
          style={{flex: 1, padding: 10, marginBottom: 100}}
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          ListHeaderComponent={
            <Text className="text-lg self-center text-center px-3 py-2 rounded-2xl text-white bg-purple">
              today
            </Text>
          }
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({animated: true})
          }
        />
      </BottomSheet>
      <View className="flex justify-start items-center bottom-24 py-2 px-5 absolute  ">
        {isTyping && ( // || newMessage !== " "
          <Text className="text-black-100/50 text-start text-base">
            {username} is typing...
          </Text>
        )}
      </View>
      {selectedImage && (
        <View className=" bottom-24 py-2 px-5 absolute">
          <TouchableOpacity
          onPress={CancelUploadImage}
          className=' top-8 z-20 w-8 h-8 rounded-full p-2 bg-red-500 left-0 ' />
          <Image className="w-32 h-32 " source={{uri: selectedImage?.uri}} />
        </View>
      )}
      <View className="bg-secondary flex flex-row justify-between gap-x-2 w-[93%] self-center bottom-9 absolute px-1 rounded-full py-2">
        <View className="flex flex-row items-center w-[70%]">
          <TouchableOpacity
            onPress={handleUploadFile}
            className="bg-pink p-3 flex items-center rounded-full justify-center">
            <Image
              className="w-6 h-6"
              resizeMode="contain"
              source={images.mic}
            />
          </TouchableOpacity>
          <TextInput
            placeholder="Message..."
            placeholderTextColor={'#C5C6CC'}
            className="flex-start h-6 pl-2"
            multiline={true}
            value={newMessage}
            onChangeText={text => setNewMessage(text)}
            onKeyPress={handleTyping} // Emit typing event on key press
          />
        </View>

        <TouchableOpacity
          onPress={handleSendMessage}
          className="bg-blue p-3 flex items-center rounded-full justify-center mr-2">
          <Image
            className="w-6 h-6"
            resizeMode="contain"
            source={images.send}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;
