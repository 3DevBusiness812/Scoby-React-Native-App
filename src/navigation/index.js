import React, {useCallback, useContext, useEffect, useRef} from 'react';
import {Alert, ActivityIndicator} from 'react-native';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {INVALID_DYNAMIC_LINK} from 'src/constants/Texts';
import {GlobalContext} from 'src/containers/global';
import MainStack from 'src/navigation/stack';
import styled from 'styled-components';
import Colors from 'src/constants/Colors';
import {matches} from 'src/constants/DynamicLinks';

const config = {
  screens: {
    UserDetailInfoModal: {
      path: 'profile/:id' /* Redirect to Profile view from external link like scoby://profile */,
      parse: {
        id: (id) => id,
      },
    },
    SeriesLandingPage: 'series',
    TeamScreen: 'team',
  },
};

const linking = {
  prefixes: ['http://www.scoby.com/', 'scoby://'],
  config,
};

const LoadingContainer = styled.View({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: Colors.blueBackgroundSession,
});

function Loading() {
  return (
    <LoadingContainer>
      <ActivityIndicator color={Colors.white} size="large" />
    </LoadingContainer>
  );
}

const Theme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.blueBackgroundSession,
  },
};

export default function Navigation() {
  const {isLogged, setInitialLink} = useContext(GlobalContext);
  const ref = useRef();

  const getPath = (dynamicLink) => {
    for (let i = 0; i < matches.length; i += 1) {
      const currMatch = dynamicLink.url.match(matches[i].exp);
      if (currMatch) {
        return {
          match: currMatch,
          id: currMatch[0].replace(`${matches[i].type}/`, ''),
          nav: matches[i].nav,
        };
      }
    }

    return null;
  };

  const handleDynamicLink = useCallback(
    (dynamicLink) => {
      if (!dynamicLink) {
        return;
      }
      const pathInfo = getPath(dynamicLink);

      if (!isLogged) {
        setInitialLink(dynamicLink);
      } else if (pathInfo) {
        ref.current?.navigate(pathInfo.nav, {id: pathInfo.id});
      } else {
        Alert.alert(INVALID_DYNAMIC_LINK);
      }
    },
    [isLogged, setInitialLink],
  );

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    return () => unsubscribe();
  }, [handleDynamicLink]);

  return (
    <NavigationContainer linking={linking} theme={Theme} fallback={<Loading />} ref={ref}>
      <MainStack navigation={ref} />
    </NavigationContainer>
  );
}
