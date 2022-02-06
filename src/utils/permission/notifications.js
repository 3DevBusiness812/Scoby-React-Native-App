import React from 'react';
import DeviceInfo from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';

export async function requestDeviceId() {
  return DeviceInfo.getDeviceId();
}

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    return token;
  }
  return null;
}

export default function Notifications() {
  return <></>;
}
