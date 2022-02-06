import {SERVER_ROOT} from './api';
import {isProd} from './env';

export const GOOGLE_API_KEY = 'AIzaSyBsqt214Eri5KuofVuIzUHQF6WTc1dMKJs';

export const SCOBY_WEBSITE_LINK = '';

export const SCOBY_PRIVACY_POLICY_LINK = '';
export const SCOBY_POLICY_LINK = '';
export const SCOBY_COOKIE_POLICY_LINK = '';
export const SCOBY_TERMS_OF_USE_LINK = '';

export const ANDROID_APP_ID = isProd() ? ' ' : ' ';
export const IOS_APP_ID = isProd() ? '' : ' ';
export const IOS_BUNDLE_ID = isProd() ? ' ' : ' ';

export const ANDROID_APP_LINK = isProd()
  ? 'https://play.google.com/store/apps/details?id='
  : 'https://play.google.com/apps/testing/';

export const APP_IOS_LINK = isProd() ? 'https://apps.apple.com/us/app/' : 'https://testflight.apple.com/join/';

export const SCOBY_IMAGE = `${SERVER_ROOT}/scoby.png`;
