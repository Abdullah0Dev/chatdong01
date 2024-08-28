import { View, Text, ImageBackground, TouchableOpacity } from 'react-native'
import React from 'react'   
import images from '../constants/images'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../types'

const WelcomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  return (
    <ImageBackground className="h-full w-full" source={images.WelcomeBG}>
      <View className='h-[66%]' />
      <Text className='text-white font-bold text-4xl'>It's easy talking to your friend with Chatdong</Text>  
      <Text className='text-black-200 text-lg mt-5 mb-9'>Call Your Friend Simply And Simple
      With Chatdong</Text>
      <TouchableOpacity  onPress={() => navigation.replace("SignIn")} // to make the user and able to chat
       className='py-4 px-8 mt-8 bg-accent flex items-center justify-center rounded-full '>
        <Text className='text-black-100 text-lg'>Get Started</Text>
      </TouchableOpacity>
    </ImageBackground>
  )
}

export default WelcomeScreen