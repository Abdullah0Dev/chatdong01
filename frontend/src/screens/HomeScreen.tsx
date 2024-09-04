import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Image,
  ImageSourcePropType,
} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {RootStackParamList, RootTabParamList} from '../types';
import {CallsTab, MessagesTab, ProfileTab} from '../tabs';
import images from '../constants/images';
import { RouteProp, useRoute } from '@react-navigation/native';
interface TabBarIconProps {
  source: ImageSourcePropType;
  name: string;
  focused: boolean;
}
// tab bar icon + name
const TabBarIcon: React.FC<TabBarIconProps> = ({source, name, focused}) => {
  // Remove 'Tab' at the end of the route name
  const displayName = name.replace('Tab', '')
  return (
    <View className='flex mt-4 flex-col items-center'>
      <Image className="w-6 h-6" style={{tintColor: focused ? '#EFE3FF' : '#FFFFFF'  }} source={source} />
      <Text style={{color: focused ? '#EFE3FF' : '#FFFFFF'}} className='text-[12px] text-white font-semibold mt-1'> {displayName} </Text>
    </View>
  );
};

const HomeScreen = () => {
  const Tab = createBottomTabNavigator<RootTabParamList>();
  const width = Dimensions.get('window').width;
  // get the route then the name from it!
  const route = useRoute<RouteProp<RootStackParamList, "Home">>()
  const {name} = route.params
  return (
    <>
      <Tab.Navigator
      initialRouteName='MessagesTab'
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            width: width * 0.9, // 90% of the width
            left: width * 0.05,
            ...styles.tabBar,
          },
          tabBarInactiveTintColor: "#FFFFFF",
          tabBarActiveTintColor: "#EFE3FF",
          tabBarIcon: ({focused}) => {
            let sourceImage;
            // check based on the route name and display the icon
            if(route.name === "CallsTab"){
              sourceImage = images.phone;
            }else if(route.name === "MessagesTab"){
              sourceImage = images.chatBubble;
            }else if(route.name === "ProfileTab"){
              sourceImage = images.profile;
            }
            return(
              <TabBarIcon name={route.name} focused={focused} source={sourceImage} />
            )
          } 
        })}>
        <Tab.Screen name="CallsTab" component={CallsTab} />
        <Tab.Screen name="MessagesTab" children={() => <MessagesTab name={name} />}  />
        <Tab.Screen name="ProfileTab" component={ProfileTab} />
      </Tab.Navigator>
    </>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#0F0704',
    height: 70,
    position: 'absolute',
    bottom: 26,
    borderRadius: 50,
    justifyContent: 'center',
    alignContent: 'center',
    paddingBottom: 20,
    borderTopColor: 'transparent',
    //  SHADOW
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.83,
    // shadow for android
    elevation: 5,
  },
});
