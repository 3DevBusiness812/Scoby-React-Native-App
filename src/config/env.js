import Config from 'react-native-config';

export const SCOBY_ENV = Config.ENVIRONMENT || 'prod';

export const SCOBY_BE = `be-${SCOBY_ENV}-scoby.scoby.dev/graphql`;

export const MEDIASOUP_BE = 'ws://ms-dev-scoby.softermii.co:4446/';

export const isProd = () => SCOBY_ENV === 'stage';

export const isDev = () => SCOBY_ENV === 'dev';

export const isStage = () => SCOBY_ENV === 'stage';

export const isTest = () => SCOBY_ENV === 'test';
