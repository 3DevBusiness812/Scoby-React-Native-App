import React, {useCallback, useContext} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {useQuery} from '@apollo/client';
import styled from 'styled-components/native';
import {Linking} from 'react-native';
import {SETTINGS_HEADER_TEXT, PRIVACY_URL, TERMS_URL} from 'src/constants/Texts';
import colors from 'src/constants/Colors';
import {FileIco} from 'assets/ico';
import {GET_USER_PROFILE} from 'src/graphql/queries/profile';
import {FollowersContext} from 'src/containers/followers';
import {GlobalContext} from 'src/containers/global';
import BackButton from 'src/components/BackButton';
import withSafeArea from 'src/components/withSafeArea';
import Fonts from 'src/constants/Fonts';
import NewLargeButton from 'src/components/NewLargeButton';

const Wrapper = styled.View`
  flex: 1;
  flex-direction: column;
  background-color: ${colors.blueBackgroundSession};
`;

const MainContent = styled.View`
  flex: 1;
  flex-direction: column;
  margin: 24px;
`;

const TitleText = styled.Text({
  ...Fonts.avenirSemiBold,
  fontSize: 24,
  color: colors.white,
  marginTop: 32,
  marginBottom: 16,
});

const DescriptionText = styled.Text({
  ...Fonts.avenir,
  fontSize: 16,
  color: '#9094A2',
  marginBottom: 48,
});

const SmallText = styled.Text({
  ...Fonts.avenir,
  fontSize: 16,
  color: '#9094A2',
});

const StatusText = styled.Text({
  ...Fonts.avenir,
  fontSize: 16,
  color: colors.greenTermsAccepted,
});

const WhiteText = styled.Text({
  ...Fonts.avenir,
  fontSize: 18,
  color: colors.white,
  paddingLeft: 16,
});

const Row = styled.View({
  flexDirection: 'row',
  marginTop: 24,
  alignItems: 'center',
  justifyContent: 'space-between',
});

const Item = styled.View({});

const ButtonRow = styled.TouchableOpacity({
  flexDirection: 'row',
});

const SettingsScreen = ({navigation}) => {
  const {client} = useQuery(GET_USER_PROFILE, {fetchPolicy: 'network-only'});
  const {setIsLogged} = useContext(GlobalContext);
  const {setCurrentUserProfile} = useContext(FollowersContext);

  const logout = useCallback(async () => {
    await client.cache.reset();
    await client.clearStore();
    setIsLogged(false);
    await AsyncStorage.removeItem('token');
    setCurrentUserProfile({id: null});
  }, [client, setCurrentUserProfile, setIsLogged]);

  return (
    <>
      <Wrapper>
        <MainContent>
          <TitleText>{SETTINGS_HEADER_TEXT}</TitleText>
          <DescriptionText>Account management and privacy settings</DescriptionText>
          <SmallText>Legal</SmallText>
          <Row>
            <Item>
              <ButtonRow onPress={() => Linking.openURL(TERMS_URL)}>
                <FileIco />
                <WhiteText>Terms of Use</WhiteText>
              </ButtonRow>
            </Item>
            <StatusText>Accepted</StatusText>
          </Row>
          <Row>
            <Item>
              <ButtonRow onPress={() => Linking.openURL(PRIVACY_URL)}>
                <FileIco />
                <WhiteText>Privacy Policy</WhiteText>
              </ButtonRow>
            </Item>
            <StatusText>Accepted</StatusText>
          </Row>
          <NewLargeButton onPress={logout} title="Log out" />
        </MainContent>
      </Wrapper>
      <BackButton onPress={navigation.goBack} />
    </>
  );
};

export default withSafeArea(SettingsScreen);
