/* eslint-disable */
import {Platform, PermissionsAndroid, Alert} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {UNKNOWN_ERROR_TEXT} from 'src/constants/Texts';

import {check, PERMISSIONS, RESULTS, request, openSettings} from 'react-native-permissions';

export const myAlert = ({title = '', body = '', btn}) => {
  return Alert.alert(
    `${title}`,
    `${body}`,
    btn || [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Open Settings',
        onPress: async () => {
          await openSettings();
        },
      },
    ],
    {cancelable: false},
  );
};

const os = Platform.OS === 'android' ? 'ANDROID' : 'IOS';

export const locationCoarseAndroid = async () =>
  Platform.OS === 'android' ? await checkPermission(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION, 'Location') : null;
export const locationBackgroundAndroid = async () =>
  Platform.OS === 'android' ? await checkPermission(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION, 'Location') : null;
export const locationFineAndroid = async () =>
  Platform.OS === 'android' ? await checkPermission(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, 'Location') : null;
export const storageRead = async () =>
  Platform.OS === 'android' ? await checkPermission(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE, 'Read Storage') : null;
export const storageWrite = async () =>
  Platform.OS === 'android' ? await checkPermission(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE, 'Write Storage') : null;

export const camera = async () =>
  Platform.OS === 'ios'
    ? await checkPermission(PERMISSIONS.IOS.CAMERA, 'Camera')
    : await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);

export const gallery = async () => {
  return Platform.OS === 'ios' ? await checkPermission(PERMISSIONS.IOS.PHOTO_LIBRARY, 'Gallery') : true;
};
/* 
export const microphone = async () => await checkPermission(PERMISSIONS[os].MICROPHONE, 'Microphone'); */
export const locationAlwaysIos = async () =>
  Platform.OS === 'ios' ? await Geolocation.requestAuthorization('always') : null;

export const microphone = async () =>
  Platform.OS === 'ios' 
    ? await checkPermission(PERMISSIONS[os].MICROPHONE, 'Microphone') 
    : await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, 'Microphone');

export async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
      title: '"Scoby" would like to use your location',
      message: 'Location will be shown as a part of the description for your live session',
      buttonPositive: 'OK',
    });
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }
    if (granted === 'never_ask_again') {
      myAlert({
        title: 'The permission is denied',
        body: 'The permission Location is denied and not requestable anymore',
      });
    }
    return false;
  } catch {
    return false;
  }
}

export const locationAndroid = async () => {
  if (Platform.OS === 'android') {
    const ACCESS_COARSE_LOCATION = await checkPermission(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION, 'Location');
    const ACCESS_BACKGROUND_LOCATION = await checkPermission(
      PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
      'Location',
    );
    const ACCESS_FINE_LOCATION = await checkPermission(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, 'Location');

    return !!(ACCESS_COARSE_LOCATION && ACCESS_BACKGROUND_LOCATION && ACCESS_FINE_LOCATION);
  }
};

// eslint-disable-next-line consistent-return
export const locationIos = async () => {
  if (Platform.OS === 'ios') {
    const LOCATION_ALWAYS = await Geolocation.requestAuthorization('always');

    return LOCATION_ALWAYS === 'granted';
  }
};
// eslint-disable-next-line no-lone-blocks
{
  /* <key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
   <string>We need your location to fill in the address field</string> */
}

async function checkPermission(permission, name) {
  try {
    const result = await check(permission);

    // eslint-disable-next-line default-case
    switch (result) {
      case RESULTS.UNAVAILABLE:
        return false;
      case RESULTS.DENIED:
        await requestPermission(permission, name);
        return 'requestable';
      case RESULTS.GRANTED:
        return true;
      case RESULTS.BLOCKED:
        myAlert({
          title: 'The permission is denied',
          body: `The permission ${name} is denied and not requestable anymore`,
        });
        return false;
    }
  } catch (error) {
    myAlert({
      title: 'ERROR',
      body: UNKNOWN_ERROR_TEXT,
      btn: [{text: 'Ok', onPress: () => {}}],
    });
  }
}

async function requestPermission(permission, name) {
  try {
    const result = await request(permission);
    checkPermission(result);
    // if (result === 'blocked') {
    //   myAlert({ title: 'The permission is denied', body: `The permission ${name} is denied and not requestable anymore` })
    // }
  } catch (error) {
    myAlert({
      title: 'ERROR',
      body: UNKNOWN_ERROR_TEXT,
      btn: [
        {
          text: 'Ok',
          onPress: () => {},
        },
      ],
    });
  }
}

export async function requestCameraPermission() {
  try {
    const getCamera = await camera();
    const getGallery = await gallery();
    const getStorageWrite = await storageWrite();
    const getStorageRead = await storageRead();

    if (Platform.OS === 'ios' && getCamera && getGallery) {
      return true;
    }

    if(getCamera==="never_ask_again"){
      return false
    }

    if (getCamera && getStorageWrite && getStorageRead) {
      return true;
    }
  } catch (error) {
    return false;
  }

  
}

export async function requestMicrophonePermission() {
  try{
    const getMicrophone = await microphone();

    if (Platform.OS === 'ios' && getMicrophone) {
      return true;
    }
    if (getMicrophone==="never_ask_again") {
      return false;
    }

    if(getMicrophone){
      return true
    }
 
  }catch (error){
    return false;
  }
  
}
