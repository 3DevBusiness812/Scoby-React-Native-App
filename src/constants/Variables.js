import {MEDIASOUP_BE, isProd} from 'src/config/env';

export const DELAY_BEFORE_RESEND = 60;
export const MIN_USER_AGE = 13;

export const PC_PROPRIETARY_CONSTRAINTS = {
  optional: [{googDscp: true}],
};

export const VIDEO_CONSTRAINS = {
  qvga: {width: {ideal: 320}, height: {ideal: 240}},
  vga: {width: {ideal: 640}, height: {ideal: 480}},
  hd: {width: {ideal: 1280}, height: {ideal: 720}},
};
export const SERVER_URI = MEDIASOUP_BE;

// export const IMG_URI = 'https://scoby-user-profile-assets-prod.s3.amazonaws.com/';
export const IMG_URI = isProd()
  ? 'https://scoby-user-profile-assets-prod.s3.amazonaws.com/'
  : 'https://scoby-user-profile-assets.s3.amazonaws.com/';
// : `https://scoby-user-profile-assets-staging.s3.amazonaws.com/`;

export const WEBCAM_SIMULCAST_ENCODINGS = [
  {scaleResolutionDownBy: 4, maxBitrate: 500000},
  {scaleResolutionDownBy: 2, maxBitrate: 1000000},
  {scaleResolutionDownBy: 1, maxBitrate: 5000000},
];

export const WEBCAM_KSVC_ENCODINGS = [{scalabilityMode: 'S3T3_KEY'}];

export const SCREEN_SHARING_SIMULCAST_ENCODINGS = [
  {dtx: true, maxBitrate: 1500000},
  {dtx: true, maxBitrate: 6000000},
];

export const SCREEN_SHARING_SVC_ENCODINGS = [{scalabilityMode: 'S3T3', dtx: true}];

export const ROOM_STATE = {
  FAILED: 'failed',
  CLOSED: 'closed',
  CLOSED_BY_SERVER: 'closed_by_server',
  CLOSED_BY_LIMIT: 'closed_by_limit',
  CLOSED_BY_BLOCK: 'closed_by_block',
  CLOSED_BY_REMOVE: 'closed_by_remove',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
};

export const DEFAULT_ANIMATION_DELAY = 500;

export const CAMERA_ORIENTATION = {
  FRONT: 'FRONT',
  BACK: 'BACK',
};

export const DYNAMIC_LINKS_SHORTENER_URL = 'https://firebasedynamiclinks.googleapis.com/v1/shortLinks';

export const DYNAMIC_LINKS_DEFAULTS = {
  dynamicLinkInfo: {
    domainUriPrefix: 'https://app.scoby.dev/links',
    androidInfo: {
      androidPackageName: 'com.scoby',
      androidFallbackLink: 'https://app.scoby.dev/links/app',
    },
    iosInfo: {
      iosBundleId: 'com.softermii.scoby',
      iosFallbackLink: 'https://app.scoby.dev/links/app',
    },
    desktopInfo: {
      desktopFallbackLink: 'https://www.scoby.social/',
    },
    socialMetaTagInfo: {
      socialTitle: 'Scoby Social',
      socialDescription: 'Discover, Host & Join Live Shared Experiences!',
      socialImageLink:
        'https://assets.website-files.com/5f11f244ae77aa7cbddf6a51/5f748a3295c4f036689e44c4_Phone%20(9)%20(1).png',
    },
  },
  suffix: {
    option: 'SHORT',
  },
};

export const DYNAMIC_LINKS_HEADERS = {
  'Content-Type': 'application/json',
};

export const TEAM_TYPES = {
  PUBLIC: 'Public',
  SECRET: 'Secret',
  PRIVATE: 'Private',
};
