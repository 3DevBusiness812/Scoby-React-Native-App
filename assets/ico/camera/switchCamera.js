import React from 'react';
import {SvgUri} from 'react-native-svg';
import testSvg from './test.svg';

export default function switchCamera() {
  return <SvgUri width="100" height="100" svgXmlData={testSvg} />;
}
