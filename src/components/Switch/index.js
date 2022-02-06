/* eslint-disable no-use-before-define */
import React from 'react';
import {StyleSheet} from 'react-native';
import {Switch} from 'react-native-switch';
import Colors from 'src/constants/Colors';

const CommonSwitch = ({
  value,
  setValue,
  circleSize = 22,
  activeText = '',
  inActiveText = '',
  barHeight = 40,
  circleBorderWidth = 0,
  backgroundActive = Colors.pinkMagenta,
  backgroundInactive = Colors.almostTransparentWhite,
  circleActiveColor = Colors.littleTransparentWhite,
  circleInActiveColor = Colors.littleTransparentWhite,
  switchWidthMultiplier = 3.8,
  containerStyle = styles.container,
  switchLeftPx = 1.2,
  switchRightPx = 1.2,
}) => (
  <Switch
    value={value}
    onValueChange={setValue}
    activeText={activeText}
    inActiveText={inActiveText}
    circleSize={circleSize}
    barHeight={barHeight}
    circleBorderWidth={circleBorderWidth}
    backgroundActive={backgroundActive}
    backgroundInactive={backgroundInactive}
    circleActiveColor={circleActiveColor}
    circleInActiveColor={circleInActiveColor}
    switchWidthMultiplier={switchWidthMultiplier}
    containerStyle={containerStyle}
    switchLeftPx={switchLeftPx}
    switchRightPx={switchRightPx}
  />
);

const styles = StyleSheet.create({container: {borderColor: Colors.white, borderWidth: 1}});

export default CommonSwitch;
