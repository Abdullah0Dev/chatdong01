import {
  View,
  Text,
  Animated,
  Image,
  TextInput,
  TouchableOpacity,
  Easing,
} from 'react-native';
import React, {useEffect, useState} from 'react';

type InputFieldProps = {
  title?: string;
  value: string;
  placeholder: string;
  onChangeText?: (text: string) => void;
  otherStyles?: string;
  setError?: (error: string) => void;
  error?: string;
  editable?: boolean;
  onPress?: () => void;
  [key: string]: any; // add more props ...props
};
// make reusable components to make our code clean
const InputField: React.FC<InputFieldProps> = ({
  title,
  value,
  placeholder,
  onChangeText,
  otherStyles,
  setError,
  error,
  editable = true,
  onPress,
  ...props
}) => {
  // states
  const [showPassword, setShowPassword] = useState(false);
  const [shakeAnimation] = useState(new Animated.Value(0));
  // let's handle the error
  const shake = () => {
    shakeAnimation.setValue(0);
    Animated.timing(shakeAnimation, {
      toValue: 4,
      duration: 400,
      useNativeDriver: true,
      easing: Easing.bounce,
    }).start(() => {
      // clear the animation after a period of time
      setTimeout(() => {
        setError?.(''); // hide the error
      }, 3000);
    });
  };
  // if error shake
  useEffect(() => {
    if (error) {
      shake();
    }
  }, [error]);
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)
  return (
    <View className={otherStyles + ' '}>
      <Text className="text-base text-content-secondary mt-5 mb-1 font-pmedium">
        {title}
      </Text>
      <Animated.View
        // handle shake here with interpolate ..
        style={{
          transform: [
            {
              translateX: shakeAnimation.interpolate({
                inputRange: [0, 1, 2, 3, 4], // when this do the output</View>
                outputRange: [0, -10, 10, -10, 0],
              }),
            },
          ],
        }}
        // let's continue styling it:)
        className={`flex flex-row items-center justify-center rounded-xl w-full h-[60px] px-4 bg-white border-2  border-black-100/20 focus:border-black-200 ${
          error ? 'border border-red-600  ' : ''
        } `}>
        {/* icon => user icon, or password, or email... */}

        {/* TextInput */}
        <TextInput
          className="flex-1 text-content-secondary font-semibold text-lg"
          value={value}
          placeholder={placeholder}
          onChangeText={onChangeText}
          placeholderTextColor={'#D0D0D0'}
          secureTextEntry={title === 'Password' && !showPassword} // hide it if it's the password... | set show password to false
          onBlur={() => error && shake()}
          editable={editable}
          onPress={onPress}
          {...props}
        />
        {/* eye switch when it's a password */}

        {title === 'Password' && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              // if show password is true so hide the password else show it
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </Animated.View>
      {/* display the error here if there... */}
      {error && (
        <Animated.View
          className={` text-red-500 font-pregular text-sm mt-3 self-center `}>
          {error}
        </Animated.View>
      )}
    </View>
  );
};

export default InputField;
