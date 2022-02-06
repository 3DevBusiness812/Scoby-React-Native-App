import React, {useEffect, useState, useRef, useCallback} from 'react';
import {StyleSheet, View, Text, Animated, ActivityIndicator} from 'react-native';
import colors from 'src/constants/Colors';
import fonts from 'src/constants/Fonts';
import BackButton from './BackButton';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#000000',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...fonts.avenirSemiBold,
    fontSize: 32,
    color: colors.white,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  subtitle: {
    ...fonts.avenir,
    fontSize: 16,
    color: colors.white,
    padding: 8,
  },
  loading: {
    padding: 8,
  },
  connecting: {
    padding: 8,
  },
  connectingInfo: {
    ...fonts.avenir,
    fontSize: 14,
    color: colors.white,
  },
});

export default function LoadingScreen({title, username, loading, connecting, isSubscriber, onBackPress}) {
  const mainOpacity = useRef(new Animated.Value(1)).current;
  const connectingOpacity = useRef(new Animated.Value(0)).current;
  const [finished, setFinished] = useState(false);

  const fadeIn = useCallback(() => {
    setFinished(false);
    Animated.timing(mainOpacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [mainOpacity]);

  const fadeOut = useCallback(() => {
    Animated.timing(mainOpacity, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      setFinished(true);
    });
  }, [mainOpacity]);

  const fadeInInfo = useCallback(() => {
    Animated.timing(connectingOpacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [connectingOpacity]);

  const fadeOutInfo = useCallback(() => {
    Animated.timing(connectingOpacity, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [connectingOpacity]);

  useEffect(() => {
    if (loading || connecting) {
      fadeIn();
    } else {
      fadeOut();
    }
  }, [loading, connecting, fadeIn, fadeOut]);

  useEffect(() => {
    if (connecting) {
      fadeInInfo();
    } else {
      fadeOutInfo();
    }
  }, [connecting, fadeInInfo, fadeOutInfo]);

  if (finished) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, {opacity: mainOpacity}]}>
      {isSubscriber && <BackButton onPress={onBackPress} avoidStatusBar />}
      <Text style={styles.title}>{title}</Text>
      {isSubscriber && <Text style={styles.subtitle}>with {username}</Text>}
      <Animated.View style={[styles.connecting, {opacity: connectingOpacity}]}>
        {isSubscriber ? (
          <Text style={styles.connectingInfo}>Loading video...</Text>
        ) : (
          <Text style={styles.connectingInfo}>Initializing video...</Text>
        )}
      </Animated.View>
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="white" />
      </View>
    </Animated.View>
  );
}
