import {View, Text, TextInput, TouchableOpacity, Platform} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RootStackParamList} from '../types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignInScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // To handle errors

  const handleSignIn = async () => {
    try {
      // Send request to your backend
      const response = await axios.post(`https://chatdong01.onrender.com/api/auth`, {
        username: nickname,
        password,
      });

      // Handle response
      if (response.status === 200) {
        // Save token or user data if needed
        console.log('Success:', response.data);

        // Navigate to Home screen
        navigation.navigate('Home', {name: nickname});
        await AsyncStorage.setItem("name", nickname)
      } else {
        setError(response.data.message);
        console.log(error);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <SafeAreaView className="h-full px-5 bg-primary ">
      <Text className="text-white text-3xl text-start font-bold mt-3">
        What's your nickname to make the chat amazing
      </Text>
      <Text className="text-white text-base text-start font-bold mt-9">
        Nickname
      </Text>
      <TextInput
        value={nickname}
        onChangeText={e => setNickname(e)}
        placeholder="Tommy"
        className="bg-black-200 py-5 rounded-full px-5 text-white mt-3"
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
        className="bg-black-200 py-5 rounded-full px-5 text-white mt-2"
      />
      {/* https://medium.com/zero-equals-false/uploading-image-to-node-from-react-native-d197285f678a */}
      {/* Show error message */}
      {error ? <Text className="text-red-500 mt-2">{error}</Text> : null}
      {/* Push the btn to bottom */}
      <View className="h-[41vh]" />
      {/* Submit btn */}
      <TouchableOpacity
        onPress={handleSignIn}
        className="py-4 px-8 mt-8 bg-accent flex items-center justify-center rounded-full">
        <Text className="text-black-100 text-lg">Get Started</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SignInScreen;
