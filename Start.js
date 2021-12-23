import React, {useEffect, useRef, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Signin from './screen/Signin';
import Signup from './screen/Signup';
import Daskboard from './screen/Dashboard/Daskboard';
//import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Splash from './screen/splash/Splash';
import FingerPrintCheck from './screen/Fingerprint/FingerPrintCheck';
import {useDispatch, useSelector} from 'react-redux';
import auth from '@react-native-firebase/auth';
import {authentication} from './redux/actions/auth/Auth';
import ProfileImageUpload from './screen/profileimageupload/ProfileImageUpload';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import axios from 'axios';
import {baseUrl} from './apiUrl/Url';
import {adduser} from './redux/actions/profiledata/Userdata';
import {AppState} from 'react-native';

export default function Start() {
  const [isloading, setisloading] = useState(true);
  const [notis, setnotis] = useState('');
  const state = useSelector(state => state);
  const dispatch = useDispatch();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const param = new URLSearchParams();
  const param1 = new URLSearchParams();

  //console.log("________________check user------------------->",auth().onAuthStateChanged(user=>{}))

  //console.log('------------------redux---------->', state);
  useEffect(() => {
    checkPermission();
    noti();
    setTimeout(() => {
      setisloading(false);
    }, 3000);

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      }
      console.log("next state",nextAppState)
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('AppState', appState.current);
      if (appState.current == 'active') {
        auth().onAuthStateChanged(user => {
          if (user) {
            //console.log('all user data from firebase------------>', user);
            //dispatch(authentication(true))
            AsyncStorage.getItem('userData').then(res => {
              // console.log('is token present', res);
              if (res == user.uid) {
                //console.log('matched-------------------------------',user.email);
                param.append('email', user.email);
                param.append('isActive', true);
                param.append('lastSeen', new Date().getTime().toString());
                axios
                  .post(baseUrl + '/loginWhenForeground', param, {
                    headers: {
                      'content-Type': 'application/x-www-form-urlencoded',
                    },
                  })
                  .then(res => {
                    //console.log('login user', res.data);
                    if (res.data.errorMessage == 200) {
                      dispatch(authentication(true));
                      dispatch(adduser(res.data.user));
                    }
                  });
              } else {
                //console.log('action failed login ');
              }
            });
          } else {
            dispatch(authentication(false));
          }
        });
      }
      if (appState.current == 'background') {
        //console.log(appState.current == 'background');
        //console.log('called.......................................');
        auth().onAuthStateChanged(user => {
          resetdata(user?.email);
        });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const resetdata = async uemail => {
    if (uemail) {
      console.log('on background----------------->', uemail);
      param1.append('email', uemail);
      param1.append('isActive', false);
      param1.append('lastSeen', new Date().getTime().toString());
      let res = await axios.post(baseUrl + '/logoutWhenBackground', param1, {
        headers: {
          'content-Type': 'application/x-www-form-urlencoded',
        },
      });

      //console.log('background end', res.data);
    }
  };

  const noti = () => {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log('TOKEN from push section:', token);
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        //console.log('NOTIFICATION:', notification);
        //console.log('notification status:', notification.foreground);
        setnotis(notification.data.word);
        if (notification.foreground) {
          PushNotification.localNotification({
            channelId: 'fcm_fallback_notification_channel',
            title: notification.title,
            bigPictureUrl: notification.bigPictureUrl,
            largeIconUrl: notification.smallIcon,
            message: notification.message,
            smallIcon: 'ic_launcher',
          });
        }
        // process the notification

        // (required) Called when a remote is received or opened, or local notification is opened
        //notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification) {
        // console.log('ACTION:', notification.action);
         console.log('NOTIFICATION:', notification);
        // process the action
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function (err) {
        //console.error(err.message, err);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });
  };
  const checkPermission = async () => {
    const enabled = await messaging().hasPermission();
    // If Premission granted proceed towards token fetch
    //console.log('firebase messaging enabled or not ', enabled);
    if (enabled) {
      getToken();
    } else {
      // If permission hasn’t been granted to our app, request user in requestPermission method.
      requestPermission();
    }
  };

  const getToken = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    //console.log('firebase messaging fcm token from async storage', fcmToken);
    if (!fcmToken) {
      fcmToken = await messaging().getToken();
      //console.log('firebase messaging fcm token ', fcmToken);
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
  };
  const requestPermission = async () => {
    try {
      await messaging().requestPermission();
      // User has authorised
      getToken();
    } catch (error) {
      // User has rejected permissions
      //console.log('permission rejected');
    }
  };
  const Stack = createNativeStackNavigator();
  //console.log('on set notification data', notis);
  return (
    <>
      {isloading ? (
        <Splash />
      ) : (
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            {state.Auth.authentication_status === true ? (
              <>
                <Stack.Screen
                  name="FingerPrintCheck"
                  component={FingerPrintCheck}
                />
                <Stack.Screen name="Daskboard" component={Daskboard} />
              </>
            ) : (
              <>
                <Stack.Screen name="Signin" component={Signin} />
                <Stack.Screen name="Signup" component={Signup} />
                <Stack.Screen
                  name="ProfileImageUpload"
                  component={ProfileImageUpload}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </>
  );
}
