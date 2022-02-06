/* eslint-disable global-require */
import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import styled from 'styled-components';
import Modal from 'react-native-modal';

const ModalContainer = styled.View({
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
});

export default function LadingSerie({visible}) {
  return (
    <View>
      <Modal isVisible={visible} hasBackdrop>
        <ModalContainer>
          <ActivityIndicator size="large" color="white" />
        </ModalContainer>
      </Modal>
    </View>
  );
}
