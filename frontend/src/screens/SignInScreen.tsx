import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import { RootStackParamList } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

const SignInScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  return (
    <SafeAreaView className="h-full bg-primary ">
      <Text className="text-white text-3xl text-start font-bold mt-3">
        What's your nickname to make the chat amazing
      </Text>
      <Text className="text-white text-base text-start font-bold  mt-9">
        Nickname
      </Text>
      <TextInput
        value={nickname}
        onChangeText={e => setNickname(e)}
        placeholder="Tommy"
        className=" bg-black-200 py-5 rounded-full px-5 text-white mt-3 "
      />
      {/* password */}
      <Text className="text-white text-base text-start font-bold mt-3">
        Password
      </Text>
      <TextInput
        value={password}
        onChangeText={e => setPassword(e)}
        placeholder="*****"
        secureTextEntry
        className=" bg-black-200 py-5 rounded-full px-5 text-white mt-2"
      />
      {/* push teh btn to bottom */}
      <View className='h-[50%]' />
      {/* submit btn */}
      <TouchableOpacity  onPress={() => navigation.replace("Home")} // to make the user and able to chat
       className='py-4 px-8 mt-8 bg-accent flex items-center justify-center rounded-full '>
        <Text className='text-black-100 text-lg'>Get Started</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SignInScreen;
