import {View, Platform, KeyboardAvoidingView, FlatList} from 'react-native';
import React from 'react';

const CustomKeyboard = ({children}: any) => {
  const ios = Platform.OS === 'ios';
  return (
    <KeyboardAvoidingView
      behavior={ios ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      style={{flex: 1}}>
      <FlatList
        style={{flex: 1}}
        data={[{key: '1'}]}
        renderItem={() => <>{children}</>}
        keyExtractor={item => item.key}
        bounces={false}
        showsVerticalScrollIndicator={false}
      />
    </KeyboardAvoidingView>
  );
};

export default CustomKeyboard;
