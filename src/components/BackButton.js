import React, {useCallback} from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {BackIco} from 'assets/svg';
import {statusBarHeight} from './withSafeArea';

const styles = StyleSheet.create({
  back: (avoidStatusBar) => ({
    position: 'absolute',
    top: avoidStatusBar ? statusBarHeight : 0,
    left: 0,
    padding: 16,
  }),
});

export default function BackButton({onPress, navigation, style, avoidStatusBar = false}) {
  const handlePress = useCallback(() => {
    if (typeof onPress === 'function') {
      onPress();
    } else {
      navigation.goBack();
    }
  }, [navigation, onPress]);

  return (
    <TouchableOpacity onPress={handlePress} style={[styles.back(avoidStatusBar), style]}>
      <BackIco />
    </TouchableOpacity>
  );
}
