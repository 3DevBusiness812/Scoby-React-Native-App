import React from 'react';
import Colors from 'src/constants/Colors';
import Fonts from 'src/constants/Fonts';
import {ACTIVITY_KEYS} from 'src/screens/Activity/ActivityKeys';
import styled from 'styled-components';

const Wrapper = styled.View({
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: 65,
});

const Title = styled.Text({
  ...Fonts.avenirSemiBold,
  fontSize: 25,
  color: Colors.greySession,
  textAlign: 'center',
  marginBottom: 15,
});

const Descr = styled.Text({
  ...Fonts.avenir,
  fontSize: 14,
  color: Colors.greySession,
  textAlign: 'center',
  marginBottom: 35,
});

const Btn = styled.TouchableOpacity({
  paddingVertical: 14,
  width: 320,
  height: 50,
  borderRadius: 8,
  backgroundColor: Colors.pinkMagenta,
});

const BtnText = styled.Text({
  ...Fonts.avenirSemiBold,
  fontSize: 16,
  color: Colors.white,
  textAlign: 'center',
});

const NoMessages = ({navigation}) => (
  <Wrapper>
    <Title>No Messages Yet</Title>
    <Descr>Send private messages to a friend</Descr>
    <Btn onPress={() => navigation.navigate(ACTIVITY_KEYS.NEW_MESSAGE)}>
      <BtnText>Send Message</BtnText>
    </Btn>
  </Wrapper>
);

export default NoMessages;
