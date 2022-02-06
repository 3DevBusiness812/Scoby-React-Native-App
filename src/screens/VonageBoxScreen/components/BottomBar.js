import React from 'react';
import styled from 'styled-components/native';
import Share from 'react-native-share';
import Colors from 'src/constants/Colors';
import {Chat, GreenRoom, InviteIcon, PeopleIcon, ThreeDotsMenu, PcSmartphone} from 'assets/svg';
import Badge from 'src/components/Badge';

const Container = styled.View({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: Colors.violetColor,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-evenly',
  borderTopEndRadius: 20,
  borderTopStartRadius: 20,
  opacity: 0.9,
  height: 69,
});

const circleSize = 60;

const CircleButton = styled.TouchableOpacity({
  width: circleSize,
  height: circleSize,
  borderRadius: circleSize / 2,
  backgroundColor: Colors.newPink,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 30,
});

const Button = styled.TouchableOpacity({
  padding: 24,
});

const getBadgeNumber = (amount) => (amount <= 9 ? amount : '+9');

export default function BottomBar({
  onGreenRoomTouch,
  onGreenRoomWaiting,
  onShareTouch,
  onViewersTouch,
  onChatTouch,
  unreadMessages,
  onMenuTouch,
  isSessionOwner,
  secondScreenLink,
}) {
  const shareSecondScreenLink = () => {
    const url = secondScreenLink;
    Share.open({
      url,
    });
  };

  return (
    <Container>
      <Button onPress={onGreenRoomTouch}>
        {onGreenRoomWaiting > 0 ? (
          <Badge size={23} top={10} right={10} text={getBadgeNumber(onGreenRoomWaiting)} />
        ) : null}
        <GreenRoom />
      </Button>
      <Button onPress={onShareTouch}>
        <InviteIcon />
      </Button>
      {!isSessionOwner && secondScreenLink !== '' && (
        <CircleButton onPress={shareSecondScreenLink}>
          <PcSmartphone />
        </CircleButton>
      )}
      <Button onPress={onViewersTouch}>
        <PeopleIcon />
      </Button>
      <Button onPress={onChatTouch}>
        {unreadMessages > 0 ? <Badge size={23} top={10} right={10} text={getBadgeNumber(unreadMessages)} /> : null}
        <Chat />
      </Button>
      {isSessionOwner && (
        <Button onPress={onMenuTouch}>
          <ThreeDotsMenu />
        </Button>
      )}
    </Container>
  );
}
