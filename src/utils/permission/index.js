/* eslint-disable */
import React from 'react';
import Geolocation from 'react-native-geolocation-service';

import {Platform, PermissionsAndroid, Alert} from 'react-native';
import {
  check,
  PERMISSIONS,
  RESULTS,
  request,
  openSettings,
} from 'react-native-permissions';

function myAlert({title = '', body = '', btn}) {
  return Alert.alert(
    `${title}`,
    `${body}`,
    btn
      ? btn
      : [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'Open Settings',
            onPress: () => {
              openSettings();
            },
          },
        ],
    {cancelable: false},
  );
}

export default class AndroidPermission extends React.Component {
  async componentDidMount() {
    try {
      await this.requestСommonPermission();

      if (Platform.OS === 'android') {
        await this.requestAndroidPermission();
      } else {
        await this.requestIosPermission();
      }
    } catch (error) {
      console.log('componentDidMount request Permission ERROR', error);
    }
  }
  async requestСommonPermission() {
    try {
      let os = Platform.OS === 'android' ? 'ANDROID' : 'IOS';
      let camera = await this.checkPermission(PERMISSIONS[os].CAMERA, 'Camera');
      let microphone = await this.checkPermission(
        PERMISSIONS[os].MICROPHONE,
        'Microphone',
      );

      console.log('requestСommonPermission', {
        camera,
        microphone,
      });
      return true;
    } catch (error) {
      console.log('requestСommonPermission ERROR', error);
      return false;
    }
  }

  async requestAndroidPermission() {
    try {
      let locationCoarse = await this.checkPermission(
        PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
        'Location',
      );
      let locationBackground = await this.checkPermission(
        PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
        'Location',
      );
      let locationFine = await this.checkPermission(
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        'Location',
      );
      let storage = await this.checkPermission(
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        'Read Storage',
      );
      let storageWrite = await this.checkPermission(
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        'Write Storage',
      );
      let microphone = await this.checkPermission(
        PERMISSIONS.ANDROID.RECORD_AUDIO,
        'Microphone',
      );

      console.log('requestAndroidPermission', {
        locationCoarse,
        locationBackground,
        locationFine,
        storage,
        storageWrite,
        microphone,
      });
      return true;
    } catch (error) {
      console.log('requestAndroidPermission ERROR', error);
      return false;
    }
  }

  async requestIosPermission() {
    try {
      let locationAlways = await this.checkPermission(
        PERMISSIONS.IOS.LOCATION_ALWAYS,
        'Location',
      );
      let locationInUse = await this.checkPermission(
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        'Location',
      );

      console.log('requestIosPermission', {
        locationAlways,
        locationInUse,
      });
      return true;
    } catch (error) {
      console.log('requestIosPermission ERROR', error);
      return false;
    }
  }

  async checkPermission(permission, name) {
    try {
      let result = await check(permission);

      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log(
            `This feature is not available (on this device / in this context) ${permission}`,
          );
          // if(name='Microphone'){
          //   const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
          //     title: permissionDialogTitle,
          //     message: permissionDialogMessage,
          //   });
          // }
          return 'none';
        case RESULTS.DENIED:
          console.log(
            `The permission has not been requested / is denied but requestable ${permission}`,
          );
          await this.requestPermission(permission, name);
          return 'requestable';
        case RESULTS.GRANTED:
          console.log(`The permission is granted ${permission}`);
          return 'work';
        case RESULTS.BLOCKED:
          console.log(
            `The permission is denied and not requestable anymore ${permission}`,
          );
          // openSettings();
          myAlert({
            title: 'The permission is denied',
            body: `The permission ${name} is denied and not requestable anymore`,
          });
          return 'user block permission';
      }
    } catch (error) {
      console.log(`checkPermission ERROR ${permission}`, error);
    }
  }

  async requestPermission(permission, name) {
    try {
      let result = await request(permission);
      // console.log('requestPermission result', result);
      if (result === 'blocked') {
        myAlert({
          title: 'The permission is denied',
          body: `The permission ${name} is denied and not requestable anymore`,
        });
        // openSettings();
      }
    } catch (error) {
      console.log(`requestPermission ERROR ${permission}`, error);
    }
  }

  render() {
    return null;
  }
}

// // Android permissions

// PERMISSIONS.ANDROID.ACCEPT_HANDOVER;
// PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION;
// PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION;
// PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
// PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION;
// PERMISSIONS.ANDROID.ADD_VOICEMAIL;
// PERMISSIONS.ANDROID.ANSWER_PHONE_CALLS;
// PERMISSIONS.ANDROID.BODY_SENSORS;
// PERMISSIONS.ANDROID.CALL_PHONE;
// PERMISSIONS.ANDROID.CAMERA;
// PERMISSIONS.ANDROID.GET_ACCOUNTS;
// PERMISSIONS.ANDROID.PROCESS_OUTGOING_CALLS;
// PERMISSIONS.ANDROID.READ_CALENDAR;
// PERMISSIONS.ANDROID.READ_CALL_LOG;
// PERMISSIONS.ANDROID.READ_CONTACTS;
// PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
// PERMISSIONS.ANDROID.READ_PHONE_NUMBERS;
// PERMISSIONS.ANDROID.READ_PHONE_STATE;
// PERMISSIONS.ANDROID.READ_SMS;
// PERMISSIONS.ANDROID.RECEIVE_MMS;
// PERMISSIONS.ANDROID.RECEIVE_SMS;
// PERMISSIONS.ANDROID.RECEIVE_WAP_PUSH;
// PERMISSIONS.ANDROID.RECORD_AUDIO;
// PERMISSIONS.ANDROID.SEND_SMS;
// PERMISSIONS.ANDROID.USE_SIP;
// PERMISSIONS.ANDROID.WRITE_CALENDAR;
// PERMISSIONS.ANDROID.WRITE_CALL_LOG;
// PERMISSIONS.ANDROID.WRITE_CONTACTS;
// PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;

// // iOS permissions

// PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY;
// PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL;
// PERMISSIONS.IOS.CALENDARS;
// PERMISSIONS.IOS.CAMERA;
// PERMISSIONS.IOS.CONTACTS;
// PERMISSIONS.IOS.FACE_ID;
// PERMISSIONS.IOS.LOCATION_ALWAYS;
// PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
// PERMISSIONS.IOS.MEDIA_LIBRARY;
// PERMISSIONS.IOS.MICROPHONE;
// PERMISSIONS.IOS.MOTION;
// PERMISSIONS.IOS.PHOTO_LIBRARY;
// PERMISSIONS.IOS.REMINDERS;
// PERMISSIONS.IOS.SIRI;
// PERMISSIONS.IOS.SPEECH_RECOGNITION;
// PERMISSIONS.IOS.STOREKIT;
