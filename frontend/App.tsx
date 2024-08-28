import {View, Text} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { ChatScreen, HomeScreen, SignInScreen, WelcomeScreen } from './src/screens';
import { RootStackParamList } from './src/types';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


const App = () => {

  const Stack = createNativeStackNavigator<RootStackParamList>();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerShown: false,
    }} initialRouteName='Welcome'>
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
