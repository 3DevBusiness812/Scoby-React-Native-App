import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styled from 'styled-components/native';
import colors from 'src/constants/Colors';
import fonts from 'src/constants/Fonts';
import BottomModal from 'src/components/BottomModal';
import {GreenRoom, PeopleIcon, RemoveSpeaker} from 'assets/svg';
import {MOVE_TO_GREEN_ROOM, MUTE_SPEAKER, MOVE_VIEWERS_LIST, REMOVE_FROM_SESSION} from 'src/constants/Texts';

const Container = styled.View({
  flexDirection: 'column',
  justifyContent: 'space-around',
  paddingTop: 12,
  paddingBottom: 24,
  height: 200,
});

const Label = styled.Text({
  ...fonts.avenirSemiBold,
  fontSize: 14,
  color: colors.white,
});

const Button = styled.TouchableOpacity({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
});

const Circle = styled.View({
  width: 30,
  height: 30,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 12,
  marginLeft: 20,
});

export default function MenuDotsModal({visible, onRequestClose, handleMoveToViewerList, closeMenuDotsModal}) {
  return (
    <BottomModal visible={visible} onRequestClose={onRequestClose} opaque>
      <Container>
        <Button>
          <Circle>
            <GreenRoom />
          </Circle>
          <Label>{MOVE_TO_GREEN_ROOM}</Label>
        </Button>
        <Button>
          <Circle>
            <Icon size={30} color="white" name="mic" />
          </Circle>
          <Label>{MUTE_SPEAKER}</Label>
        </Button>
        <Button
          onPress={() => {
            handleMoveToViewerList();
            closeMenuDotsModal();
          }}>
          <Circle>
            <PeopleIcon />
          </Circle>
          <Label>{MOVE_VIEWERS_LIST}</Label>
        </Button>
        <Button>
          <Circle>
            <RemoveSpeaker />
          </Circle>
          <Label>{REMOVE_FROM_SESSION}</Label>
        </Button>
      </Container>
    </BottomModal>
  );
}
