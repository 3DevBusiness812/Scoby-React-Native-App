import {Dimensions} from 'react-native';

export const {width} = Dimensions.get('window');
export const {height} = Dimensions.get('window');

export const isSmallDevice = width < 375;
