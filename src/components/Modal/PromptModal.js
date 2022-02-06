/* eslint-disable global-require */
import React from 'react';
import {View} from 'react-native';
import styled from 'styled-components';
import Fonts from 'src/constants/Fonts';
import Colors from 'src/constants/Colors';
import Button from 'src/components/NewLargeButton';
import Modal from 'react-native-modal';

const ModalContainer = styled.View({
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  borderWidth: 2,
  borderColor: '#845EC9',
  borderRadius: 5,
  backgroundColor: Colors.primaryPurpleColor,
  padding: 20,
});

const ButtonContainer = styled.View({
  flexDirection: 'row',
  paddingHorizontal: 5,
});

const MainText = styled.Text({
  ...Fonts.avenir,
  color: Colors.white,
  fontSize: 14,
  width: '90%',
  textAlign: 'center',
});

export default function PromptModal({
  visible,
  setVisible,
  text = '',
  leftButtonText = '',
  rightButtonText = '',
  onLeftButtonPress,
  onRightButtonPress,
}) {
  return (
    <View>
      <Modal isVisible={visible} onBackdropPress={() => setVisible(false)} hasBackdrop>
        <ModalContainer>
          <MainText>{text}</MainText>
          <ButtonContainer>
            <Button
              title={leftButtonText}
              flex
              style={{marginHorizontal: 15, marginBottom: 0}}
              onPress={onLeftButtonPress}
            />
            <Button
              title={rightButtonText}
              flex
              style={{marginHorizontal: 15, marginBottom: 0}}
              onPress={onRightButtonPress}
            />
          </ButtonContainer>
        </ModalContainer>
      </Modal>
    </View>
  );
}
