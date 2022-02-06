import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styled from 'styled-components/native';
import colors from 'src/constants/Colors';
import fonts from 'src/constants/Fonts';
import BottomModal from 'src/components/BottomModal';
import {MUTE_MIC, START_VIDEO, STOP_VIDEO, SWITCH_CAMERA, UNMUTE_MIC} from 'src/constants/Texts';

const Container = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-around',
  paddingTop: 12,
  paddingBottom: 24,
});

const Button = styled.TouchableOpacity({
  flex: 1,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

const Circle = styled.View({
  width: 48,
  height: 48,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 24,
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  marginBottom: 12,
});

const Label = styled.Text({
  ...fonts.avenirSemiBold,
  fontSize: 14,
  color: colors.white,
});

export default function MenuModal({
  visible,
  onRequestClose,
  videoEnabled,
  onVideoToggle,
  audioEnabled,
  onAudioToggle,
  onCameraToggle,
}) {
  return (
    <BottomModal visible={visible} onRequestClose={onRequestClose} opaque>
      <Container>
        <Button onPress={onVideoToggle}>
          <Circle>
            <Icon size={24} color="white" name={videoEnabled ? 'videocam' : 'videocam-off'} />
          </Circle>
          <Label>{videoEnabled ? STOP_VIDEO : START_VIDEO}</Label>
        </Button>
        <Button onPress={onAudioToggle}>
          <Circle>
            <Icon
              size={24}
              color={audioEnabled ? 'white' : 'rgb(143, 137, 161)'}
              name={audioEnabled ? 'mic' : 'mic-off'}
            />
          </Circle>
          <Label>{audioEnabled ? MUTE_MIC : UNMUTE_MIC}</Label>
        </Button>
        <Button onPress={onCameraToggle}>
          <Circle>
            <Icon size={24} color="white" name="flip-camera-android" />
          </Circle>
          <Label>{SWITCH_CAMERA}</Label>
        </Button>
      </Container>
    </BottomModal>
  );
}
