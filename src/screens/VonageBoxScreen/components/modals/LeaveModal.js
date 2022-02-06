import React from 'react';
import styled from 'styled-components/native';
import colors from 'src/constants/Colors';
import fonts from 'src/constants/Fonts';
import NewLargeButton from 'src/components/NewLargeButton';
import BottomModal from 'src/components/BottomModal';
import {
  EXIT_SESSION_2_GUEST,
  EXIT_SESSION_2_HOST,
  EXIT_SESSION_2_PARTICIPANT,
  EXIT_SESSION_GUEST,
  EXIT_SESSION_HOST,
  EXIT_SESSION_PARTICIPANT,
} from 'src/constants/Texts';

const Title = styled.Text({
  ...fonts.avenirBold,
  fontSize: 16,
  color: colors.white,
  textAlign: 'center',
  paddingBottom: 8,
});

const Text = styled.Text({
  ...fonts.avenir,
  fontSize: 16,
  textAlign: 'center',
  color: colors.white,
});

const getLeaveTitle = ({isGuest, isUserOwner}) => {
  if (isUserOwner) {
    return EXIT_SESSION_HOST;
  }
  if (isGuest) {
    return EXIT_SESSION_GUEST;
  }
  return EXIT_SESSION_PARTICIPANT;
};

const getLeaveLabel = ({isGuest, isUserOwner}) => {
  if (isUserOwner) {
    return 'End Session';
  }
  if (isGuest) {
    return 'Leave Session';
  }
  return 'Leave Stage';
};

const getLeaveText = ({isGuest, isUserOwner}) => {
  if (isUserOwner) {
    return EXIT_SESSION_2_HOST;
  }
  if (isGuest) {
    return EXIT_SESSION_2_GUEST;
  }
  return EXIT_SESSION_2_PARTICIPANT;
};

export default function LeaveModal({visible, onRequestClose, onLeave, isGuest, isUserOwner}) {
  return (
    <BottomModal visible={visible} onRequestClose={onRequestClose} opaque>
      <Title>{getLeaveTitle({isGuest, isUserOwner})}</Title>
      <Text>{getLeaveText({isGuest, isUserOwner})}</Text>
      <NewLargeButton onPress={onLeave} title={getLeaveLabel({isGuest, isUserOwner})} />
    </BottomModal>
  );
}
