import {Platform} from 'react-native';

export const goudy = Platform.select({
  android: {
    fontFamily: `Goudy-Heavyface-Regular`,
    fontWeight: 'normal',
  },
  default: {
    fontFamily: 'Goudy Heavyface',
    fontWeight: '400',
  },
});

export const avenir = Platform.select({
  android: {
    fontFamily: `AvenirNext-Regular`,
    fontWeight: 'normal',
  },
  default: {
    fontFamily: 'Avenir Next LT Pro',
    fontWeight: '400',
  },
});

export const avenirSemiBold = Platform.select({
  android: {
    fontFamily: `AvenirNext-Regular`,
    fontWeight: 'normal',
  },
  default: {
    fontFamily: 'Avenir Next LT Pro',
    fontWeight: '600',
  },
});

export const avenirBold = Platform.select({
  android: {
    fontFamily: `AvenirNext-Bold`,
    fontWeight: 'normal',
  },
  default: {
    fontFamily: 'Avenir Next LT Pro',
    fontWeight: '700',
  },
});

export default {goudy, avenir, avenirSemiBold, avenirBold};
