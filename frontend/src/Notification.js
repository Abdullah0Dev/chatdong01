// import PushNotification from 'react-native-push-notification';
// import PushNotificationIOS from "@react-native-community/push-notification-ios";

// // make a class to able to use it across all the app
// class Notifications {
//   constructor() {
//     PushNotification.configure({
//       // (optional) Called when Token is generated (iOS and Android)
//       onRegister: function (token) {
//         console.log('TOKEN:', token);
//       },

//       // (required) Called when a remote is received or opened, or local notification is opened
//       onNotification: function (notification) {
//         console.log('NOTIFICATION:', notification);

//         // process the notification

//         // (required) Called when a remote is received or opened, or local notification is opened
//         notification.finish(PushNotificationIOS.FetchResult.NoData);
//       },

//       // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
//       onAction: function (notification) {
//         console.log('ACTION:', notification.action);
//         console.log('NOTIFICATION:', notification);

//         // process the action
//       },

//       // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
//       onRegistrationError: function (err) {
//         console.error(err.message, err);
//       },

//       // IOS ONLY (optional): default: all - Permissions to register.
//       permissions: {
//         alert: true,
//         badge: true,
//         sound: true,
//       },

//       // Should the initial notification be popped automatically
//       // default: true
//       popInitialNotification: true,

//       /**
//        * (optional) default: true
//        * - Specified if permissions (ios) and token (android and ios) will requested or not,
//        * - if not, you must call PushNotificationsHandler.requestPermissions() later
//        * - if you are not using remote notification or do not have Firebase installed, use this:
//        *     requestPermissions: Platform.OS === 'ios'
//        */
//       // requestPermissions: true,
//       channelId: '1',
//       requestPermissions: Platform.OS === 'ios'
//     });
//   }
//   PushNotificationNow() {
//     PushNotification.localNotification({  

//       title: 'My Notification Title', // (optional)
//       message: 'My Notification Message', // (required)
//       picture: 'https://crum-blab.vercel.app/assets/logo_small.png',  
//       // playSound: true, // (optional) default: true  
//     });
//   }
//   scheduleNotification(date) {
//     PushNotification.localNotificationSchedule({
//       channelId: 'reminders', 
//       title: 'My Notification Title', // (optional)
//       message: 'My Notification Message', // (required)
//       date,
//     });
//   }
// }

// export default new Notifications();
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
class Notifications {
  constructor() {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        // console.log('TOKEN:', token);
      },
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      popInitialNotification: true,
      requestPermissions: true,
      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: false,
        sound: false,
      },
    });

    PushNotification.createChannel(
      {
        channelId: 'reminders', // (required)
        channelName: 'Task reminder notifications', // (required)
        channelDescription: 'Reminder for any tasks',
      },
      () => {},
    );

    PushNotification.getScheduledLocalNotifications(rn => {
      console.log('SN --- ', rn);
    });
  }
// schedule
scheduleNotification(date, title, message) {
    PushNotification.localNotificationSchedule({
      channelId: 'reminders',
      title,
      message,
      date,
    });
  }
}

export default new Notifications();