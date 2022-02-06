import React from 'react';
import {Alert} from 'react-native';
import {useMutation} from '@apollo/client';
import {CongratsIco} from 'assets/svg';
import styled from 'styled-components/native';
import colors from 'src/constants/Colors';
import fonts from 'src/constants/Fonts';
import {SUBTITLE_JOIN_1, UNKNOWN_ERROR_TEXT_SHORT} from 'src/constants/Texts';
import {VIEW_SESSION} from 'src/graphql/mutations/session';
import BackButton from 'src/components/BackButton';
import withSafeArea from 'src/components/withSafeArea';
import NewLargeButton from 'src/components/NewLargeButton';

const Wrapper = styled.View({
  flex: 1,
  justifyContent: 'center',
  paddingHorizontal: 24,
  backgroundColor: '#09073a',
});

const TitleText = styled.Text({
  ...fonts.goudy,
  fontSize: 28,
  color: colors.white,
  lineHeight: '32px',
});

const SubtitleText = styled.Text({
  ...fonts.avenir,
  fontSize: 16,
  color: colors.white,
  paddingBottom: 8,
});

const ButtonLabel = styled.View({
  height: 56,
  justifyContent: 'center',
});

const ButtonLabelText = styled.Text({
  ...fonts.avenirSemiBold,
  fontSize: 18,
  color: colors.white,
});

const ButtonIcon = styled.View({
  position: 'absolute',
  right: -24,
});

const JoinSession = ({navigation, route}) => {
  const {params} = route.params;

  const [viewSession, {loading}] = useMutation(VIEW_SESSION, {
    variables: {
      id: params.id,
      userId: params.userId,
    },
    onError({message}) {
      Alert.alert(UNKNOWN_ERROR_TEXT_SHORT, message, [
        {
          onPress: () => {
            navigation.replace('MainTabs', {screen: 'Home'});
          },
        },
      ]);
    },
    onCompleted({...v}) {
      const paramsSession = {
        sessionId: params.vonageSessionId,
        token: v.viewSession.token,
        vonageApiToken: v.viewSession.vonageApiToken,
        username: v.viewSession.session.ownerUser.username,
        description: v.viewSession.session.description,
        title: params.sessionName,
        isSubscriber: true,
        isUserOwner: false,
        enableMic: true,
        enableCam: true,
        frontCam: true,
        sessionBackEndId: v.viewSession.session.id,
        followers: params.followers,
        secondScreenLink: v.viewSession.session.secondScreenLink,
      };
      navigation.replace('JoinVonageBox', {paramsSession});
    },
  });

  return (
    <Wrapper>
      <BackButton navigation={navigation} />
      <TitleText>{params.sessionName}</TitleText>
      <SubtitleText>
        {SUBTITLE_JOIN_1}
        {`\n`}with {params.hostName}
      </SubtitleText>
      <NewLargeButton noPadding onPress={viewSession} disabled={loading} loading={loading}>
        <ButtonLabel>
          <ButtonLabelText>Let's go</ButtonLabelText>
          <ButtonIcon>
            <CongratsIco />
          </ButtonIcon>
        </ButtonLabel>
      </NewLargeButton>
    </Wrapper>
  );
};

export default withSafeArea(JoinSession);
