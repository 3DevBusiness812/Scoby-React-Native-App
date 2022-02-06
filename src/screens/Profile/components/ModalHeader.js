import React from 'react';
import {BackIco} from 'assets/svg';
import {Header, HeaderLeftButton, HeaderRightButton, HeaderTitleText, HeaderButtonTextPrimary} from './Header';

const ModalHeader = ({title, onPressBack, onPressDone, disabled}) => (
  <Header>
    <HeaderLeftButton onPress={onPressBack}>
      <BackIco />
    </HeaderLeftButton>
    <HeaderTitleText>{title}</HeaderTitleText>
    <HeaderRightButton disabled={disabled} onPress={onPressDone}>
      <HeaderButtonTextPrimary disabled={disabled}>Done</HeaderButtonTextPrimary>
    </HeaderRightButton>
  </Header>
);

export default ModalHeader;
