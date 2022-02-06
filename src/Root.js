import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import styled, {ThemeProvider} from 'styled-components/native';
import Navigation from 'src/navigation';
import NoInternetModal from 'src/components/Modal/NoInternetModal';
import theme from 'src/config/theme';
//import Notifications from 'src/utils/permission/';
import GlobalProvider, {GlobalContext} from 'src/containers/global';
import {MediaSoupProvider} from 'src/containers/mediasoup';
import FollowersProvider from 'src/containers/followers';
import Colors from 'src/constants/Colors';
import {ApolloProvider} from '@apollo/client';
import useApolloClient from './graphql/ApolloClient';
import {GET_USER_PROFILE} from './graphql/queries/profile';

const LoadingContainer = styled.View({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: Colors.blueBackgroundSession,
});

function AppContainer() {
  const client = useApolloClient();
  const {setInitialLink, setIsLogged, setId} = useContext(GlobalContext);
  const [loadingToken, setLoadingToken] = useState(true);
  const [loadingLink, setLoadingLink] = useState(true);

  useEffect(() => {
    async function initializeApp() {
      if (loadingToken) {
        try {
          const {data} = await client.query({query: GET_USER_PROFILE});
          const id = data?.getUserProfile?.id;
          setIsLogged(id && id !== null);
          setId(id || null);
        } catch {
          setIsLogged(false);
          await AsyncStorage.removeItem('token');
        } finally {
          setLoadingToken(false);
        }
      }
    }
    initializeApp();
  }, [client, loadingToken, setIsLogged]);

  useEffect(() => {
    async function processInitialLink() {
      const link = await dynamicLinks().getInitialLink();
      setInitialLink(link);
      setLoadingLink(false);
    }
    processInitialLink();
  }, [setInitialLink]);

  if (loadingToken || loadingLink) {
    return (
      <LoadingContainer>
        <ActivityIndicator color={Colors.white} size="large" />
      </LoadingContainer>
    );
  }

  return (
    <ApolloProvider client={client}>
      <FollowersProvider>
        <Navigation />
      </FollowersProvider>
    </ApolloProvider>
  );
}

export default function Root() {
  return (
    <GlobalProvider>
      <ThemeProvider theme={theme}>
        <NoInternetModal />
        {/* <Notifications /> */}
        <MediaSoupProvider>
          <AppContainer />
        </MediaSoupProvider>
      </ThemeProvider>
    </GlobalProvider>
  );
}
