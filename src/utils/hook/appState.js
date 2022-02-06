// eslint-disable-next-line no-unused-vars
import React, {useRef, useState, useEffect} from 'react';
import {AppState} from 'react-native';

export default () => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  // eslint-disable-next-line no-underscore-dangle
  const _handleAppStateChange = (nextAppState) => {
    appState.current = nextAppState;
    setAppStateVisible(appState.current);
  };

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  return [appStateVisible, null];
};
