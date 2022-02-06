import React from 'react';
import {StatusBar} from 'react-native';
import Geocoder from 'react-native-geocoding';
import {GOOGLE_API_KEY} from 'src/config/common';
import Colors from 'src/constants/Colors';
import Root from 'src/Root';
import styled from 'styled-components';
import {MenuProvider} from 'react-native-popup-menu';
import {Provider} from 'react-redux';
import store from 'src/redux/store';

const Container = styled.View({
  flex: 1,
  backgroundColor: Colors.blueBackgroundSession,
});

export default function App() {
  Geocoder.init(GOOGLE_API_KEY);

  return (
    <Provider store={store}>
      <MenuProvider>
        <Container>
          <StatusBar backgroundColor="transparent" barStyle="light-content" translucent animated />
          <Root />
        </Container>
      </MenuProvider>
    </Provider>
  );
}
