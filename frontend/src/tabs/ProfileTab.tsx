import React, {useState} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import DatePicker from 'react-native-date-picker';
import Notifications from '../Notification';

export default function HomeTab() {
  const [date, setDate] = useState(new Date());
  const setNotification = () => {
    // Notifications.scheduleNotification(date);
    Notifications.scheduleNotification(new Date(Date.now() + 5 * 1000), "ChatDong", "Now let's move on to the main implementations");
  };

  return (
    <View style={styles.container}>
      {/* <DatePicker date={date} onDateChange={setDate} /> */}
      <View style={styles.wrapper} />
      <Button
        title="Set notification after 5 seconds"
        onPress={setNotification}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    height: 60,
  },
});