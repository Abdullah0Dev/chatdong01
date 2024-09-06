import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  ChatScreen,
  HomeScreen,
  SignInScreen,
  WelcomeScreen,
} from './src/screens';
import {RootStackParamList} from './src/types';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const [name, setName] = useState<String | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const storedName = await AsyncStorage.getItem('name');
      setName(storedName);
      setIsLoading(false); // Set loading to false after fetching the name
    };
    checkUser();
  }, []); // Add empty dependency array to avoid re-running the effect on each render

  if (isLoading) {
    return null; // You can add a loading spinner here if you want
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName={name ? 'Home' : 'Welcome'}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
