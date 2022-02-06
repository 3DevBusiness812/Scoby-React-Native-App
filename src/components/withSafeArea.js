import React from 'react';
import {StatusBar, View, StyleSheet, Platform, Dimensions} from 'react-native';
import Colors from 'src/constants/Colors';

const X_WIDTH = 375;
const X_HEIGHT = 812;
const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;
const {height, width} = Dimensions.get('window');

const isIPhoneX = () =>
  Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS
    ? (width >= X_WIDTH && height >= X_HEIGHT) || (width >= XSMAX_WIDTH && height >= XSMAX_HEIGHT)
    : false;

const statusBarHeight = Platform.select({
  ios: isIPhoneX() ? 48 : 24,
  android: StatusBar.currentHeight || 0,
  default: 0,
});

const styles = StyleSheet.create({
  safeArea: (drawUnderStatusBar) => ({
    flex: 1,
    marginTop: drawUnderStatusBar ? 0 : statusBarHeight,
  }),
  wrapper: (backgroundColor) => ({
    height: '100%',
    width: '100%',
    backgroundColor,
  }),
});

const defaults = {
  drawUnderStatusBar: false,
  barStyle: 'light-content',
  backgroundColor: Colors.blueBackgroundSession,
};

function withSafeArea(Component, {drawUnderStatusBar, barStyle, backgroundColor} = defaults) {
  return (props) => (
    <View style={styles.wrapper(backgroundColor)}>
      <View style={styles.safeArea(drawUnderStatusBar)}>
        <StatusBar
          backgroundColor={drawUnderStatusBar ? 'transparent' : backgroundColor}
          barStyle={barStyle}
          translucent
          animated
        />
        <Component {...props} />
      </View>
    </View>
  );
}

export {statusBarHeight};
export default withSafeArea;
