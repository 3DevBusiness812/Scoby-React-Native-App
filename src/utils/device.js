import {Platform, Dimensions, NativeModules} from 'react-native';
import DeviceInfo from 'react-native-device-info';

const dimensions = Dimensions.get('window');

let savedDeviceId;

export const getDeviceId = async () => {
  savedDeviceId = await DeviceInfo.getUniqueId();
  // savedDeviceId = "8644c64cfcbffc9f"; // Dasha
  return savedDeviceId;
};

export const getCachedDeviceId = () => savedDeviceId;

export const isIOS = () => Platform.OS === 'ios';

export const isAndroid = () => Platform.OS === 'android';

export const getDeviceLocale = () => {
  const systemLanguage = isIOS()
    ? NativeModules.SettingsManager.settings.AppleLocale || NativeModules.SettingsManager.settings.AppleLanguages[0]
    : NativeModules.I18nManager.localeIdentifier;

  return systemLanguage;
};

export const getDeviceCountry = () => {
  const locale = getDeviceLocale();
  // this is fix for iOS default locale
  return locale === 'en' ? 'US' : locale.slice(-2);
};

export const screenWidth = dimensions.width;

export const screenHeight = dimensions.height;

export const getDeviceVersion = () => DeviceInfo.getSystemVersion();

export const getDeviceModel = () => DeviceInfo.getModel();

export const getBuildNumber = () => DeviceInfo.getBuildNumber();

export const getVersion = () => DeviceInfo.getVersion();
