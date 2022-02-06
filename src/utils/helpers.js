import moment from 'moment';
import lodash from 'lodash';
import avatarSrc from 'assets/images/profile/avatarPlaceholder.png';
import {firebase} from '@react-native-firebase/dynamic-links';
import {DYNAMIC_LINKS_DEFAULTS, DYNAMIC_LINKS_HEADERS, DYNAMIC_LINKS_SHORTENER_URL} from 'src/constants/Variables';
import {ReactNativeFile} from 'extract-files';

export const validURL = (str) => {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator
  return !!pattern.test(str);
};

export const validEmail = (str) => {
  const pattern =
    // eslint-disable-next-line max-len
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return pattern.test(String(str).toLowerCase());
};

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const isArray = (a) => Array.isArray(a);

export const isObject = (o) => o === Object(o) && !isArray(o) && typeof o !== 'function';

export const toCamel = (s) => s.replace(/([-_][a-z])/gi, ($1) => $1.toUpperCase().replace('-', '').replace('_', ''));

export const keysToCamel = (o) => {
  if (isObject(o)) {
    const result = {};

    Object.keys(o).forEach((k) => {
      result[toCamel(k)] = keysToCamel(o[k]);
    });

    return result;
  }
  if (isArray(o)) {
    return o.map((i) => keysToCamel(i));
  }

  return o;
};

export const formatChatMessage = (message, currUser, defaultAvatar) => {
  if (!message) return;
  const {
    createdAt,
    sender: {fullName: name, avatar: image},
    id,
    text,
  } = message;
  return {
    createdAt,
    _id: id,
    text,
    user: {
      _id: name !== currUser.fullName ? 2 : 1,
      name: name !== currUser.fullName ? name : currUser.fullName,
      avatar: name !== currUser.fullName ? image || defaultAvatar : currUser.avatar,
    },
  };
};

export const formatChatMessages = (messages, currUser, defaultAvatar) =>
  messages?.map((message) => formatChatMessage(message, currUser, defaultAvatar)).reverse();

export const isNotEmptyArr = (arr) => arr?.length > 0;

export const timeStamp = (message) => {
  const offset = moment(message.createdAt).tz('America/New_York').utcOffset();
  return moment(message.createdAt)
    .add(-1 * offset, 'minutes')
    .format('LT');
};

export const timeStampLastMessage = (message) => {
  const offset = moment(message.createdAt).tz('America/New_York').utcOffset();
  return moment(message.createdAt)
    .add(-1 * offset, 'minutes')
    .format();
};

export const checkAvatar = (user) => (user.avatar ? {uri: user.avatar} : avatarSrc);

export const buildLink = async (id, type) => {
  try {
    const body = JSON.stringify(
      lodash.merge(DYNAMIC_LINKS_DEFAULTS, {
        dynamicLinkInfo: {
          link: `${DYNAMIC_LINKS_DEFAULTS.dynamicLinkInfo.domainUriPrefix}/${type}/${id}`,
        },
      }),
    );
    const response = await fetch(`${DYNAMIC_LINKS_SHORTENER_URL}?key=${firebase.app().options.apiKey}`, {
      method: 'POST',
      headers: DYNAMIC_LINKS_HEADERS,
      body,
    });
    const json = await response.json();
    return json.shortLink;
  } catch (error) {
    return null;
  }
};

export const buildFile = (uri) =>
  new ReactNativeFile({
    uri,
    name: 'image.jpg',
    type: 'image/jpeg',
  });

export const checkIsFileUploaded = (file) => file.includes('https://');
