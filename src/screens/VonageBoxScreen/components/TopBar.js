import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import colors from 'src/constants/Colors';
import fonts from 'src/constants/Fonts';
import {CloseWhiteIco, ViewersEyeIcon} from 'assets/svg';

export const topBarHeight = 52;

const Container = styled.View({
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  flexDirection: 'row',
  alignItems: 'center',
  opacity: 0.9,
  height: topBarHeight,
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 100,
});

const SessionTitleContainer = styled.View({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  flexWrap: 'wrap',
  paddingRight: 8,
});

const Title = styled.Text({
  ...fonts.avenirBold,
  fontSize: 14,
  color: colors.white,
  paddingLeft: 16,
});

const Owner = styled.Text({
  ...fonts.avenirSemiBold,
  fontSize: 14,
  color: colors.white,
  paddingLeft: 16,
});

const Live = styled.View({
  height: 24,
  justifyContent: 'center',
  alignContent: 'center',
});

const GradientLabel = styled(LinearGradient)({
  borderRadius: 4,
  justifyContent: 'center',
  height: '100%',
  width: '100%',
  paddingHorizontal: 16,
});

const LabelText = styled.Text({
  ...fonts.avenir,
  fontSize: 16,
  textAlign: 'center',
  color: colors.white,
});

const Viewers = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  justifyContent: 'center',
  alignContent: 'center',
  borderRadius: 4,
  height: 24,
  marginHorizontal: 4,
  paddingHorizontal: 16,
});

const ViewersEyeContainer = styled.View({
  marginRight: 10,
});

const ExitText = styled.Text({
  ...fonts.avenirSemiBold,
  fontSize: 14,
  color: colors.white,
  paddingHorizontal: 16,
});

const CloseButton = styled.TouchableOpacity({
  marginLeft: -4,
  paddingVertical: 16,
});

const styles = StyleSheet.create({
  endButton: {
    backgroundColor: colors.pink,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function TopBar({title, username, viewersCount, isGuest, isSubscriber, onLeave}) {
  return (
    <Container>
      <SessionTitleContainer>
        <Title numberOfLines={1}>{title}</Title>
        <Owner numberOfLines={1}>@{username}</Owner>
      </SessionTitleContainer>
      <Live>
        <GradientLabel
          start={{x: 0, y: 0.3}}
          end={{x: 1, y: 0}}
          colors={['#cd068e', '#9e0f92', '#7a1794', '#5f1c96', '#501f98', '#4a2098']}>
          <LabelText>LIVE</LabelText>
        </GradientLabel>
      </Live>
      <Viewers>
        <ViewersEyeContainer>
          <ViewersEyeIcon />
        </ViewersEyeContainer>
        <LabelText>{viewersCount}</LabelText>
      </Viewers>
      {isSubscriber && !isGuest && (
        <TouchableOpacity onPress={onLeave}>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0.5}}
            colors={['#8155D3', '#4A2098']}
            style={styles.endButton}>
            <ExitText>Leave Stage</ExitText>
          </LinearGradient>
        </TouchableOpacity>
      )}
      {isSubscriber && isGuest && (
        <CloseButton onPress={onLeave}>
          <CloseWhiteIco />
        </CloseButton>
      )}
      {!isSubscriber && !isGuest && (
        <TouchableOpacity onPress={onLeave}>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0.5}}
            colors={['#8155D3', '#4A2098']}
            style={styles.endButton}>
            <ExitText>End</ExitText>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </Container>
  );
}
